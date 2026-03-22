import numpy as np
dizi=np.array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
#array ın boyutunu bulma
print(dizi.shape)
#1x15 lik array i 3x5 lik bir matrise çeviriyoruz
dizi2=dizi.reshape(3,5)
print(dizi2)
print("Şekil: ",dizi2.shape) # Şekil (3,5)
print("Boyut: ",dizi2.ndim) #Boyut: 2
print("Veri tipi: ",dizi2.dtype.name)   #Veri tipi: int32
print("Boy: ",dizi2.size)   #Boy: 15
print("type: ",type(dizi2)) #<class  'numpy.ndarray'>
sifir_dizi=np.zeros((3,4))
print(sifir_dizi)   #3x4 lük sıfırlardan oluşan bir matris oluşturur
bir_dizi=np.ones((3,4))
print(bir_dizi)  #3x4 lük birlerden oluşan bir matris oluşturur
bos_dizi=np.empty((2,3))
print(bos_dizi)
dizi_aralik=np.arange(10,50,5)  
print(dizi_aralik)  #array([10,15,20,25,30,35,40,45])
dizi_bosluk=np.linspace(10,20,5)
print(dizi_bosluk)
