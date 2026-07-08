"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar({ chats }: { chats: { id: string; name: string }[] }) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat/');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`
      ${isChatPage ? 'hidden md:flex' : 'flex w-full'} 
      md:w-1/3 md:min-w-[300px] md:max-w-[400px] 
      bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col h-screen
    `}>
      {/*header*/}
      <div className="h-16 bg-gray-100 dark:bg-gray-800 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Sohbetler</h1>
      </div>

      {/* Arama Kutusu */}
      <div className="p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Aratın veya yeni sohbet başlatın"
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/*Sohbet Liste */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => (
          <Link
            href={`/chat/${chat.id}`}
            key={chat.id}
            className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800/50"
          >
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400">
              {chat.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-baseline">
                <h2 className="text-md font-medium text-gray-900 dark:text-gray-100">{chat.name}</h2>
              </div>
            </div>
          </Link>
        ))}
        {filteredChats.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Sohbet bulunamadı
          </div>
        )}
      </div>
    </div>
  );
}
