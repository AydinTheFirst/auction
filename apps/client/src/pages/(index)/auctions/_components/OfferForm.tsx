import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Auction, Offer, Product } from "@/types";

interface PropsWithAuction {
  auction: Auction;
}

export const OfferForm = ({ auction }: PropsWithAuction) => {
  const [offerValue, setOfferValue] = useState<number>(0);

  const isEnded = new Date(auction.endAt) < new Date();

  const { data: offers } = useSWR<Offer[]>(
    !isEnded ? `/auctions/${auction.id}/offers` : null,
  );

  const { data: product } = useSWR<Product>(`/products/${auction.productId}`);

  useEffect(() => {
    if (!offers || !product) return;

    const minimumOffer =
      offers.reduce(
        (max, offer) => Math.max(max, offer.offer),
        product.startPrice || 0,
      ) + 100;

    setOfferValue(minimumOffer);
  }, [offers, product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.offer = parseInt(data.offer as string);
    data.auctionId = auction.id;

    try {
      await http.post("/offers", data);
      toast.success("Teklif verildi!");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isEnded) return;

  return (
    <Card>
      <CardBody>
        <h2 className="mb-3 text-center text-xl font-semibold">Teklif Ver</h2>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input
            endContent="TL"
            isRequired
            label="Teklif"
            name="offer"
            onChange={(e) => setOfferValue(parseInt(e.target.value))}
            type="number"
            value={offerValue.toString()}
          />
          <Button color="primary" fullWidth type="submit">
            Teklif Ver
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
