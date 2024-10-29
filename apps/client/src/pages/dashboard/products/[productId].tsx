import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import { CheckInput } from "@/components";
import http from "@/http";
import { Product } from "@/types";
import { sleep } from "@/utils";

import { ProductImages } from "./_ProductImages";
import { StartAuction } from "./_StartAuction";

const ViewProduct = () => {
  const navigate = useNavigate();

  const { productId } = useParams<{ productId: string }>();
  const isNew = productId === "new";
  const { data: product, isLoading } = useSWR<Product>(
    isNew ? null : `/products/${productId}`,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    data.price = parseInt(data.price as string);
    data.startPrice = parseInt(data.startPrice as string);
    data.isPublished = data.isPublished === "true";
    data.notifyUsers = data.notifyUsers === "true";

    try {
      const { data: product } = isNew
        ? await http.post<Product>("/products", data)
        : await http.patch<Product>(`/products/${productId}`, data);

      toast.success(
        isNew ? "Ürün başarıyla oluşturuldu!" : "Ürün başarıyla güncellendi!",
      );

      await sleep(1000);

      if (!isNew) return navigate("/dashboard/products");

      const imagesFormData = new FormData();
      const images = formData.getAll("images") as File[];
      images.forEach((image) => imagesFormData.append("images", image));

      const promise = () => {
        return new Promise((resolve) =>
          http
            .post(`/products/${product.id}/images`, imagesFormData)
            .then(() => {
              resolve(true);

              sleep(1000).then(() => {
                navigate("/dashboard/products");
              });
            }),
        );
      };

      toast.promise(promise, {
        error: "Resimler yükleme sırasında bir hata oluştu!",
        loading: "Resimler yükleniyor...",
        success: "Resimler başarıyla yüklendi!",
      });
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

    try {
      await http.delete(`/products/${product?.id}`);
      toast.success("Ürün başarıyla silindi!");
      navigate("/dashboard/products");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return "Yükleniyor...";

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            {isNew ? "Yeni Ürün Oluştur" : `Ürünü Güncelle: ${product?.title}`}
          </h2>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={product?.title}
              isRequired
              label="Başlık"
              name="title"
            />

            <Input
              className="col-span-12"
              defaultValue={product?.description}
              isRequired
              label="Açıklama"
              name="description"
            />

            <Input
              className="col-span-12"
              defaultValue={product?.price.toString()}
              isRequired
              label="Fiyat"
              name="price"
              type="number"
            />

            <Input
              className="col-span-12"
              defaultValue={product?.startPrice.toString()}
              isRequired
              label="Başlangıç Fiyatı"
              name="startPrice"
            />

            {isNew && (
              <Input
                accept="image/*"
                className="col-span-12"
                isRequired
                label="Eklenecek Resimler"
                multiple
                name="images"
                type="file"
              />
            )}

            <CheckInput
              className="col-span-12"
              defaultSelected={product?.isPublished}
              name="isPublished"
            >
              Herkese açık
            </CheckInput>

            <CheckInput className="col-span-12" name="notifyUsers">
              Kullanıcılara bildir
            </CheckInput>

            <Button
              className="col-span-12"
              color="primary"
              fullWidth
              type="submit"
            >
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>

          {!isNew && (
            <div className="mt-3 flex justify-end">
              <Button color="danger" onClick={handleDelete}>
                <strong>Ürünü Sil</strong>
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {!isNew && <ProductImages product={product!} />}
      {!isNew && <StartAuction />}
    </section>
  );
};

export default ViewProduct;
