# cit-maliyeti-hesaplama

Bu repo, **“Çit Maliyeti Hesaplama”** adlı  
**tarayıcı tabanlı etkileşimli bir eğitim etkinliğini** içerir.

Uygulama, **kare şeklindeki bir arsanın** çevresini çitle çevirmek için gereken **toplam maliyeti** hesaplatır. Kullanıcı:
- arsa miktarını **dönüm** cinsinden (*1 dönüm = 1000 m²*)
- metre başına çit maliyetini (₺/m)

girer ve uygulama:
- **MathJax** ile yazılmış **adım adım çözüm**
- **canvas** üzerinde arsa modeli ve çit çizimi
- **“Nasıl Çözülür?”** (Bootstrap modal)
- açılışta **ipucu (overlay) diyaloğu** ve **tıklama sesi**

sunarak öğrenmeyi destekler.

---

## Özellikler

### 1. Girdiye Dayalı Maliyet Hesaplama
- Kullanıcı girişleri:
  - `Arsa miktarı (Dönüm)` → `#acreAmount`
  - `Metre başına çit maliyeti (₺)` → `#fenceCost`
- **Hesapla** butonu (`#calculateButton`) yalnızca iki alan da doluyken aktif olur.

### 2. Matematiksel Model (Kare Arsa Varsayımı)
- Arsanın kare olduğu varsayılır.
- `main.js` içinde kullanılan hesaplar:
  - Kenar: `√(acreAmount * 1000)`
  - Çevre: `4 * √(acreAmount * 1000)`
  - Toplam maliyet: `çevre * fenceCost`

### 3. Adım Adım Çözüm (MathJax)
- Çözüm adımları `#solutionSteps` içinde (`step1..step4`) gösterilir
- Adımlar **fade-in** animasyonuyla sırayla görünür
- Matematiksel ifadeler **MathJax** ile biçimlendirilir

### 4. Canvas Üzerinde Görsel Model
- `#fenceCanvas` üzerinde rastgele bir arsa modeli görseli gösterilir:
  - `images/model1.jpeg` … `images/model4.jpeg`
- Model değişirken canvas **soluklaşma (fade-out / fade-in)** animasyonu uygular
- Çit, `ctx.strokeRect(...)` ile kenarlara çizilir
- Dönüm bilgisi `#acreInfo` alanında gösterilir

### 5. “Nasıl ��özülür?” Modalı (Bootstrap)
- **“Nasıl Çözülür?”** butonu Bootstrap modalını (`#solutionModal`) açar
- Modal içinde çözüm yöntemi ve formüller yer alır (MathJax çalışır)

### 6. İpucu Diyaloğu (Overlay) + Ses
- Sayfa açılışında `ipucuDiyalogAc(...)` ile özel ipucu penceresi açılır
- Overlay stilleri `style.css` içinde tanımlıdır:
  - `.dialog-ipucu-overlay`, `.dialog-ipucu-box`, `.close-ipucu-button`
- “Tamam” butonu `mp3/click.mp3` sesini çalar ve pencereyi kapatır.

---

## Proje Yapısı

- `index.html` — arayüz (form, canvas, modal, ses etiketi)
- `style.css` — layout + canvas + ipucu overlay stilleri
- `main.js` — mantık (doğrulama, hesaplama, çizim, MathJax typeset, animasyonlar, ses)
- `images/`
  - `model1.jpeg`, `model2.jpeg`, `model3.jpeg`, `model4.jpeg`
  - `key.png` (ipucu ikonu)
- `mp3/`
  - `click.mp3`
- `fonts/`
  - `Helveticasinav.ttf`
- `icons/`
  - `favicon.ico`

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

> İpucu: Görsel/font/ses dosyalarının sorunsuz yüklenmesi için local server önerilir.

---

## 🛠️ Kullanılan Teknolojiler
- HTML / CSS / JavaScript
- Bootstrap 4 (CDN)
- jQuery
- MathJax 3

---

## 📌 Notlar
- Sayfada sağ tık menüsü kapalıdır (`oncontextmenu="return false;"`). Geliştirme sırasında istersen kaldırabilirsin.
- Giriş sınırları uygulanır:
  - `#acreAmount`: en fazla 5 basamak
  - `#fenceCost`: en fazla 9 basamak
- Arayüzde virgüllü gösterim (`,`) için bazı alanlarda `replace('.', ',')` kullanılır; hesaplamalar JS sayı tipiyle yapılır.

---

## 📜 Lisans
Bu proje MIT lisansı altında sunulmaktadır. Ayrıntılar için LICENSE dosyasına bakınız.