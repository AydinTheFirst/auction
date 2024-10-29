import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Progress,
} from "@nextui-org/react";
import { LucideArrowLeft, LucideArrowRight, LucideTrash } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { mutate } from "swr";

import http from "@/http";
import { Product } from "@/types";
import { getFileUrl } from "@/utils";

interface ProductImagesProps {
  product: Product;
}

export const ProductImages = ({ product }: ProductImagesProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { productId } = useParams<{ productId: string }>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadProgress > 0) {
      return toast.error("Lütfen fotoğaflar yüklenene kadar bekleyiniz.");
    }

    const form = new FormData(e.currentTarget);

    try {
      await http.post(`/products/${productId}/images`, form, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!,
          );
          setUploadProgress(progress);
        },
      });
      toast.success("Images uploaded successfully!");
      mutate(`/products/${productId}`);
    } catch (error) {
      http.handleError(error);
    }

    setUploadProgress(0);
  };

  const handleImageDelete = async (image: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this image?",
    );
    if (!confirm) return;

    image = encodeURIComponent(image);

    try {
      await http.delete(`/products/${productId}/images/${image}`);
      toast.success("Image deleted successfully!");
      mutate(`/products/${productId}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  const orderPrev = async (image: string) => {
    image = encodeURIComponent(image);

    // set order to previous on the client
    const index = product.images.indexOf(image);
    if (index === 0) return;

    const newImages = [...product.images];
    const temp = newImages[index - 1];
    newImages[index - 1] = newImages[index];
    newImages.splice(index, 1, temp).map((image, i) => ({ image, order: i }));

    try {
      await http.patch(`/products/${productId}/images`, {
        images: newImages,
      });
      toast.success("Image moved to previous successfully!");
      mutate(`/products/${productId}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  const orderNext = async (image: string) => {
    image = encodeURIComponent(image);

    // set order to next on the client
    const index = product.images.indexOf(image);
    if (index === product.images.length - 1) return;

    const newImages = [...product.images];
    const temp = newImages[index + 1];
    newImages[index + 1] = newImages[index];
    newImages.splice(index, 1, temp).map((image, i) => ({ image, order: i }));

    try {
      await http.patch(`/products/${productId}/images`, {
        images: newImages,
      });
      toast.success("Image moved to next successfully!");
      mutate(`/products/${productId}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  if (uploadProgress > 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Yükleniyor</h2>
        </CardHeader>
        <CardBody>
          <Progress value={uploadProgress} />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Fotoğraflar
          <span>({product.images.length})</span>
        </h2>
      </CardHeader>
      <CardBody className="grid gap-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {product.images.map((image, i) => (
            <div className="relative">
              <img alt={`Image ${i + 1}`} key={i} src={getFileUrl(image)} />
              <button
                className="absolute end-0 top-0 bg-red-500 p-1"
                onClick={() => handleImageDelete(image)}
              >
                <LucideTrash />
              </button>
              <div className="absolute bottom-0 flex w-full justify-between text-3xl text-white">
                <button
                  className="bg-black bg-opacity-50"
                  disabled={i === 0}
                  onClick={() => orderPrev(image)}
                >
                  <LucideArrowLeft />
                </button>
                <button
                  className="bg-black bg-opacity-50"
                  disabled={i === product.images.length - 1}
                  onClick={() => orderNext(image)}
                >
                  <LucideArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input accept="image/*" multiple name="images" type="file" />
          <Button color="primary" fullWidth type="submit">
            Yükle
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
