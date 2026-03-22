const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs'); // Dosya okuma/yazma için gerekli
const multer = require('multer');
const path = require('path');
const moment = require('moment'); // Tarih işlemleri için moment.js kullanabilirsiniz
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

let isUpdating=false;

const today = new Date().toISOString().split('T')[0]; 

// SQLite veritabanı bağlantısı
const db = new sqlite3.Database('./netlify/functions/database.db', (err) => {
    if (err) {
      console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
      console.log('SQLite veritabanına başarıyla bağlanıldı.');
      createTables();
      initializeUserInfo();
      initializeTasksTable();
      initializeCategoriesTable();
      initializeProductsTable();
      initializeGoalsTable();
      initializeHabitsTable();
    }
});

function createTables() {
    // user_info tablosu oluşturma
    db.run(`CREATE TABLE IF NOT EXISTS user_info (
        username TEXT,
        password TEXT,
        userlevel INTEGER,
        usertp INTEGER,
        usergold INTEGER,
        selectedFilter TEXT,
        selectedFilterGoal TEXT,
        selectedDate TEXT,
        savedTheme TEXT,
        profilePicture TEXT
    )`, logTableCreation('user_info'));

    // tasks tablosu oluşturma
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        gorev_sira_no INTEGER,
        gorev_ikon TEXT,
        gorev_ikon_renk TEXT,
        gorev_tanimi TEXT,
        gorev_aciklama TEXT,
        gorev_tarih TEXT,
        gorev_kategori TEXT,
        gorev_tp INTEGER,
        gorev_altin INTEGER,
        gorev_yapildimi BOOLEAN,
        gorev_durumu TEXT,
        gorev_tekrar TEXT,
        onem_derecesi TEXT,
        gorev_tamamlanma_tarihi TEXT
    )`, logTableCreation('tasks'));

    // categories tablosu oluşturma
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        category_name TEXT,
        category_level INTEGER,
        category_tp INTEGER,
        category_tpUpdated BOOLEAN
    )`, logTableCreation('categories'));

    // products tablosu oluşturma
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        product_icon TEXT,
        product_color TEXT,
        product_name TEXT,
        product_price INTEGER,
        product_stock INTEGER,
        product_date TEXT
    )`, logTableCreation('products'));

    // goals tablosu oluşturma
    db.run(`CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY,
        hedef_ikon TEXT,
        hedef_ikon_renk TEXT,
        hedef_tanimi TEXT,
        hedef_aciklama TEXT,
        hedef_kategori TEXT,
        hedef_tp INTEGER,
        hedef_altin INTEGER,
        hedef_ulasildimi BOOLEAN,
        hedef_durumu TEXT,
        hedef_tamamlanma_tarihi TEXT,
        hedef_takip_notlari TEXT,
        hedef_geribildirim TEXT
    )`, logTableCreation('goals'));

    // habits tablosu oluşturma
    db.run(`CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY,
        aliskanlik_tanimi TEXT,
        aliskanlik_aciklama TEXT,
        aliskanlik_baslangic_tarihi TEXT,
        aliskanlik_gun_sayisi INTEGER,
        aliskanlik_gunluk_takip TEXT,
        aliskanlik_kategori TEXT,
        aliskanlik_tp INTEGER,
        aliskanlik_altin INTEGER,
        aliskanlik_ulasildimi BOOLEAN,
        aliskanlik_durumu TEXT
    )`, logTableCreation('habits'));
}

function initializeUserInfo() {

    db.get('SELECT COUNT(*) AS count FROM user_info', (err, row) => {
        if (err) {
            console.error('user_info tablosunu kontrol ederken hata oluştu:', err.message);
        } else if (row.count === 0) {
            const defaultUser = {
                username: "",
                password: "",
                userlevel: 0,
                usertp: 0,
                usergold: 0,
                selectedFilter: "today",
                selectedFilterGoal: "action",
                selectedDate: today,
                savedTheme: "light",
                profilePicture: "/public/images/profil.jpg"
            };
            db.run(`INSERT INTO user_info (username, password, userlevel, usertp, usergold, selectedFilter, selectedFilterGoal, selectedDate, savedTheme, profilePicture) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    defaultUser.username,
                    defaultUser.password,
                    defaultUser.userlevel,
                    defaultUser.usertp,
                    defaultUser.usergold,
                    defaultUser.selectedFilter,
                    defaultUser.selectedFilterGoal,
                    defaultUser.selectedDate,
                    defaultUser.savedTheme,
                    defaultUser.profilePicture
                ],
                (err) => {
                    if (err) {
                        console.error('Varsayılan kullanıcı bilgileri eklenirken hata oluştu:', err.message);
                    } else {
                        console.log('Varsayılan kullanıcı bilgileri başarıyla eklendi.');
                    }
                }
            );
        } else {
            console.log('user_info tablosunda zaten veri mevcut.');
        }
    });
}

