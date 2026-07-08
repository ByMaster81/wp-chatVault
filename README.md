# WhatsApp Chat Vault

Kendi dışa aktardığınız WhatsApp sohbet geçmişlerinizi (`.txt` formatındaki yedekleri) tıpkı WhatsApp'ın kendi arayüzündeymiş gibi okuyabilmeniz için yazdığım açık kaynaklı bir araç.

WhatsApp'tan bir sohbeti "Medyayı Dahil Et" seçeneğiyle dışa aktardığınızda size bir `.txt` dosyası ve karmakarışık bir sürü fotoğraf/video verir. Bunları klasör içinde tek tek arayıp okumak işkence olduğu için, yedekleri tekrar bir "sohbet" ekranı gibi gösterecek bu arayüzü kodladım.

## Özellikler
- **Gerçekçi Tasarım:** WhatsApp'taki gibi sağ/sol yerleşimi, arka plan, karanlık mod ve kendi mesajlarınızı farklı renkte görme.
- **Medya Galerisi:** Sadece sohbetteki fotoğraflara ve videolara bakmak isterseniz "Medya Galerisi" butonuyla her şeyi ızgara görünümünde listeleme (Instagram profili gibi). Fotoğraflara tıklayıp büyütebilirsiniz.
- **Yüksek Performans:** 100 bin mesajlık devasa sohbetleri bile tarayıcıyı dondurmadan açabilmesi için **sonsuz kaydırma (infinite scroll)** mekanizması yazdım. Yukarı çıktıkça eski mesajlar parça parça eklenir.
- **Güvenlik (Lokal Çalışma):** Bütün veriler sadece kendi cihazınızda (yerelde) durur, hiçbir sunucuya yüklenmez.

## Nasıl Kullanılır?

Öncelikle telefonunuzdaki WhatsApp'tan herhangi bir sohbeti **Sohbeti Dışa Aktar -> Medyayı Dahil Et** diyerek aktarın. 
Çıkan zip dosyasının içindekileri (bir `.txt` dosyası ve tüm medya dosyaları) projenin içindeki `public/backups/Sohbet_Adi/` klasörüne atın. Uygulama otomatik olarak bu klasörü görüp sohbeti listeleyecektir.

Örnek klasör yapısı:
```text
public/
  backups/
    Kardesim/
      _chat.txt (veya WhatsApp Chat - Kardesim.txt vb.)
      IMG-20230501.jpg
      VID-20230502.mp4
```

*(Özel sohbetleriniz yanlışlıkla GitHub'a gitmesin diye `public/backups` klasörünü `.gitignore` dosyasına ekledim.)*

## Kurulum (Docker ile En Kolayı)

Bu proje Node.js Alpine imajı kullandığı için **işletim sisteminden ve mimariden tamamen bağımsızdır**. Standart bir bilgisayarda çalışabileceği gibi **Raspberry Pi 5 (ARM64)** gibi cihazlarda da kusursuz çalışır.

Bilgisayarınıza Node.js gibi gereksinimleri kurup versiyon hatalarıyla uğraşmanıza gerek yok. Docker varsa tek hamlede çalıştırabilirsiniz.

```bash
# Repoyu indirin
git clone https://github.com/ByMaster81/wp-chatVault
cd whatsapp-viewer

# Docker ile ayağa kaldırın
docker-compose up -d
```

Uygulama saniyeler içinde açılacak. Tarayıcınızdan **http://localhost:3005** adresine giderek sohbetlerinizi okuyabilirsiniz. Bilgisayarınızdaki `public/backups` klasörüne yeni sohbet attığınız an, Docker bunu otomatik görüp sayfaya yansıtacaktır.

### Tailscale ve Özel Ağ Güvenliği (Sadece İstediğiniz IP'den Erişim)

Eğer projeyi benim gibi bir Raspberry Pi üzerinde çalıştırıp her yerden erişmek istiyorsanız, arayüzü sadece **Tailscale** ağınıza veya yerel ağınıza özel hale getirerek güvenliği artırabilirsiniz. 

Arayüzün dış dünyaya (`0.0.0.0`) tamamen açılmasını engellemek için uygulamayı başlatmadan önce cihazınızın Tailscale IP'sini (veya yerel IP'nizi) belirterek çalıştırabilirsiniz:

```bash
# Sadece Tailscale IP'niz üzerinden erişime izin verir (Örnek IP: 100.80.60.40)
BIND_IP=100.80.60.40 docker-compose up -d
```
Bu sayede projeniz sadece o ağdan bağlanan cihazlara (telefonunuza, bilgisayarınıza) yanıt verecektir.


## Manuel Kurulum (Node.js)

Eğer "Ben kodlarla uğraşmayı severim, Docker istemem" derseniz:
```bash
npm install
npm run dev
```
ile çalıştırıp geliştirmeye başlayabilirsiniz.

---
Katkıda bulunmak isterseniz PR göndermekten çekinmeyin
