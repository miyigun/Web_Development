import pandas as pd
dictionary={"isim":["ali","veli","kenan","murat","ayse","hilal"],
            "yas":[15,16,17,33,45,66],
            "maas":[100,150,240,350,110,220]}
veri=pd.DataFrame(dictionary)
#print(veri)
#print(veri["yas"])
veri["sehir"]=["Ankara","İstanbul","Konya","İzmir","Bursa","Antalya"]
#print(veri)
#print(veri.loc[:,"yas"])
#print(veri.loc[:3,"yas"])
#print(veri.loc[:3,"yas":"sehir"])
#print(veri.loc[:3,["yas","sehir"]])
# print(veri.loc[::-1,:])
# print(veri.iloc[:,1])
print(veri.iloc[:3,[0,1]])
