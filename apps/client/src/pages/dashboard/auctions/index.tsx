import {
  getKeyValue,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { LucideSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Auction } from "@/types";

const AuctionTable = () => {
  const navigate = useNavigate();

  const [filteredItems, setFilteredItems] = useState<Auction[]>([]);
  const { data: auctions } = useSWR<Auction[]>("/auctions");

  useEffect(() => {
    if (!auctions) return;
    setFilteredItems(auctions);
  }, [auctions]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!auctions) return;

    const filtered = auctions.filter((auction) =>
      auction.name.toLowerCase().includes(value),
    );

    setFilteredItems(filtered);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case "date:asc":
        setFilteredItems(
          [...filteredItems].sort(
            (a, b) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
          ),
        );
        break;

      case "date:desc":
        setFilteredItems(
          [...filteredItems].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
        );
        break;

      case "name:asc":
        setFilteredItems(
          [...filteredItems].sort((a, b) => a.name.localeCompare(b.name)),
        );
        break;

      case "name:desc":
        setFilteredItems(
          [...filteredItems].sort((a, b) => b.name.localeCompare(a.name)),
        );
        break;

      default:
        break;
    }
  };

  const handleRowAction = (key: unknown) => {
    navigate(`/dashboard/auctions/${key as string}`);
  };

  const columns = [
    { key: "name", label: "İsim" },
    { key: "duration", label: "Süre" },
    { key: "date", label: "Tarih" },
  ];

  const rows = filteredItems.map((auction) => ({
    date: new Date(auction.createdAt).toLocaleString("tr-TR"),
    duration: `${auction.duration / 1000} saniye`,
    key: auction.id,
    name: auction.name,
  }));

  if (!auctions) return "Yükleniyor...";

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Açık Arttırmalar</h2>
          <span className="text-sm text-gray-500">
            ({filteredItems.length}/{auctions?.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Input
            className="max-w-xs"
            endContent={<LucideSearch />}
            label="Ara"
            onChange={handleFilter}
            placeholder="Ürün ara..."
            variant="faded"
          />
          <Select
            className="max-w-xs"
            label="Sırala"
            onSelectionChange={(keys) =>
              handleSort(Array.from(keys)[0].toString())
            }
            placeholder="Sırala"
            variant="faded"
          >
            <SelectItem key={"price:asc"}>Fiyat (Artan)</SelectItem>
            <SelectItem key={"price:desc"}>Fiyat (Azalan)</SelectItem>
            <SelectItem key={"name:asc"}>İsim (A-Z)</SelectItem>
            <SelectItem key={"name:desc"}>İsim (Z-A)</SelectItem>
            <SelectItem key={"date:asc"}>Tarih (Eski)</SelectItem>
            <SelectItem key={"date:desc"}>Tarih (Yeni)</SelectItem>
          </Select>
        </div>
      </div>

      <Table
        aria-label="Example table with dynamic content"
        isStriped
        onRowAction={handleRowAction}
        selectionMode="single"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="Henüz bir açık arttırma bulunmamaktadır."
          items={rows}
        >
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default AuctionTable;