function initializeTasksTable() {
   
    // JSON Verisi
    const tasks = [
        {
            "gorev_sira_no": 1,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Kilom belirlenecek",
            "gorev_aciklama": "En son 83 idim.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 2,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Günlük yazılacak",
            "gorev_aciklama": "Word'e klasörün içerisine kaydedilecek",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 3,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Akşam siğil ilacı sürülecek",
            "gorev_aciklama": "Sırtımdakileri unutma",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 4,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Akşam ekmek yenilmeyecek",
            "gorev_aciklama": "Buna alışmam lazım.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 5,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Akşam mantar ilacı sürülecek",
            "gorev_aciklama": "Tırnağımı gerekirse keseceğim.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 6,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Akşam diş fırçalanacak",
            "gorev_aciklama": "Gargara da yapılacak.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 7,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Ağırlık kaldırılacak",
            "gorev_aciklama": "Şimdilik her gün vücudumun bir bölümünü çalıştırmayı düşünüyorum.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 2,
            "gorev_altin": 2,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 8,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Öğlen ekmek yenilmeyecek",
            "gorev_aciklama": "Pilav evde hep olmalı.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 9,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Sabah mantar ilacı sürülecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 10,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Sabah siğil ilacı sürülecek",
            "gorev_aciklama": "Belimdekine de sürülecek.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 11,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Sabah diş fırçalanacak",
            "gorev_aciklama": "Gargara yapmayı unutma.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 12,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Yürüyüş yapılacak",
            "gorev_aciklama": "10.000 adım",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 3,
            "gorev_altin": 3,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 13,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Sakal tıraşı olunacak",
            "gorev_aciklama": "Haftada 3 gün yeterli olur bence.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "OT-2",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 14,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Banyo yapılacak",
            "gorev_aciklama": "Haftada 3 gün yeterli olacaktır.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "OT-3",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 15,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Tırnaklarım kesilecek",
            "gorev_aciklama": "Ayak tırnaklarımı 2 haftada 1 kesebilirim.",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 16,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Gözde'nin okulu için yemek hazırlanacak",
            "gorev_aciklama": "Pizza",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "HA",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 17,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Evlilik yıldönümü hediyesi alınacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 3,
            "gorev_altin": 3,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "Y",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 18,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Evlilik yıldönümü için hazırlık yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 3,
            "gorev_altin": 3,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "Y",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 19,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Gülden'e zaman ayrılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 20,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Gözde'ye zaman ayrılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 21,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Çöp atılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 22,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Haftalık yemek listesi hazırlanacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 23,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Alışveriş yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 24,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Gözde'ye odası toplattırılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 25,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Çamaşır yıkanacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 26,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Yemek yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 27,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Fotoğraflar yedeklenecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 28,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Telefonun bakımı yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Düşük",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 29,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Evin tozu alınacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 30,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Ev süpürülecek",
            "gorev_aciklama": "Robot süpürge sağolsun. 3 günde 1 yeterli olacaktır.",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "1",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 31,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Dolabım düzeltilecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 32,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Bilgisayarın bakımı yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 33,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Ev toplanacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 34,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Bulaşıklar yıkanacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 35,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Evlilik yıldönümü hediyesi alınacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 3,
            "gorev_altin": 3,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "Y",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 36,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Evlilik yıldönümü için hazırlık yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 3,
            "gorev_altin": 3,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "Y",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 37,
            "gorev_ikon": "fa-wallet",
            "gorev_ikon_renk": "orange",
            "gorev_tanimi": "Hesap defteri güncellenecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ekonomi",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 38,
            "gorev_ikon": "fa-wallet",
            "gorev_ikon_renk": "orange",
            "gorev_tanimi": "Sınav görevleri takip edilecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ekonomi",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 39,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Çöp atılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 40,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Haftalık yemek listesi hazırlanacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 41,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Alışveriş yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 42,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Gözde'ye odası toplattırılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 43,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Çamaşır yıkanacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 44,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Fotoğraflar yedeklenecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 45,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Telefonun bakımı yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Düşük",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 46,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Evin tozu alınacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 47,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Dolabım düzeltilecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 48,
            "gorev_ikon": "fa-home",
            "gorev_ikon_renk": "green",
            "gorev_tanimi": "Bilgisayarın bakımı yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ev",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 49,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Evlilik yıldönümü hediyesi alınacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 3,
            "gorev_altin": 3,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "Y",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 50,
            "gorev_ikon": "fa-users",
            "gorev_ikon_renk": "blue",
            "gorev_tanimi": "Evlilik yıldönümü için hazırlık yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Aile",
            "gorev_tp": 3,
            "gorev_altin": 3,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "Y",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 51,
            "gorev_ikon": "fa-wallet",
            "gorev_ikon_renk": "orange",
            "gorev_tanimi": "Hesap defteri güncellenecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ekonomi",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 52,
            "gorev_ikon": "fa-wallet",
            "gorev_ikon_renk": "orange",
            "gorev_tanimi": "Sınav görevleri takip edilecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Ekonomi",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "H",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 53,
            "gorev_ikon": "fa-user",
            "gorev_ikon_renk": "red",
            "gorev_tanimi": "Günlük yapılacaklar kontrol edilecek",
            "gorev_aciklama": "Önem sırasına sokulacak",
            "gorev_tarih": today,
            "gorev_kategori": "Kişisel",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 54,
            "gorev_ikon": "fa-briefcase",
            "gorev_ikon_renk": "black",
            "gorev_tanimi": "Bilişim ekibi işleri yapılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "İş",
            "gorev_tp": 2,
            "gorev_altin": 2,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Yüksek",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 55,
            "gorev_ikon": "fa-phone",
            "gorev_ikon_renk": "pink",
            "gorev_tanimi": "Annemgille görüntülü görüşülecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "İletişim",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 56,
            "gorev_ikon": "fa-code",
            "gorev_ikon_renk": "black",
            "gorev_tanimi": "BTK Akdemi'den 'JQuery' eğitimi devam ettirilecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Programlama",
            "gorev_tp": 2,
            "gorev_altin": 2,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 57,
            "gorev_ikon": "fa-comments",
            "gorev_ikon_renk": "grey",
            "gorev_tanimi": "BTK Akdemi'den 'B1 Seviye İngilizce' eğitimi devam ettirilecek",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Yabancı Dil",
            "gorev_tp": 2,
            "gorev_altin": 2,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "G",
            "onem_derecesi": "Orta",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 58,
            "gorev_ikon": "fa-chess-king",
            "gorev_ikon_renk": "black",
            "gorev_tanimi": "Satranca çalışılacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Satranç",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "",
            "onem_derecesi": "Düşük",
            "gorev_tamamlanma_tarihi": ""
        },
        {
            "gorev_sira_no": 59,
            "gorev_ikon": "fa-guitar",
            "gorev_ikon_renk": "purple",
            "gorev_tanimi": "Gitar çalınacak",
            "gorev_aciklama": "",
            "gorev_tarih": today,
            "gorev_kategori": "Müzik",
            "gorev_tp": 1,
            "gorev_altin": 1,
            "gorev_yapildimi": false,
            "gorev_durumu": "",
            "gorev_tekrar": "OT-3",
            "onem_derecesi": "Düşük",
            "gorev_tamamlanma_tarihi": ""
        }
    ];

    // Veritabanını kontrol et ve ekle
    db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {
        if (err) {
            console.error("Görev tablosu kontrol edilemedi:", err);
        } else if (row.count === 0) {
            // Insert tasks if table is empty
            const stmt = db.prepare("INSERT INTO tasks (gorev_sira_no, gorev_ikon, gorev_ikon_renk, gorev_tanimi, gorev_aciklama, gorev_tarih, gorev_kategori, gorev_tp, gorev_altin, gorev_yapildimi, gorev_durumu, gorev_tekrar, onem_derecesi, gorev_tamamlanma_tarihi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
            tasks.forEach(task => {
                stmt.run(task.gorev_sira_no, task.gorev_ikon, task.gorev_ikon_renk, task.gorev_tanimi, task.gorev_aciklama, task.gorev_tarih, task.gorev_kategori, task.gorev_tp, task.gorev_altin, task.gorev_yapildimi, task.gorev_durumu, task.gorev_tekrar, task.onem_derecesi, task.gorev_tamamlanma_tarihi, (err) => {
                    if (err) {
                        console.error("Görev eklenemedi:", err);
                    }
                });
            });
    
            stmt.finalize();
            console.log("Varsayılan görevler başarıyla eklendi.");
        } else {
            console.log("Görev tablosu zaten dolu.");
        }
    });

}

function initializeCategoriesTable(){

    const initialCategories = [
        {
          "id": 1,
          "category_name": "Genel",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 2,
          "category_name": "Kişisel",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 3,
          "category_name": "Aile",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 4,
          "category_name": "Ev",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 5,
          "category_name": "Ekonomi",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 6,
          "category_name": "İş",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 7,
          "category_name": "Alışveriş",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 8,
          "category_name": "İletişim",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 9,
          "category_name": "Programlama",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 10,
          "category_name": "Yabancı Dil",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 11,
          "category_name": "Satranç",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 12,
          "category_name": "Müzik",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 13,
          "category_name": "Yemek",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 14,
          "category_name": "Araba",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        },
        {
          "id": 15,
          "category_name": "Gezi",
          "category_level": 0,
          "category_tp": 0,
          "category_tpUpdated": false
        }
      ];

      db.get("SELECT COUNT(*) AS count FROM categories", (err, row) => {
        if (err) {
            console.error("Kategori tablosu kontrol edilemedi:", err);
        } else if (row.count === 0) {
            // Insert initial categories if table is empty
            const stmt = db.prepare("INSERT INTO categories (id, category_name, category_level, category_tp, category_tpUpdated) VALUES (?, ?, ?, ?, ?)");
    
            initialCategories.forEach(category => {
                stmt.run(category.id, category.category_name, category.category_level, category.category_tp, category.category_tpUpdated, (err) => {
                    if (err) {
                        console.error("Kategori eklenemedi:", err);
                    }
                });
            });
    
            stmt.finalize();
            console.log("Varsayılan kategoriler başarıyla eklendi.");
        } else {
            console.log("Kategori tablosu zaten dolu.");
        }
    });

}

function initializeProductsTable() {
    const initialProducts = [
        {
            "id": 1,
            "product_icon": "fa-clapperboard",
            "product_color": "black",
            "product_name": "30 dakika film izlemek",
            "product_price": 2,
            "product_stock": 1000,
            "product_date": today
        },
        {
            "id": 2,
            "product_icon": "fa-clapperboard",
            "product_color": "black",
            "product_name": "1 saat film izlemek",
            "product_price": 3,
            "product_stock": 1000,
           "product_date": today
        },
        {
            "id": 3,
            "product_icon": "fa-user",
            "product_color": "black",
            "product_name": "31 çekme",
            "product_price": 5,
            "product_stock": 1000,
            "product_date": today
        },
        {
            "id": 4,
            "product_icon": "fa-user",
            "product_color": "black",
            "product_name": "Seks",
            "product_price": 10,
            "product_stock": 1000,
            "product_date": today
        },
        {
            "id": 5,
            "product_icon": "fa-mug-hot",
            "product_color": "black",
            "product_name": "1 bardak çay",
            "product_price": 1,
            "product_stock": 1000,
            "product_date": today
        },
        {
            "id": 6,
            "product_icon": "fa-square",
            "product_color": "black",
            "product_name": "1 çikolata yemek",
            "product_price": 3,
            "product_stock": 1000,
            "product_date": today
        }
    ];

    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
            console.error("Ürün tablosu kontrol edilemedi:", err);
        } else if (row.count === 0) {
            // Insert initial products if table is empty
            const stmt = db.prepare("INSERT INTO products (id, product_icon, product_color, product_name, product_price, product_stock, product_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
            initialProducts.forEach(product => {
                stmt.run(product.id, product.product_icon, product.product_color, product.product_name, product.product_price, product.product_stock, product.product_date, (err) => {
                    if (err) {
                        console.error("Ürün eklenemedi:", err);
                    }
                });
            });
    
            stmt.finalize();
            console.log("Varsayılan ürünler başarıyla eklendi.");
        } else {
            console.log("Ürün tablosu zaten dolu.");
        }
    });
}

