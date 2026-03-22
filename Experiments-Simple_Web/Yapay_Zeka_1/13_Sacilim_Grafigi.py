import matplotlib.pyplot as plt
import pandas as pd

veri=pd.read_csv("iris.csv")

plt.figure()
plt.scatter(veri["SepalLengthCm"],veri["SepalWidthCm"],color="blue",s=15,alpha=0.7)
plt.title("Alt Yaprak Uzunluğu ve Genişliği")
plt.xlabel("Alt Yaprak Uzunluğu(Cm)")
plt.ylabel("Alt Yaprak Genişliği(Cm)")
plt.grid(True)
plt.show()