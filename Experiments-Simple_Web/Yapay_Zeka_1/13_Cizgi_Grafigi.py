import matplotlib.pyplot as plt
import pandas as pd

veri=pd.read_csv("iris.csv")

plt.figure()
plt.plot(veri["Id"],veri["SepalLengthCm"],color="red",alpha=0.7)
plt.title('Alt yaprak uzunluğu')
plt.xlabel("id")
plt.ylabel("Cm")
plt.grid(True)

plt.show()