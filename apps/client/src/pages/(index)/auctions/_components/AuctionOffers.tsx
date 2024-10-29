import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import useSWR from "swr";

import { Auction, Offer, User } from "@/types";

interface PropsWithAuction {
  auction: Auction;
}

export const AuctionOffers = ({ auction }: PropsWithAuction) => {
  const { data: offers } = useSWR<Offer[]>(`/auctions/${auction.id}/offers`);
  const { data: users } = useSWR<User[]>(`/users`);

  if (!offers) return "Yükleniyor...";

  const columns = [
    {
      key: "offer",
      label: "Teklif",
    },
    {
      key: "user",
      label: "Kullanıcı",
    },
    {
      key: "createdAt",
      label: "Tarih",
    },
  ];

  const rows = offers
    .sort((a, b) => {
      return a.offer > b.offer ? -1 : 1;
    })
    .slice(0, 3)
    .map((offer, index) => {
      const user = users?.find((user) => user.id === offer.userId);
      return {
        createdAt: new Date(offer.createdAt).toLocaleTimeString(),
        index,
        key: offer.id,
        offer: offer.offer.toLocaleString("tr-TR"),
        user: user ? `${user.firstName} ${user.lastName}` : "Bilinmiyor",
      };
    });

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell
                className={
                  item.index === 0 ? "text-lg font-extrabold" : "text-gray-500"
                }
              >
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
