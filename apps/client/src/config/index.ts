const { VITE_API_URL } = import.meta.env;

export const API_URL: string = VITE_API_URL || "http://localhost:8080/api";

export const LOGO_URL: string = "/logo.png";
