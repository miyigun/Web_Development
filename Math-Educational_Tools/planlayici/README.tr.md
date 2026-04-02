# planlayici

Bu repo, **“Görev Uygulaması”** adlı  
**tarayıcı tabanlı bir görev / üretkenlik uygulamasını** içerir.

Proje **tek sayfalık (SPA benzeri)** bir arayüz olarak kurgulanmıştır ve şunları kullanır:
- **Bootstrap 5** (arayüz bileşenleri)
- **jQuery + jQuery UI** (etkileşimler)
- **Font Awesome** (ikonlar)

Uygulama; **giriş/kayıt**, görev paneli, **seviye–TP–altın** gibi oyunlaştırma öğeleri, menüler ve **sesli geri bildirimler** içerir.

---

## Özellikler

### 1. Kimlik Doğrulama Arayüzü (Giriş / Kayıt)
- `public/index.html` içinde giriş/kayıt ekranları bulunur:
  - `#loginScreen` (giriş/kayıt konteyneri)
  - `#registerFields` ve `#loginFields` alanları uygulama mantığına göre gösterilip gizlenir
- Onayla butonu (`#submitButton`) başlangıçta pasiftir; kontrol `public/main.js` ile yapılır.

### 2. Oyunlaştırılmış Üst Bilgi Alanı
Üst bölümde:
- Profil resmi (`#profilePicture`)
- Kullanıcı adı
- Seviye (`#level`)
- TP ve Altın göstergeleri yer alır.

### 3. Görev Paneli + Navigasyon
Sayfa düzeni:
- Sol menü:
  - Kahraman, Görevler, Kategoriler, Market, Takvim
- Sağ menü:
  - Hedefler, Alışkanlık Takibi, Ayarlar
- Orta içerik alanı:
  - `#tasksContainer` (görevler/içerikler dinamik eklenir)

### 4. Sesli Geri Bildirim
`public/index.html` içinde tanımlı sesler:
- `mp3/click.mp3`
- `mp3/menu_option.mp3`
- `mp3/claps.mp3`
- `mp3/success.mp3`
- `mp3/fail.mp3`
- `mp3/magic.mp3`
- `mp3/login.mp3`
- `mp3/login_denied.mp3`
- `mp3/delete.mp3`
- `mp3/buy.mp3`

> Not: Birçok tarayıcı, kullanıcı etkileşimi olmadan ses oynatmayı engeller.

### 5. Arayüz Stilleri + Responsive Düzen
- Stil dosyası: `public/styles.css`
- Şunlar için düzen/stil içerir:
  - giriş ekranı kutusu
  - sticky görev çubuğu
  - kaydırılabilir görev listesi
  - sol/sağ side-bar menüler
  - diyalog/modal görünümleri
  - küçük ekranlar için uyarlamalar

### 6. Dağıtım (Netlify)
- `netlify.toml` ve `public/_redirects` dosyaları deploy/yönlendirme için eklenmiştir.

---

## Proje Yapısı

- `public/index.html` — arayüz iskeleti (ekranlar, CDN’ler, ses etiketleri)
- `public/main.js` — uygulama mantığı (dinamik içerik, event yönetimi)
- `public/styles.css` — arayüz stilleri
- `public/images/` — uygulamada kullanılan görseller (örn. profil resmi)
- `public/icons/` — favicon ve ikon dosyaları
- `public/mp3/` — ses dosyaları
- `database.db` — uygulamanın kullandığı yerel veritabanı dosyası (projeye özel)
- `netlify.toml` / `public/_redirects` — deploy/yönlendirme ayarları
- `package.json` / `package-lock.json` — proje bağımlılık ve metadata

---

## Başlangıç

### Yerelde çalıştırma
1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/miyigun/plan.git
   ```

2. Klasöre girin:
   ```bash
   cd plan
   ```

3. Local server başlatın (önerilen):
   ```bash
   python -m http.server 8000
   ```

4. Tarayıcıdan açın:
   - `http://localhost:8000/public/`

> İpucu: Asset’lerin (görsel/ses) sorunsuz yüklenmesi ve yönlendirmelerin doğru çalışması için local server önerilir.

---

## 🛠️ Kullanılan Teknolojiler
- HTML / CSS / JavaScript
- Bootstrap 5 (CDN)
- jQuery + jQuery UI
- Font Awesome

---

## 📌 Notlar
- Arayüzün önemli bir kısmı `public/main.js` ile **dinamik** olarak üretilir (örn. `#tasksContainer`).
- Subpath altında yayınlama yapılacaksa `public/index.html` içindeki path’leri kontrol edin (örn. `/images/...` gibi mutlak yollar).
- `database.db` repo içinde yer alıyor; yayın ortamında nasıl kullanılacağı (erişim/güncelleme) ayrıca değerlendirilmelidir.

---

## 📜 Lisans
Bu proje MIT lisansı altında sunulmaktadır. Ayrıntılar için LICENSE dosyasına bakınız.