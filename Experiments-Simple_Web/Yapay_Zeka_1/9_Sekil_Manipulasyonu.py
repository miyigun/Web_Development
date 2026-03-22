import numpy as np
dizi2D=np.array([[1,2,3],[4,5,6],[7,8,9]])
print(dizi2D)
#vektör haline getirme
vektor=dizi2D.ravel() #ravel in anlamı tel ayırma, düğüm çözme anlamında
print(vektor)
vektor.reshape(3,3)
print(vektor)
print(dizi2D.T)

#dizileri istifleme
dizi1=np.array([[1,2],[3,4]])
dizi2=np.array([[-1,-2],[-3,-4]])
#iki diziyi alt alta ekleme: sütun sayısı sabit satırları arttır
dizi_dikey=np.vstack((dizi1,dizi2))
print(dizi_dikey)
dizi_satır=np.hstack((dizi1,dizi2))
print(dizi_satır)
