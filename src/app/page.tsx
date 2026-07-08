export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#222e35] h-full text-center p-8">
      <div className="max-w-md">
        <h1 className="text-3xl font-light text-[#41525d] dark:text-gray-200 mb-4">
          WhatsApp Backup Viewer
        </h1>
        <p className="text-[#667781] dark:text-gray-400 text-sm leading-relaxed mb-8">
          Yerel WhatsApp yedeklerinizi görüntülemek için sol menüden bir sohbet seçin.
          <br /><br />
          Sohbet eklemek için `public/backups/KlasorAdi` dizinine dışa aktardığınız `.txt` ve medya dosyalarınızı yerleştirin.
        </p>
        <div className="flex justify-center">
          <svg className="w-64 h-64 text-gray-300 dark:text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-10 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
        Uçtan uca şifrelenmiş gibi tamamen yerel
      </div>
    </div>
  );
}
