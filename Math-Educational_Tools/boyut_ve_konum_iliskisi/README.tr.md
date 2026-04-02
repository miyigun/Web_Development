# surgu-ile-sekil-gosterimi

Bu repo, **“Sürgü ile Şekil Gösterimi”** adlı  
**tarayıcı tabanlı etkileşimli bir eğitim etkinliğini** içerir.

Proje **tek sayfalık (SPA benzeri)** bir web uygulamasıdır.  
Kullanıcı, bir **sürgü** yardımıyla **sıfırdan farklı bir x gerçek sayısının dört ardışık kuvvetinin** fiziksel modellemesini **0B/1B/2B/3B** (nokta, doğru parçası, kare, küp) üzerinden inceler.  
Uygulamada **ipucu (overlay) diyaloğu**, **ses efektleri** ve denklem görselleri (kod içine gömülü **base64 resimler**) yer alır.

---

## Özellikler

### 1. Sürgü ile Keşif (0 → 3)
- `#slider` bileşeniyle **4 farklı model** arasında geçiş yapılır:
  - `0` → **0 Boyutlu**: nokta
  - `1` → **1 Boyutlu**: uçları etiketli doğru parçası
  - `2` → **2 Boyutlu**: köşeleri etiketli kare
  - `3` → **3 Boyutlu**: küp görseli
- Seçilen değer `#sliderValue` alanında gösterilir
- Boyut bilgisi `#dimension` alanında yazdırılır

### 2. Dinamik Şekil Üretimi
- Çizim/gösterim alanı `#shape` konteyneridir
- Şekiller `main.js` içinde DOM ile dinamik üretilir:
  - `.point`, `.line`, `.square`, `.cube`
  - Nokta/kenar açıklamaları için `.label` (A, B, C, D, “x birim”)

### 3. Denklem Gösterimi (Resim)
- Her sürgü değişiminde `#equation` alanı güncellenir
- Denklem görselleri `dataOfEquation(index)` fonksiyonundan gelen base64 veriyle `<img>` olarak eklenir
- Küp görseli `kupVerisi()` fonksiyonu ile base64 olarak sağlanır

### 4. İpucu Diyaloğu (Overlay)
- Sayfa açılışında `ipucuDiyalogAc(baslik, ipucu)` ile ipucu penceresi gösterilir
- Stil tanımları `style.css` içindedir:
  - `.dialog-ipucu-overlay`, `.dialog-ipucu-box`, `.close-ipucu-button`
- Diyalogda kullanılan ikon: `images/key.png`

### 5. Ses Efektleri
`index.html` içinde tanımlı sesler:
- `mp3/click.mp3` (ipucu penceresi kapatılırken)
- `mp3/menu_option.mp3` (sürgü değeri değişirken)

> Not: Tarayıcılar, kullanıcı etkileşimi olmadan sesi engelleyebilir.

### 6. Basit ve Esnek Yerleşim
- `html, body` flexbox ile ortalanır
- Minimum genişlik sınırı vardır (`min-width: 250px`)
- Ana arayüz `#container` içinde yer alır

---

## Proje Yapısı

- `index.html` — arayüz (başlık, sürgü, şekil alanı, denklem alanı, ses etiketleri)
- `style.css` — layout + şekil stilleri + ipucu overlay stilleri
- `main.js` — uygulama mantığı (şekil güncelleme, denklem güncelleme, sesler, ipucu diyaloğu)
- `mp3/` — ses dosyaları
- `fonts/` — özel font (`fonts/Helveticasinav.ttf`)
- `icons/` — favicon (`icons/favicon.ico`)
- `images/` — `images/key.png` (ipucu ikonu)

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

> İpucu: Font/ses/görsel gibi dosyaların sorunsuz yüklenmesi için local server önerilir.

---

## 🛠️ Kullanılan Teknolojiler
- HTML / CSS / JavaScript (Vanilla)

---

## 📌 Notlar
- Sayfada sağ tık menüsü kapalıdır (`oncontextmenu="return false;"`). Geliştirme sırasında gerekirse kaldırabilirsiniz.
- `@font-face` ile özel font kullanılır; `fonts/Helveticasinav.ttf` dosyasının projede bulunduğundan emin olun.
- Denklem görselleri ve küp görseli `main.js` içine base64 olarak gömülüdür (ekstra dosya gerekmez); ancak ipucu ikonunun (`images/key.png`) bulunması gerekir.

---

## 📜 Lisans
Bu proje MIT lisansı altında sunulmaktadır. Ayrıntılar için LICENSE dosyasına bakınız.