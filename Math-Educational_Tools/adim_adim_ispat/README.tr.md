# adim-adim-ispat-oyunu

Bu repo, **“Adım Adım İspat Oyunu”** isimli **tarayıcı tabanlı etkileşimli bir eğitim etkinliğini** içerir.  
Uygulama, kullanıcının **karışık verilen ispat adımlarını** **sürükle-bırak** ya da **çift tıklama** ile doğru sıraya dizmesine dayanan **tek sayfalık (SPA benzeri) bir web uygulamasıdır**.

---

## Özellikler

### 1. Aşama Tabanlı İspat Etkinliği
- Aşamalar `main.js` içindeki `stages` dizisiyle yönetilir
- Her aşamada:
  - Bir **teorem görseli**
  - İspat yöntemiyle ilgili **bilgilendirici alt metin**
  - Karışık halde verilen **adım görselleri**
  - Kontrol için **doğru sıra (correctOrder)** bulunur

### 2. Etkileşimler (Masaüstü + Mobil)
- Adımlar **sürükle-bırak** ile `dropArea` alanına bırakılır
- Bir adıma **çift tıklayarak** da `dropArea` alanına eklenebilir
- `dropArea` içindeki bir adım **tıklanarak geri alınabilir**
- Mobil sürükleme desteği için **jQuery UI Touch Punch** kullanılır

### 3. Zamanlayıcı ve Akış Yönetimi
- Her aşama için geri sayım (varsayılan **300 saniye / 5 dakika**)
- Süre bitince:
  - Uyarı gösterilir
  - “Sonuçları Göster” butonu pasifleştirilir

### 4. Geri Bildirim ve Sesler
- Ses efektleri:
  - Tıklama
  - Başarı
  - Hata
  - Alkış (final)
- Gönderim sonrası adımların yanına doğru/yanlış ikonları eklenir

### 5. Açılış Ekranı ve İpucu Diyaloğu
- Oyuna başlamadan önce açılış ekranı (modal) vardır
- Başlangıçta özel bir **İPUCU** diyalogu açılır (mobil kullanım için yatay ekran önerisi vb.)

---

## Proje Yapısı

- `index.html` — arayüz ve sayfa yapısı
- `style.css` — adımlar, bırakma alanı, açılış modalı ve ipucu diyaloğu stilleri
- `main.js` — oyun mantığı (aşamalar, zamanlayıcı, sürükle-bırak, kontrol, reset)
- `images/` — teorem/adım görselleri, arka plan, ikonlar
- `mp3/` — etkinlikte kullanılan ses dosyaları
- `fonts/` — arayüzde kullanılan font dosyası

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

> Not: `index.html` dosyasını doğrudan açmak çoğu zaman çalışsa da, görsel/ses gibi dosya yüklemelerinde sorun yaşamamak için local server önerilir.

---

## 🛠️ Kullanılan Teknolojiler
- HTML / CSS / JavaScript
- jQuery
- Bootstrap 4
- Bootstrap Icons
- jQuery UI + jQuery UI Touch Punch (mobil sürükleme desteği)

---

## 📌 Notlar
- Aşamalar görsel tabanlıdır. `main.js` içindeki dosya yollarının `images/` klasörüyle birebir uyuştuğundan emin olun.
- Birçok tarayıcı otomatik ses oynatmayı engeller; bu yüzden sesler kullanıcı etkileşimi (tıklama) sonrası çalacak şekilde tetiklenmiştir.
- Yeni aşama eklemek için `stages` dizisine yeni bir nesne ekleyip:
  - `steps`
  - `correctOrder`
  alanlarını güncellemeniz yeterlidir.

---

## 📜 Lisans
Bu proje MIT lisansı altında sunulmaktadır. Ayrıntılar için LICENSE dosyasına bakınız.