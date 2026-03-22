import matplotlib.pyplot as plt
import pandas as pd

veri=pd.read_csv("iris.csv")

print(veri.head())
veri_sutun_listesi=['SepalLengthCm',"SepalWidthCm","PetalLengthCm","PetalWidthCm"]
tanım=veri.describe()
print(tanım)
ortalama=tanım.iloc[1,[1,2,3,4]]
print(ortalama)

plt.figure()
plt.bar(veri_sutun_listesi,ortalama)
plt.title("Alt Yaprak Uzunluğu ve Genişliği Ortalama")
plt.ylabel("Cm")
plt.show()