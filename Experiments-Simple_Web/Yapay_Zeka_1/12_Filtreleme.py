import pandas as pd
dictionary={"isim":["ali","veli","kenan","murat","ayse","hilal"],
            "yas":[15,16,17,33,45,66],
            "sehir":["İzmir","Ankara","Konya","Ankara","Ankara","Antalya"]}
veri=pd.DataFrame(dictionary)
# print(veri)
filtre1=veri.yas>22
filtrelenmis_veri=veri[filtre1]
# print(filtrelenmis_veri)
filtre2=veri.sehir=="Ankara"
# print(veri[filtre1&filtre2])
ortalama_yas=veri.yas.mean()
# print(ortalama_yas)
veri["YAS_GRUBU"]=["kucuk" if ortalama_yas>i else "buyuk" for i in veri.yas]
# print(veri)
veri.columns=[i.lower() for i in veri.columns]
veri=veri.assign(yas_5_yil_sonra=lambda x:(x['yas']+5))
def yas10YilSonra(age):
    return age+10
veri["yas_10_yil_sonra"]=veri.yas.apply(yas10YilSonra)
print(veri)