function initializeGoalsTable() {
    const initialGoals = [
        {
            "id": 1,
            "hedef_ikon": "fa-hand-holding-heart",
            "hedef_ikon_renk": "red",
            "hedef_tanimi": "65 kiloya düşülecek",
            "hedef_aciklama": "Haftalık kilom belirlenecek",
            "hedef_kategori": "Kişisel",
            "hedef_tp": 15,
            "hedef_altin": 15,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "Haftalık olarak vücut ölçülerini takip et.",
            "hedef_geribildirim": "Haftalık kilo kontrolü yapıldı."
        },
        {
            "id": 2,
            "hedef_ikon": "fa-briefcase",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "Articulate'de video ve ses oynatma sorunlarına çözüm bulunacak",
            "hedef_aciklama": "",
            "hedef_kategori": "İş",
            "hedef_tp": 2,
            "hedef_altin": 2,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 3,
            "hedef_ikon": "fa-briefcase",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "Scorm kütüphanesi düzenlenecek",
            "hedef_aciklama": "",
            "hedef_kategori": "İş",
            "hedef_tp": 2,
            "hedef_altin": 2,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 4,
            "hedef_ikon": "fa-briefcase",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "İstatistikle ilgili çalışmam tamamlanacak",
            "hedef_aciklama": "",
            "hedef_kategori": "İş",
            "hedef_tp": 3,
            "hedef_altin": 3,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 5,
            "hedef_ikon": "fa-briefcase",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "22.Föy içeriği hazırlanacak",
            "hedef_aciklama": "",
            "hedef_kategori": "İş",
            "hedef_tp": 5,
            "hedef_altin": 5,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 6,
            "hedef_ikon": "fa-code",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "BTK Akdemi'den 'JQuery' eğitimi tamamlanacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Programlama",
            "hedef_tp": 10,
            "hedef_altin": 10,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 7,
            "hedef_ikon": "fa-comments",
            "hedef_ikon_renk": "grey",
            "hedef_tanimi": "BTK Akdemi'den 'B1 Seviye İngilizce' eğitimi tamamlanacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Yabancı Dil",
            "hedef_tp": 10,
            "hedef_altin": 10,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 8,
            "hedef_ikon": "fa-car",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "Arabanın şoför koltuğuna örtü alınacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Araba",
            "hedef_tp": 2,
            "hedef_altin": 2,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 9,
            "hedef_ikon": "fa-plane",
            "hedef_ikon_renk": "red",
            "hedef_tanimi": "Yeşil pasaport çıkarılacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Kişisel",
            "hedef_tp": 3,
            "hedef_altin": 3,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 10,
            "hedef_ikon": "fa-code",
            "hedef_ikon_renk": "navy",
            "hedef_tanimi": "LinkEdin'de yaptığım etkinlikler belirli bir plan dahilinde paylaşılacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Programlama",
            "hedef_tp": 5,
            "hedef_altin": 5,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 11,
            "hedef_ikon": "fa-code",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "React üzerine bir kurs bitirmek",
            "hedef_aciklama": "",
            "hedef_kategori": "Programlama",
            "hedef_tp": 10,
            "hedef_altin": 10,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 12,
            "hedef_ikon": "fa-comments",
            "hedef_ikon_renk": "grey",
            "hedef_tanimi": "BTK Akdemi'den 'B2 Seviye İngilizce' eğitimi tamamlanacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Yabancı Dil",
            "hedef_tp": 10,
            "hedef_altin": 10,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 13,
            "hedef_ikon": "fa-camera",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "Yeşil pasaport çıkartılacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Gezi",
            "hedef_tp": 5,
            "hedef_altin": 5,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 14,
            "hedef_ikon": "fa-code",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "medium.com'da 1 makale yayınlatılacak",
            "hedef_aciklama": "",
            "hedef_kategori": "Programlama",
            "hedef_tp": 10,
            "hedef_altin": 10,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        },
        {
            "id": 15,
            "hedef_ikon": "fa-camera",
            "hedef_ikon_renk": "black",
            "hedef_tanimi": "Teleferik'e binilecek",
            "hedef_aciklama": "",
            "hedef_kategori": "Gezi",
            "hedef_tp": 3,
            "hedef_altin": 3,
            "hedef_ulasildimi": false,
            "hedef_durumu": "",
            "hedef_tamamlanma_tarihi": "",
            "hedef_takip_notlari": "",
            "hedef_geribildirim": ""
        }
    ];

    db.get("SELECT COUNT(*) AS count FROM goals", (err, row) => {
        if (err) {
            console.error("Hedef tablosu kontrol edilemedi:", err);
        } else if (row.count === 0) {
            // Insert initial goals if table is empty
            const stmt = db.prepare("INSERT INTO goals (id, hedef_ikon, hedef_ikon_renk, hedef_tanimi, hedef_aciklama, hedef_kategori, hedef_tp, hedef_altin, hedef_ulasildimi, hedef_durumu, hedef_tamamlanma_tarihi, hedef_takip_notlari, hedef_geribildirim) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
            initialGoals.forEach(goal => {
                stmt.run(goal.id, goal.hedef_ikon, goal.hedef_ikon_renk, goal.hedef_tanimi, goal.hedef_aciklama, goal.hedef_kategori, goal.hedef_tp, goal.hedef_altin, goal.hedef_ulasildimi, goal.hedef_durumu, goal.hedef_tamamlanma_tarihi, goal.hedef_takip_notlari, goal.hedef_geribildirim, (err) => {
                    if (err) {
                        console.error("Hedef eklenemedi:", err);
                    }
                });
            });
    
            stmt.finalize();
            console.log("Varsayılan hedefler başarıyla eklendi.");
        } else {
            console.log("Hedef tablosu zaten dolu.");
        }
    });

}

function initializeHabitsTable() {
    const initialHabits = [
    {
        "id": 1,
        "aliskanlik_tanimi": "Günlük 10.000 adım atılacak",
        "aliskanlik_aciklama": "",
        "aliskanlik_baslangic_tarihi": today,
        "aliskanlik_gun_sayisi": 10,
        "aliskanlik_gunluk_takip": [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
        ],
        "aliskanlik_kategori": "Kişisel",
        "aliskanlik_tp": 15,
        "aliskanlik_altin": 3,
        "aliskanlik_ulasildimi": false,
        "aliskanlik_durumu": ""
    },
    {
        "id": 2,
        "aliskanlik_tanimi": "Günde 30 dakika meditasyon yapılacak",
        "aliskanlik_aciklama": "Zihinsel rahatlama ve odaklanma sağlamak amacıyla meditasyon",
        "aliskanlik_baslangic_tarihi": today,
        "aliskanlik_gun_sayisi": 15,
        "aliskanlik_gunluk_takip": [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
        ],
        "aliskanlik_kategori": "Kişisel",
        "aliskanlik_tp": 10,
        "aliskanlik_altin": 5,
        "aliskanlik_ulasildimi": false,
        "aliskanlik_durumu": ""
    },
    {
        "id": 3,
        "aliskanlik_tanimi": "Haftada 3 gün egzersiz yapılacak",
        "aliskanlik_aciklama": "Fiziksel sağlığı artırmak amacıyla spor salonunda egzersiz",
        "aliskanlik_baslangic_tarihi": today,
        "aliskanlik_gun_sayisi": 12,
        "aliskanlik_gunluk_takip": [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
        ],
        "aliskanlik_kategori": "Fiziksel",
        "aliskanlik_tp": 20,
        "aliskanlik_altin": 4,
        "aliskanlik_ulasildimi": false,
        "aliskanlik_durumu": ""
    },
    {
        "id": 4,
        "aliskanlik_tanimi": "Her gün 2 litre su içilecek",
        "aliskanlik_aciklama": "Sağlıklı bir yaşam için su tüketimi artırılacak",
        "aliskanlik_baslangic_tarihi": today,
        "aliskanlik_gun_sayisi": 30,
        "aliskanlik_gunluk_takip": [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
        ],
        "aliskanlik_kategori": "Sağlık",
        "aliskanlik_tp": 10,
        "aliskanlik_altin": 2,
        "aliskanlik_ulasildimi": false,
        "aliskanlik_durumu": ""
    },
    {
        "id": 5,
        "aliskanlik_tanimi": "Her gün 1 saat kitap okunacak",
        "aliskanlik_aciklama": "Zihinsel gelişim için günlük kitap okuma alışkanlığı",
        "aliskanlik_baslangic_tarihi": today,
        "aliskanlik_gun_sayisi": 20,
        "aliskanlik_gunluk_takip": [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
        ],
        "aliskanlik_kategori": "Kişisel",
        "aliskanlik_tp": 12,
        "aliskanlik_altin": 6,
        "aliskanlik_ulasildimi": false,
        "aliskanlik_durumu": ""
    },
    {
        "id": 6,
        "aliskanlik_tanimi": "Her sabah 10 dakika esneme yapılacak",
        "aliskanlik_aciklama": "Fiziksel esneklik için her sabah düzenli esneme egzersizleri",
        "aliskanlik_baslangic_tarihi": today,
        "aliskanlik_gun_sayisi": 7,
        "aliskanlik_gunluk_takip": [
        false,
        false,
        false,
        false,
        false,
        false,
        false
        ],
        "aliskanlik_kategori": "Fiziksel",
        "aliskanlik_tp": 8,
        "aliskanlik_altin": 3,
        "aliskanlik_ulasildimi": false,
        "aliskanlik_durumu": ""
    }
    ];

    db.get("SELECT COUNT(*) AS count FROM habits", (err, row) => {
        if (err) {
            console.error("Alışkanlık tablosu kontrol edilemedi:", err);
        } else if (row.count === 0) {
            // Insert initial habits if table is empty
            const stmt = db.prepare("INSERT INTO habits (id, aliskanlik_tanimi, aliskanlik_aciklama, aliskanlik_baslangic_tarihi, aliskanlik_gun_sayisi, aliskanlik_gunluk_takip, aliskanlik_kategori, aliskanlik_tp, aliskanlik_altin, aliskanlik_ulasildimi, aliskanlik_durumu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
            initialHabits.forEach(habit => {
                stmt.run(habit.id, habit.aliskanlik_tanimi, habit.aliskanlik_aciklama, habit.aliskanlik_baslangic_tarihi, habit.aliskanlik_gun_sayisi, JSON.stringify(habit.aliskanlik_gunluk_takip), habit.aliskanlik_kategori, habit.aliskanlik_tp, habit.aliskanlik_altin, habit.aliskanlik_ulasildimi, habit.aliskanlik_durumu, (err) => {
                    if (err) {
                        console.error("Alışkanlık eklenemedi:", err);
                    }
                });
            });
    
            stmt.finalize();
            console.log("Varsayılan alışkanlıklar başarıyla eklendi.");
        } else {
            console.log("Alışkanlık tablosu zaten dolu.");
        }
    });

}

function logTableCreation(tableName) {
    return (err) => {
        if (err) {
            console.error(`${tableName} tablosu oluşturulurken hata oluştu:`, err.message);
        } else {
            console.log(`${tableName} tablosu başarıyla oluşturuldu.`);
        }
    };
}

// Yükleme klasörü
const uploadFolder = path.join(__dirname, 'public/images');

// Yalnızca .jpg dosyalarını kabul eden filtre
const fileFilter = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension === '.jpg') {
        cb(null, true); // Yüklemeye izin ver
    } else {
        cb(new Error('Yalnızca .jpg formatındaki dosyalar kabul edilir.'));
    }
};

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Dosyaların kaydedileceği klasör
    },
    filename: (req, file, cb) => {
        cb(null, 'profil.jpg'); // Sabit dosya adı
    }
});

