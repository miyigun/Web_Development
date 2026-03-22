import matplotlib.pyplot as plt
import pandas as pd

veri=pd.read_csv("iris.csv")

print(veri.head())

fig,ax=plt.subplots(2,1)
fig.suptitle("Alt Yaprak Uzunluk ve Üst Yaprak Uzunluk",fontsize=14)

ax[0].plot(veri.Id,veri.SepalLengthCm,color="red",label="SepalLengthCm")
ax[0].set_title('Alt Yaprak Uzunluk')
ax[0].set_xlabel("id")
ax[0].set_ylabel("Cm")

ax[1].plot(veri.Id,veri.PetalLengthCm,color="green",label="PetalLengthCm")
ax[1].set_title('Üst Yaprak Uzunluk')
ax[1].set_xlabel("id")
ax[1].set_ylabel("Cm")

fig.tight_layout()
fig.subplots_adjust(top=0.85)
plt.show()