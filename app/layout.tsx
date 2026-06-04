import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nosso Momento",
  description: "Transforme o seu amor em uma página inesquecível"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