const upload = multer({ storage });

// Middleware

app.use(express.json());
app.use(cors()); // Tüm kaynaklar için CORS izni verir.
app.use(express.static(path.join(__dirname, 'public'))); // Root üzerinden public içeriği sunar.
app.use('/public/images', express.static(uploadFolder)); // Sadece /public/images için uploadFolder'ı sunar.

module.exports.handler = serverless(app);

// '/get-user' endpointi, veritabanından kullanıcı verilerini çeker
app.get('/get-user', (req, res) => {
    const query = 'SELECT * FROM user_info LIMIT 1'; // Veritabanından bir kullanıcı verisi çekiyoruz (1. kullanıcıyı almak için örnek)
    
    db.get(query, [], (err, row) => {
      if (err) {
        console.error('Veritabanı sorgu hatası:', err.message);
        return res.status(500).json({ error: 'Veritabanı hatası' });
      }
  
      // Eğer kullanıcı varsa, veriyi JSON formatında döner
      if (row) {
        res.json({
          data: {
            username: row.username,
            password: row.password,
            userlevel: row.userlevel,
            usertp: row.usertp,
            usergold: row.usergold,
            selectedFilter: row.selectedFilter,
            selectedFilterGoal: row.selectedFilterGoal,
            selectedDate: row.selectedDate,
            savedTheme: row.savedTheme,
            profilePicture: row.profilePicture
          }
        });
      } else {
        res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }
    });
});

// '/update-user' endpointi, veritabanındaki kullanıcı bilgilerini günceller
app.put('/update-user', express.json(), (req, res) => {
    const { username, password, userlevel, usertp, usergold, selectedFilter, selectedFilterGoal, selectedDate, savedTheme, profilePicture } = req.body;
    
    // Verilerin eksiksiz olup olmadığını kontrol et
    if (!username || !password) {
      return res.status(400).json({ error: 'Username ve password gereklidir.' });
    }
  
    // SQL sorgusu ile kullanıcıyı güncelle
    const query = `
      UPDATE user_info SET
        username = ?,
        password = ?,
        userlevel = ?,
        usertp = ?,
        usergold = ?,
        selectedFilter = ?,
        selectedFilterGoal = ?,
        selectedDate = ?,
        savedTheme = ?,
        profilePicture = ?
      `;  // id = 1 ile birinci kullanıcıyı güncelliyoruz (id'yi ihtiyaca göre değiştirebilirsiniz)
  
    // Veritabanında güncelleme işlemi
    db.run(query, [username, password, userlevel, usertp, usergold, selectedFilter, selectedFilterGoal, selectedDate, savedTheme, profilePicture], function(err) {
      if (err) {
        console.error('Veritabanı güncelleme hatası:', err.message);
        return res.status(500).json({ error: 'Veritabanı hatası' });
      }
  
      // Başarılı güncelleme sonrası yanıt gönder
      res.json({ message: 'Kullanıcı bilgileri başarıyla güncellendi.' });
    });
});  

// Veritabanlarını sıfırlama işlevi (SQLite uyumlu)
function resetDatabases() {
    // Tasks veritabanını sıfırlama
    db.run('DELETE FROM tasks', (err) => {
        if (err) {
            console.error('Error deleting tasks:', err);
            return;
        }
        initializeTasksTable();
    });

    // Categories veritabanını sıfırlama
    db.run('DELETE FROM categories', (err) => {
        if (err) {
            console.error('Error deleting categories:', err);
            return;
        }
        initializeCategoriesTable();
    });

    // Products veritabanını sıfırlama
    db.run('DELETE FROM products', (err) => {
        if (err) {
            console.error('Error deleting categories:', err);
            return;
        }
        initializeProductsTable();
    });
    
    // Goals veritabanını sıfırlama
    db.run('DELETE FROM goals', (err) => {
        if (err) {
            console.error('Error deleting categories:', err);
            return;
        }
        initializeGoalsTable();
    });
        
        
    // Goals veritabanını sıfırlama
    db.run('DELETE FROM habits', (err) => {
        if (err) {
            console.error('Error deleting categories:', err);
            return;
        }
        initializeHabitsTable();
    });
     
}

// Sunucu tarafında verileri sıfırlama işlemi için endpoint
app.post('/reset-data', (req, res) => {
    resetDatabases(); // Veritabanlarını sıfırla

    // Varsayılan veri sıfırlama ve kullanıcı yanıtı gönderme
    res.json({
        message: 'Tüm veriler sıfırlandı ve varsayılan ayarlar yüklendi!',
    });
});

// Kategoriler Okuma API
app.get('/api/categories', (req, res) => {
    try {
        const query = 'SELECT * FROM categories'; // Veritabanındaki tüm kategorileri alıyoruz
        db.all(query, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Kategoriler okunamadı.' });
            }
            res.json({ success: true, data: rows }); // JSON formatında kategori verilerini döndürüyoruz
        });
    } catch (error) {
        console.error('Kategoriler okunurken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Sunucu hatası oluştu.' });
    }
});

