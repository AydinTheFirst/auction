import { Input, Select, SelectItem } from "@nextui-org/react";
import { LucideSearch } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Product } from "@/types";

import { ProductCard } from "./ProductCard";

export const ViewProducts = () => {
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

  if (!products) return "Yükleniyor...";

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Ürünler</h2>
          <span className="text-sm text-gray-500">
            ({filteredProducts.length}/{products.length})
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
