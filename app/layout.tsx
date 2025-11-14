import type { Metadata } from "next";
import { Inter, Righteous } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });
const righteous = Righteous({ subsets: ["latin"], weight: "400", variable: "--font-cooper" });

export const metadata: Metadata = {
  title: "HiddenAura - Anonymous Q&A",
  description: "Get honest anonymous answers from your followers. Share your unique link and receive feedback without revealing who asked.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={righteous.variable}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
