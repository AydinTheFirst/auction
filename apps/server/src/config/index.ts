export * from "./multer";
export * from "./serveStatic";
export * from "./swagger";
export * from "./throttler";

export const config = {
  port: process.env.PORT || 8080,
  title: "NestJS API",
};
