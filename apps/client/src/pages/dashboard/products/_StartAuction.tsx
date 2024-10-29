import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import http from "@/http";
import { Auction } from "@/types";
import { sleep } from "@/utils";

export const StartAuction = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());

    data.duration = parseInt(data.duration as string) * 1000;

    try {
      const { data: auction } = await http.post<Auction>("/auctions", {
        ...data,
        productId,
      });
      toast.success("Açık arttırma başarıyla başlatıldı!");
      await sleep(3000);
      navigate(`/auctions/${auction.id}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Açık Arttırma Başlat</h2>
      </CardHeader>
      <CardBody>
        <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
          <Input
            className="col-span-12 md:col-span-6"
            defaultValue={`${new Date().toLocaleString()} tarihli açık arttırma`}
            isRequired
            label="Açık Arttırma Başlığı"
            name="name"
            type="text"
          />
          <Input
            className="col-span-12 md:col-span-6"
            defaultValue="60"
            endContent="saniye"
            isRequired
            label="Süre"
            name="duration"
            type="number"
          />
          <Button className="col-span-12" color="warning" type="submit">
            Başlat
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
