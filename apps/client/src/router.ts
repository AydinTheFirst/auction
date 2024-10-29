// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/auctions/:auctionId`
  | `/dashboard/auctions`
  | `/dashboard/auctions/:auctionId`
  | `/dashboard/products`
  | `/dashboard/products/:productId`
  | `/dashboard/users`
  | `/dashboard/users/:userId`
  | `/help`
  | `/login`
  | `/products`
  | `/products/:productId`
  | `/register`;

export type Params = {
  "/auctions/:auctionId": { auctionId: string };
  "/dashboard/auctions/:auctionId": { auctionId: string };
  "/dashboard/products/:productId": { productId: string };
  "/dashboard/users/:userId": { userId: string };
  "/products/:productId": { productId: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
