import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

#python'da uyarıları kapatalım
import warnings
warnings.filterwarnings("ignore")

#veriyi içeri aktaracağız
veri=pd.read_csv("olimpiyatlar.csv")
# print(veri.head())
# print(veri.info())
# print(veri.columns)

#sütun isimlerini değiştirelim
veri.rename(columns={'ID'       :   'id',
                      'Name'    :   'isim',
                      'Gender'  :   'cinsiyet',
                      'Age'     :   'yas',
                      'Height'  :   'boy',
                      'Weight'  :   'kilo',
                      'Team'    :   'takim',
                      'NOC'     :   'uok',
                      'Games'   :   'oyunlar',
                      'Year'    :   'yil',
                      'Season'  :   'sezon',
                      'City'    :   'sehir',
                      'Sport'   :   'spor',
                      'Event'   :   'etkinlik',
                      'Medal'   :   'madalya'},inplace=True)
#inplace=True dediğimizde ismi değiştirilen veri otomatik olarak bulunduğu yerde isimlendirilir

veri=veri.drop(["id","oyunlar"],axis=1) #axis=1 sütunları çıkarıyor
# print(veri.head(3))
#boy ve kilo sütununda bulunan kayıp veriyi etkinlik ortalamasına göre dolduracağız
essiz_etkinlik=pd.unique(veri.etkinlik)
# print("Eşsiz etkinlik sayısı:{}".format(len(essiz_etkinlik)))
# print(essiz_etkinlik[:10])

#her bir etkinliği iteratif olarak dolaşacağız
#etkinlik özelinde boy ve kilo ortalamalarını bulacağız
#etkinlik özelinde boy ve kiloda kayıp olan değerlere ortalama boy ve kio değerlerini eşitleyeceğiz
veri_gecici=veri.copy() #gerçek veriyi kaybetmemek için kopya oluştur
boy_kilo_liste=["boy","kilo"]

for e in essiz_etkinlik:    #etkinlik listesi içerisinde dolaş
    #etkinlik filtresi oluştur
    etkinlik_filtre=veri_gecici.etkinlik==e
    #veriyi etkinliğe göre filtrele
    veri_filtreli=veri_gecici[etkinlik_filtre]
    #boy ve kilo için etkinlik özelinde ortalama hesapla
    for s in boy_kilo_liste:
        ortalama=np.round(np.mean(veri_filtreli[s]),2)
        if ~np.isnan(ortalama): #eğer etkinlik özelinde ortalama hesaplanabiliyorsa
            veri_filtreli[s]=veri_filtreli[s].fillna(ortalama)
        else:   #eğer etkinlik özelinde ortalama hesaplanamıyorsa tüm veri için ortalamayı bul
            tum_veri_ortalamasi=np.round(np.mean(veri[s]),2)
            veri_filtreli[s]=veri_filtreli[s].fillna(tum_veri_ortalamasi)
    #etkinlik özelinde kayıp değerleri doldurulmuş olan veriyi veri_gecici değişkenine eşitle
    veri_gecici[etkinlik_filtre]=veri_filtreli
#kayıp değerleri giderilmiş geçici veriyi gerçek veri değişkenine eşitle
veri=veri_gecici.copy()

#boy ve kilo sütunlarında kayıp değer sayısına bak
# print(veri.info()) 

# yas sütununda bulunan kayıp veriyi, veri setinin ortalamasına göre dolduracağız
# yas değişkeni tanımlı olmayan verileri bul
# ~ işareti ile tersini al
# yas değişkeni tanımlı olan verileri bulmak için filtre oluştur
yas_ortalamasi=np.round(np.mean(veri.yas),2)
# print("Yaş ortalaması: {}".format(yas_ortalamasi))
veri["yas"]=veri["yas"].fillna(yas_ortalamasi)
# print(veri.info())

#Madalya alamayan sporcuları veri setinden çıkaracağız. Toplamda 231333 tan örnek için madalya değişkeni tanımlı değil
madalya_degiskeni=veri["madalya"]
print(pd.isnull(madalya_degiskeni).sum())
#madalya değişkeni tanımlı olmayan örnekleri bul, (NaN)
#tilda işareti ile tersini al
#madalya değişkeni tanımlı olan örnekleri bulmak için filtre oluştur
madalya_degiskeni_filtresi=~pd.isnull(madalya_degiskeni)
veri=veri[madalya_degiskeni_filtresi]
# print(veri.head(5))
print(veri.info())

veri.to_csv("olimpiyatlar_temizlenmis.csv",index=False)