// Kategori sil
app.delete('/api/categories', (req, res) => {
    const { id } = req.body; // Silinecek kategori ID'si
    try {
        // Kategoriyi veritabanından sil
        const db = new sqlite3.Database('database.db');

        db.serialize(() => {
            // Silinecek kategoriye ait görevlerin 'gorev_kategori' alanını boşalt
            db.run('UPDATE tasks SET gorev_kategori = "" WHERE gorev_kategori = (SELECT category_name FROM categories WHERE id = ?)', [id], function(err) {
                if (err) {
                    console.error('Görev kategorileri güncellenirken hata oluştu:', err);
                    return res.status(500).json({ error: 'Görevler güncellenirken hata oluştu.' });
                }
            });

            // Kategoriyi sil
            db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
                if (err) {
                    console.error('Kategori silinirken hata oluştu:', err);
                    return res.status(500).json({ error: 'Kategori silinirken hata oluştu.' });
                }

                // Silinen kategori sonrasında kategori sıralamasını güncelle
                db.all('SELECT * FROM categories ORDER BY id', [], (err, rows) => {
                    if (err) {
                        console.error('Kategoriler sıralanırken hata oluştu:', err);
                        return res.status(500).json({ error: 'Kategori sıralaması yapılamadı.' });
                    }

                    // Kategorilerin ID'lerini sıfırla
                    const updatedCategories = rows.map((category, index) => {
                        db.run('UPDATE categories SET id = ? WHERE id = ?', [index + 1, category.id]);
                    });

                    res.status(200).json({ message: 'Kategori ve tüm verisi başarıyla silindi, ID’ler sıralandı.' });
                });
            });
        });

        db.close();
    } catch (err) {
        console.error('Kategori silinirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Yeni kategori ekle
app.post('/api/categories', (req, res) => {
    const { category_name, category_level, category_tp } = req.body;  // Yeni kategori verilerini alıyoruz

    if (!category_name) {
        return res.status(400).json({ error: 'Kategori adı gereklidir' });
    }

    try {
        const query = 'INSERT INTO categories (category_name, category_level, category_tp) VALUES (?, ?, ?)';
        db.run(query, [category_name, category_level, category_tp], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Kategori eklenirken hata oluştu.' });
            }

            // Yeni kategori verilerini döndürüyoruz
            res.status(201).json({
                id: this.lastID,
                category_name,
                category_level,
                category_tp
            });
        });
    } catch (err) {
        console.error('Kategori eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kategori güncelle
app.put('/api/categories', (req, res) => {
    const { id, category_name, category_level, category_tp } = req.body; // Güncellenecek kategori verilerini alıyoruz

    if (!id || !category_name) {
        return res.status(400).json({ error: 'ID ve kategori adı gereklidir' });
    }

    try {
        const query = 'SELECT * FROM categories WHERE id = ?';
        db.get(query, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Veritabanı hatası' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Kategori bulunamadı' });
            }

            // Kategoriyi güncelleme
            const updateCategoryQuery = 'UPDATE categories SET category_name = ?, category_level = ?, category_tp = ? WHERE id = ?';
            db.run(updateCategoryQuery, [category_name, category_level, category_tp, id], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Kategori güncellenirken hata oluştu.' });
                }

                // tasks tablosundaki gorev_kategori'yi güncelle
                const updateTasksQuery = 'UPDATE tasks SET gorev_kategori = ? WHERE gorev_kategori = ?';
                db.run(updateTasksQuery, [category_name, row.category_name], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Görev kategorileri güncellenirken hata oluştu.' });
                    }

                    res.status(200).json({
                        message: 'Kategori ve ilişkili görevler başarıyla güncellendi',
                        category: {
                            id,
                            category_name,
                            category_level,
                            category_tp
                        }
                    });
                });
            });
        });
    } catch (err) {
        console.error('Kategori güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Görevleri filtreleme
app.get('/api/tasks', (req, res) => {
    try {
        const filter = req.query.filter || 'all'; // Varsayılan değer: 'all'
        const today = new Date();
        const todayDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const search = req.query.search || ''; // Arama değeri
        const sort = req.query.sort || null; // Varsayılan değer: null

        let whereClauses = [];
        let params = [];

        // Tarih filtresi
        switch (filter) {
            case 'today':
                whereClauses.push('gorev_tarih = ? AND gorev_yapildimi = 0');
                params.push(todayDate);
                break;
            case 'tomorrow':
                whereClauses.push('gorev_tarih = ? AND gorev_yapildimi = 0');
                params.push(tomorrow);
                break;
            case 'overdue':
                whereClauses.push('gorev_tarih < ? AND gorev_yapildimi = 0');
                params.push(todayDate);
                break;
            case 'completed':
                whereClauses.push('gorev_yapildimi = 1');
                break;
            case 'all':
                whereClauses.push('gorev_yapildimi = 0');
                break;
            default:
                break;
        }

        // Arama filtresi
        if (search) {
            whereClauses.push('gorev_tanimi LIKE ?');
            params.push(`%${search.toLowerCase()}%`);
        }

        // Sıralama
        let orderClause = '';
        if (sort) {
            switch (sort) {
                case 'priority':
                    orderClause = 'ORDER BY CASE WHEN onem_derecesi = "Yüksek" THEN 3 WHEN onem_derecesi = "Orta" THEN 2 WHEN onem_derecesi = "Düşük" THEN 1 END DESC';
                    break;
                case 'category':
                    orderClause = 'ORDER BY gorev_kategori ASC';
                    break;
                case 'date-desc':
                    orderClause = 'ORDER BY gorev_tarih DESC';
                    break;
                case 'date-asc':
                    orderClause = 'ORDER BY gorev_tarih ASC';
                    break;
            }
        }

        // SQL sorgusunu oluştur
        const query = `SELECT * FROM tasks WHERE ${whereClauses.join(' AND ')} ${orderClause}`;

        // Veritabanından görevleri çek
        db.all(query, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Veritabanı hatası' });
            }

            res.json(rows); 
        });
    } catch (error) {
        console.error("Sunucu hatası:", error.message);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// Yeni görev ekle
app.post('/api/tasks', (req, res) => {
    const { 
        gorev_ikon, 
        gorev_ikon_renk, 
        gorev_tanimi, 
        gorev_aciklama, 
        gorev_tarih, 
        gorev_kategori, 
        gorev_tp, 
        gorev_altin, 
        gorev_yapildimi = false,  // Varsayılan olarak false
        gorev_durumu, 
        gorev_tekrar, 
        onem_derecesi, 
        gorev_tamamlanma_tarihi 
    } = req.body; // Görev verisini alıyoruz

    if (!gorev_tarih || !gorev_tanimi) {
        return res.status(400).json({ error: 'Geçersiz görev verisi. Görev tarihi ve tanımı gereklidir.' });
    }

    try {
        // Yeni görev için SQL sorgusu
        const query = `
            INSERT INTO tasks (
                gorev_ikon, gorev_ikon_renk, gorev_tanimi, gorev_aciklama, gorev_tarih, 
                gorev_kategori, gorev_tp, gorev_altin, gorev_yapildimi, gorev_durumu, 
                gorev_tekrar, onem_derecesi, gorev_tamamlanma_tarihi
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            gorev_ikon, gorev_ikon_renk, gorev_tanimi, gorev_aciklama, gorev_tarih, 
            gorev_kategori, gorev_tp, gorev_altin, gorev_yapildimi, gorev_durumu, 
            gorev_tekrar, onem_derecesi, gorev_tamamlanma_tarihi
        ];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Görev eklenirken veritabanı hatası:', err);
                return res.status(500).json({ error: 'Görev eklenirken hata oluştu.' });
            }

            // Görev başarıyla eklendi
            const newTask = {
                gorev_sira_no: this.lastID,  // Otomatik olarak oluşturulan ID
                gorev_ikon,
                gorev_ikon_renk,
                gorev_tanimi,
                gorev_aciklama,
                gorev_tarih,
                gorev_kategori,
                gorev_tp,
                gorev_altin,
                gorev_yapildimi,
                gorev_durumu,
                gorev_tekrar,
                onem_derecesi,
                gorev_tamamlanma_tarihi
            };

            res.json({ success: true, newTask });
        });
    } catch (err) {
        console.error('Görev eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Görevi sil
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);  // Silinecek görev ID'si

    // SQL sorgusuyla görevi veritabanından silme
    const deleteQuery = 'DELETE FROM tasks WHERE gorev_sira_no = ?';

    db.run(deleteQuery, [taskId], function(err) {
        if (err) {
            console.error('Görev silinirken veritabanı hatası:', err);
            return res.status(500).json({ error: 'Görev silinirken hata oluştu.' });
        }

        // Görev başarıyla silindi, kalan görevleri yeniden sıralama
        const reindexQuery = `
            UPDATE tasks
            SET gorev_sira_no = gorev_sira_no - 1
            WHERE gorev_sira_no > ?;
        `;

        db.run(reindexQuery, [taskId], function(err) {
            if (err) {
                console.error('Görev sıralanırken veritabanı hatası:', err);
                return res.status(500).json({ error: 'Görev sıralanırken hata oluştu.' });
            }

            res.json({ success: true });
        });
    });
});

// Görevi güncelle ve gerekirse tekrar ekle
app.put('/api/tasks/:id', (req, res) => {
    if (isUpdating) {
        return res.status(400).json({ error: 'İşlem devam ediyor, lütfen bekleyin.' });
    }

    isUpdating = true;  // İşleme başla
    
    try {
        const taskId = parseInt(req.params.id, 10);  // Güncellenecek görev ID'si
        const updatedTask = req.body;  // Gelen güncelleme verileri

        // SQL sorgusuyla görevi güncelleme
        const updateQuery = `
            UPDATE tasks
            SET
                gorev_ikon = ?, 
                gorev_ikon_renk = ?, 
                gorev_tanimi = ?, 
                gorev_aciklama = ?, 
                gorev_tarih = ?, 
                gorev_kategori = ?, 
                gorev_tp = ?, 
                gorev_altin = ?, 
                gorev_yapildimi = ?, 
                gorev_durumu = ?, 
                gorev_tekrar = ?, 
                onem_derecesi = ?, 
                gorev_tamamlanma_tarihi = ?
            WHERE gorev_sira_no = ?`;

        const params = [
            updatedTask.gorev_ikon,
            updatedTask.gorev_ikon_renk,
            updatedTask.gorev_tanimi,
            updatedTask.gorev_aciklama,
            updatedTask.gorev_tarih,
            updatedTask.gorev_kategori,
            updatedTask.gorev_tp,
            updatedTask.gorev_altin,
            updatedTask.gorev_yapildimi,
            updatedTask.gorev_durumu,
            updatedTask.gorev_tekrar,
            updatedTask.onem_derecesi,
            updatedTask.gorev_tamamlanma_tarihi,
            taskId
        ];

        db.run(updateQuery, params, function(err) {
            if (err) {
                console.error('Görev güncellenirken veritabanı hatası:', err);
                return res.status(500).json({ error: 'Görev güncellenirken hata oluştu.' });
            }

            // Eğer görev yapıldıysa ve tekrar özelliği varsa, yeni bir görev ekle
            if (updatedTask.gorev_yapildimi && updatedTask.gorev_tekrar) {
                let nextDate;

                // "OHA-" tipi tekrar
                if (updatedTask.gorev_tekrar.startsWith('OHA-')) {
                    const daysString = updatedTask.gorev_tekrar.substring(4);  // "OHA-" sonrası gün dizisini al
                    const selectedDays = daysString.split('');  // ['1', '3', '5'] gibi bir diziye çevir
                    let tempDate = moment(updatedTask.gorev_tarih).add(1, 'days');  // Başlangıç tarihinden itibaren

                    // Eşleşen gün bulunana kadar gün ekle
                    while (!selectedDays.includes(tempDate.isoWeekday().toString())) {
                        tempDate.add(1, 'days');
                    }

                    nextDate = tempDate.format('YYYY-MM-DD');  // İlk eşleşen tarih
                } else if (updatedTask.gorev_tekrar.startsWith('OT-')) {  // "OT-" tipi tekrar
                    const daysToAdd = parseInt(updatedTask.gorev_tekrar.substring(3));  // "OT-" sonrası sayıyı al
                    nextDate = moment(updatedTask.gorev_tarih).add(daysToAdd, 'days').format('YYYY-MM-DD');
                } else {  // Diğer tekrar türleri
                    switch (updatedTask.gorev_tekrar) {
                        case 'G':  // Günlük
                            nextDate = moment(updatedTask.gorev_tarih).add(1, 'days').format('YYYY-MM-DD');
                            break;
                        case 'H':  // Haftalık
                            nextDate = moment(updatedTask.gorev_tarih).add(1, 'weeks').format('YYYY-MM-DD');
                            break;
                        case 'A':  // Aylık
                            nextDate = moment(updatedTask.gorev_tarih).add(1, 'months').format('YYYY-MM-DD');
                            break;
                        case 'Y':  // Yıllık
                            nextDate = moment(updatedTask.gorev_tarih).add(1, 'years').format('YYYY-MM-DD');
                            break;
                        case 'HA':  // Hafta içi
                            let tempDateHA = moment(updatedTask.gorev_tarih).add(1, 'days');
                            while (tempDateHA.isoWeekday() > 5) {  // Cumartesi-Pazar dışındaki günler
                                tempDateHA.add(1, 'days');
                            }
                            nextDate = tempDateHA.format('YYYY-MM-DD');
                            break;
                        case 'HS':  // Hafta sonu
                            let tempDateHS = moment(updatedTask.gorev_tarih).add(1, 'days');
                            while (tempDateHS.isoWeekday() < 6) {  // Pazartesi-Cuma arası
                                tempDateHS.add(1, 'days');
                            }
                            nextDate = tempDateHS.format('YYYY-MM-DD');
                            break;
                        default:
                            nextDate = updatedTask.gorev_tarih;  // Eğer "gorev_tekrar" yoksa, tarih değişmesin
                            break;
                    }
                }

                // Yeni görev olup olmadığını kontrol et
                const existingTaskQuery = 'SELECT * FROM tasks WHERE gorev_tarih = ? AND gorev_tanimi = ?';
                db.get(existingTaskQuery, [nextDate, updatedTask.gorev_tanimi], (err, row) => {
                    if (err) {
                        console.error('Veri kontrolü hatası:', err);
                        return res.status(500).json({ error: 'Yeni görev kontrol edilirken hata oluştu.' });
                    }

                    // Aynı tarihli görev yoksa yeni görev oluştur
                    if (!row) {
                        const newTask = {
                            gorev_ikon: updatedTask.gorev_ikon,
                            gorev_ikon_renk: updatedTask.gorev_ikon_renk,
                            gorev_tanimi: updatedTask.gorev_tanimi,
                            gorev_aciklama: updatedTask.gorev_aciklama,
                            gorev_tarih: nextDate,
                            gorev_kategori: updatedTask.gorev_kategori,
                            gorev_tp: updatedTask.gorev_tp,
                            gorev_altin: updatedTask.gorev_altin,
                            gorev_yapildimi: false,
                            gorev_durumu: "",
                            gorev_tekrar: updatedTask.gorev_tekrar,
                            onem_derecesi: updatedTask.onem_derecesi,
                            gorev_tamamlanma_tarihi: ""
                        };

                        const insertQuery = `
                            INSERT INTO tasks (gorev_ikon, gorev_ikon_renk, gorev_tanimi, gorev_aciklama, gorev_tarih, 
                                gorev_kategori, gorev_tp, gorev_altin, gorev_yapildimi, gorev_durumu, 
                                gorev_tekrar, onem_derecesi, gorev_tamamlanma_tarihi)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                        const insertParams = [
                            newTask.gorev_ikon, newTask.gorev_ikon_renk, newTask.gorev_tanimi, newTask.gorev_aciklama, 
                            newTask.gorev_tarih, newTask.gorev_kategori, newTask.gorev_tp, newTask.gorev_altin, 
                            newTask.gorev_yapildimi, newTask.gorev_durumu, newTask.gorev_tekrar, newTask.onem_derecesi, 
                            newTask.gorev_tamamlanma_tarihi
                        ];

                        db.run(insertQuery, insertParams, function(err) {
                            if (err) {
                                console.error('Yeni görev eklerken veritabanı hatası:', err);
                                return res.status(500).json({ error: 'Yeni görev eklenirken hata oluştu.' });
                            }
                        });
                    }
                });
            }

            // Başarılı güncelleme yanıtı gönderin
            res.json({ success: true, updatedTask });
        });
    } catch (err) {
        console.error('Görev güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    } finally {
        isUpdating = false;  // İşlem tamamlandığında kilidi kaldır
    }
});

