import { Card, CardBody, Progress } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { Auction } from "@/types";

interface PropsWithAuction {
  auction: Auction;
}

export const AuctionTimer = ({ auction }: PropsWithAuction) => {
  // ms
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const now = new Date().getTime();
    const endTime = new Date(auction.endAt).getTime();
    const timeLeft = endTime - now;

    setTimeLeft(timeLeft);
  }, [auction]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft <= 0) return clearInterval(interval);
      setTimeLeft((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, auction]);

  const timeLeftInDay = timeLeft % (1000 * 60 * 60 * 24);
  const timeLeftInHour = timeLeftInDay % (1000 * 60 * 60);
  const timeLeftInMinute = timeLeftInHour % (1000 * 60);

  const hours = Math.floor(timeLeftInDay / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(timeLeftInHour / (1000 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timeLeftInMinute / 1000)
    .toString()
    .padStart(2, "0");

  const percent = (timeLeft / auction.duration) * 100;

  return (
    <Card>
      <CardBody className="grid place-items-center">
        {timeLeft > 0 ? (
          <>
            <h2 className="mb-3 text-3xl font-semibold">
              Kalan Süre: {hours}:{minutes}:{seconds}
            </h2>
            <Progress aria-label="Kalan Süre" value={percent} />
          </>
        ) : (
          <h2 className="text-3xl font-semibold">Süre Doldu!</h2>
        )}
      </CardBody>
    </Card>
  );
};
