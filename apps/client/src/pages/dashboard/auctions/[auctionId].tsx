import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Auction, Product } from "@/types";
import { sleep } from "@/utils";

const ViewAuction = () => {
  const navigate = useNavigate();

  const { auctionId } = useParams<{ auctionId: string }>();
  const isNew = auctionId === "new";
  const { data: auction, isLoading } = useSWR<Auction>(
    isNew ? null : `/auctions/${auctionId}`,
  );

  const { data: products } = useSWR<Product[]>("/products");

  if (isLoading) return "Yükleniyor...";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());

    data.duration = parseInt(data.duration as string) * 1000;

    try {
      const auction = isNew
        ? await http.post("/auctions", data)
        : await http.patch(`/auctions/${auctionId}`, data);

      toast.success(isNew ? "Mezat oluşturuldu!" : "Mezat güncellendi!");

      await sleep(1000);
      if (isNew) navigate(`/auctions/${auction.data.id}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      try {
        await http.delete(`/auctions/${auctionId}`);
        navigate("/dashboard/auctions");
      } catch (error) {
        http.handleError(error);
      }
    }
  };

  const defaultValues = {
    duration: auction ? auction.duration / 1000 : 60,
  };

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            {isNew ? "Yeni Mezat" : auction?.name}
          </h2>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={auction?.name}
              label="Adı"
              name="name"
            />

            <Select
              className="col-span-12 md:col-span-6"
              defaultSelectedKeys={[auction?.productId || ""]}
              label="Ürün"
              name="productId"
            >
              {products ? (
                products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={""}>Yükleniyor...</SelectItem>
              )}
            </Select>

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={defaultValues.duration.toString()}
              endContent="saniye"
              label="Süre"
              name="duration"
            />

            <Button className="col-span-12" color="primary" type="submit">
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>
        </CardBody>
        {auction && (
          <CardFooter className="justify-end gap-5">
            <Button
              color="primary"
              onClick={() =>
                navigate(`/dashboard/products/${auction.productId}`)
              }
            >
              Ürünü Görüntüle
            </Button>
            <Button color="danger" onClick={handleDelete}>
              <strong>Sil</strong>
            </Button>
          </CardFooter>
        )}
      </Card>
    </section>
  );
};

export default ViewAuction;
