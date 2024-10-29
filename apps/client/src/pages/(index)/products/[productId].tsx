import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Image,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Product } from "@/types";
import { getFileUrl } from "@/utils";

const ViewProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useSWR<Product>(`/products/${productId}`);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!product) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [product]);

  if (!product) return "Loading...";

  const activeImage = product.images[activeImageIndex];

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Anasayfa</BreadcrumbItem>
        <BreadcrumbItem href="/products">Ürünler</BreadcrumbItem>
        <BreadcrumbItem>{product.title}</BreadcrumbItem>
      </Breadcrumbs>
      <br />
      <section className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5">
          <div className="grid place-items-center rounded bg-[#f0eeed] p-3">
            <Image
              className="mx-auto h-96 w-full"
              isBlurred
              isZoomed
              src={getFileUrl(activeImage || product.images[0])}
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1">
            {product.images.map((image, index) => (
              <img
                className="h-24 w-full cursor-pointer object-fill"
                key={index}
                onClick={() => setActiveImageIndex(index)}
                src={getFileUrl(image)}
              />
            ))}
          </div>
        </div>
        <div className="col-span-12 md:col-span-7">
          <div className="grid gap-3">
            <h1 className="text-3xl font-extrabold md:text-5xl">
              {product.title}
            </h1>
            <h3 className="price text-4xl font-extrabold md:text-4xl">
              {product.price} TL
            </h3>
            <p className="font-bold text-gray-500">{product.description}</p>
            <Divider />
            <div className="flex gap-3">
              <Button color="primary">
                <strong>Satın Alma İsteği Gönder</strong>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewProduct;