// Ürünleri Okuma API
app.get('/api/products', (req, res) => {
    try {
        // Ürünleri veritabanından çek
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) {
                console.error('Veritabanı hatası:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Veritabanından ürünler alınamadı. Sunucu hatası oluştu.'
                });
            }

            // Ürünleri JSON formatında döndür
            res.json({
                success: true,
                data: rows
            });
        });
    } catch (error) {
        console.error('Sunucu hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası oluştu.'
        });
    }
});

// Ürün ID'ye göre tek bir ürünü döndüren API
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); // ID'yi sayıya dönüştür

    try {
        // Ürünü veritabanından ID'ye göre sorgula
        db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
            if (err) {
                console.error('Veritabanı hatası:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Veritabanı hatası oluştu. Ürün alınamadı.'
                });
            }

            if (row) {
                // Ürün bulunduysa veriyi döndür
                res.json({
                    success: true,
                    data: row
                });
            } else {
                // Ürün bulunamadıysa 404 döndür
                res.status(404).json({
                    success: false,
                    error: 'Ürün bulunamadı.'
                });
            }
        });
    } catch (error) {
        console.error('Sunucu hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası oluştu.'
        });
    }
});

// Ürün Silme API
app.delete('/api/products', (req, res) => {
    const { id } = req.body; // ID'yi request body'den al

    try {
        // Ürünü veritabanından sil
        db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Veritabanı hatası:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Veritabanı hatası oluştu. Ürün silinemedi.'
                });
            }

            if (this.changes === 0) {
                // Eğer hiçbir şey silinmediyse, ürün bulunamadı
                return res.status(404).json({
                    success: false,
                    error: 'Silinecek ürün bulunamadı.'
                });
            }

            // Silme işlemi başarılı, şimdi ID'leri yeniden sıralayacağız
            db.all('SELECT * FROM products ORDER BY id ASC', [], (err, rows) => {
                if (err) {
                    console.error('ID sıralanırken hata oluştu:', err);
                    return res.status(500).json({
                        success: false,
                        error: 'ID sıralama hatası oluştu.'
                    });
                }

                // ID'leri yeniden numaralandır
                const updatedProducts = rows.map((product, index) => {
                    return {
                        ...product,
                        id: index + 1 // Yeni ID'ler 1'den başlayacak
                    };
                });

                // Veritabanında ID'leri güncelle
                const updateQueries = updatedProducts.map(product => {
                    return new Promise((resolve, reject) => {
                        db.run('UPDATE products SET id = ? WHERE rowid = ?', [product.id, product.rowid], function(err) {
                            if (err) reject(err);
                            resolve();
                        });
                    });
                });

                // Güncelleme işlemleri tamamlandıktan sonra
                Promise.all(updateQueries)
                    .then(() => {
                        res.status(200).json({
                            success: true,
                            message: 'Ürün başarıyla silindi ve ID\'ler yeniden düzenlendi.'
                        });
                    })
                    .catch(error => {
                        console.error('ID güncelleme hatası:', error);
                        res.status(500).json({
                            success: false,
                            error: 'ID güncellenirken hata oluştu.'
                        });
                    });
            });
        });
    } catch (error) {
        console.error('Sunucu hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası oluştu.'
        });
    }
});

