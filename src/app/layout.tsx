import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getChats } from "@/lib/whatsapp-parser";
import Sidebar from "@/components/Sidebar";
import MainWrapper from "@/components/MainWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp Backup Viewer",
  description: "View local WhatsApp chat backups offline",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chats = await getChats();

  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-200 dark:bg-black h-screen overflow-hidden`}>
        <div className="h-full w-full flex bg-white dark:bg-[#111b21] shadow-xl overflow-hidden relative mx-auto">
          <Sidebar chats={chats} />
          <MainWrapper>
            {children}
          </MainWrapper>
        </div>
      </body>
    </html>
  );
}
