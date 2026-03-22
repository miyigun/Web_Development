import pandas as pd
sozluk1={"isim":["ali","veli","kenan"],
         "yas":[15,16,17],
         "sehir":["İzmir","Ankara","Konya"]}
veri1=pd.DataFrame(sozluk1)
sozluk2={"isim":["murat","ayse","hilal"],
         "yas":[33,45,66],
         "sehir":["Ankara","Ankara","Antalya"]}
veri2=pd.DataFrame(sozluk2)
veri_dikey=pd.concat([veri1,veri2],axis=0)
print(veri_dikey)
veri_yatay=pd.concat([veri1,veri2],axis=1)
print(veri_yatay)
