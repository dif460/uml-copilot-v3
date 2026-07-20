import "./globals.css";
import { LocaleWrapper } from "@/lib/locale-wrapper";

export const metadata = {
  title: "Odoo AI Studio",
  description: "Conversational Odoo requirement and prototype studio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><LocaleWrapper>{children}</LocaleWrapper></body>
    </html>
  );
}
