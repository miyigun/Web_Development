import matplotlib.pyplot as plt
import pandas as pd

veri=pd.read_csv("iris.csv")

plt.figure()
plt.hist(veri["SepalLengthCm"],color="green",alpha=0.5,bins=20,label="Alt Yaprak Uzunluk")
plt.hist(veri["PetalLengthCm"],color="orange",alpha=0.5,bins=20,label="Üst Yaprak Uzunluk")
plt.title("Alt Yaprak Uzunluğu ve Üst Yaprak Uzunluğu-Histogram")
plt.xlabel("Cm")
plt.ylabel("Frekans")
plt.legend()
plt.show()