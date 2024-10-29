import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import { socket } from "@/http/socket";
import { Auction, Offer } from "@/types";

import {
  AuctionOffers,
  AuctionTimer,
  OfferForm,
  ViewAuctionProduct,
} from "./_components";
import WinnerBox from "./_components/WinnerBox";

const ViewAuction = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { data: auction, mutate: mutateAuction } = useSWR<Auction>(
    `/auctions/${auctionId}`,
  );

  useEffect(() => {
    socket.connect();

    socket.emit("auction:join", auctionId);

    socket.on("new-offer", ({ offer }: { offer: Offer }) => {
      mutateAuction();
      mutate(`/auctions/${auctionId}/offers`);
      toast.info(`Yeni teklif geldi: ${offer.offer} TL`);
    });

    return () => {
      socket.emit("auction:leave", auctionId);
      socket.off("new-offer");
      socket.disconnect();
    };
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;

    const interval = setInterval(() => {
      const isEnded = new Date(auction.endAt) < new Date();
      if (!isEnded) return;
      clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  console.log(auction);

  if (!auction) return "Yükleniyor...";

  return (
    <>
      <div className="container mx-auto grid max-w-xl gap-5">
        <ViewAuctionProduct auction={auction} />
        <AuctionTimer auction={auction} />
        <AuctionOffers auction={auction} />
        <WinnerBox auction={auction} />
        <OfferForm auction={auction} />
      </div>
    </>
  );
};

export default ViewAuction;
