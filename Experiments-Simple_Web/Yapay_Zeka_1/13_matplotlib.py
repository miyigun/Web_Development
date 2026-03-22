import pandas as pd

veri=pd.read_csv("iris.csv")
# print(veri.head())
# print(veri.columns)
# print(veri.Species.unique())
# print(veri.info())
print(veri.describe())