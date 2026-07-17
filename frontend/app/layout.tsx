import "./globals.css";

export const metadata = {
  title: "Odoo AI Studio",
  description: "Conversational Odoo requirement and prototype studio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
