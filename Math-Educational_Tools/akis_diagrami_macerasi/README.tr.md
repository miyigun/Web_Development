# akis-diyagrami-macerasi

Bu repo, **“Akış Diyagramı Macerası: Algoritmalar Dünyasına Yolculuk”** adlı  
**tarayıcı tabanlı etkileşimli bir eğitim etkinliğini** içerir.

Proje **tek sayfalık (SPA benzeri) bir web uygulaması** olarak kurgulanmıştır. Arayüzün büyük kısmı `main.js` tarafından **dinamik olarak oluşturulur**.  
Uygulamada **ses efektleri**, **modal/overlay pencereleri**, **canvas tabanlı (matrix tarzı) arka plan** ve `SCORM_API_wrapper.js` / `quiz-adaptor.js` ile **SCORM entegrasyonu (opsiyonel)** bulunur.

---

## Özellikler

### 1. Tek Sayfa + Dinamik Arayüz
- Sayfa iskeleti `index.html` dosyasında yer alır
- İçerik ve buton alanları JavaScript ile dinamik doldurulur:
  - `#container`
  - `#buttons`
- Ana akış ve mantık `main.js` içerisinden yönetilir

### 2. Eğitim Etkileşimi + Oyunlaştırılmış Akış
- Etkinliğin ekranları/aşamaları/iş adımları `main.js` tarafından kontrol edilir
- Kullanıcı yönlendirmeleri ve geri bildirimler diyaloglar üzerinden sağlanır

### 3. Diyalog / Overlay Sistemi
`style.css` içinde özel stilleri tanımlanmış overlay bileşenleri (CSS sınıf adlarına göre):
- İpucu diyaloğu (`.dialog-ipucu-*`)
- Sonuç diyaloğu (`.dialog-sonuc-*`)
- Etkinlik sonlandırma onayı (`.dialog-etkinlik-sonlandir-*`)
- Animasyon/bilgi diyaloğu (`.dialog-animasyon-*`)
- Geniş içerikli diyalog (`.dialog-org-*`)
- Quiz ekranı (`.quiz-overlay`, `.quiz-box`, seçenek/navigasyon stilleri)

### 4. Ses Efektleri
`index.html` içinde tanımlı sesler:
- `mp3/click.mp3`
- `mp3/menu_option.mp3`
- `mp3/claps.mp3`
- `mp3/success.mp3`
- `mp3/fail.mp3`
- `mp3/place.mp3`

> Not: Çoğu tarayıcı, kullanıcı etkileşimi olmadan ses oynatmayı engeller.

### 5. Responsive Tasarım (Mobil / Tablet / PC)
`style.css` içinde ekran kırılımları:
- Mobil: `@media (max-width: 768px)`
- Küçük mobil: `@media (max-width: 480px)`
- Tablet: `@media (min-width: 768px) and (max-width: 1300px)`
- PC: `@media (min-width: 1300px)`

### 6. SCORM Uyumlu (Opsiyonel)
Sayfada şu script’ler çağrılır:
- `SCORM_API_wrapper.js`
- `quiz-adaptor.js`

Bu dosyalar, bir LMS/SCORM ortamına entegrasyon için kullanılabilir (adaptor içeriğine göre).

---

## Proje Yapısı

- `index.html` — ana sayfa iskeleti (canvas + dinamik alanlar + script/style ekleri)
- `style.css` — tüm arayüz stilleri (layout, overlay’ler, responsive kurallar vb.)
- `main.js` — etkinlik mantığı (DOM üretimi, event yönetimi, akış kontrolü)
- `SCORM_API_wrapper.js` — SCORM API yardımcı katmanı (opsiyonel)
- `quiz-adaptor.js` — quiz / SCORM adaptör katmanı
- `mp3/` — ses dosyaları
- `fonts/` — arayüzde kullanılan font(lar)
- `icons/` — favicon / iOS dokunmatik simge dosyaları
- (opsiyonel) `images/` — `main.js` içinde kullanılan görseller varsa

---

## Başlangıç

### Yerelde çalıştırma
1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/miyigun/egik_prizma.git
   ```

2. Klasöre girin:
   ```bash
   cd egik_prizma
   ```

3. Local server başlatın (önerilen):
   ```bash
   python -m http.server 8000
   ```

4. Tarayıcıdan açın:
   - `http://localhost:8000`

> İpucu: `index.html` doğrudan açıldığında bazen çalışsa da, font/ses/görsel gibi asset’lerde sorun yaşamamak için local server önerilir.

---

## 🛠️ Kullanılan Teknolojiler
- HTML / CSS / JavaScript
- Bootstrap 5
- jQuery

---

## 📌 Notlar
- Arayüzün büyük bölümü `main.js` ile **dinamik** üretildiği için `index.html` içinde sadece placeholder alanlar bulunur.
- `body` üzerinde sağ tık menüsü kapalıdır (`oncontextmenu="return false;"`). Geliştirme sırasında sağ tık gerekirse bu kısmı kaldırabilirsiniz.
- `style.css` içinde `@font-face` ile özel font kullanılır; `fonts/` altındaki dosyanın mevcut olduğundan emin olun.

---

## 📜 Lisans
Bu proje MIT lisansı altında sunulmaktadır. Ayrıntılar için LICENSE dosyasına bakınız.