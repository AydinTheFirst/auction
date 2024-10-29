import { toast } from "sonner";

import { Product } from "@/types";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFileUrl = (file: string) => {
  if (!file) return "https://via.placeholder.com/400";
  const backendUrl = import.meta.env.VITE_API_URL;
  return `${backendUrl}/files/${file}`;
};

export const randomImage = () => {
  const w = Math.round(Math.random() * 400 + 200);
  const h = Math.round(Math.random() * 400 + 200);
  return `https://picsum.photos/${w}/${h}`;
};

export const addToFavs = (product: Product) => {
  if (!product) return;

  const favs = localStorage.getItem("favs") || "[]";

  const isAlreadyFav = JSON.parse(favs).some(
    (fav: Product) => fav.id === product.id,
  );

  if (isAlreadyFav) {
    toast.error("Ürün zaten favorilerde.");
    return;
  }

  localStorage.setItem(
    "favs",
    JSON.stringify([...JSON.parse(favs), product.id]),
  );

  toast.success("Ürün favorilere eklendi.");
};