// Yeni Ürün Ekleme API
app.post('/api/products', (req, res) => {
    const { product_icon, product_color, product_name, product_price, product_stock, product_date } = req.body;

    // Zorunlu alan kontrolü
    if (!product_name || !product_price || !product_stock) {
        return res.status(400).json({ error: 'Ürün adı, fiyat ve stok zorunludur.' });
    }

    try {
        // Ürünü veritabanına ekle
        const query = `INSERT INTO products (product_icon, product_color, product_name, product_price, product_stock, product_date) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.run(query, [product_icon, product_color, product_name, product_price, product_stock, product_date], function(err) {
            if (err) {
                console.error('Yeni ürün eklenirken hata oluştu:', err);
                return res.status(500).json({ error: 'Sunucu hatası' });
            }

            // Yeni eklenen ürünün ID'si, insert işlemi sonrası this.lastID olarak alınabilir
            const newProduct = {
                id: this.lastID, // SQLite tarafından otomatik oluşturulan ID
                product_icon,
                product_color,
                product_name,
                product_price,
                product_stock,
                product_date
            };

            // Başarılı ekleme sonrası yanıt
            res.status(201).json(newProduct);
        });
    } catch (error) {
        console.error('Yeni ürün eklenirken hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Ürün Güncelleme API
app.put('/api/products', (req, res) => {
    const { id, product_icon, product_color, product_name, product_price, product_stock, product_date } = req.body;

    // ID ve ürün adı zorunlu
    if (!id || !product_name) {
        return res.status(400).json({ error: 'ID ve ürün adı zorunludur.' });
    }

    try {
        // Ürünü güncelle
        const query = `UPDATE products SET 
                       product_icon = ?, 
                       product_color = ?, 
                       product_name = ?, 
                       product_price = ?, 
                       product_stock = ?, 
                       product_date = ? 
                       WHERE id = ?`;

        db.run(query, [product_icon, product_color, product_name, product_price, product_stock, product_date, id], function(err) {
            if (err) {
                console.error('Ürün güncellenirken hata oluştu:', err);
                return res.status(500).json({ error: 'Sunucu hatası' });
            }

            if (this.changes === 0) {
                // Eğer hiç bir satır güncellenmemişse
                return res.status(404).json({ error: 'Ürün bulunamadı.' });
            }

            // Güncellenmiş ürün bilgileri ile yanıt dön
            const updatedProduct = {
                id,
                product_icon,
                product_color,
                product_name,
                product_price,
                product_stock,
                product_date
            };

            res.status(200).json({ message: 'Ürün başarıyla güncellendi', product: updatedProduct });
        });
    } catch (error) {
        console.error('Ürün güncellenirken hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Hedef Okuma API
app.get('/api/goals', (req, res) => {
    try {
        const filter = req.query.filter;
        let query = `SELECT * FROM goals`;
        let queryParams = [];

        // Filtreleme işlemi
        if (filter) {
            if (filter.toLowerCase() === 'action') {
                // "Action" filtreleme: hedef_ulasildimi false olanlar
                query += ` WHERE hedef_ulasildimi = ?`;
                queryParams.push(false);
            } else if (filter.toLowerCase() === 'completed') {
                // "Completed" filtreleme: hedef_ulasildimi true olanlar
                query += ` WHERE hedef_ulasildimi = ?`;
                queryParams.push(true);
            }
        }

        // Veritabanı sorgusunu çalıştır
        db.all(query, queryParams, (err, rows) => {
            if (err) {
                console.error("Hedefler okunurken hata oluştu:", err);
                return res.status(500).json({ error: "Sunucu hatası" });
            }

            let filteredGoals = rows;

            // Sorting by category and priority
            filteredGoals.sort((a, b) => {
                // İlk olarak kategoriye göre alfabetik sıralama
                if (a.hedef_kategori < b.hedef_kategori) return -1;
                if (a.hedef_kategori > b.hedef_kategori) return 1;

                // Kategoriler aynı ise, önceliğe göre sıralama
                const priorityOrder = { "Yüksek": 3, "Orta": 2, "Düşük": 1 };
                return (priorityOrder[b.hedef_tp] || 0) - (priorityOrder[a.hedef_tp] || 0);
            });

            // Filtrelenmiş hedefleri döndür
            res.json(filteredGoals);
        });
    } catch (error) {
        console.error("Sunucu hatası:", error.message);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// Yeni Hedef Ekleme API
app.post('/api/goals', (req, res) => {
    const { 
        hedef_ikon, hedef_ikon_renk, hedef_tanimi, hedef_aciklama, 
        hedef_kategori, hedef_tp, hedef_altin, hedef_ulasildimi, 
        hedef_durumu, hedef_tamamlanma_tarihi, hedef_takip_notlari, 
        hedef_geribildirim 
    } = req.body;

    // Zorunlu alanların kontrolü
    if (!hedef_tanimi) {
        return res.status(400).json({ error: 'Hedef tanımı zorunludur.' });
    }

    try {
        // Yeni hedef ekleme
        const newGoal = {
            hedef_ikon,
            hedef_ikon_renk,
            hedef_tanimi,
            hedef_aciklama,
            hedef_kategori,
            hedef_tp,
            hedef_altin,
            hedef_ulasildimi,
            hedef_durumu,
            hedef_tamamlanma_tarihi,
            hedef_takip_notlari,
            hedef_geribildirim
        };

        // Hedefi veritabanına ekle
        db.run(`INSERT INTO goals (
            hedef_ikon, hedef_ikon_renk, hedef_tanimi, hedef_aciklama, 
            hedef_kategori, hedef_tp, hedef_altin, hedef_ulasildimi, 
            hedef_durumu, hedef_tamamlanma_tarihi, hedef_takip_notlari, 
            hedef_geribildirim
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [
            newGoal.hedef_ikon, newGoal.hedef_ikon_renk, newGoal.hedef_tanimi, 
            newGoal.hedef_aciklama, newGoal.hedef_kategori, newGoal.hedef_tp, 
            newGoal.hedef_altin, newGoal.hedef_ulasildimi, newGoal.hedef_durumu, 
            newGoal.hedef_tamamlanma_tarihi, newGoal.hedef_takip_notlari, 
            newGoal.hedef_geribildirim
        ], function(err) {
            if (err) {
                console.error('Yeni hedef eklenirken hata oluştu:', err);
                return res.status(500).json({ error: 'Sunucu hatası' });
            }

            // Başarılı ekleme sonrası yeni hedefi döndür
            newGoal.id = this.lastID; // SQLite tarafından otomatik olarak oluşturulan ID
            res.status(201).json({ success: true, newGoal });
        });
    } catch (err) {
        console.error('Yeni hedef eklenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Hedef Silme API
app.delete('/api/goals/:id', (req, res) => {
    const goalId = parseInt(req.params.id);

    if (isNaN(goalId)) {
        return res.status(400).json({ error: 'Geçersiz hedef ID.' });
    }

    try {
        // Veritabanından hedefi sil
        db.run(`DELETE FROM goals WHERE id = ?`, [goalId], function(err) {
            if (err) {
                console.error('Hedef silinirken hata oluştu:', err);
                return res.status(500).json({ error: 'Sunucu hatası' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Hedef bulunamadı.' });
            }

            // Silme işleminden sonra hedeflerin ID'lerini yeniden sıralamak için
            db.all('SELECT * FROM goals ORDER BY id', [], (err, rows) => {
                if (err) {
                    console.error('Veritabanı okuma hatası:', err);
                    return res.status(500).json({ error: 'Sunucu hatası' });
                }

                // ID'leri yeniden sıralamak için veritabanında güncelleme işlemi
                const updatePromises = rows.map((goal, index) => {
                    return new Promise((resolve, reject) => {
                        db.run(`UPDATE goals SET id = ? WHERE id = ?`, [index + 1, goal.id], function(err) {
                            if (err) {
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });

                // Tüm ID güncellemeleri tamamlandıktan sonra yanıt gönder
                Promise.all(updatePromises)
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch((error) => {
                        console.error('ID güncellenirken hata oluştu:', error);
                        res.status(500).json({ error: 'Sunucu hatası' });
                    });
            });
        });
    } catch (err) {
        console.error('Hedef silinirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Hedef Güncelleme API
app.put('/api/goals/:id', (req, res) => {
    const goalId = parseInt(req.params.id, 10);
    const { hedef_ikon, hedef_ikon_renk, hedef_tanimi, hedef_aciklama, hedef_kategori, hedef_tp, hedef_altin, hedef_ulasildimi, hedef_durumu, hedef_tamamlanma_tarihi, hedef_takip_notlari, hedef_geribildirim } = req.body;

    // Hedef ID'si geçerli mi kontrol et
    if (isNaN(goalId)) {
        return res.status(400).json({ error: 'Geçersiz hedef ID.' });
    }

    // Hedef için gerekli alanların eksik olup olmadığını kontrol et
    if (!hedef_tanimi || !hedef_kategori) {
        return res.status(400).json({ error: 'Hedef tanımı ve kategori gereklidir.' });
    }

    try {
        // Veritabanındaki hedefi güncelle
        db.run(`UPDATE goals SET 
            hedef_ikon = ?, 
            hedef_ikon_renk = ?, 
            hedef_tanimi = ?, 
            hedef_aciklama = ?, 
            hedef_kategori = ?, 
            hedef_tp = ?, 
            hedef_altin = ?, 
            hedef_ulasildimi = ?, 
            hedef_durumu = ?, 
            hedef_tamamlanma_tarihi = ?, 
            hedef_takip_notlari = ?, 
            hedef_geribildirim = ? 
            WHERE id = ?`,
            [hedef_ikon, hedef_ikon_renk, hedef_tanimi, hedef_aciklama, hedef_kategori, hedef_tp, hedef_altin, hedef_ulasildimi, hedef_durumu, hedef_tamamlanma_tarihi, hedef_takip_notlari, hedef_geribildirim, goalId], 
            function(err) {
                if (err) {
                    console.error('Hedef güncellenirken hata oluştu:', err);
                    return res.status(500).json({ error: 'Sunucu hatası' });
                }

                // Güncellenen hedefi veritabanından almak için SELECT komutu çalıştır
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Hedef bulunamadı' });
                }

                db.get('SELECT * FROM goals WHERE id = ?', [goalId], (err, row) => {
                    if (err) {
                        console.error('Veritabanı okuma hatası:', err);
                        return res.status(500).json({ error: 'Sunucu hatası' });
                    }

                    res.json({ success: true, updatedGoal: row });
                });
            });
    } catch (err) {
        console.error('Hedef güncellenirken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Alışkanlık Okuma API
app.get('/api/habits', (req, res) => {
    try {
        let query = 'SELECT * FROM habits WHERE 1 = 1'; // Tüm alışkanlıkları seç

        const filters = [];
        const values = [];

        // Filtreleme işlemleri
        const category = req.query.category;
        const completed = req.query.completed;

        // "aliskanlik_ulasildimi" false olanları filtrele
        query += ' AND aliskanlik_ulasildimi = ?';
        filters.push(false); // false değerini ekle

        if (category) {
            query += ' AND aliskanlik_kategori = ?';
            filters.push(category.toLowerCase());
        }

        if (completed !== undefined) {
            const isCompleted = completed.toLowerCase() === 'true';
            query += ' AND aliskanlik_ulasildimi = ?';
            filters.push(isCompleted);
        }

        db.all(query, filters, (err, rows) => {
            if (err) {
                console.error('Veritabanı hatası:', err);
                return res.status(500).json({ error: 'Sunucu hatası' });
            }

            res.json(rows); // Filtrelenmiş alışkanlıkları geri gönder
        });
    } catch (error) {
        console.error('Sunucu hatası:', error.message);
        res.status(500).json({ error: 'Sunucu hatası oluştu.' });
    }
});

// Yeni Alışkanlık Ekleme API
app.post('/api/habits', (req, res) => {
    try {
        const newHabit = req.body;

        if (!newHabit || !newHabit.aliskanlik_tanimi || !newHabit.aliskanlik_baslangic_tarihi) {
            return res.status(400).json({ error: 'Invalid habit data' });
        }

        // Yeni alışkanlık için SQL INSERT sorgusu
        const insertQuery = `
            INSERT INTO habits (
                aliskanlik_tanimi, aliskanlik_aciklama, aliskanlik_baslangic_tarihi, 
                aliskanlik_gun_sayisi, aliskanlik_gunluk_takip, aliskanlik_kategori, 
                aliskanlik_tp, aliskanlik_altin, aliskanlik_ulasildimi, aliskanlik_durumu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            newHabit.aliskanlik_tanimi,
            newHabit.aliskanlik_aciklama || '',
            newHabit.aliskanlik_baslangic_tarihi,
            newHabit.aliskanlik_gun_sayisi || 0,
            newHabit.aliskanlik_gunluk_takip || '',
            newHabit.aliskanlik_kategori || '',
            newHabit.aliskanlik_tp || 0,
            newHabit.aliskanlik_altin || 0,
            newHabit.aliskanlik_ulasildimi || false,
            newHabit.aliskanlik_durumu || ''
        ];

        // Veriyi veritabanına ekle
        db.run(insertQuery, values, function(err) {
            if (err) {
                console.error('Error adding habit:', err.message);
                return res.status(500).json({ error: 'Server error' });
            }

            // Başarılı ekleme sonrası yeni alışkanlık verisini döndür
            res.json({
                success: true,
                newHabit: {
                    ...newHabit,
                    id: this.lastID // Son eklenen kaydın ID'sini döndür
                }
            });
        });
    } catch (err) {
        console.error('Error adding habit:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Alışkanlık Silme API
app.delete('/api/habits/:id', (req, res) => {
    try {
        const habitId = parseInt(req.params.id, 10);

        // Alışkanlığı veritabanından silmek için SQL DELETE sorgusu
        const deleteQuery = 'DELETE FROM habits WHERE id = ?';

        // Veritabanında silme işlemi
        db.run(deleteQuery, [habitId], function(err) {
            if (err) {
                console.error('Error deleting habit:', err.message);
                return res.status(500).json({ error: 'Server error' });
            }

            // Silme işlemi başarıyla gerçekleşti
            // Alışkanlıklar silindikten sonra ID'leri yeniden sıralayacağız
            const reindexQuery = `
                UPDATE habits
                SET id = ROWID
                WHERE id > 0
            `;
            db.run(reindexQuery, function(reindexErr) {
                if (reindexErr) {
                    console.error('Error reindexing habits:', reindexErr.message);
                    return res.status(500).json({ error: 'Error reindexing habits' });
                }

                // Başarılı silme ve sıralama işlemi
                res.json({ success: true });
            });
        });
    } catch (err) {
        console.error('Error deleting habit:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Alışkanlık Güncelleme API
app.put('/api/habits/:id', (req, res) => {
    try {
        const habitId = parseInt(req.params.id, 10);
        const updatedHabit = req.body;

        // Geçerli alanların olup olmadığını kontrol et
        if (!updatedHabit.aliskanlik_tanimi || !updatedHabit.aliskanlik_baslangic_tarihi) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        // Alışkanlık var mı diye kontrol et
        const checkHabitQuery = 'SELECT * FROM habits WHERE id = ?';
        db.get(checkHabitQuery, [habitId], (err, row) => {
            if (err) {
                console.error('Error fetching habit:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Habit not found' });
            }

            // Alışkanlık verilerini güncelle
            const updateQuery = `
                UPDATE habits 
                SET 
                    aliskanlik_tanimi = ?, 
                    aliskanlik_aciklama = ?, 
                    aliskanlik_baslangic_tarihi = ?, 
                    aliskanlik_gun_sayisi = ?, 
                    aliskanlik_gunluk_takip = ?, 
                    aliskanlik_kategori = ?, 
                    aliskanlik_tp = ?, 
                    aliskanlik_altin = ?, 
                    aliskanlik_ulasildimi = ?, 
                    aliskanlik_durumu = ? 
                WHERE id = ?
            `;
            
            db.run(updateQuery, [
                updatedHabit.aliskanlik_tanimi,
                updatedHabit.aliskanlik_aciklama,
                updatedHabit.aliskanlik_baslangic_tarihi,
                updatedHabit.aliskanlik_gun_sayisi,
                updatedHabit.aliskanlik_gunluk_takip,
                updatedHabit.aliskanlik_kategori,
                updatedHabit.aliskanlik_tp,
                updatedHabit.aliskanlik_altin,
                updatedHabit.aliskanlik_ulasildimi,
                updatedHabit.aliskanlik_durumu,
                habitId
            ], function(err) {
                if (err) {
                    console.error('Error updating habit:', err);
                    return res.status(500).json({ error: 'Server error' });
                }

                // Güncellenmiş alışkanlık verisini yanıt olarak gönder
                res.json({ success: true, updatedHabit });
            });
        });
    } catch (err) {
        console.error('Error updating habit:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Uygulama kapanırken bağlantıyı kapat
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Veritabanı kapatma hatası:', err.message);
        } else {
            console.log('SQLite veritabanı bağlantısı kapatıldı.');
        }
    });
});