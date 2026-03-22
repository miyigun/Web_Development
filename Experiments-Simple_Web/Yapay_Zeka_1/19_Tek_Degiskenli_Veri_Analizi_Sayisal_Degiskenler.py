import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

#python'da uyarıları kapatalım
import warnings
warnings.filterwarnings("ignore")

#veriyi içeri aktaracağız
veri=pd.read_csv("olimpiyatlar_temizlenmis.csv")

def plotHistogram(degisken):
    """
        Girdi:  Değişken/Sütun ismi
        Çıktı:  Histogram grafiği
    """
    plt.figure()
    plt.hist(veri[degisken],bins=85,color="orange")
    plt.xlabel(degisken)
    plt.ylabel("Frekans")
    plt.title("Veri sıklığı - {}".format(degisken))
    plt.show()
    
#Sayısal değişkenler için histogram çizdirelim
sayisal_degisken=["yas","boy","kilo","yil"]
for i in sayisal_degisken:
    plotHistogram(i)

#veri içerisinde bulunan sayısal değerleri istatiksel açıdan inceleyelim
veri.describe()
#yas değişkeni için filtreyi uygulayıp sonra kutu grafiği çizdirelim
plt.boxplot(veri.yas)
plt.title("Yaş değişkeni için kutu grafiği")
plt.xlabel("yas")
plt.ylabel("Değer")
plt.show()