import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import useSWR from "swr";

import { Auction, Product } from "@/types";
import { getFileUrl } from "@/utils";

interface PropsWithAuction {
  auction: Auction;
}

export const ViewAuctionProduct = ({ auction }: PropsWithAuction) => {
  const { data: product } = useSWR<Product>(`/products/${auction.productId}`);

  if (!product) return "Yükleniyor...";

  return (
    <Card>
      <CardHeader className="h-56 justify-center bg-[#cccccc]">
        <Image className="h-56" src={getFileUrl(product.images[0])} />
      </CardHeader>
      <CardBody className="grid gap-5 text-center">
        <h2 className="text-4xl font-bold">{product.title}</h2>
        <p className="text-xl">Açılış Fiyatı</p>
        <h4 className="text-3xl font-semibold">
          {product.startPrice.toLocaleString("tr-TR")} TL
        </h4>
      </CardBody>
    </Card>
  );
};
