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
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Product } from "@/types";

const Products = () => {
  const navigate = useNavigate();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { data: products } = useSWR<Product[]>("/products");

  useEffect(() => {
    if (!products) return;
    setFilteredProducts(products);
  }, [products]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!products) return;

    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(value) ||
        product.description.toLowerCase().includes(value) ||
        product.price.toString().includes(value),
    );

    setFilteredProducts(filtered);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case "date:asc":
        setFilteredProducts(
          [...filteredProducts].sort(
            (a, b) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
          ),
        );
        break;

      case "date:desc":
        setFilteredProducts(
          [...filteredProducts].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
        );
        break;

      case "name:asc":
        setFilteredProducts(
          [...filteredProducts].sort((a, b) => a.title.localeCompare(b.title)),
        );
        break;

      case "name:desc":
        setFilteredProducts(
          [...filteredProducts].sort((a, b) => b.title.localeCompare(a.title)),
        );
        break;

      case "price:asc":
        setFilteredProducts(
          [...filteredProducts].sort((a, b) => a.price - b.price),
        );
        break;

      case "price:desc":
        setFilteredProducts(
          [...filteredProducts].sort((a, b) => b.price - a.price),
        );
        break;

      default:
        break;
    }
  };

  const columns = [
    { key: "title", label: "Başlık" },
    { key: "price", label: "Fiyat" },
    { key: "updatedAt", label: "Güncelleme Tarihi" },
  ];

  const rows = filteredProducts.map((product) => {
    return {
      key: product.id,
      price: product.price.toLocaleString("tr-TR"),
      title: product.title,
      updatedAt: new Date(product.updatedAt).toLocaleDateString("tr-TR"),
    };
  });

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/products/${key.toString()}`);
  };

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Ürünler</h2>
          <span className="text-sm text-gray-500">
            ({filteredProducts.length}/{products?.length})
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
        <TableBody items={rows}>
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

export default Products;
