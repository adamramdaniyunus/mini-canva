import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DesignProvider } from "@/context/DesignContext";
import { Toaster } from "react-hot-toast";
import SessionProviderContext from "./SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miva",
  description: "Miva all right reserved",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderContext>
          <DesignProvider>
            {children}
            <Toaster />
          </DesignProvider>
        </SessionProviderContext>
      </body>
    </html>
  );
}
