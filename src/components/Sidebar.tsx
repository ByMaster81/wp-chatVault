"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar({ chats }: { chats: { id: string; name: string }[] }) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat/');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const chatName = window.prompt("Lütfen bu sohbet için bir isim girin:", file.name.replace(".zip", ""));
    if (!chatName) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatName", chatName);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        alert("Hata oluştu: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Yükleme sırasında bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sohbet İşleniyor...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Yeni Sohbet Ekle (.zip)
            </>
          )}
        </button>
        <input 
          type="file" 
          accept=".zip" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
        />
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
