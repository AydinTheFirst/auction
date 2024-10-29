import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { Product } from "@/types";
import { getFileUrl } from "@/utils";

export const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  const handlePress = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card isHoverable isPressable onPress={handlePress}>
      <CardHeader className="justify-center bg-[#F0EEED]">
        <Image
          className="aspect-video h-56 w-full"
          src={getFileUrl(product.images[0])}
        />
      </CardHeader>
      <CardBody className="grid gap-3">
        <h4 className="text-xl font-bold">{product.title}</h4>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-extrabold">{product.price}₺</h2>
        </div>
      </CardBody>
    </Card>
  );
};

/*     <Card
      isFooterBlurred
      isPressable
      onPress={handlePress}
      className="relative"
    >
      <Chip
        className="absolute end-0 top-0 z-30"
        color={forSale ? "danger" : "primary"}
      >
        <b>{product.price.toLocaleString("tr")} TL</b>
      </Chip>
      <div className="relative w-full">
        <img
          alt={product.title}
          className="z-0 h-56 w-full object-scale-down"
          src={getFileUrl(product.images[0])}
        />
        {!forSale && (
          <img
            src="/sold.png"
            className="absolute left-0 top-0 z-10 h-56 w-full object-cover p-5"
          />
        )}
      </div>
      <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/50 dark:border-default-100">
        <p className="w-full text-center text-sm font-bold text-white">
          {product.title}
        </p>
      </CardFooter>
    </Card>; */
