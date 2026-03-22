import pandas as pd
dictionary={"isim":["ali","veli","kenan","murat","ayse","hilal"],
            "yas":[15,16,17,33,45,66],
            "maas":[100,150,240,350,110,220]}
veri=pd.DataFrame(dictionary)
print(veri)
print(veri.head())
print(veri.tail())
print(veri.columns)
print(veri.info())
print(veri.describe())
