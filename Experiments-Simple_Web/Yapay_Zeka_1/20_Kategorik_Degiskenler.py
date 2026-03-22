import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

#python'da uyarıları kapatalım
import warnings
warnings.filterwarnings("ignore")

#veriyi içeri aktaracağız
veri=pd.read_csv("olimpiyatlar_temizlenmis.csv")

#öncelikli olarak bar grafiğini elde edeceğimiz metodumuzu yazalım
def plotBar(degisken,n=5):
    """
        Girdi:  Değişken/sütun isim
                n=en önemli 5 eşsiz değer
        Çıktı:  Bar grafiği
    """
    veri_=veri[degisken]
    veri_sayma=veri_.value_counts()
    veri_sayma=veri_sayma[:n]
    plt.figure()
    plt.bar(veri_sayma.index,veri_sayma,color="orange")
    plt.xticks(veri_sayma.index,veri_sayma.index.values)
    plt.xticks(rotation=45)
    plt.ylabel("Frekans")
    plt.title("Veri sıklığı- {}".format(degisken))
    plt.show()
    print("{}:\n{}".format(degisken,veri_sayma))
 #sayısal değişkenler için histogram çizdirelim
kategorik_degisken=["isim","cinsiyet","takim","uok","sezon","sehir","spor","etkinlik","madalya"]

for i in kategorik_degisken:
    plotBar(i)   


