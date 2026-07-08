"use client";
import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat/');
  
  return (
    <main className={`
      ${isChatPage ? 'flex' : 'hidden md:flex'} 
      flex-1 flex-col min-w-0 bg-[#efeae2] dark:bg-[#0b141a] h-full
    `}>
      {children}
    </main>
  );
}
