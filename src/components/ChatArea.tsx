"use client";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { Chat } from "@/lib/whatsapp-parser";
import Link from "next/link";

export default function ChatArea({ chat }: { chat: Chat }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMediaOnly, setShowMediaOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [modalMedia, setModalMedia] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteChat = async () => {
    if (window.confirm(`${chat.name} sohbetini ve tüm medyalarını kalıcı olarak silmek istediğinize emin misiniz?`)) {
      try {
        const response = await fetch(`/api/chat?id=${encodeURIComponent(chat.name)}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.location.href = "/";
        } else {
          alert("Silme işlemi başarısız oldu.");
        }
      } catch (e) {
        alert("Silme sırasında bir hata oluştu.");
      }
    }
  };

  //listeyi başa sar
  useEffect(() => {
    setVisibleCount(100);
  }, [chat.id, searchQuery, showMediaOnly]);

  const filteredMessages = chat.messages.filter(msg => {
    if (showMediaOnly) {
      //.webp (sticker) olanları hariç tut
      return msg.isMedia && (!msg.mediaUrl || !msg.mediaUrl.toLowerCase().endsWith('.webp'));
    }
    if (searchQuery) {
      return msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const visibleMessages = filteredMessages.slice(Math.max(filteredMessages.length - visibleCount, 0));
  // listeyi ters çevir(Kaydırma için)
  const reversedMessages = [...visibleMessages].reverse();

  // Liste kaydırıldıkça eski mesajlar
  const handleScroll = () => {
    const triggerId = showMediaOnly ? "media-loading-trigger" : "loading-trigger";
    const target = document.getElementById(triggerId);

    if (target) {
      const rect = target.getBoundingClientRect();
      if (rect.bottom > -500 && rect.top < window.innerHeight + 500) {
        if (visibleCount < filteredMessages.length) {
          setVisibleCount(prev => Math.min(prev + 100, filteredMessages.length));
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] overflow-hidden">

      <div className="h-16 bg-gray-100 dark:bg-gray-800 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 shrink-0 justify-between z-10 shadow-sm">
        <div className="flex items-center">
          <Link
            href="/"
            className="md:hidden mr-3 p-1 -ml-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
            {chat.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100">{chat.name}</h2>
          </div>
        </div>

        {/* Sağ Üst Butonlar */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => setShowMediaOnly(!showMediaOnly)}
            className={`p-2 rounded-full ${showMediaOnly ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Medya Galerisi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          <div className={`relative ${isSearchVisible ? 'block' : 'hidden md:block'}`}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Mesajlarda ara..."
              className="w-48 md:w-48 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 rounded-lg pl-8 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-2.5 top-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isSearchVisible && (
              <button 
                onClick={() => {
                   setIsSearchVisible(false);
                   setSearchQuery("");
                }} 
                className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#233138] rounded-lg shadow-xl z-50 py-2 border border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={() => {
                      setIsSearchVisible(true);
                      setIsMenuOpen(false);
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#182229]"
                  >
                    Sohbeti Ara
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDeleteChat();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#182229]"
                  >
                    Sohbeti Sil
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/*Medya Liste*/}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-4 md:px-[10%] lg:px-[15%] flex ${showMediaOnly ? 'flex-col' : 'flex-col-reverse'}`}
        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', opacity: 0.95 }}
      >
        {showMediaOnly ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 bg-white/80 dark:bg-black/50 p-2 md:p-4 rounded-xl min-h-full">
              {reversedMessages.map(msg => (
                msg.mediaUrl && (
                  <div
                    key={msg.id}
                    className="relative w-full h-0 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden group cursor-pointer"
                    style={{ paddingBottom: '100%' }}
                    onClick={() => {
                      if (!msg.mediaUrl?.match(/\.(mp4|webm|mp3|opus|ogg)$/i)) {
                        setModalMedia(msg.mediaUrl!);
                      }
                    }}
                  >
                    {msg.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                      <video src={msg.mediaUrl} className="absolute inset-0 w-full h-full object-cover" controls={false} />
                    ) : msg.mediaUrl.match(/\.(mp3|opus|ogg)$/i) ? (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                        <audio src={msg.mediaUrl} controls className="w-full px-2" />
                      </div>
                    ) : (
                      <img src={msg.mediaUrl} alt="Medya" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {msg.date} {msg.time} {msg.sender ? `- ${msg.sender}` : ''}
                    </div>
                  </div>
                )
              ))}
              {reversedMessages.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">Bu sohbette medya bulunamadı.</div>
              )}
            </div>

            {visibleCount < filteredMessages.length && (
              <div id="media-loading-trigger" className="flex justify-center py-4 w-full mt-4">
                <div className="bg-white dark:bg-[#182229] shadow-sm rounded-full px-4 py-2 text-sm text-gray-500 flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Daha fazla medya yükleniyor...
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {reversedMessages.map((msg, idx) => {
              const prevMsgInTime = idx < reversedMessages.length - 1 ? reversedMessages[idx + 1] : null;
              const showDate = !prevMsgInTime || prevMsgInTime.date !== msg.date;

              if (!msg.sender) {
                return (
                  <div key={msg.id} className="flex flex-col-reverse w-full">
                    <div className="flex justify-center my-2">
                      <div className="bg-yellow-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-lg shadow-sm max-w-[80%] text-center">
                        {msg.content}
                      </div>
                    </div>
                    {showDate && (
                      <div className="flex justify-center my-3">
                        <div className="bg-white dark:bg-[#182229] text-gray-600 dark:text-gray-300 text-[12px] px-3 py-1 rounded-lg shadow-sm">
                          {msg.date}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isOwn = msg.sender !== chat.name;

              return (
                <div key={msg.id} className="flex flex-col-reverse w-full">
                  <MessageBubble message={msg} isOwn={isOwn} />
                  {showDate && (
                    <div className="flex justify-center my-3">
                      <div className="bg-white dark:bg-[#182229] text-gray-600 dark:text-gray-300 text-[12px] px-3 py-1 rounded-lg shadow-sm">
                        {msg.date}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/*yükleniyor göstergesi */}
            {visibleCount < filteredMessages.length && (
              <div id="loading-trigger" className="flex justify-center py-4 w-full">
                <div className="bg-white dark:bg-[#182229] shadow-sm rounded-full px-3 py-1 text-xs text-gray-500 flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yükleniyor...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/*Tam Ekran*/}
      {modalMedia && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setModalMedia(null)}
        >
          <div className="absolute top-4 right-4 text-white p-2 cursor-pointer z-[110]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <img src={modalMedia} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
