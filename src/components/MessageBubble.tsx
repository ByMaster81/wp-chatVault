import { Message } from "@/lib/whatsapp-parser";

import { useState } from "react";

export default function MessageBubble({ message, isOwn }: { message: Message, isOwn: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sadece emojiyse yazıyı büyüt
  const isOnlyEmoji = /^[\p{Emoji}\s]+$/u.test(message.content) && message.content.trim().length <= 6;

  return (
    <>
      <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div
          className={`max-w-[75%] md:max-w-[65%] rounded-lg px-3 pt-2 pb-1 relative shadow-sm
            ${isOwn
              ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-900 dark:text-gray-100 rounded-tr-none'
              : 'bg-white dark:bg-[#202c33] text-gray-900 dark:text-gray-100 rounded-tl-none'}
          `}
        >
          {/* Gruptaysa isim */}
          {!isOwn && message.sender && (
            <div className="text-xs font-semibold text-blue-500 mb-1">
              {message.sender}
            </div>
          )}

          {message.isMedia && message.mediaUrl && (
            <div className="mb-1 rounded-md overflow-hidden relative min-h-[100px] min-w-[200px] bg-gray-200 dark:bg-gray-700">
              {message.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                <video src={message.mediaUrl} controls className="w-full max-h-[300px] object-cover" />
              ) : message.mediaUrl.match(/\.(mp3|opus|ogg)$/i) ? (
                <audio src={message.mediaUrl} controls className="w-full mt-2" />
              ) : (
                <img
                  src={message.mediaUrl}
                  alt="Media"
                  className="w-full max-h-[300px] object-cover cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
              )}
            </div>
          )}

          {message.content.trim() !== '' && (
            <div className={`break-words ${isOnlyEmoji && !message.isMedia ? 'text-4xl' : 'text-[14px] leading-relaxed'}`}>
              {message.content.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i !== message.content.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          )}

          <div className="text-[11px] text-gray-500 dark:text-gray-400 text-right mt-1 ml-4 inline-block float-right">
            {message.time}
          </div>

          <div className="clear-both"></div>
        </div>
      </div>

      {isModalOpen && message.isMedia && message.mediaUrl && !message.mediaUrl.match(/\.(mp4|webm|mp3|opus|ogg)$/i) && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="absolute top-4 right-4 text-white p-2 cursor-pointer z-[60]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <img src={message.mediaUrl} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  );
}
