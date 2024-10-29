import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Auction, Offer, User } from "@/types";

interface PropsWithAuction {
  auction: Auction;
}

interface AuctionWinnerResponse {
  auction: Auction;
  offer: Offer;
  user: User;
}

const WinnerBox = ({ auction }: PropsWithAuction) => {
  const [isAuctionEnded, setIsAuctionEnded] = useState<boolean>(false);

  const { data: winnerData, error } = useSWR<AuctionWinnerResponse>(
    isAuctionEnded ? `/auctions/${auction.id}/winner` : null,
    {
      errorRetryCount: 0,
    },
  );

  useEffect(() => {
    const isEnded = new Date(auction.endAt) < new Date();
    setIsAuctionEnded(isEnded);
  }, [auction]);

  if (error) {
    return (
      <Card>
        <CardBody className="grid place-items-center gap-3">
          <h2 className="text-3xl font-semibold text-danger-500">
            Kazanan Belirlenemedi
          </h2>
        </CardBody>
      </Card>
    );
  }

  if (!winnerData) return;

  return (
    <Card>
      <CardBody className="grid place-items-center gap-3">
        <h3 className="text-xl font-semibold">Kazanan</h3>
        <h2 className="text-3xl font-extrabold">
          {winnerData.user.firstName} {winnerData.user.lastName}
        </h2>
        <p className="text-2xl font-bold">{winnerData.offer.offer} TL</p>
      </CardBody>
    </Card>
  );
};

export default WinnerBox;
