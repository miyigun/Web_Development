$(document).ready(function () {
    // Tooltip'leri başlat
    $('[data-toggle="tooltip"]').tooltip();


    const today = new Date().toISOString().split('T')[0]; 

    let username='';

    let password='';
    let confirmPassword='';

    let userlevel=0;
    let usertp=0;
    let usergold=0;
    let selectedFilter='today';
    let selectedFilterGoal="action";
    let selectedDate= today;
    let savedTheme='light';
    let profilePicture='/public/images/profil.jpg';
   
    getUserData();
         
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Renk ve ikon seçenekleri
    const colors = [
        "red", "blue", "green", "yellow", "purple", "orange", "pink", "black", "grey", "brown",
        "cyan", "magenta", "lime", "teal", "violet", "gold", "silver", "maroon",
        "navy", "olive", "turquoise", "coral", "crimson", "khaki", "lavender", "beige", "salmon",
        "chocolate", "mint", "peach", "rose"
    ];   
  
    const icons = [
        { title: "Genel ve Ev", icons: ["fa-home", "fa-user", "fa-users"] },
        { title: "Finans ve Alışveriş", icons: ["fa-dollar-sign", "fa-euro-sign", "fa-wallet", "fa-money-bill", "fa-money-bill-wave", "fa-coins", "fa-shopping-cart", "fa-shopping-bag", "fa-cart-arrow-down", "fa-store", "fa-piggy-bank"] },
        { title: "İş ve Kariyer", icons: ["fa-briefcase", "fa-user-tie", "fa-handshake", "fa-file-contract", "fa-clipboard", "fa-chart-line", "fa-briefcase-medical"] },
        { title: "Eğitim ve Öğrenme", icons: ["fa-book", "fa-book-open", "fa-user-graduate", "fa-chalkboard-teacher"] },
        { title: "Eğlence ve Hobi", icons: ["fa-film", "fa-tv", "fa-theater-masks", "fa-camera", "fa-camera-retro", "fa-gamepad", "fa-palette", "fa-paint-brush", "fa-clapperboard", "fa-video", "fa-tape"] },
        { title: "Yemek ve İçecek", icons: ["fa-apple-alt", "fa-bread-slice", "fa-carrot", "fa-cheese", "fa-egg", "fa-fish", "fa-ice-cream", "fa-lemon", "fa-pizza-slice", "fa-wine-bottle", "fa-drumstick-bite", "fa-hamburger", "fa-mug-hot", "fa-coffee", "fa-wine-glass", "fa-wine-glass-alt", "fa-cocktail", "fa-beer", "fa-martini-glass", "fa-martini-glass-citrus", "fa-mug-saucer", "fa-cube", "fa-square", "fa-cookie", "fa-bars", "fa-utensils", "fa-blender", "fa-leaf"] },
        { title: "Sağlık ve Fitness", icons: ["fa-heart", "fa-dumbbell", "fa-running", "fa-walking", "fa-swimmer", "fa-first-aid", "fa-spa", "fa-seedling"] },
        { title: "Seyahat ve Doğa", icons: ["fa-plane", "fa-tree", "fa-globe", "fa-map", "fa-suitcase", "fa-campground", "fa-hiking", "fa-route"] },
        { title: "Gecelik Aktiviteler ve Dinlenme", icons: ["fa-moon", "fa-bed"] },
        { title: "Aile ve Arkadaşlık", icons: ["fa-hand-holding-heart", "fa-people-arrows"] },
        { title: "İletişim", icons: ["fa-phone", "fa-envelope", "fa-comments"] },
        { title: "Günlük Kullanım", icons: ["fa-bell", "fa-clock", "fa-lightbulb", "fa-key", "fa-lock", "fa-paperclip", "fa-scissors", "fa-wrench", "fa-folder"] },
        { title: "Başarı ve Motivasyon", icons: ["fa-award", "fa-trophy", "fa-gift", "fa-star", "fa-rocket", "fa-brain"] },
        { title: "El Becerileri ve Gönüllülük", icons: ["fa-hammer", "fa-hand-sparkles"] },
        { title: "Kodlama ve Teknoloji", icons: ["fa-code", "fa-laptop"] },
        { title: "Özel Etkinlikler ve Durumlar", icons: ["fa-ring", "fa-gem", "fa-calendar-check", "fa-tasks", "fa-shoe-prints", "fa-hat-wizard", "fa-ticket-alt"] },
        { title: "Satranç", icons: ["fa-chess", "fa-chess-king", "fa-chess-queen", "fa-chess-rook", "fa-chess-bishop", "fa-chess-knight", "fa-chess-pawn", "fa-hourglass"] },
        { title: "Müzik", icons: ["fa-music", "fa-headphones", "fa-guitar"] },
        { title: "Araçlar", icons: ["fa-car", "fa-bus", "fa-motorcycle", "fa-truck", "fa-ambulance", "fa-taxi", "fa-train", "fa-ship", "fa-subway", "fa-helicopter"] },
        { title: "Binalar", icons: ["fa-hotel", "fa-hospital", "fa-school", "fa-church", "fa-university", "fa-warehouse", "fa-store-alt", "fa-mosque", "fa-synagogue"] }
    ];    
    
    const $loginScreen = $('#loginScreen');
    const $mainApp = $('#mainApp');
    const $loginForm = $('#loginForm');
    const $registerFields = $('#registerFields');
    const $loginFields = $('#loginFields');
    const $submitButton = $('#submitButton');
    const $loginError = $('#loginError');
    const $screenTitle = $('#screenTitle');

    $loginForm.on('input', function () {
        const isRegister = $registerFields.is(':visible');
        username = isRegister ? $('#newUsername').val() : $('#username').val();
        password = isRegister ? $('#newPassword').val() : $('#password').val();
        confirmPassword = isRegister ? $('#confirmPassword').val() : null;

        if (isRegister) {
            $submitButton.prop('disabled', !(username && password && confirmPassword && password === confirmPassword));
        } else {
            $submitButton.prop('disabled', !(username && password));
        }
    });

    $loginForm.on('submit', function (event) {
        event.preventDefault();
        const isRegister = $registerFields.is(':visible');

        if (isRegister) {
            let usname = $('#newUsername').val();
            let uspassword = $('#newPassword').val();
            let confPassword = $('#confirmPassword').val();

            if (uspassword !== confPassword) {
                playSoundLoginDenied();

                $loginError.text('Şifreler eşleşmiyor!').show();
                return;
            }

            username=usname;
            password=uspassword;

            updateUserData();

            $('.username').text(username);

            $loginScreen.hide();
            $mainApp.show();

            playSoundLogin();

            // Yeni kullanıcı için görevler ekranını göster
            tasksFunction();

        } else {
            let usname = $('#username').val();
            let uspassword = $('#password').val();

            if (username === usname && password === uspassword) {
                playSoundLogin();

                $loginScreen.hide();
                $mainApp.show();

                username=usname;
                password=uspassword;

                updateUserData();

                $('.username').text(username);

                tasksFunction();
            } else {
                playSoundLoginDenied();

                $loginError.text('Hatalı giriş!').show();
            }
        }
    });

    // Butonlara tıklama olaylarını ekleyelim
    $('.sidebar-btn').click(function() {
        playSoundOption();

        // Tüm butonlardan 'selected' sınıfını kaldır
        $('.sidebar-btn').removeClass('selected');
        
        // Tıklanan butona 'selected' sınıfını ekle
        $(this).addClass('selected');
        
        // Hangi butona tıklandığına göre ilgili fonksiyonu çalıştır
        var btnId = $(this).attr('id'); // Butonun id'sini al
        
        switch(btnId) {
            case 'heroBtn':
                heroFunction();
                break;
            case 'tasksBtn':
                tasksFunction();
                break;
            case 'categoriesBtn':
                categoriesFunction();
                break;
            case 'marketBtn':
                marketFunction();
                break;
            case 'calendarBtn':
                calendarFunction();
                break;
            case 'goalsBtn':
                goalsFunction();
                break;
            case 'habitTrackerBtn':
                habitTrackerFunction();
                break;
            case 'settingsBtn':
                settingsFunction();
                break;
        }
    });

    // Kullanıcı bilgilerini API'den çekme fonksiyonu
    async function getUserData() {
        try {
            const response = await fetch('/get-user'); // API'yi çağır
            if (!response.ok) {
                throw new Error(`API Hatası: ${response.status}`);
            }
    
            const result = await response.json(); // JSON formatında sonucu al
            const userData = result.data; // Kullanıcı verileri
    
            // Verileri değişkenlere ata
            username = userData.username || ''; 
            password = userData.password || ''; 
            userlevel = userData.userlevel || 0;
            usertp = userData.usertp || 0;
            usergold = userData.usergold || 0;
            selectedFilter = userData.selectedFilter || 'today';
            selectedFilterGoal = userData.selectedFilterGoal || 'action';
            selectedDate = userData.selectedDate || today;
            savedTheme = userData.theme || 'light';
            profilePicture = userData.profilePicture || '/public/images/profil.jpg'; 
            
            // Sayfada kullanmak için DOM güncellemeleri yapabilirsiniz
            document.body.setAttribute('data-theme', savedTheme); // Örnek: Temayı güncelle
    
            // Kullanıcı arayüzünü güncelle
            checkUserState();
        } catch (error) {
            console.error('Kullanıcı verileri alınamadı:', error);
        }
    }
    
    function checkUserState() {
        if (username === '' || password === '') {
            // Kayıt formunu göster
            $loginScreen.show();
            $registerFields.show();
            $loginFields.hide();
            $screenTitle.text('Yeni Kullanıcı Kaydı');
        } else {
            // Giriş formunu göster
            $loginScreen.show();
            $registerFields.hide();
            $loginFields.show();
            $screenTitle.text('Giriş Yap');
    
            // Kullanıcı bilgilerini göster
            $('.userlevel').text(userlevel);
            $('.usertp').text(usertp);
            $('.usergold').text(usergold);
        }
    }

    // Kullanıcı bilgilerini güncelleme fonksiyonu
    async function updateUserData() {
   
        const userData = {
            username,
            password,
            userlevel,
            usertp,
            usergold,
            selectedFilter,
            selectedFilterGoal,
            selectedDate,
            savedTheme,
            profilePicture,
        };
    
        $.ajax({
            url: '/update-user',       // API'nin URL'si
            type: 'PUT',               // İstek tipi
            contentType: 'application/json', // Veri formatı
            data: JSON.stringify(userData),  // Kullanıcı verilerini JSON formatında gönder
            success: function(response) {
                
                // UI güncellemeleri (örneğin, profil resmi ve tema)
                document.body.setAttribute('data-theme', savedTheme);  // Tema güncellemesi
                document.getElementById('profilePicture').src = profilePicture; // Profil resmi güncellenmesi
            },
            error: function(xhr, status, error) {
                console.error('Kullanıcı bilgileri güncellenemedi:', error);
            }
        });
 
    }

    // Kahraman Butonu Fonksiyonu
    async function heroFunction() {
        $('#tasksContainer').html(''); // İçeriği sıfırla
    
        // Profil resmi ve kullanıcı bilgilerini ekle
        const profileSection = `
            <div class="profile-section" style="text-align: center; margin-bottom: 20px;">
               <img src="/images/profil.jpg" alt="Profil Resmi" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px;">
                
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px;">
                        <strong>Ad:</strong>
                        <span>${username}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px;">
                        <strong>Seviye:</strong>
                        <span>${userlevel}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px;">
                        <strong>TP:</strong>
                        <span>${usertp}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px;">
                       
                        <span class="gold-info">
                            <i class="fas fa-coins" style="color: gold;"></i>
                        </span>
                          <span>${usergold}</span>
                    </div>
                </div>
            </div>
        `;
    
        $('#tasksContainer').append(profileSection); // Profil bilgisini ekle

        // Kategorileri sunucudan çek
        const categories = await fetch('/api/categories')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Kategoriler yüklenemedi');
                }
                return res.json(); // JSON formatında veri al
            })
            .then(data => {
                if (data.success) {
                    return data.data; // API'den dönen kategori verilerini al
                } else {
                    throw new Error('Kategoriler başarıyla yüklenmedi');
                }
            })
            .catch(err => {
                console.error('Hata oluştu:', err);
                return []; // Hata durumunda boş bir dizi döndür
            });

        // Kategoriler başlığını ekle
        const categoryTitle = `<h4 style="font-weight: bold; text-align: center; margin-bottom: 20px; text-decoration: underline;">Kategoriler</h4>`;

        $('#tasksContainer').append(categoryTitle);
    
        // Yeni bir kategori alanı ekle
        const categoryGrid = `
            <div class="category-grid" 
                style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; 
                    max-height: 200px; /* Kategori grid için yüksekliği sınırla */
                    overflow-y: auto; /* Yalnızca dikey kaydırma ekle */
                    padding-right: 10px;">
            </div>
        `;

        $('#tasksContainer').append(categoryGrid);
    
        // Kategorileri 3 kolon halinde sırala
        categories.forEach(category => {
            const categoryCard = `
                <div class="category-card" style="flex: 0 1 calc(20% - 10px); border: 1px solid #ddd; margin: 5px; padding: 10px; border-radius: 5px; box-sizing: border-box; background-color: #fff;">
                    <div style="flex-grow: 1; text-align: left;">
                        <div class="category-title"><strong>${category.category_name}</strong></div>
                        <div class="category-level" style="font-size: 12px; color: #666;">
                            <strong>Seviye:</strong> ${category.category_level}
                        </div>
                          <div class="category-tp" style="font-size: 12px; color: #666;">
                            <strong>TP:</strong> ${category.category_tp}
                        </div>
                    </div>
                </div>
            `;
            $('.category-grid').append(categoryCard);
        });
    }

    // Görev Butonu Fonksiyonu
    async function tasksFunction() {
        $('#tasksContainer').html('');
        $('#tasksContainer').removeAttr('style');

        // Popup menü HTML'i
        const filterPopupHTML = `
        <div style="position: relative;">
            <button id="filterPopupBtn" class="btn btn-secondary"></button>
            <div id="filterMenu" style="display: none; position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #ddd; border-radius: 5px; z-index: 1000; width: 120px;">
                <div class="filter-option" data-filter="today">Bugün</div>
                <div class="filter-option" data-filter="tomorrow">Yarın</div>
                <div class="filter-option" data-filter="overdue">Gecikmiş</div>
                <div class="filter-option" data-filter="all">Tümü</div>
                <div class="filter-option" data-filter="completed">Tamamlanmış</div>
            </div>
        </div>
        `;        

        let filter = selectedFilter; // Başlangıç filtresi
        
        // Sıralama menüsü HTML'i
        const sortMenuHTML = `
            <div style="position: relative;">
                <button id="sortBtn" class="btn btn-light"><i class="fas fa-sort-alpha-down"></i></button>
                <div id="sortMenu" style="display: none; position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #ddd; border-radius: 5px; z-index: 1000; width: 130px;">
                    <div class="sort-option" data-sort="priority">Önem Derecesi</div>
                    <div class="sort-option" data-sort="category">Kategoriler</div>
                    <div class="sort-option" data-sort="date-desc">Tarih-Azalan</div>
                    <div class="sort-option" data-sort="date-asc">Tarih-Artan</div>
                </div>
            </div>
        `;

        let taskCount=0;

        let ozel_gun="";
        
        let sort = null; // Başlangıç sıralama tercihi
        let searchValue = ''; // Arama değeri

        // Görevleri listeleme fonksiyonu
        const fetchTasks = async () => {
            try {
        
                // API çağrısı için gerekli parametreleri ayarla
                const response = await $.ajax({
                    url: `/api/tasks`,
                    type: 'GET',
                    data: {
                        filter: filter || 'all', // Tarih filtresi
                        sort: sort || null, // Sıralama
                        search: searchValue || '' // Arama
                    }
                });
        
                // Yanıtın geçerli olup olmadığını kontrol et
                if (!Array.isArray(response)) {
                    throw new Error("Backend'den dönen yanıt dizi formatında değil.");
                }
        
                // Görev sayısını güncelle
                const taskCount = response.length;
                $('#tasksContainer .task-count').text(`Görev Sayısı: ${taskCount}`);
        
                // Görevleri ekrana yazdır
                displayTasks(response);
        
            } catch (err) {
                console.error('Görevler alınırken hata oluştu:', err);
                $('#tasksList').html('<p>Görevler yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>');
            }
        };      
        
        // Görev sayısını, arama ikonunu, ve butonları tasksContainer'a ekle
        $('#tasksContainer').html(`
            <div id="taskBar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; position: sticky; top: 0; background-color: #fff; z-index: 10; padding: 10px;">
                ${filterPopupHTML}
                <span class="task-count" style="font-size: 16px;">Görev Sayısı: <strong>${taskCount}</strong></span>
                <div style="position: relative;">
                    <i id="searchIcon" class="fas fa-search" style="cursor: pointer;"></i>
                    <input id="searchInput" type="text" placeholder="Görev Ara" style="display: none; position: absolute; top: 25px; left: 0; width: 200px; padding: 5px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${sortMenuHTML}
                    <button id="addTaskBtn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Yeni Görev
                    </button>
                </div>
            </div>
            <div id="tasksList" style="max-height: 500px; overflow-y: auto; padding-right: 10px;"></div>
        `);    
        
        // Görevleri DOM'a ekleme fonksiyonu
        const displayTasks = (tasks) => {
            if (!tasks || tasks.length === 0) {
                $('#tasksList').html('<p>Gösterilecek görev bulunamadı.</p>');
                return;
            }
        
            const taskCards = tasks.map(task => {
                let gorevTekrarFormatted = task.gorev_tekrar;

                // Eğer "OHA-" ile başlıyorsa
                if (gorevTekrarFormatted.startsWith("OHA-")) {
                    const numbers = gorevTekrarFormatted.slice(4); // "OHA-" kısmını çıkar
                    let days = [];
                    
                    // Günleri 1 karakter boşlukla ayırarak ekle
                    if (numbers.includes("1")) days.push("Pzt");
                    if (numbers.includes("2")) days.push("Sa");
                    if (numbers.includes("3")) days.push("Ça");
                    if (numbers.includes("4")) days.push("Pe");
                    if (numbers.includes("5")) days.push("Cu");
                    if (numbers.includes("6")) days.push("Ctesi");
                    if (numbers.includes("7")) days.push("Pa");
            
                    gorevTekrarFormatted = days.join(" ");
                }
            
                // Eğer "OT-" ile başlıyorsa
                else if (gorevTekrarFormatted.startsWith("OT-")) {
                    const number = gorevTekrarFormatted.slice(3); // "OT-" kısmını çıkar
                    gorevTekrarFormatted = `${number} günde 1`; // Sayıyı alıp yanına "T" ekle
                }

                // Eğer "HA" ise "Hafta İçi"
                else if (gorevTekrarFormatted === "HA") {
                    gorevTekrarFormatted = "Hafta İçi";
                }

                // Eğer "HS" ise "Hafta Sonu"
                else if (gorevTekrarFormatted === "HS") {
                    gorevTekrarFormatted = "Hafta Sonu";
                }
                
                const formattedDate = new Date(task.gorev_tarih).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
        
                // Butonları gösterme/gizleme durumunu belirlemek
                const taskActions = !task.gorev_yapildimi 
                    ? `
                        <div class="task-actions ms-auto d-flex align-items-center">
                            <button class="btn btn-success complete-task me-2" style="font-size: 1.5rem; position: relative;">
                                <i class="fas fa-check-circle"></i>
                            </button>
                            <button class="btn btn-danger failure-task me-2" style="font-size: 1.5rem; position: relative;">
                                <i class="fas fa-times-circle"></i>
                            </button>
                            <button class="btn btn-danger delete-task" style="font-size: 1.5rem;">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button class="btn btn-primary edit-task ms-2" style="font-size: 1.5rem;">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>`
                    : '';
        
                // Duruma göre sağ tarafta yeşil tik veya kırmızı çarpı simgesi
                const statusIcon = task.gorev_yapildimi 
                    ? (task.gorev_durumu === 'Başarılı' 
                        ? '<i class="fas fa-check-circle" style="color: green;"></i>' 
                        : '<i class="fas fa-times-circle" style="color: red;"></i>')
                    : '';
        
                return `
                    <div class="task-card" data-id="${task.gorev_sira_no}"  data-tp="${task.gorev_tp}" 
         data-altin="${task.gorev_altin}" data-gorevkategori="${task.gorev_kategori}" data-gorevtekrar="${task.gorev_tekrar}" style="border: 1px solid #ddd; margin-bottom: 10px; padding: 10px; border-radius: 5px; background-color: #fff;">
                        <div class="d-flex align-items-center">
                            <div class="task-priority-icon d-flex align-items-center justify-content-center me-3" style="width: 10px; height: 10px; border-radius: 10px; background-color: ${
                                task.onem_derecesi === "Yüksek" ? "red" :
                                task.onem_derecesi === "Orta" ? "blue" :
                                task.onem_derecesi === "Düşük" ? "brown" : "transparent"};">
                            </div>
                            <div class="task-icon d-flex align-items-center justify-content-center" style="color: ${task.gorev_ikon_renk}; font-size: 2rem; width: 50px; height: 50px;">
                                <i class="fas ${task.gorev_ikon}"></i>
                            </div>
                            <div class="task-info ms-2">
                                <div class="task-title"><strong>${task.gorev_tanimi}</strong></div>
                                <div class="task-description">${task.gorev_aciklama}</div>
                                <div class="task-details d-flex flex-wrap">
                                    <span class="me-3"><i class="fas fa-tags"></i> ${task.gorev_kategori}</span>
                                    <span class="me-3"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                                    <span class="me-3"><i class="fas fa-redo"></i> ${gorevTekrarFormatted}</span>
                                    <span class="me-3"><i class="fas fa-coins" style="color: gold;"></i> ${task.gorev_altin}</span>
                                    <span class="me-3"><strong>TP:</strong> ${task.gorev_tp}</span>
                                </div>
                            </div>
                            <div class="task-actions ms-auto d-flex align-items-center">
                                ${taskActions}
                                ${statusIcon}
                            </div>
                        </div>
                    </div>
                `;
            });
        
            $('#tasksList').html(taskCards.join(''));
        };
        
        // İlk kez görevleri yükle
        fetchTasks();

        // `#filterPopupBtn` öğesini bul ve metni güncelle
        // Filtreye göre içeriği güncelle
        switch (filter) {
            case 'today':
                $('#filterPopupBtn').text("Bugün");
                break;
            case 'tomorrow':
                $('#filterPopupBtn').text("Yarın");
                break;
            case 'overdue':
                $('#filterPopupBtn').text("Gecikmiş");
                break;
            case 'all':
                $('#filterPopupBtn').text("Tümü");
                break;
            case 'completed':
                $('#filterPopupBtn').text("Tamamlanmış");
                break;
            default:
                $('#filterPopupBtn').text("Bugün"); // Varsayılan durum
                break;
        }

        // Popup menü işlevselliği
        $('#filterPopupBtn').click((event) => {
            
            $('#filterMenu').hide(); // Filtre menüsünü gizle
            $('#sortMenu').hide(); // Sıralama menüsünü gizle

            event.stopPropagation(); // Tıklamanın document'e yayılmasını engelle
            playSoundClick(); // Ses çal
            $('#filterMenu').toggle(); // Menü görünürlüğünü değiştir
        });

        $('.filter-option').click(function () {
            
            playSoundOption();
            
            filter = $(this).data('filter');
            $('#filterPopupBtn').text($(this).text());

            selectedFilter=filter;

            //Veriler güncelleniyor
            updateUserData();

            $('#filterMenu').hide();
            fetchTasks();
        });

        // Sıralama menüsü işlevselliği
        $('#sortBtn').click((event) => {
            
            $('#filterMenu').hide(); // Filtre menüsünü gizle
            $('#sortMenu').hide(); // Sıralama menüsünü gizle

            event.stopPropagation(); // Tıklamanın document'e yayılmasını engelle
            playSoundClick(); // Ses çal

            $('#sortMenu').toggle(); // Menü görünürlüğünü değiştir
        });

        $('.sort-option').click(function () {
            playSoundOption();

            sort = $(this).data('sort');
            $('#sortMenu').hide();
            fetchTasks();
        });

        // Document üzerinde bir yere tıklanınca menüleri kapat
        $(document).click(() => {
            $('#filterMenu').hide(); // Filtre menüsünü gizle
            $('#sortMenu').hide(); // Sıralama menüsünü gizle
        });

        // Menüye tıklanırsa document'e yayılmasını engelle
        $('#filterMenu, #sortMenu').click((event) => {
            event.stopPropagation(); // Tıklamanın document'e yayılmasını engelle
        });

        // Arama işlevselliği
        $('#searchIcon').click(() => {
            playSoundClick();

            $('#searchInput').toggle().focus();
        });
        
        $('#searchInput').on('input', function () {
            playSoundOption();

            searchValue = $(this).val().toLowerCase(); // Arama değerini güncelle
            fetchTasks(); // Filtrelemeyi yap
        });

        // Enter tuşuna basıldığında veya odak kaydırıldığında arama kutusunu kapat
        $('#searchInput').on('blur', function () {
            playSoundClick();

            $('#searchInput').hide();
        });

        $('#searchInput').on('keydown', function (e) {
            playSoundClick();

            if (e.key === 'Enter') {
                $('#searchInput').hide(); // Enter tuşuna basıldığında arama kutusunu kapat
            }
        });

        $(document).off('click', '#addTaskBtn').on('click', '#addTaskBtn', function () {
            playSoundClick();
        
                var today = new Date();
                var day = today.getDate().toString().padStart(2, '0');
                var month = (today.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                var year = today.getFullYear();
                var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl

                let gorev_ikon="fa-home";
                let gorev_ikon_renk='black';
                let gorev_tanimi='';
                let gorev_aciklama='';
                let gorev_tarih = formattedDateString;
                let gorev_kategori = "Genel";
                let gorev_tp = 0;
                let gorev_altin=0;
                let gorev_yapildimi = false;
                let gorev_durumu = "";
                let gorev_tekrar = "1";
                let onem_derecesi = "Yüksek";
                let gorev_tamamlanma_tarihi = "";

                // Önem Derecesi İndikatörünü Güncelleme Fonksiyonu
                function updateImportanceIndicator(value) {
                    let color = '';

                    // Seçilen 'onem_derecesi' değerine göre renk atama
                    if (value === 'Yüksek') {
                        color = 'red';
                    } else if (value === 'Orta') {
                        color = 'blue';
                    } else {
                        color = 'brown';
                    }

                    // 'importanceIndicator' elementinin background-color özelliğini güncelle
                    $('#importanceIndicator').css('background-color', color);
                }

                // Diyalog HTML
                const dialogHtml = `
                    <div id="addDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                        <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <form id="addForm">
                                <h5 style="margin-bottom: 20px; font-weight: bold;">Yeni Görev Ekle</h5>
                                
                                <!-- Renk Seçimi -->
                                <div>
                                    <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                    <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                        ${colors.map((color, index) => `
                                            <div class="color-circle" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                            ${((index + 1) % 7 === 0) ? '<div style="flex-basis: 100%; height: 0; margin-bottom: 15px;"></div>' : ''}
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- İkon Seçimi -->
                                <div class="mb-3">
                                    <label for="iconSelection" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                        İkon Seçimi:
                                        <i class="fas fa-search" id="searchIconAdd" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                        <div id="searchContainerAdd" style="display: none; margin-left: 10px;">
                                            <input type="text" id="searchInputAdd" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                        </div>
                                    </label>
                                    <div id="iconSelection" style="margin-top: 10px;">
                                        ${icons.map(category => `
                                            <div class="icon-category" style="margin-bottom: 20px;">
                                                <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                    ${category.title}
                                                </h4>
                                                <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                    ${category.icons.map(icon => `
                                                        <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                            <i class="fas ${icon}" style="font-size: 20px; color: ${gorev_ikon_renk};"></i>
                                                            <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                                ${icon.replace("fa-", "").replace("-", " ")}
                                                            </span>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- Görev Tanımı -->
                                <div class="mb-3">
                                    <label for="taskDescription" class="form-label" style=" font-weight: bold;">Görev Tanımı:</label>
                                    <input type="text" class="form-control" id="taskDescription" value="${gorev_tanimi}">
                                </div>

                                <!-- Görev Açıklaması -->
                                <div class="mb-3">
                                    <label for="taskDetails" class="form-label" style=" font-weight: bold;">Görev Açıklaması:</label>
                                    <textarea class="form-control" id="taskDetails">${gorev_aciklama}</textarea>
                                </div>

                                <!-- Kategori -->
                                <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                    <label for="taskCategory" class="mb-0" style=" font-weight: bold;">Kategori:</label> <!-- Flexbox gap ile mesafe verildi -->
                                    <select class="form-select" id="taskCategory" style="width: 200px;">
                                        <!-- Kategoriler buraya dinamik olarak eklenecek -->
                                    </select>
                                </div>

                                <!-- Tarih -->
                                <div class="mb-3 d-flex align-items-center" style="gap: 20px;">
                                    <label for="taskDate" class="mb-0" style=" font-weight: bold;">Tarih:</label> <!-- Flexbox gap ile mesafe verildi -->
                                    <div style="display: flex; align-items: center; width: 150px;">
                                        <input type="text" class="form-control" id="taskDate" value="${formattedDateString}" readonly>
                                        <i id="calendarIcon" class="fas fa-calendar-alt" style="cursor: pointer; margin-left: 10px;"></i>
                                    </div>
                                </div>

                                <!-- Tekrar -->
                                <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                    <label for="taskRepeat" class="mb-0" style=" font-weight: bold;">Tekrar:</label> <!-- Flexbox gap ile mesafe verildi -->
                                    <select class="form-select" id="taskRepeat" style="width: 150px;">
                                        <option value="Tekrar Etme" ${gorev_tekrar === "1" ? "selected" : ""}>Tekrar Etme</option>
                                        <option value="Günlük" ${gorev_tekrar === "G" ? "selected" : ""}>Günlük</option>
                                        <option value="Haftalık" ${gorev_tekrar === "H" ? "selected" : ""}>Haftalık</option>
                                        <option value="Aylık" ${gorev_tekrar === "A" ? "selected" : ""}>Aylık</option>
                                        <option value="Yıllık" ${gorev_tekrar === "Y" ? "selected" : ""}>Yıllık</option>
                                        <option value="Hafta İçi" ${gorev_tekrar === "HA" ? "selected" : ""}>Hafta İçi</option>
                                        <option value="Hafta Sonu" ${gorev_tekrar === "HS" ? "selected" : ""}>Hafta Sonu</option>
                                        <option value="Özel" ${gorev_tekrar.startsWith('OHA-') || gorev_tekrar.startsWith('OT-') ? "selected" : ""}>Özel</option>
                                    </select>
                                </div>

                                <!-- Altın -->
                                <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                    <!-- Altın İkonu -->
                                    <i class="fas fa-coins" style="color: gold; font-size: 20px;"></i>
                                    
                                    <!-- Altın Girişi -->
                                    <input type="number" class="form-control" id="taskGold" value="${gorev_altin}" min="0" max="100" style="width: 100px;">
                                </div>

                                <!-- TP -->
                                <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                    <!-- TP Yazısı -->
                                    <label for="taskTp" class="mb-0" style=" font-weight: bold;">TP:</label>
                                    
                                    <!-- TP Girişi -->
                                    <input type="number" class="form-control" id="taskTp" value="${gorev_tp}" min="0" max="100" style="width: 100px;">
                                </div>

                               <!-- Önem Derecesi -->
                                <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                    <!-- Önem Derecesi Yazısı -->
                                    <label for="taskOnemDerecesi" class="mb-0" style=" font-weight: bold;">Önem Derecesi:</label>
                                    
                                    <!-- Dinamik Renk Dairesi -->
                                    <div id="importanceIndicator" class="rounded-circle" style="width: 20px; height: 20px; margin-right: 10px;"></div>
                                    
                                    <!-- Önem Derecesi Seçimi -->
                                    <select class="form-select" id="taskOnemDerecesi" style="width: 120px;">
                                        <option value="Yüksek">Yüksek</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Düşük">Düşük</option>
                                    </select>
                                </div>

                                <!-- Butonlar -->
                                <div style="margin-top: 30px;">
                                    <button type="button" id="confirmAdd" class="btn btn-primary" style="margin-right: 10px;">Ekle</button>
                                    <button type="button" id="cancelAdd" class="btn btn-secondary">İptal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                // Diyalog kutusunu sayfaya ekle
                $('body').append(dialogHtml);

                const initialValue = onem_derecesi;
                updateImportanceIndicator(initialValue);
                $('#taskOnemDerecesi').val(onem_derecesi);

                // Seçenek değiştiğinde güncelleme işlemi
                $('#taskOnemDerecesi').change(function() {
                    playSoundOption();

                    const selectedValue = $(this).val();
                    updateImportanceIndicator(selectedValue);
                });     
                
                // Arama simgesine tıklama
                $('#searchIconAdd').on('click', function () {
                    const $searchContainer = $('#searchContainerAdd');
                    $searchContainer.toggle(); // Görünürlüğü değiştirir
                });

                // Arama girişine yazı yazıldıkça ikonları filtreleme
                $('#searchInputAdd').on('input', function () {
                    const query = $(this).val().toLowerCase();

                    // Filtreleme işlemi
                    const filteredIcons = icons.map(category => ({
                        title: category.title,
                        icons: category.icons.filter(icon => icon.includes(query))
                    })).filter(category => category.icons.length > 0);

                    // Güncellenmiş ikon listesi
                    const $iconSelection = $('#iconSelection');
                    $iconSelection.html(filteredIcons.map(category => `
                        <div class="icon-category" style="margin-bottom: 20px;">
                            <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                ${category.title}
                            </h4>
                            <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                ${category.icons.map(icon => `
                                    <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                        <i class="fas ${icon}" style="font-size: 20px; color: ${gorev_ikon_renk};"></i>
                                        <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                            ${icon.replace("fa-", "").replace("-", " ")}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join(''));
                });

                // Arama girişinin dışına tıklanınca gizleme
                $(document).on('click', function (e) {
                    const $searchContainer = $('#searchContainerAdd');
                    if (!$(e.target).closest('#searchContainerAdd, #searchIconAdd').length) {
                        $searchContainer.hide(); // Giriş kutusunu gizle
                    }
                });

                // Kategorileri API'den çekme
                $.ajax({
                    url: '/api/categories', // API endpoint
                    method: 'GET',
                    success: function(response) {
                        // API'den gelen yanıtı kontrol ediyoruz
                        if (response.success && Array.isArray(response.data)) {
                            const categories = response.data; // 'data' kısmına erişiyoruz
                            
                            // Kategorileri menüye ekleme
                            categories.forEach(function(category) {
                                $('#taskCategory').append(`
                                    <option value="${category.category_name}" ${gorev_kategori === category.category_name ? 'selected' : ''}>
                                        ${category.category_name}
                                    </option>
                                `);
                            });
                        } else {
                            console.error('API yanıtı beklenen formatta değil veya başarısız.');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Kategoriler yüklenemedi:', error);
                    }
                });               

                // İkon Seçimi: Başlangıçta task.gorev_ikon'a göre ikon seçili yapılacak
                $('#iconSelection .icon-option').each(function() {
                    if ($(this).data('icon') === gorev_ikon) {
                        $(this).addClass('selected');

                       // $(this).css('border', '2px solid black'); // Seçilen ikonu vurgula
                    }
                });

                // Renk Seçimi: Başlangıçta task.gorev_ikon_renk'e göre renk seçili yapılacak
                $('.color-circle').each(function() {
                    if ($(this).data('color') === gorev_ikon_renk) {
                        $(this).addClass('selected');
                        // Seçilen rengi ikona uygula
                        $('#iconSelection .fas').css('color', gorev_ikon_renk);
                    }
                });

                // Renk seçimi dinamik renk değişimi
                $('.color-circle').on('click', function () {
                    playSoundClick();

                    const selectedColor = $(this).data('color');
                    
                    // Tüm renk dairelerinden 'selected' sınıfını kaldır
                    $('.color-circle').removeClass('selected');
                    
                    // Seçilen renk dairesine 'selected' sınıfını ekle
                    $(this).addClass('selected');

                    $('#iconSelection .fas').css('color', selectedColor);
                    gorev_ikon_renk = selectedColor;
                });

                // İkon seçimi
                $('.icon-option').on('click', function () {
                    playSoundClick();

                    gorev_ikon = $(this).data('icon');

                    // Tüm ikonlar üzerindeki 'selected' sınıfını kaldır
                    $('.icon-option').removeClass('selected');
                    
                    // Tıklanan ikona 'selected' sınıfını ekle
                    $(this).addClass('selected');
                    
                });

                var selectedDate=gorev_tarih;

                // Takvim simgesine tıklandığında takvim diyalog penceresini açma
                $('#calendarIcon').click(function() {
                    playSoundClick();

                    // Tarihi Türkçe formatına uygun şekilde güncelle
                    var today = new Date();
                    var day = today.getDate().toString().padStart(2, '0');
                    var month = (today.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                    var year = today.getFullYear();
                    var formattedDateString = `${year}-${month}-${day}`; // YYYY-MM-DD formatı
        
                    // Ana formdaki tarih alanını güncelle
                    //$('#taskDate').val(formattedDateString);

                    // Takvim diyalog penceresini dinamik olarak oluştur
                    var calendarDialogHtml = `
                        <div id="calendarDialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                            <div style="background: white; padding: 20px; border-radius: 8px; width: 200px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <h5 style="margin-bottom: 20px;">Tarih Seçin</h5>
                                <input type="date" id="calendarInput" class="form-control" style="margin-bottom: 20px;">
                                <div>
                                    <button type="button" id="confirmDate" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                    <button type="button" id="cancelDate" class="btn btn-secondary">İptal</button>
                                </div>
                            </div>
                        </div>
                    `;
                
                    // Takvim diyalog penceresini body'ye ekle
                    $('body').append(calendarDialogHtml);
                
                    // Takvim diyalog penceresini göster
                    $('#calendarDialog').fadeIn();

                    $('#calendarInput').val(formattedDateString); // Bugünün tarihini YYYY-MM-DD formatında ayarla
                
                    // Takvim diyalog penceresindeki "Onayla" butonuna tıklanınca tarih ana pencerede güncellenir
                    $('#confirmDate').click(function() {
                        playSoundClick();

                        selectedDate = $('#calendarInput').val();  // Takvimden seçilen tarihi al
                        if (selectedDate) {
                            // Tarihi Türkçe formatına uygun şekilde güncelle
                            var formattedDate = new Date(selectedDate);
                            var day = formattedDate.getDate().toString().padStart(2, '0');
                            var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                            var year = formattedDate.getFullYear();
                            var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl
                
                            selectedDate=formattedDateString;
                            // Ana formdaki tarih alanını güncelle
                            $('#taskDate').val(formattedDateString);
                        }
                
                        // Takvim diyalog penceresini kapat
                        $('#calendarDialog').fadeOut(function() {
                            // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                            $('#calendarDialog').remove();
                        });
                    });
                
                    // Takvim diyalog penceresindeki "İptal" butonuna tıklanınca pencere kapanır
                    $('#cancelDate').click(function() {
                        playSoundClick();

                        $('#calendarDialog').fadeOut(function() {
                            // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                            $('#calendarDialog').remove();
                        });
                    });
                });
                
                // "İptal" butonuna tıklanırsa takvim diyalog penceresini kapatma
                $('#cancelDate').click(function() {
                    playSoundClick();

                    $('#calendarDialog').fadeOut();
                });

                // "Onayla" butonuna tıklanırsa tarih güncellenmesi
                $('#confirmDate').click(function() {
                    playSoundClick();

                    const selectedDate = $('#calendarInput').val();
                    if (selectedDate) {
                        // Türkçe formata uygun tarih güncellemesi (gg.aa.yyyy formatı)
                        const formattedDate = new Date(selectedDate).toLocaleDateString('tr-TR');
                        $('#taskDate').val(formattedDate);
                        $('#calendarDialog').fadeOut();
                    }
                });         

                // 'Özel' seçeneği seçildiğinde diyalog penceresini göster
                $('#taskRepeat').on('change', function() {
                    if ($(this).val() === "Özel") {
                        showCustomDialog();
                    }
                });

                function showCustomDialog() {
                    // Diğer içerik, değerler gibi değişkenlerinize uygun şekilde
                    const dialogHtml = `
                        <div id="specialDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                            <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <h5 style="font-weight: bold; margin-bottom: 10px;">ÖZEL GÜN BELİRLEME</h5>
                                
                                <!-- Gün Sayısı ve Haftanın Günleri Seçenekleri (Her zaman üstte) -->
                                <div class="mb-3">
                                    <input type="radio" name="repeatType" value="days" id="repeatDays" checked /> Gün Sayısı
                                    <input type="radio" name="repeatType" value="week" id="repeatWeek" /> Haftanın Günleri
                                </div>
            
                                <!-- Sayı Seçimi -->
                                <div class="mb-3" id="customRepeatDaysContainer" style=" margin-bottom: 10px;">
                                    <label for="customRepeatDays">Gün Seçimi (2-6 arası):</label>
                                    <input type="number" id="customRepeatDays" min="2" max="6" style="width: 60px;" /> günde 1
                                </div>
                                
                                <!-- Haftanın Günleri Seçimi -->
                                <div id="weekDaysContainer" style="display: none; margin-bottom: 10px;">
                                    <div>
                                        <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                            <input type="checkbox" id="monday" /> Pazartesi
                                        </label>
                                        <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                            <input type="checkbox" id="tuesday" /> Salı
                                        </label>
                                        <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                            <input type="checkbox" id="wednesday" /> Çarşamba
                                        </label>
                                        <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                            <input type="checkbox" id="thursday" /> Perşembe
                                        </label>
                                        <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                            <input type="checkbox" id="friday" /> Cuma
                                        </label>
                                        <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                            <input type="checkbox" id="saturday" /> Cumartesi
                                        </label>
                                        <label style="display: inline-flex; align-items: center;">
                                            <input type="checkbox" id="sunday" /> Pazar
                                        </label>
                                    </div>
                                </div>

            
                                <!-- Onayla ve İptal Butonları -->
                                <div>
                                    <button type="button" id="confirmCustom" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                    <button type="button" id="cancelCustom" class="btn btn-secondary">İptal</button>
                                </div>
                            </div>
                        </div>
                    `;
            
                    // Diğer içeriklerle birlikte diyalog penceresini ekleyin
                    $('body').append(dialogHtml);
            
                    // Gün Sayısı ve Haftanın Günleri seçenekleri arasındaki değişiklikleri kontrol et
                    $('input[name="repeatType"]').on('change', function() {
                        if ($('#repeatDays').is(':checked')) {
                            $('#weekDaysContainer').hide(); // Haftanın günleri kutusunu gizle
                            $('#customRepeatDaysContainer').show(); // Gün sayısı kutusunu göster
                        } else if ($('#repeatWeek').is(':checked')) {
                            $('#weekDaysContainer').show(); // Haftanın günleri kutusunu göster
                            $('#customRepeatDaysContainer').hide(); // Gün sayısı kutusunu gizle
                        }
                    });
            
                    // Onayla butonuna tıklama
                    $('#confirmCustom').on('click', function() {
                        let repeatValue = '';
            
                        // Seçilen tür ve değer doğrultusunda taskRepeat değerini güncelle
                        if ($('#repeatDays').is(':checked')) {
                            const repeatDays = $('#customRepeatDays').val();
                            if (repeatDays) {
                                repeatValue = `OT-${repeatDays}`;
                            }
                        } else if ($('#repeatWeek').is(':checked')) {
                            const selectedDays = [];
                            const daysMap = {
                                'monday': '1',
                                'tuesday': '2',
                                'wednesday': '3',
                                'thursday': '4',
                                'friday': '5',
                                'saturday': '6',
                                'sunday': '7'
                            };
                
                            // Haftanın günleri seçilirse sayısal değerleri al
                            $('#weekDaysContainer input[type="checkbox"]:checked').each(function() {
                                const dayId = $(this).attr('id');
                                if (daysMap[dayId]) {
                                    selectedDays.push(daysMap[dayId]);
                                }
                            });
                
                            // Seçilen günleri "OHA-" ile başlat ve sayısal değerleri ekle
                            if (selectedDays.length) {
                                repeatValue = `OHA-${selectedDays.join('')}`;
                            }
                        }
                    
                        // 'taskRepeat' değerini güncelle ve diyalog penceresini kapat
                        //$('#taskRepeat').val(repeatValue);
                        ozel_gun=repeatValue;
                        $('#specialDialog').remove(); // Diyalog penceresini kapat
                    });
            
                    // İptal butonuna tıklama, diyalog penceresini kapat
                    $('#cancelCustom').on('click', function() {
                        $('#specialDialog').remove(); // Diyalog penceresini kapat
                    });
                }
                
                function convertDateToISO(dateString) {
                    // Gelen tarih formatı: "20.12.2024"
                    const [day, month, year] = dateString.split('.'); // Tarihi gün, ay ve yıl olarak ayır
                    return `${year}-${month}-${day}`; // ISO formatında birleştir
                }

                // Güncelle butonuna tıklama işlemi
                $('#confirmAdd').on('click', async function () {
                    playSoundClick();

                    const description = $('#taskDescription').val().trim();
                    const details = $('#taskDetails').val().trim();
                    const iconClass = $('#iconSelection .icon-option.selected').data('icon') || 'default-icon'; // Seçilen ikonu al
                    const iconColor = $('#colorSelection .color-circle.selected').data('color') || '#000000'; // Seçilen rengi al
                    const category = $('#taskCategory').val().trim().replace(/\s+/g, ' '); // Güncellenen kategori adı
                    const date = convertDateToISO(selectedDate); // "2024-12-20"
                    const repeatOption = $('#taskRepeat').val(); // Select öğesindeki seçili değeri al
                    let repeatOptionText = "";
                    
                    switch (repeatOption) {
                        case "Tekrar Etme":
                            repeatOptionText = "1";
                            break;
                        case "Günlük":
                            repeatOptionText = "G";
                            break;
                        case "Haftalık":
                            repeatOptionText = "H";
                            break;
                        case "Aylık":
                            repeatOptionText = "A";
                            break;
                        case "Yıllık":
                            repeatOptionText = "Y";
                            break;
                        case "Hafta İçi":
                            repeatOptionText = "HA";
                            break;
                        case "Hafta Sonu":
                            repeatOptionText = "HS";
                            break;
                        case "Özel":
                            repeatOptionText = ozel_gun;
                            break;
                        default:
                            repeatOptionText = "";
                    }

                    const goldAmount = parseInt($('#taskGold').val() || "0", 10);
                    const tpAmount = parseInt($('#taskTp').val() || "0", 10);       
                                      
                    // Güncellenen veriler JSON formatında
                    const taskData = JSON.stringify({
                        gorev_ikon: iconClass,
                        gorev_ikon_renk: iconColor,
                        gorev_tanimi: description,
                        gorev_aciklama: details,
                        gorev_tarih: date,
                        gorev_kategori: category,
                        gorev_tp: tpAmount,
                        gorev_altin: goldAmount,
                        gorev_yapildimi: false,
                        gorev_durumu: "",
                        gorev_tekrar: repeatOptionText,
                        onem_derecesi: $('#taskOnemDerecesi').val(),
                        gorev_tamamlanma_tarihi: ""
                    });

                    // Boş bırakma kontrolü
                    if (!description) {
                        alert("Görev tanımı boş bırakılamaz!");
                        return;
                    }

                    /* const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error(`Silme hatası: ${response.status}`);
                    taskCard.remove(); // Görevi kaldır */

                    //Yeni görev ekleniyor
                    $.ajax({
                        url: '/api/tasks', // API endpoint
                        type: 'POST',
                        contentType: 'application/json', // JSON formatında veri gönderiyoruz
                        data: JSON.stringify(taskData), // Veriyi JSON string'e dönüştürüyoruz
                        success: function (response) {
                            if (response.success) {
                                alert("Görev başarıyla eklendi!");
                                $('#addDialog').remove(); // Dialog'u kaldırıyoruz
                    
                            } else {
                                alert("Görev eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
                            }
                        },
                        error: function (xhr) {
                            const errorResponse = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu";
                            alert("Görev eklenirken bir hata oluştu: " + errorResponse);
                        }
                    });
                    
                    fetchTasks();
                    
                });
            
                // İptal butonuna tıklama işlemi
                $('#cancelAdd').on('click', function () {
                    playSoundClick();

                    $('#addDialog').remove(); // Sadece diyalog kutusunu kaldır
                });
        
        }); 
        
        $(document).on('click', '.complete-task', function () {
            playSoundSuccess();

            const $taskCard = $(this).closest('.task-card');
            const taskId = $taskCard.data('id');
            const gorevKategori = $taskCard.data('gorevkategori');
            const gorevTekrar = $taskCard.data('gorevtekrar');

            // Get today's date in the format YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0]; // Example: "2024-12-20"
        
            // Animate the check icon
            const $checkIcon = $(this).find('.fa-check-circle');
            $checkIcon.css({
                transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                transform: "scale(1.5)",
                color: "green"
            });
        
            setTimeout(() => {
                $checkIcon.css('transform', 'scale(1)');
            }, 300);

            // Get gorev_tp and gorev_altin values from taskCard
            const gorev_tp = parseInt($taskCard.data('tp'), 10) || 0; // Default to 0 if not provided
            const gorev_altin = parseInt($taskCard.data('altin'), 10) || 0; // Default to 0 if not provided      
      
            //Kategori verileri alınıyor
            $.ajax({
                url: '/api/categories', // Kategorileri listeleyen API'ye GET isteği gönderiyoruz
                type: 'GET',
                success: function (response) {
                    // API'nin döndürdüğü yapıyı kontrol ediyoruz
                    const categories = Array.isArray(response) ? response : response.data || [];
            
                    if (!Array.isArray(categories)) {
                        console.error('Beklenen bir dizi, ancak farklı bir veri yapısı alındı:', response);
                        return;
                    }
            
                    // İlgili kategoriyi bul
                    const category = categories.find(cat => cat.category_name === gorevKategori);
            
                    if (!category) {
                        console.error(`Kategori bulunamadı: ${gorevKategori}`);
                        return;
                    }
            
                    // Kategori bilgilerini al
                    let categoryName = category.category_name;
                    let categoryLevel = parseInt(category.category_level, 10) || 0;
                    let categoryTp = parseInt(category.category_tp, 10) || 0;
            
                    if (!$(this).data('updated')) { // Kullanıcı güncellemesinin tekrarını önlemek için kontrol
                        categoryTp += gorev_tp; // TP değerini artır
            
                        // TP değeri 50'yi geçerse seviye artır ve TP'yi azalt
                        if (categoryTp > 50) {
                            categoryTp -= 50;
                            categoryLevel += 1; 
                        }
            
                        $(this).data('updated', true); // Güncelleme işaretini koy
                    }
            
                    // Kategoriyi güncellemek için PUT isteği gönderiyoruz
                    $.ajax({
                        url: `/api/categories`,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            id: category.id, // Kategori ID'si
                            category_name: categoryName,
                            category_level: categoryLevel,
                            category_tp: categoryTp
                        }),
                        success: function () {
                            console.log(`Kategori başarıyla güncellendi: ${categoryName}`);
                        },
                        error: function (xhr) {
                            const errorResponse = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu";
                            console.error('Kategori güncellenirken hata oluştu:', errorResponse);
                        }
                    });
                },
                error: function (xhr) {
                    const errorResponse = xhr.responseJSON?.error || "Kategoriler alınırken hata oluştu";
                    console.error('Kategori verileri alınırken hata oluştu:', errorResponse);
                }
            });            

            ozel_gun=gorevTekrar;
        
            // Mark the task as completed and remove the card
            setTimeout(() => {
                // Update the task's state (e.g., `gorev_yapildimi = true`)
                $.ajax({
                    url: `/api/tasks/${taskId}`,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        gorev_yapildimi: true, // Görevi tamamlandı olarak işaretle
                        gorev_durumu: "Başarılı",
                        gorev_tekrar: ozel_gun,
                        gorev_tamamlanma_tarihi: today // Tamamlama tarihi olarak bugünü ekle
                    }),
                    success: function (response) {
                        console.log(`Görev ${taskId} başarıyla tamamlandı.`, response);
                
                        // Görev listesi verilerini yeniden yükle
                        fetchTasks();
                
                        // Görev kartını UI'dan kaldır
                        $taskCard.remove();
                
                        // Kullanıcı TP ve altın değerlerini güncelle
                        if (!$taskCard.data('updated')) { // TP ve altın yalnızca bir kez güncellenmeli
                            usertp += gorev_tp;
                            usergold += gorev_altin;
                            $taskCard.data('updated', true); // Birden fazla güncellemeyi önlemek için işaretle
                
                            // Kullanıcı seviyesi kontrolü
                            if (usertp >= 50) {
                                playSoundMagic();
                
                                userlevel += 1;
                                usertp -= 50;
                
                                // Yeni değerlerle UI'yi güncelle ve animasyonu ekle
                                $('.userlevel').text(userlevel)
                                    .addClass('animateValue')
                                    .one('animationend', function () {
                                        $(this).removeClass('animateValue');
                                    });
                            } else {
                                $('.userlevel').text(userlevel);
                            }
                
                            // Yeni altın ve TP değerlerini UI'de göster
                            $('.usergold').text(usergold);
                            $('.usertp').text(usertp);
                        }
                    },
                    error: function (err) {
                        console.error('Görev güncellenirken hata oluştu:', err);
                        if (err.responseJSON && err.responseJSON.error) {
                            alert(`Hata: ${err.responseJSON.error}`);
                        }
                    }
                });
                
                updateUserData();

                tasksFunction();   
    
            }, 600); 

        });       

        $(document).on('click', '.failure-task', function () {
            playSoundFail();

            const $taskCard = $(this).closest('.task-card');
            const taskId = $taskCard.data('id');

            // Diyalog penceresini oluştur
            $('body').append(`
                <div id="customDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                        <div style="background: white; padding: 20px; border-radius: 8px; width: 300px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <p>Bu görev başarısız sayılacak. Kabul ediyor musunuz?</p>
                            <button id="confirmFailure" class="btn btn-danger">Onayla</button>
                            <button id="cancelFailure" class="btn btn-secondary">İptal</button>
                        </div>
                </div>
            `);

            // Diyalog penceresini göster
            $('#customDialog').fadeIn();

            // "Onayla" butonuna tıklanması durumunda
            $(document).on('click', '#confirmFailure', function () {
                playSoundFail();
                // Bugünün tarihini al
                const today = new Date().toISOString().split('T')[0]; // Example: "2024-12-20"
                const gorevKategori = $taskCard.data('gorevkategori');
                const gorevTekrar = $taskCard.data('gorevtekrar');

                // Get gorev_tp and gorev_altin values from taskCard
                const gorev_tp = parseInt($taskCard.data('tp'), 10) || 0; // Default to 0 if not provided
                const gorev_altin = parseInt($taskCard.data('altin'), 10) || 0; // Default to 0 if not provided
   
                ozel_gun=gorevTekrar;

                // Mark the task as completed and remove the card
                // Görev güncellemesi (başarısızlık durumu ve gorev_yapildimi: true olarak)
                $.ajax({
                    url: `/api/tasks/${taskId}`,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        gorev_yapildimi: true, // Görevi tamamlanmış olarak işaretle
                        gorev_durumu: "Başarısız",
                        gorev_tekrar: ozel_gun, // Tekrar bilgisi
                        gorev_tamamlanma_tarihi: today // Bugünün tarihini tamamlanma tarihi olarak ekle
                        //Bu alttaki kısmı eklemem gerekebilir . Hata verebilir.
                        //gorev_tarih: gorevTarih // Görevin orijinal tarihini ekleyin
                    }),
                    success: function (response) {
                        console.log(`Görev ${taskId} başarıyla güncellendi.`);
                        
                        // Yeni görev oluşturulmuşsa yanıt kontrolü
                        if (response.updatedTask) {
                            console.log("Güncellenen görev detayları:", response.updatedTask);
                        }
                
                        $taskCard.remove(); // Görev kartını UI'dan kaldır
                        $('#customDialog').fadeOut(); // Diyalog penceresini gizle
                        $('#customDialog').remove();
                
                        fetchTasks(); // Görev listesini yeniden yükle
                    },
                    error: function (err) {
                        if (err.responseJSON && err.responseJSON.error) {
                            console.error('Görev güncellenirken hata:', err.responseJSON.error);
                        } else {
                            console.error('Görev güncellenirken hata oluştu:', err);
                        }
                    },
                    complete: function () {
                        console.log('Görev güncelleme işlemi tamamlandı.');
                    }
                });

                $.ajax({
                    url: '/api/categories', // Kategorilerin listelendiği API
                    type: 'GET',
                    success: function (response) {
                        // Gelen yanıtı kontrol et ve kategorileri al
                        const categories = Array.isArray(response) ? response : response.data || [];
                
                        if (!Array.isArray(categories)) {
                            console.error('Beklenen bir dizi alinamadi, farklı bir veri yapısı döndü:', response);
                            return;
                        }
                
                        // İlgili kategoriyi bul
                        const category = categories.find(cat => cat.category_name === gorevKategori);
                
                        if (!category) {
                            console.error(`Belirtilen kategori bulunamadı: ${gorevKategori}`);
                            return;
                        }
                
                        let categoryName = category.category_name;
                        let categoryLevel = parseInt(category.category_level, 10) || 0;
                        let categoryTp = parseInt(category.category_tp, 10) || 0;
                
                        // Kullanıcı verilerinin birden fazla kez güncellenmesini önlemek için kontrol
                        if (!$(this).data('updated')) {
                            if ((categoryTp - gorev_tp) > 0) {
                                categoryTp -= gorev_tp;
                            } else if (categoryLevel > 0) {
                                categoryLevel -= 1; // Seviye düşür
                                categoryTp = 50 + (categoryTp - gorev_tp); // TP'yi yeniden ayarla
                            }
                
                            $(this).data('updated', true); // Güncellendi olarak işaretle
                        }
                
                        // Güncellenmiş kategori bilgilerini sunucuya gönder
                        $.ajax({
                            url: `/api/categories`, // Güncelleme API'si
                            type: 'PUT',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                id: category.id, // Kategori ID'si
                                category_name: categoryName,
                                category_level: categoryLevel,
                                category_tp: categoryTp
                            }),
                            success: function () {
                                console.log(`Kategori başarıyla güncellendi: ${categoryName}`);
                            },
                            error: function (err) {
                                console.error('Kategori güncellenirken hata oluştu:', err);
                            }
                        });
                    },
                    error: function (err) {
                        console.error('Kategori verileri alınırken hata oluştu:', err);
                    }
                });               

                // Update usertp and usergold variables
                if (!$(this).data('updated')) {
                    // Update usertp and usergold variables
                    usertp -= gorev_tp;
                    usergold -= gorev_altin;

                    // Check if userlevel is greater than 0 and usertp becomes less than 0
                    if (usertp < 0) {
                        if (userlevel > 0) {
                            // If userlevel is greater than 0, decrease userlevel by 1 and set usertp to (50 - gorev_tp)
                            userlevel -= 1;
                            usertp+=50;
                        } else {
                            // If userlevel is 0 or less, set usertp to 0
                            usertp = 0;
                        }
                    }

                    if (usergold<0) {
                        usergold=0;
                    }

                    // Update the UI with the new values
                    $('.usertp').text(usertp);
                    $('.usergold').text(usergold);
                    $('.userlevel').text(userlevel);

                    
                    //Veriler güncelleniyor
                    
                }

                updateUserData();
            });

            // "İptal" butonuna tıklanması durumunda
            $(document).on('click', '#cancelFailure', function () {
                playSoundClick();

                $('#customDialog').fadeOut(500, function() {
                    $(this).remove();
                });

            });

        });
    
        // Silme işlemi
        $(document).off('click', '.delete-task').on('click', '.delete-task', function () {
            playSoundDelete();

            const taskCard = $(this).closest('.task-card');
            const taskId = taskCard.data('id');

            // Diyalog kutusunu oluştur
            const dialogHtml = `
                <div id="deleteDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 20px; border-radius: 8px; width: 300px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <p style="margin-bottom: 20px;">Bu görev silinecek. Emin misiniz?</p>
                        <div>
                            <button id="confirmDelete" class="btn btn-danger" style="margin-right: 10px;">Onayla</button>
                            <button id="cancelDelete" class="btn btn-secondary">İptal</button>
                        </div>
                    </div>
                </div>
            `;

            // Diyalog kutusunu sayfaya ekle
            $('body').append(dialogHtml);

            // Onayla butonuna tıklama işlemi
            $('#confirmDelete').on('click', async function () {
                playSoundDelete();

                try {
                    const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error(`Silme hatası: ${response.status}`);
                    taskCard.remove(); // Görevi kaldır
                } catch (error) {
                    console.error("Görev silinirken hata oluştu:", error);
                    alert("Görev silinirken bir hata oluştu.");
                } finally {
                    $('#deleteDialog').remove(); // Diyalog kutusunu kaldır
                }

                fetchTasks();
            });

            // İptal butonuna tıklama işlemi
            $('#cancelDelete').on('click', function () {
                playSoundClick();

                $('#deleteDialog').remove(); // Sadece diyalog kutusunu kaldır
            });
        });

        $(document).off('click', '.edit-task').on('click', '.edit-task', function () {
            playSoundClick();

            const taskCard = $(this).closest('.task-card');
            const taskId = taskCard.data('id');

            let task; // Task objesini dışarıda tanımladık
                  
            /// Task verilerini al (örnek bir veri alım yöntemi, bunu back-end'e uygun şekilde güncelleyebilirsiniz)
            $.ajax({
                url: `/api/tasks`, // Tüm görevleri almak için endpoint
                type: 'GET',
                success: function (response) {
                    task = Array.isArray(response) ? response.find(t => t.gorev_sira_no === taskId) : null; // ID'ye göre görevi bul
                    if (task) {
                        var formattedDate = new Date(task.gorev_tarih);
                        var day = formattedDate.getDate().toString().padStart(2, '0');
                        var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                        var year = formattedDate.getFullYear();
                        var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl

                        // Önem Derecesi İndikatörünü Güncelleme Fonksiyonu
                        function updateImportanceIndicator(value) {
                            let color = '';

                            // Seçilen 'onem_derecesi' değerine göre renk atama
                            if (value === 'Yüksek') {
                                color = 'red';
                            } else if (value === 'Orta') {
                                color = 'blue';
                            } else {
                                color = 'brown';
                            }

                            // 'importanceIndicator' elementinin background-color özelliğini güncelle
                            $('#importanceIndicator').css('background-color', color);
                        }

                        // Diyalog HTML
                        const dialogHtml = `
                            <div id="editDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <form id="editForm">
                                        <h5 style="margin-bottom: 20px; font-weight: bold;">Görev Düzenleme</h5>
                                        
                                        <!-- Renk Seçimi -->
                                        <div>
                                            <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                            <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                                ${colors.map(color => `
                                                    <div class="color-circle" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                                `).join('')}
                                            </div>
                                        </div>

                                        <!-- İkon Seçimi -->
                                        <div class="mb-3">
                                            <label for="iconSelection" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                                İkon Seçimi:
                                                <i class="fas fa-search" id="searchIconEdit" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                                <div id="searchContainerEdit" style="display: none; margin-left: 10px;">
                                                    <input type="text" id="searchInputEdit" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                                </div>
                                            </label>
                                            <div id="iconSelection" style="margin-top: 10px;">
                                                ${icons.map(category => `
                                                    <div class="icon-category" style="margin-bottom: 20px;">
                                                        <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                            ${category.title}
                                                        </h4>
                                                        <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                            ${category.icons.map(icon => `
                                                                <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                                    <i class="fas ${icon}" style="font-size: 20px; color: ${task.gorev_ikon_renk};"></i>
                                                                    <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                                        ${icon.replace("fa-", "").replace("-", " ")}
                                                                    </span>
                                                                </div>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>

                                        <!-- Görev Tanımı -->
                                        <div class="mb-3">
                                            <label for="taskDescription" class="form-label" style=" font-weight: bold;">Görev Tanımı:</label>
                                            <input type="text" class="form-control" id="taskDescription" value="${task.gorev_tanimi}">
                                        </div>

                                        <!-- Görev Açıklaması -->
                                        <div class="mb-3">
                                            <label for="taskDetails" class="form-label" style=" font-weight: bold;">Görev Açıklaması:</label>
                                            <textarea class="form-control" id="taskDetails">${task.gorev_aciklama}</textarea>
                                        </div>

                                        <!-- Kategori -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <label for="taskCategory" class="mb-0" style=" font-weight: bold;">Kategori:</label> <!-- Flexbox gap ile mesafe verildi -->
                                            <select class="form-select" id="taskCategory" style="width: 200px;">
                                                <!-- Kategoriler buraya dinamik olarak eklenecek -->
                                            </select>
                                        </div>

                                        <!-- Tarih -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 20px;">
                                            <label for="taskDate" class="mb-0" style=" font-weight: bold;">Tarih:</label> <!-- Flexbox gap ile mesafe verildi -->
                                            <div style="display: flex; align-items: center; width: 150px;">
                                                <input type="text" class="form-control" id="taskDate" value="${formattedDateString}" readonly>
                                                <i id="calendarIcon" class="fas fa-calendar-alt" style="cursor: pointer; margin-left: 10px;"></i>
                                            </div>
                                        </div>

                                        <!-- Tekrar -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <label for="taskRepeat" class="mb-0" style=" font-weight: bold;">Tekrar:</label> <!-- Flexbox gap ile mesafe verildi -->
                                            <select class="form-select" id="taskRepeat" style="width: 150px;">
                                                <option value="Tekrar Etme" ${task.gorev_tekrar === "1" ? "selected" : ""}>Tekrar Etme</option>
                                                <option value="Günlük" ${task.gorev_tekrar === "G" ? "selected" : ""}>Günlük</option>
                                                <option value="Haftalık" ${task.gorev_tekrar === "H" ? "selected" : ""}>Haftalık</option>
                                                <option value="Aylık" ${task.gorev_tekrar === "A" ? "selected" : ""}>Aylık</option>
                                                <option value="Yıllık" ${task.gorev_tekrar === "Y" ? "selected" : ""}>Yıllık</option>
                                                <option value="Hafta İçi" ${task.gorev_tekrar === "HA" ? "selected" : ""}>Hafta İçi</option>
                                                <option value="Hafta Sonu" ${task.gorev_tekrar === "HS" ? "selected" : ""}>Hafta Sonu</option>
                                                <option value="Özel" ${task.gorev_tekrar.startsWith('OHA-') || task.gorev_tekrar.startsWith('OT-') ? "selected" : ""}>Özel</option>
                                            </select>
                                        </div>


                                        <!-- Altın -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- Altın İkonu -->
                                            <i class="fas fa-coins" style="color: gold; font-size: 20px;"></i>
                                            
                                            <!-- Altın Girişi -->
                                            <input type="number" class="form-control" id="taskGold" value="${task.gorev_altin}" min="0" max="100" style="width: 100px;">
                                        </div>

                                        <!-- TP -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- TP Yazısı -->
                                            <label for="taskTp" class="mb-0" style=" font-weight: bold;">TP:</label>
                                            
                                            <!-- TP Girişi -->
                                            <input type="number" class="form-control" id="taskTp" value="${task.gorev_tp}" min="0" max="100" style="width: 100px;">
                                        </div>

                                       <!-- Önem Derecesi -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- Önem Derecesi Yazısı -->
                                            <label for="taskOnemDerecesi" class="mb-0" style=" font-weight: bold;">Önem Derecesi:</label>
                                            
                                            <!-- Dinamik Renk Dairesi -->
                                            <div id="importanceIndicator" class="rounded-circle" style="width: 20px; height: 20px; margin-right: 10px;"></div>
                                            
                                            <!-- Önem Derecesi Seçimi -->
                                            <select class="form-select" id="taskOnemDerecesi" style="width: 120px;">
                                                <option value="Yüksek">Yüksek</option>
                                                <option value="Orta">Orta</option>
                                                <option value="Düşük">Düşük</option>
                                            </select>
                                        </div>

                                        <!-- Butonlar -->
                                        <div style="margin-top: 30px;">
                                            <button type="button" id="confirmEdit" class="btn btn-primary" style="margin-right: 10px;">Güncelle</button>
                                            <button type="button" id="cancelEdit" class="btn btn-secondary">İptal</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        `;

                        // Diyalog kutusunu sayfaya ekle
                        $('body').append(dialogHtml);

                        const initialValue = task.onem_derecesi;
                        updateImportanceIndicator(initialValue);
                        $('#taskOnemDerecesi').val(task.onem_derecesi);

                        // Seçenek değiştiğinde güncelleme işlemi
                        $('#taskOnemDerecesi').change(function() {
                            playSoundOption();

                            const selectedValue = $(this).val();
                            updateImportanceIndicator(selectedValue);
                        });    
                        
                        // Arama simgesine tıklama
                        $('#searchIconEdit').on('click', function () {
                            const $searchContainer = $('#searchContainerEdit');
                            $searchContainer.toggle(); // Görünürlüğü değiştirir
                        });

                        // Arama girişine yazı yazıldıkça ikonları filtreleme
                        $('#searchInputEdit').on('input', function () {
                            const query = $(this).val().toLowerCase();

                            // Filtreleme işlemi
                            const filteredIcons = icons.map(category => ({
                                title: category.title,
                                icons: category.icons.filter(icon => icon.includes(query))
                            })).filter(category => category.icons.length > 0);

                            // Güncellenmiş ikon listesi
                            const $iconSelection = $('#iconSelection');
                            $iconSelection.html(filteredIcons.map(category => `
                                <div class="icon-category" style="margin-bottom: 20px;">
                                    <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                        ${category.title}
                                    </h4>
                                    <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                        ${category.icons.map(icon => `
                                            <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                <i class="fas ${icon}" style="font-size: 20px; color: ${task.gorev_ikon_renk};"></i>
                                                <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                    ${icon.replace("fa-", "").replace("-", " ")}
                                                </span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join(''));
                        });

                        // Arama girişinin dışına tıklanınca gizleme
                        $(document).on('click', function (e) {
                            const $searchContainer = $('#searchContainerEdit');
                            if (!$(e.target).closest('#searchContainerEdit, #searchIconEdit').length) {
                                $searchContainer.hide(); // Giriş kutusunu gizle
                            }
                        });

                        // Kategorileri API'den çekme
                        $.ajax({
                            url: '/api/categories', // API endpoint
                            method: 'GET',
                            success: function(response) {
                                // API yanıtını kontrol et
                                if (response.success && Array.isArray(response.data)) {
                                    const categories = response.data; // 'data' kısmına erişiyoruz

                                    // Kategorileri menüye ekleme
                                    categories.forEach(function(category) {
                                        $('#taskCategory').append(`
                                            <option value="${category.category_name}" ${task.gorev_kategori === category.category_name ? 'selected' : ''}>
                                                ${category.category_name}
                                            </option>
                                        `);
                                    });
                                } else {
                                    console.error('Kategoriler beklenen formatta değil veya başarı durumu false:', response);
                                }
                            },
                            error: function(err) {
                                console.error('Kategoriler yüklenemedi.', err);
                            }
                        });

                        // İkon Seçimi: Başlangıçta task.gorev_ikon'a göre ikon seçili yapılacak
                        $('#iconSelection .icon-option').each(function() {
                            if ($(this).data('icon') === task.gorev_ikon) {
                                $(this).addClass('selected');

                               // $(this).css('border', '2px solid black'); // Seçilen ikonu vurgula
                            }
                        });

                        // Renk Seçimi: Başlangıçta task.gorev_ikon_renk'e göre renk seçili yapılacak
                        $('.color-circle').each(function() {
                            if ($(this).data('color') === task.gorev_ikon_renk) {
                                $(this).addClass('selected');
                                // Seçilen rengi ikona uygula
                                $('#iconSelection .fas').css('color', task.gorev_ikon_renk);
                            }
                        });
 
                        // Renk seçimi dinamik renk değişimi
                        $('.color-circle').on('click', function () {
                            playSoundOption();

                            const selectedColor = $(this).data('color');
                            
                            // Tüm renk dairelerinden 'selected' sınıfını kaldır
                            $('.color-circle').removeClass('selected');
                            
                            // Seçilen renk dairesine 'selected' sınıfını ekle
                            $(this).addClass('selected');

                            $('#iconSelection .fas').css('color', selectedColor);
                            task.gorev_ikon_renk = selectedColor;
                        });

                        // İkon seçimi
                        $('.icon-option').on('click', function () {
                            playSoundOption();
                            
                            task.gorev_ikon = $(this).data('icon');

                            // Tüm ikonlar üzerindeki 'selected' sınıfını kaldır
                            $('.icon-option').removeClass('selected');
                            
                            // Tıklanan ikona 'selected' sınıfını ekle
                            $(this).addClass('selected');
                            
                        });

                        var selectedDate=task.gorev_tarih;

                        // Takvim simgesine tıklandığında takvim diyalog penceresini açma
                        $('#calendarIcon').click(function() {
                            // Tarihi Türkçe formatına uygun şekilde güncelle
                            playSoundClick();

                            var formattedDate = new Date(task.gorev_tarih);
                            var day = formattedDate.getDate().toString().padStart(2, '0');
                            var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                            var year = formattedDate.getFullYear();
                            var formattedDateString = `${year}-${month}-${day}`; // YYYY-MM-DD formatı
                
                            // Ana formdaki tarih alanını güncelle
                            //$('#taskDate').val(formattedDateString);

                            // Takvim diyalog penceresini dinamik olarak oluştur
                            var calendarDialogHtml = `
                                <div id="calendarDialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                    <div style="background: white; padding: 20px; border-radius: 8px; width: 200px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        <h5 style="margin-bottom: 20px;">Tarih Seçin</h5>
                                        <input type="date" id="calendarInput" class="form-control" style="margin-bottom: 20px;">
                                        <div>
                                            <button type="button" id="confirmDate" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                            <button type="button" id="cancelDate" class="btn btn-secondary">İptal</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        
                            // Takvim diyalog penceresini body'ye ekle
                            $('body').append(calendarDialogHtml);
                        
                            // Takvim diyalog penceresini göster
                            $('#calendarDialog').fadeIn();

                            $('#calendarInput').val(task.gorev_tarih); // Bugünün tarihini YYYY-MM-DD formatında ayarla
                        
                            // Takvim diyalog penceresindeki "Onayla" butonuna tıklanınca tarih ana pencerede güncellenir
                            $('#confirmDate').click(function() {
                                playSoundClick();

                                selectedDate = $('#calendarInput').val();  // Takvimden seçilen tarihi al
                                if (selectedDate) {
                                    // Tarihi Türkçe formatına uygun şekilde güncelle
                                    var formattedDate = new Date(selectedDate);
                                    var day = formattedDate.getDate().toString().padStart(2, '0');
                                    var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                                    var year = formattedDate.getFullYear();
                                    var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl
                        
                                    // Ana formdaki tarih alanını güncelle
                                    $('#taskDate').val(formattedDateString);
                                }
                        
                                // Takvim diyalog penceresini kapat
                                $('#calendarDialog').fadeOut(function() {
                                    // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                                    $('#calendarDialog').remove();
                                });
                            });
                        
                            // Takvim diyalog penceresindeki "İptal" butonuna tıklanınca pencere kapanır
                            $('#cancelDate').click(function() {
                                playSoundClick();

                                $('#calendarDialog').fadeOut(function() {
                                    // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                                    $('#calendarDialog').remove();
                                });
                            });
                        });
                        
                        // "İptal" butonuna tıklanırsa takvim diyalog penceresini kapatma
                        $('#cancelDate').click(function() {
                            playSoundClick();

                            $('#calendarDialog').fadeOut();
                        });

                        // "Onayla" butonuna tıklanırsa tarih güncellenmesi
                        $('#confirmDate').click(function() {
                            playSoundClick();

                            const selectedDate = $('#calendarInput').val();
                            if (selectedDate) {
                                // Türkçe formata uygun tarih güncellemesi (gg.aa.yyyy formatı)
                                const formattedDate = new Date(selectedDate).toLocaleDateString('tr-TR');
                                $('#taskDate').val(formattedDate);
                                $('#calendarDialog').fadeOut();
                            }
                        });                       

                        // 'Özel' seçeneği seçildiğinde diyalog penceresini göster
                        $('#taskRepeat').on('change', function() {
                            if ($(this).val() === "Özel") {
                                showCustomDialog();
                            }
                        });

                        function showCustomDialog() {
                            // Diğer içerik, değerler gibi değişkenlerinize uygun şekilde
                            const dialogHtml = `
                                <div id="specialDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                    <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        <h5 style="font-weight: bold; margin-bottom: 10px;">ÖZEL GÜN BELİRLEME</h5>
                        
                                        <!-- Gün Sayısı ve Haftanın Günleri Seçenekleri (Her zaman üstte) -->
                                        <div class="mb-3">
                                            <input type="radio" name="repeatType" value="days" id="repeatDays" checked /> Gün Sayısı
                                            <input type="radio" name="repeatType" value="week" id="repeatWeek" /> Haftanın Günleri
                                        </div>
                        
                                        <!-- Sayı Seçimi -->
                                        <div class="mb-3" id="customRepeatDaysContainer" style="margin-bottom: 10px;">
                                            <label for="customRepeatDays">Gün Seçimi (2-6 arası):</label>
                                            <input type="number" id="customRepeatDays" min="2" max="6" style="width: 60px;" /> günde 1
                                        </div>
                        
                                        <!-- Haftanın Günleri Seçimi -->
                                        <div id="weekDaysContainer" style="display: none; margin-bottom: 10px;">
                                            <div>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="monday" /> Pazartesi
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="tuesday" /> Salı
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="wednesday" /> Çarşamba
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="thursday" /> Perşembe
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="friday" /> Cuma
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="saturday" /> Cumartesi
                                                </label>
                                                <label style="display: inline-flex; align-items: center;">
                                                    <input type="checkbox" id="sunday" /> Pazar
                                                </label>
                                            </div>
                                        </div>
                        
                                        <!-- Onayla ve İptal Butonları -->
                                        <div>
                                            <button type="button" id="confirmCustom" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                            <button type="button" id="cancelCustom" class="btn btn-secondary">İptal</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        
                            // Diğer içeriklerle birlikte diyalog penceresini ekleyin
                            $('body').append(dialogHtml);
                        
                            // Gün Sayısı ve Haftanın Günleri seçenekleri arasındaki değişiklikleri kontrol et
                            $('input[name="repeatType"]').on('change', function() {
                                if ($('#repeatDays').is(':checked')) {
                                    $('#weekDaysContainer').hide(); // Haftanın günleri kutusunu gizle
                                    $('#customRepeatDaysContainer').show(); // Gün sayısı kutusunu göster
                                } else if ($('#repeatWeek').is(':checked')) {
                                    $('#weekDaysContainer').show(); // Haftanın günleri kutusunu göster
                                    $('#customRepeatDaysContainer').hide(); // Gün sayısı kutusunu gizle
                                }
                            });
                        
                            // Onayla butonuna tıklama
                            $('#confirmCustom').on('click', function() {
                                let repeatValue = '';
                        
                                // Seçilen tür ve değer doğrultusunda taskRepeat değerini güncelle
                                if ($('#repeatDays').is(':checked')) {
                                    const repeatDays = $('#customRepeatDays').val();
                                    if (repeatDays) {
                                        repeatValue = `OT-${repeatDays}`;
                                    }
                                } else if ($('#repeatWeek').is(':checked')) {
                                    const selectedDays = [];
                                    const daysMap = {
                                        'monday': '1',
                                        'tuesday': '2',
                                        'wednesday': '3',
                                        'thursday': '4',
                                        'friday': '5',
                                        'saturday': '6',
                                        'sunday': '7'
                                    };
                        
                                    // Haftanın günleri seçilirse sayısal değerleri al
                                    $('#weekDaysContainer input[type="checkbox"]:checked').each(function() {
                                        const dayId = $(this).attr('id');
                                        if (daysMap[dayId]) {
                                            selectedDays.push(daysMap[dayId]);
                                        }
                                    });
                        
                                    // Seçilen günleri "OHA-" ile başlat ve sayısal değerleri ekle
                                    if (selectedDays.length) {
                                        repeatValue = `OHA-${selectedDays.join('')}`;
                                    }
                                }
                        
                                // 'taskRepeat' değerini güncelle ve diyalog penceresini kapat
                                //$('#taskRepeat').val(repeatValue);
                                ozel_gun = repeatValue;
                                $('#specialDialog').remove(); // Diyalog penceresini kapat
                            });
                        
                            // İptal butonuna tıklama, diyalog penceresini kapat
                            $('#cancelCustom').on('click', function() {
                                $('#specialDialog').remove(); // Diyalog penceresini kapat
                            });
                        }
                        

                        // Güncelle butonuna tıklama işlemi
                        $('#confirmEdit').on('click', async function () {
                            playSoundClick();

                            const description = $('#taskDescription').val().trim();
                            const details = $('#taskDetails').val().trim();
                            const iconClass = $('#iconSelection .icon-option.selected').data('icon') || 'default-icon'; // Seçilen ikonu al
                            const iconColor = $('#colorSelection .color-circle.selected').data('color') || '#000000'; // Seçilen rengi al
                            const category = $('#taskCategory').val().trim().replace(/\s+/g, ' '); // Güncellenen kategori adı
                            const date = selectedDate; // Seçilen tarih
                            const goldAmount = parseInt($('#taskGold').val() || "0", 10);
                            const tpAmount = parseInt($('#taskTp').val() || "0", 10);     
            
                            const repeatOption = $('#taskRepeat').val(); // Select öğesindeki seçili değeri al
                            let repeatOptionText = $('#taskRepeat').val();
                            
                            switch (repeatOption) {
                                case "Tekrar Etme":
                                    repeatOptionText = "1";
                                    break;
                                case "Günlük":
                                    repeatOptionText = "G";
                                    break;
                                case "Haftalık":
                                    repeatOptionText = "H";
                                    break;
                                case "Aylık":
                                    repeatOptionText = "A";
                                    break;
                                case "Yıllık":
                                    repeatOptionText = "Y";
                                    break;
                                case "Hafta İçi":
                                    repeatOptionText = "HA";
                                    break;
                                case "Hafta Sonu":
                                    repeatOptionText = "HS";
                                    break;
                                case "Özel":
                                    repeatOptionText =ozel_gun;
                                    break;
                                default:
                                    repeatOptionText = "";
                            }
                          
                            // Güncellenen veriler JSON formatında
                            const taskData = JSON.stringify({
                                gorev_ikon: iconClass,
                                gorev_ikon_renk: iconColor,
                                gorev_tanimi: description,
                                gorev_aciklama: details,
                                gorev_tarih: date,
                                gorev_kategori: category,
                                gorev_tp: tpAmount,
                                gorev_altin: goldAmount,
                                gorev_yapildimi: false,
                                gorev_durumu: "",
                                gorev_tekrar: repeatOptionText,
                                onem_derecesi: $('#taskOnemDerecesi').val(),
                                gorev_tamamlanma_tarihi: ""
                            });

                            // Boş bırakma kontrolü
                            if (!description) {
                                alert("Görev tanımı boş bırakılamaz!");
                                return;
                            }

                            /* const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                            if (!response.ok) throw new Error(`Silme hatası: ${response.status}`);
                            taskCard.remove(); // Görevi kaldır */

                            $.ajax({
                                url: `/api/tasks/${taskId}`, // Görev ID'sine uygun endpoint
                                type: 'PUT',
                                contentType: 'application/json',
                                data: taskData,
                                success: function (response) {
                                    if (response.success) {
                                        alert("Görev başarıyla güncellendi!");
                                        $('#editDialog').remove();
                                        // Görev listesini yeniden yüklemek için gerekli kodlar
                                    }
                                },
                                error: function (xhr) {
                                    const errorResponse = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu";
                                    alert("Görev güncellenirken bir hata oluştu: " + errorResponse);
                                }
                            });

                            fetchTasks();
                            

                        });
                    
                        // İptal butonuna tıklama işlemi
                        $('#cancelEdit').on('click', function () {
                            playSoundClick();

                            $('#editDialog').remove(); // Sadece diyalog kutusunu kaldır
                        });
                    } else {

                        alert("Görev bulunamadı!");
                    }
                },
                error: function (xhr, status, error) {
                    alert("Görev verileri alınırken bir hata oluştu: " + error);
                }
                
            });
       
        });       

    }
    
    // Kategori Butonu Fonksiyonu
    async function categoriesFunction() {
        $('#tasksContainer').html(''); // Önce mevcut içeriği temizle
        $('#tasksContainer').removeAttr('style');

        // Kategorileri sunucudan çek
        const categories = await fetch('/api/categories') // '/categories' yerine '/api/categories' kullanıyoruz.
        .then(res => res.json()) // JSON formatında veri al
        .then(json => {
            if (json.success) {
                return json.data; // 'data' alanını ayıkla ve döndür
            } else {
                console.error('Kategoriler yüklenemedi:', json.error);
                return [];
            }
        })
        .catch(err => {
            console.error('Kategoriler yüklenemedi:', err);
            return [];
        });   

        // Kategori sayısını göster
        const categoryCount = categories.length;
        const categoryHeader = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 16px;">Kategori Sayısı: <strong>${categoryCount}</strong></span>
                <button id="addCategoryBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Yeni Kategori
                </button>
            </div>
        `;
        $('#tasksContainer').append(categoryHeader);

        // Kategorileri grid düzeninde göstermek için bir container ekle
        const categoryGrid = `
            <div class="category-grid" 
                style="
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                    gap: 20px;
                    margin-top: 10px;
                    max-height: 550px; /* İhtiyaca göre yüksekliği ayarlayın */
                    overflow-y: auto;
                    padding-right: 10px;
                ">
            </div>`;
        $('#tasksContainer').append(categoryGrid);

        // Kategorileri DOM'a ekle
        categories.forEach(category => {
            const categoryCard = `
                <div class="category-card" data-id="${category.id}" 
                    style="
                        border: 1px solid #ddd; 
                        padding: 15px; 
                        border-radius: 5px; 
                        box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
                        background-color: #fff;
                        display: flex; 
                        flex-direction: column; 
                        justify-content: space-between;
                        position: relative; /* Relative positioning for alignment */
                    ">
                    <div style="text-align: left;">
                        <div class="category-title" style="font-size: 16px; font-weight: bold;">${category.category_name}</div>
                        <div class="category-level" style="font-size: 14px; color: #666;">
                            <strong>Seviye:</strong> ${category.category_level}
                        </div>
                        <div class="category-tp" style="font-size: 14px; color: #666;">
                            <strong>TP:</strong> ${category.category_tp}
                        </div>
                    </div>
                    <div class="category-actions" 
                        style="
                            display: flex; 
                            justify-content: flex-end; 
                            align-items: center; 
                            margin-top: auto; /* Push to bottom */
                        ">
                        <button class="btn btn-sm btn-danger delete-btn" data-category-id="${category.id}" 
                            style="margin-right: 10px;">
                            <i class="fas fa-trash"></i> <!-- Çöp kutusu ikonu -->
                        </button>
                        <button class="btn btn-sm btn-primary edit-btn" data-category-id="${category.id}">
                            <i class="fas fa-pencil-alt"></i> <!-- Kalem ikonu -->
                        </button>
                    </div>
                </div>
            `;
            $('.category-grid').append(categoryCard);
        });

        // Çöp kutusuna tıklanması durumunda kategori kartını sil
        $('.delete-btn').click(function () {
            playSoundClick();

            const categoryId = $(this).closest('.category-card').data('id'); // Kategori ID'sini al
        
            // Diyalog penceresini oluştur
            const confirmationDialog = `
                <div class="confirmation-dialog" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
                    <div class="dialog-box" style="background: #fff; padding: 20px; border-radius: 5px; width: 300px; text-align: center;">
                        <p>Bu kategori silinecek. Emin misiniz?</p>
                        <button class="btn btn-danger confirm-delete">Tamam</button>
                        <button class="btn btn-secondary cancel-delete">İptal</button>
                    </div>
                </div>
            `;
        
            // Diyalog penceresini ekle
            $('body').append(confirmationDialog);
        
            // "Tamam" butonuna basıldığında kategori silme işlemi
            $('.confirm-delete').click(async function () {
                playSoundClick();

                try {
                    const response = await fetch('/api/categories', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: categoryId }),  // Silinecek kategori ID'sini gönder
                    });
        
                    if (response.ok) {
                        // Kategori başarıyla silindi, DOM'dan kaldır
                        $(this).closest('.category-card').remove();
                        $(this).closest('.confirmation-dialog').remove(); // Diyaloğu kaldır
                        console.log('Kategori başarıyla silindi');
                        categoriesFunction(); // Kategori sayısını güncelle
                    } else {
                        const errorData = await response.json();
                        console.error('Kategori silinirken hata oluştu:', errorData.error);
                        $(this).closest('.confirmation-dialog').remove(); // Diyaloğu kaldır
                        alert('Kategori silinirken bir hata oluştu: ' + errorData.error);
                    }
                } catch (error) {
                    console.error('Bir hata oluştu:', error);
                    $(this).closest('.confirmation-dialog').remove(); // Diyaloğu kaldır
                    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
                }
            });
        
            // "İptal" butonuna basıldığında diyaloğu kapatma
            $('.cancel-delete').click(function () {
                playSoundClick();

                $(this).closest('.confirmation-dialog').remove();
            });
        });
        
        // Kalem simgesine tıklanması durumunda kategori adı düzenleme diyalogu aç
        $('.edit-btn').click(function () {
            playSoundClick();

            const categoryId = $(this).closest('.category-card').data('id'); // Kategori ID'sini al
            const currentCategoryName = $(this).closest('.category-card').find('.category-title').text();

            // Eski diyalogları kaldır
            $('#editDialog').remove();

            // Düzenleme diyaloğunu oluştur
            const dialogHTML = `
                <div id="editDialog" style="display: block; background-color: rgba(0, 0, 0, 0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
                    <div style="background-color: #fff; width: 300px; margin: 100px auto; padding: 20px; border-radius: 5px; text-align: center;">
                        <div>
                            <label for="categoryName">Kategori Adı:</label>
                            <input type="text" id="categoryName" value="${currentCategoryName}" style="width: 100%; margin-top: 10px; padding: 5px;">
                        </div>
                        <div style="margin-top: 15px;">
                            <button id="confirmEdit" class="btn btn-success" disabled>Onayla</button>
                            <button id="cancelEdit" class="btn btn-secondary" style="margin-left: 10px;">İptal</button>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(dialogHTML);

            // "Onayla" butonunu etkinleştir ve kategori adı düzenle
            $('#categoryName').on('input', function () {
                const newCategoryName = $(this).val();
                $('#confirmEdit').prop('disabled', newCategoryName.trim() === currentCategoryName.trim() || newCategoryName.trim() === '');
            });

            // "Onayla" butonuna basıldığında güncellemeleri yap
            $('#confirmEdit').click(async function () {
                playSoundClick();

                const newCategoryName = $('#categoryName').val().trim();

                // Aynı kategori adı olup olmadığını kontrol et
                const isDuplicate = categories.some(category => category.category_name.trim() === newCategoryName);
                if (isDuplicate) {
                    alert('Bu kategori adı zaten mevcut.');
                    return;
                }

                // PUT isteği ile güncelle
                try {
                    const response = await fetch('/api/categories', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: categoryId,
                            category_name: newCategoryName,
                            category_level : 0,
                            category_tp : 0
                        }),
                    });

                    if (response.ok) {
                        $('#editDialog').remove(); // Diyalog penceresini kapat
                        await categoriesFunction(); // DOM'u yeniden yükle
                        console.log('Kategori adı başarıyla güncellendi');
                    } else {
                        const errorData = await response.json();
                        console.error('Kategori adı güncellenirken hata oluştu:', errorData.error);
                        alert('Kategori adı güncellenirken hata oluştu: ' + errorData.error);
                    }
                } catch (error) {
                    console.error('Sunucuyla iletişim sırasında hata:', error);
                    alert('Sunucuyla iletişim sırasında bir hata oluştu. Lütfen tekrar deneyin.');
                }

            });

            // "İptal" butonuna basıldığında diyalog penceresini kapat
            $('#cancelEdit').click(function () {
                playSoundClick();

                $('#editDialog').remove();
            });
        });

        // Kategori ekleme butonuna tıklanması
        $('#addCategoryBtn').click(function () {
            playSoundClick();

            const addCategoryDialog = `
                <div id="addCategoryDialog" style="display: block; background-color: rgba(0, 0, 0, 0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
                    <div style="background-color: #fff; width: 300px; margin: 100px auto; padding: 20px; border-radius: 5px; text-align: center;">
                        <div>
                            <label for="newCategoryName">Yeni Kategori Adı:</label>
                            <input type="text" id="newCategoryName" style="width: 100%; margin-top: 10px; padding: 5px;">
                        </div>
                        <div style="margin-top: 15px;">
                            <button id="confirmAdd" class="btn btn-success" disabled>Onayla</button>
                            <button id="cancelAdd" class="btn btn-secondary" style="margin-left: 10px;">İptal</button>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(addCategoryDialog);

            // "Onayla" butonunu etkinleştir ve kategori adı ekle
            $('#newCategoryName').on('input', function () {
                const newCategoryName = $('#newCategoryName').val();
                const isDuplicate = categories.some(category => category.category_name === newCategoryName);
            
                if (newCategoryName && !isDuplicate) {
                    $('#confirmAdd').prop('disabled', false);
                } else {
                    $('#confirmAdd').prop('disabled', true);
                }
            });
            
            // "Onayla" butonuna basıldığında kategori ekleme
            $('#confirmAdd').click(async function () {
                playSoundClick();

                const newCategoryName = $('#newCategoryName').val();
                const newCategoryLevel = 0; // Yeni kategori seviyesi alınıyor
                const newCategoryType = 0; // Yeni kategori tipi alınıyor
            
                // API'ye gönderilecek veri
                const newCategory = {
                    category_name: newCategoryName,
                    category_level: newCategoryLevel, // Varsayılan değer
                    category_tp: newCategoryType, // Varsayılan değer
                };
            
                try {

                    // API'ye kategori eklemek için POST isteği gönderme
                    const response = await fetch('/api/categories', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newCategory),
                    });
                
                    if (response.ok) {
                        $('#addCategoryDialog').remove(); // Diyaloğu kapat
                        await categoriesFunction(); // Kategorileri yeniden yükle
                        console.log('Kategori başarıyla eklendi');
                    } else {
                        const errorData = await response.json();
                        console.error('Kategori eklenirken hata oluştu:', errorData.error);
                        alert('Kategori eklenirken hata oluştu: ' + errorData.error);
                    }
                    
                } catch (error) {
                    console.error('Sunucuyla iletişim sırasında hata:', error);
                    alert('Sunucuyla iletişim sırasında bir hata oluştu. Lütfen tekrar deneyin.');
                }

            });
            

            // "İptal" butonuna basıldığında diyalog penceresini kapat
            $('#cancelAdd').click(function () {
                playSoundClick();

                $('#addCategoryDialog').remove();
            });
        });
    }

    // Market Butonu Fonksiyonu
    async function marketFunction() {

        $('#tasksContainer').html('');
        $('#tasksContainer').removeAttr('style');

    
        // Ürünleri sunucudan çek
        const products = await fetch('/api/products')
        .then(res => res.json()) // JSON formatında veri al
        .then(json => {
            if (json.success) {
                return json.data; // 'data' alanını ayıkla
            } else {
                console.error('Ürünler alınırken bir hata oluştu:', json.error);
                return [];
            }
        })
        .catch(err => {
            console.error('Ürünler yüklenemedi:', err);
            return [];
        });   
        
        // Ürün sayısını göster
        const productCount = products.length;
        let product_ikon_renk='black';
 
        const productHeader = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 16px;">Ürün Sayısı: <strong>${productCount}</strong></span>
                <button id="addProductBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Yeni Ürün
                </button>
            </div>
        `;
        $('#tasksContainer').append(productHeader);
    
        // Ürünleri grid düzeninde göstermek için bir container ekle
        const productGrid = `
            <div class="product-grid" 
                style="
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                    gap: 20px;
                    margin-top: 10px;
                    max-height: 550px; /* İhtiyaca göre yüksekliği ayarlayın */
                    overflow-y: auto;
                    padding-right: 10px;
                ">
            </div>`;
        $('#tasksContainer').append(productGrid);
    
        // Ürünleri DOM'a ekle
        products.forEach(product => {
       
            const productCard = `
                <div class="product-card" data-id="${product.id}" 
                 data-color="${product.color}"  data-icon="${product.icon}"
                  data-name="${product.name}"  data-price="${product.price}"
                   data-stock="${product.stock}"
                    style="
                        border: 1px solid #ddd; 
                        padding: 15px; 
                        border-radius: 5px; 
                        box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
                        background-color: #fff;
                        display: flex; 
                        flex-direction: column; 
                        justify-content: space-between;
                        position: relative; /* Relative positioning for alignment */
                    ">
                    <!-- Product Icon and Color -->
                    <div class="product-icon" 
                        style="
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            font-size: 20px;
                            color: ${product.product_color};
                        ">
                        <i class="fas ${product.product_icon || ''}"></i>
                    </div>
        
                    <div style="text-align: left;">
                        <div class="product-title" style="font-size: 16px; font-weight: bold;">${product.product_name}</div>
                        <div class="product-price" style="font-size: 14px; color: #666; display: flex; align-items: center;">
                            <strong style="margin-right: 5px;">Fiyat:</strong>
                            <i class="fas fa-coins" style="color: gold; margin-right: 5px;"></i> 
                            ${product.product_price}
                        </div>
                        <div class="product-stock" style="font-size: 14px; color: #666;">
                            <strong>Stok:</strong> ${product.product_stock}
                        </div>
                    </div>
        
                    <div class="product-actions" 
                        style="
                            display: flex; 
                            justify-content: flex-end; 
                            align-items: center; 
                            margin-top: auto; /* Push to bottom */
                        ">
                        <button class="btn btn-sm btn-success buy-btn" 
                            data-product-id="${product.id}" 
                            data-product-icon="${product.product_icon}" 
                            data-product-color="${product.product_color}" 
                            data-product-name="${product.product_name}" 
                            data-product-price="${product.product_price}"
                            style="margin-right: 10px;">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-product-id="${product.id}" 
                            style="margin-right: 10px;">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-primary edit-btn" data-product-id="${product.id}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            $('.product-grid').append(productCard);
        });
               
        // Yeni ürün ekleme butonu için event listener
        $('#addProductBtn').on('click', () => {
            playSoundClick();
                  
            const dialogHTML = `
                <div id="addProductDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 80%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h5 style="margin-bottom: 20px; font-weight: bold;">Yeni Ürün Ekle</h5>
                        <form id="addProductForm">
                            <!-- Renk Seçimi -->
                            <div>
                                <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                    ${colors.map((color, index) => `
                                        <div class="color-circle" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                        ${((index + 1) % 7 === 0) ? '<div style="flex-basis: 100%; height: 0; margin-bottom: 15px;"></div>' : ''}
                                    `).join('')}
                                </div>
                            </div>

                            <!-- İkon Seçimi -->
                            <div class="mb-3">
                                <label for="iconSelection" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                    İkon Seçimi:
                                    <i class="fas fa-search" id="searchIconAdd" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                    <div id="searchContainerAdd" style="display: none; margin-left: 10px;">
                                        <input type="text" id="searchInputAdd" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                    </div>
                                </label>
                                <div id="iconSelection" style="margin-top: 10px;">
                                    ${icons.map(category => `
                                        <div class="icon-category" style="margin-bottom: 20px;">
                                            <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                ${category.title}
                                            </h4>
                                            <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                ${category.icons.map(icon => `
                                                    <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                        <i class="fas ${icon}" style="font-size: 20px; color: ${product_ikon_renk};"></i>
                                                        <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                            ${icon.replace("fa-", "").replace("-", " ")}
                                                        </span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="productNameInput" style=" font-weight: bold;">Ürün Adı:</label>
                                <input type="text" id="productNameInput" class="form-control" placeholder="Ürün adı girin" autocomplete="off">
                            </div>

                            <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 10px;">
                                <div style="display: flex; align-items: center; margin-left:12px; margin-bottom: 5px;">
                                    <i class="fas fa-coins" style="font-size: 24px; color: gold;"></i>
                                    <input type="number" id="productPriceInput" class="form-control" min="0" placeholder="0" style="width: 150px; margin-left: 10px;">
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <label style="margin-right: 10px; font-weight: bold;">Stok:</label>
                                    <input type="number" id="productStockInput" class="form-control" min="0" placeholder="0" style="width: 150px;">
                                </div>
                            </div>

                            <div>
                                <button type="button" id="addProductConfirmBtn" class="btn btn-primary" disabled>Ekle</button>
                                <button type="button" id="cancelProductBtn" class="btn btn-secondary">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        
            $('body').append(dialogHTML);
        
            let selectedColor = null;
            let selectedIcon = null;
        
            $('.color-circle').on('click', function () {
                $('.color-circle').removeClass('selected');
                $(this).addClass('selected');
                selectedColor = $(this).data('color');
                
                // Change icon color to selected color
                $('.icon-option i').each(function () {
                    $(this).css('color', selectedColor);
                });
            });
        
            $('.icon-option').on('click', function () {
                $('.icon-option').removeClass('selected');
                $(this).addClass('selected');
                selectedIcon = $(this).data('icon');
            });

             // Arama simgesine tıklama
             $('#searchIconMarketAdd').on('click', function () {
                const $searchContainer = $('#searchContainerMarketAdd');
                $searchContainer.toggle(); // Görünürlüğü değiştirir
            });

            // Arama girişine yazı yazıldıkça ikonları filtreleme
            $('#searchInputMarketAdd').on('input', function () {
                const query = $(this).val().toLowerCase();

                // Filtreleme işlemi
                const filteredIcons = icons.map(category => ({
                    title: category.title,
                    icons: category.icons.filter(icon => icon.includes(query))
                })).filter(category => category.icons.length > 0);

                // Güncellenmiş ikon listesi
                const $iconSelection = $('#iconSelection');
                $iconSelection.html(filteredIcons.map(category => `
                    <div class="icon-category" style="margin-bottom: 20px;">
                        <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                            ${category.title}
                        </h4>
                        <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                            ${category.icons.map(icon => `
                                <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                    <i class="fas ${icon}" style="font-size: 20px; color: ${gorev_ikon_renk};"></i>
                                    <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                        ${icon.replace("fa-", "").replace("-", " ")}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join(''));
            });

            // Arama girişinin dışına tıklanınca gizleme
            $(document).on('click', function (e) {
                const $searchContainer = $('#searchContainerMarketAdd');
                if (!$(e.target).closest('#searchContainerMarketAdd, #searchIconMarketAdd').length) {
                    $searchContainer.hide(); // Giriş kutusunu gizle
                }
            });

            function updateButtonState() {
                const productName = $('#productNameInput').val().trim();
                $('#addProductConfirmBtn').prop('disabled', productName === '' || !selectedColor || !selectedIcon);
            }
        
            $('#productNameInput').on('input', function () {
                updateButtonState();
            });
        
            $('#addProductConfirmBtn').on('click', async () => {
                playSoundClick();
            
                const productName = $('#productNameInput').val().trim();
                const productPrice = parseFloat($('#productPriceInput').val());
                const productStock = parseInt($('#productStockInput').val(), 10);
                
                // Zorunlu alanları kontrol et
                if (!productName || isNaN(productPrice) || isNaN(productStock)) {
                    alert('Ürün adı, fiyat ve stok zorunludur.');
                    return;
                }
            
                const newProduct = {
                    product_icon: selectedIcon,
                    product_color: selectedColor,
                    product_name: productName,
                    product_price: productPrice || 0, // Fiyat zorunlu, 0 olarak atanabilir
                    product_stock: productStock || 0, // Stok zorunlu, 0 olarak atanabilir
                    product_date: new Date().toISOString().split('T')[0] // Bugünün tarihi
                };
            
                try {
                    // API'ye POST isteği gönderme
                    const response = await fetch('/api/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newProduct)
                    });
            
                    const data = await response.json();
            
                    if (response.ok) {
                        // Ürün başarıyla eklendi
                        $('#addProductDialog').remove(); // Diyalog penceresini kapat
                        alert('Ürün başarıyla eklendi!');
                        marketFunction(); // Ürünleri yeniden yükle
                    } else {
                        // Hata mesajı göster
                        alert(data.error || 'Ürün eklenirken bir hata oluştu.');
                    }
                } catch (error) {
                    console.error('Ürün eklenirken hata oluştu:', error);
                    alert('Ürün eklenirken bir hata oluştu.');
                }
            });           
        
            $('#cancelProductBtn').on('click', () => {
                playSoundClick();

                $('#addProductDialog').remove();
            });
        });
        
        // Satın alma butonu için event listener ekle
        $('.buy-btn').on('click', function () {
            playSoundClick();
        
            const productId = $(this).data('product-id');
            const productPrice = parseInt($(this).data('product-price'));
            const productIcon = $(this).data('product-icon');
            const productColor = $(this).data('product-color');
            const productName = $(this).data('product-name');
            
            const productCard = $(this).closest('.product-card');
            let productStock = parseInt(productCard.find('.product-stock').text().match(/\d+/)); // Ürün stokunu çıkar
        
            // Altın kontrolü
            if (usergold < productPrice) {
                alert("Yeterli altınınız yok! Biraz görevleri yerine getirin!");
                return;
            }
        
            // Stok kontrolü
            if (productStock <= 0) {
                alert("Ürün tükenmiş!");
                return;
            }
        
            // Satın alma işlemi
            $.ajax({
                url: '/api/products',
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: productId,
                    product_icon: productIcon,
                    product_color: productColor,
                    product_name: productName,
                    product_price: productPrice,
                    product_stock: productStock - 1, // Stok bir azaltılıyor
                    product_date: new Date().toISOString().split('T')[0] // Güncel tarih
                }),
                success: function (data) {
                    if (data.error) {
                        alert(data.error); // API'den gelen hata mesajı
                        return;
                    }
        
                    playSoundBuy();
        
                    // Satın alma başarılıysa altın güncelle
                    usergold -= productPrice;
        
                    // Veriler güncelleniyor
                    updateUserData();
        
                    $(".usergold").text(usergold);
        
                    // Kullanıcıya yeni altın miktarını göster
                    alert(`Ürün başarıyla satın alındı! Kalan Altın: ${usergold}`);
        
                    // Stok güncelle veya kartı kaldır
                    if (productStock > 1) {
                        // Stok azalt
                        productCard.find('.product-stock').text(`Stok: ${productStock - 1}`);
                    } else {
                        // Stok 0 ise kartı kaldır
                        productCard.remove();
                    }
                },
                error: function (error) {
                    console.error('Satın alma sırasında hata:', error);
                    alert('Satın alma işlemi başarısız oldu, lütfen tekrar deneyin.');
                }
            });
        });        

        // Silme butonu için event listener ekle
        $('.delete-btn').on('click', function () {
            const productId = $(this).data('product-id');
        
            // Diyalog penceresi oluştur
            const dialogHtml = `
                <div class="custom-dialog">
                    <div class="dialog-content">
                        <p>Bu ürün silinecektir. Emin misiniz?</p>
                        <div class="dialog-buttons">
                            <button class="btn btn-danger confirm-delete">Onayla</button>
                            <button class="btn btn-secondary cancel-delete">İptal</button>
                        </div>
                    </div>
                </div>
            `;
        
            // Diyalog penceresini body'ye ekle
            $('body').append(dialogHtml);
        
            // CSS ile diyalog penceresini stilize et
            $('.custom-dialog').css({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            });
        
            $('.dialog-content').css({
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                width: '300px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            });
        
            $('.dialog-buttons').css({
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-around'
            });
        
            // Onayla butonuna tıklandığında silme işlemini gerçekleştir
            $('.confirm-delete').on('click', function () {
                $.ajax({
                    url: '/api/products',
                    method: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: productId }),
                    success: function (data) {
                        if (data.success) {
                            console.log(`Ürün silindi: ID ${productId}`);
                            alert('Ürün başarıyla silindi!');
                            marketFunction(); // Listeyi yenile
                        } else {
                            alert(data.error || 'Silme işlemi başarısız oldu.');
                        }
                    },
                    error: function (err) {
                        console.error('Ürün silinirken hata oluştu:', err);
                        alert('Silme işlemi sırasında bir hata oluştu.');
                    },
                    complete: function () {
                        $('.custom-dialog').remove(); // Diyalog penceresini kapat
                    }
                });
            });
        
            // İptal butonuna tıklandığında diyalog penceresini kapat
            $('.cancel-delete').on('click', function () {
                $('.custom-dialog').remove();
            });
        
        });
        
        // Düzenleme butonu için event listener ekle
        $('.edit-btn').on('click', function () {
            playSoundClick();         
        
            const productCard = $(this).closest('.product-card');
            const productId = productCard.data('id');
        
            let product;
            let selectedColor;
            let selectedIcon;
           
            $.ajax({
                url: `/api/products`, // Tüm ürünleri almak için endpoint
                type: 'GET',
                success: function (response) {
                    const products = response.data;
        
                    product = products.find(t => t.id === productId);
                  
                    if (product) {
               
                        // Eski diyalogları kaldır
                        $('#editProductDialog').remove();
                
                        const dialogHTML = `
                        <div id="editProductDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                            <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 80%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <h5 style="margin-bottom: 20px; font-weight: bold;">Ürün Güncelle</h5>
                                <form id="editProductForm">
        
                                     <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                    <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                        ${colors.map((color, index) => `
                                            <div class="color-circle ${color === product.product_color ? 'selected' : ''}" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                            ${((index + 1) % 7 === 0) ? '<div style="flex-basis: 100%; height: 0; margin-bottom: 15px;"></div>' : ''}
                                        `).join('')}
                                    </div>
        
                                     <!-- İkon Seçimi -->
                                    <div class="mb-3">
                                        <label for="iconSelection" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                            İkon Seçimi:
                                            <i class="fas fa-search" id="searchIconEdit" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                            <div id="searchContainerEdit" style="display: none; margin-left: 10px;">
                                                <input type="text" id="searchInputEdit" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                            </div>
                                        </label>
                                        <div id="iconSelection" style="margin-top: 10px;">
                                            ${icons.map(category => `
                                                <div class="icon-category" style="margin-bottom: 20px;">
                                                    <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                        ${category.title}
                                                    </h4>
                                                    <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                        ${category.icons.map(icon => `
                                                            <div class="icon-option ${icon === product.product_icon ? 'selected' : ''}" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                                <i class="fas ${icon}" style="font-size: 20px; color: ${product.product_color};"></i>
                                                                <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                                    ${icon.replace("fa-", "").replace("-", " ")}
                                                                </span>
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
        
                                    <div class="mb-3">
                                        <label for="productNameInput" class="form-label" style=" font-weight: bold;">Ürün Adı:</label>
                                        <input type="text" id="productNameInput" class="form-control" value="${product.product_name}" autocomplete="off">
                                    </div>
                                    <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 10px;">
                                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                            <i class="fas fa-coins" style="font-size: 24px; color: gold;"></i>
                                            <input type="number" id="productPriceInput" class="form-control" min="0" value="${product.product_price}" style="width: 150px; margin-left: 10px;">
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                            <label style="margin-right: 10px; font-weight: bold;">Stok:</label>
                                            <input type="number" id="productStockInput" class="form-control" min="0" value="${product.product_stock}" style="width: 150px;">
                                        </div>
                                    </div>
                                    <div>
                                        <button type="button" id="updateProductBtn" class="btn btn-primary" disabled>Güncelle</button>
                                        <button type="button" id="cancelEditBtn" class="btn btn-secondary">İptal</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    `;
        
                        $('body').append(dialogHTML);
        
                        selectedColor = product.product_color;
                        selectedIcon = product.product_icon;
            
                        $('.icon-option').each(function() {
                            if ($(this).data('icon') === product.product_icon) {
                                $(this).addClass('selected');
                            }
                        });
            
                        $('.color-circle').each(function() {
                            if ($(this).data('color') === product.product_color) {
                                $(this).addClass('selected');
                                $('#iconSelection .fas').css('color', product.product_color);
                            }
                        });
            
                        $('.color-circle').on('click', function () {
                            playSoundOption();
        
                            selectedColor = $(this).data('color');
        
                            $('.color-circle').removeClass('selected');
                            $(this).addClass('selected');
                            
                            $('.icon-option i').css('color', selectedColor);
                            validateUpdateForm();
                        });
            
                        $('.icon-option').on('click', function () {
                            playSoundOption();
        
                            product.product_icon=$(this).data('icon');
        
                            $('.icon-option').removeClass('selected');
                            $(this).addClass('selected');
        
                            selectedIcon = $(this).data('icon');
                            validateUpdateForm();
                        });
            
                        $('#productNameInput, #productPriceInput, #productStockInput').on('input', validateUpdateForm);
            
                        function validateUpdateForm() {
                            const productName = $('#productNameInput').val().trim();
                            const productPrice = parseFloat($('#productPriceInput').val()) || 0;
                            const productStock = parseInt($('#productStockInput').val(), 10) || 0;
                        
                            // Değişiklikleri kontrol et
                            const isModified = 
                                selectedIcon !== product.product_icon || 
                                selectedColor !== product.product_color || 
                                productPrice !== product.product_price || 
                                productStock !== product.product_stock;
                        
                            // Geçerli form durumu kontrolü
                            const isValid = 
                                productName && 
                                productStock > 0 && 
                                selectedColor && 
                                selectedIcon;
                        
                            // Butonu aktif/pasif yap
                            $('#updateProductBtn').prop('disabled', !(isModified && isValid));
                        }
            
                        $('#updateProductBtn').on('click', function () {
                            const updatedProduct = {
                                id: productId,
                                product_icon: selectedIcon,
                                product_color: selectedColor,
                                product_name: $('#productNameInput').val().trim(),
                                product_price: parseFloat($('#productPriceInput').val()) || 0,
                                product_stock: parseInt($('#productStockInput').val(), 10) || 0,
                                product_date: new Date().toISOString().split('T')[0]
                            };
            
                            $.ajax({
                                url: '/api/products', // Güncelleme işlemi
                                type: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify(updatedProduct),
                                success: function(data) {
                                    if (data.error) {
                                        alert(data.error);
                                    } else {
                                        $('#editProductDialog').remove();
                                        alert('Ürün başarıyla güncellendi!');
                                        marketFunction(); // Sayfa içeriğini yenileyebilirsiniz
                                    }
                                },
                                error: function(xhr, status, error) {
                                    alert("Ürün güncellenirken bir hata oluştu: " + error);
                                }
                            });
                        });
            
                        $('#cancelEditBtn').on('click', function () {
                            $('#editProductDialog').remove();
                        });
        
                    } else {
                        alert("Ürün bulunamadı!");
                    }
                },
                error: function (xhr, status, error) {
                    alert("Ürün verileri alınırken bir hata oluştu: " + error);
                }
        
            });
        });
        
    }   

    // Takvim Butonu Fonksiyonu
    function calendarFunction() {
        $('#tasksContainer').removeAttr('style');

        $.datepicker.regional['tr'] = {
            closeText: 'Kapat',
            prevText: '&#x3C;geri',
            nextText: 'ileri&#x3E;',
            currentText: 'Bugün',
            monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
                'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
            dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
            dayNamesShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
            dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
            weekHeader: 'Hf',
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.setDefaults($.datepicker.regional['tr']);
    
        // Takvim ve görevler için bölümleri oluştur
        const $calendarContainer = $('<div id="calendarContainer" class="mb-3" style="display: flex; flex-direction: row; justify-content: flex-start; align-items: start;">');
        const $taskListContainer = $('<div id="taskListContainer" style="height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;"></div>');
    
        $('#tasksContainer').html('').append($calendarContainer, $taskListContainer);

        // Takvimi oluştur
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];

        // Takvimi oluştur
        const $calendar = $('<div id="calendar"></div>');
        $calendarContainer.append($calendar);

        if (!selectedDate) {
            selectedDate = todayDate;    
        }
        
        // Varsayılan olarak bugünü seç
        //$calendar.datepicker('setDate', today);
    
        // Görevleri varsayılan olarak bugünkü filtreyle yükle
        loadTasks(selectedDate);
    
        // Tüm görevler için görev tarihlerini işaretle
        markCalendarDates();

        function formatDateToYYYYMMDD(date) {
            if (!(date instanceof Date)) {
                console.error("Geçersiz tarih nesnesi:", date);
                return null;
            }
        
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1
            const day = date.getDate().toString().padStart(2, '0');
        
            return `${year}-${month}-${day}`;
        }
    
        // Takvimde görevlerin olduğu tarihleri işaretleme
        function markCalendarDates() {
            $.ajax({
                url: '/api/tasks',
                type: 'GET',
                data: { 
                    filter: 'all', // Tüm görevleri çekmek için 'all' filtresi kullanılıyor
                    search: '', // Arama parametresi (isteğe bağlı)
                    sort: 'date-asc' // Tarihe göre sıralama
                },
                success: function (tasks) {
                    const dateTaskCount = {};
        
                    // Görevlerin tarihlerini topla
                    tasks.forEach(task => {
                        const taskDate = new Date(task.gorev_tarih).toISOString().split('T')[0];
                        dateTaskCount[taskDate] = (dateTaskCount[taskDate] || 0) + 1;
                    });
        
                    $calendar.datepicker('destroy');
                    $calendar.datepicker({
                        defaultDate: selectedDate,
                        dateFormat: 'yy-mm-dd',
                        beforeShowDay: function (date) {
                            const formattedDate = $.datepicker.formatDate('yy-mm-dd', date);
        
                            if (dateTaskCount[formattedDate]) {
                                // Görev olan günler için özel bir sınıf ekle
                                return [true, 'has-tasks', `${dateTaskCount[formattedDate]} görev`];
                            }
        
                            return [true, '', ''];
                        },
                        onSelect: function (sDate) {
                            selectedDate = sDate;
        
                            // Veriler güncelleniyor
                            updateUserData();
        
                            // Seçilen güne ait görevleri yükle
                            loadTasks(sDate);
        
                            // Görev olan tarihleri işaretle
                            // markCalendarDates(); // Burada tekrar çağrı yapmak yerine, sadece tarihler üzerinde işlemleri gerçekleştirin
                        },
                    });
                },
                error: function () {
                    console.error('Görev tarihlerini yüklerken bir hata oluştu.');
                }
            });
        }
        
        // CSS ile görev olan günlerin rengini kırmızı yapma
        $('head').append('<style>.has-tasks { color: red !important; }</style>');
    
        // Seçilen güne ait görevleri yükle
        function loadTasks(date) {
             // Tarihi gün.ay.yıl formatında döndürmek
            // 'date' bir Date nesnesi ise uygun formata dönüştür
            const formattedDate = date instanceof Date
                ? `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
                : date.split('-').reverse().join('.'); // Eğer string ise mevcut kodu kullan

            $.ajax({
                url: '/api/tasks',
                type: 'GET',
                data: { 
                    filter: 'all',  // 'all' filtresi ile tüm görevler çekilecek
                    search: '',     // Arama filtresi boş bırakıldı
                    sort: 'date-asc'  // Görevler tarihe göre sıralanacak
                },
                success: function (tasks) {
                    const filteredTasks = tasks.filter(task => {
                        const taskDate = new Date(task.gorev_tarih).toISOString().split('T')[0];
                        return taskDate === date;  // Seçilen tarihe göre filtreleme
                    });
                   
                    const taskCount = filteredTasks.length;
                    const $taskCountInfo = $(`<div><strong>${formattedDate} günü için ${taskCount} görev bulundu.</strong></div>`);
                    const $addTaskButton = $('<button class="btn btn-primary mt-2">Yeni Görev Ekle</button>');
        
                    // Eğer #taskInfoContainer var ise içeriğini temizle, yoksa yeni bir tane oluştur
                    let $taskInfoContainer = $('#taskInfoContainer');
                   
                    if ($taskInfoContainer.length === 0) {
                        // Eğer #taskInfoContainer bulunmazsa, yeni oluştur
                        $taskInfoContainer = $('<div id="taskInfoContainer" style="display: flex; flex-direction: column; align-items: flex-start; margin-left: 10px;">');
                        // Append the task info container to the right side of the calendar container
                        $calendarContainer.append($taskInfoContainer);
                    }
            
                    // İçeriği temizle ve yeni içerikleri ekle
                    $taskInfoContainer.html('').append($taskCountInfo, $addTaskButton);
                    // Append the task info container to the right side of the calendar container
                  
                    displayTasks(filteredTasks);

                    $addTaskButton.on('click', function () {
                        playSoundClick();

                        var today = new Date();
                        var day = today.getDate().toString().padStart(2, '0');
                        var month = (today.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                        var year = today.getFullYear();
                        var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl
                
                        let gorev_ikon="fa-home";
                        let gorev_ikon_renk='black';
                        let gorev_tanimi='';
                        let gorev_aciklama='';
                        let gorev_tarih = formattedDateString;
                        let gorev_kategori = "Genel";
                        let gorev_tp = 0;
                        let gorev_altin=0;
                        let gorev_yapildimi = false;
                        let gorev_durumu = "";
                        let gorev_tekrar = "1";
                        let onem_derecesi = "Yüksek";
                        let gorev_tamamlanma_tarihi = "";
                
                        // Önem Derecesi İndikatörünü Güncelleme Fonksiyonu
                        function updateImportanceIndicator(value) {
                            let color = '';
                
                            // Seçilen 'onem_derecesi' değerine göre renk atama
                            if (value === 'Yüksek') {
                                color = 'red';
                            } else if (value === 'Orta') {
                                color = 'blue';
                            } else {
                                color = 'brown';
                            }
                
                            // 'importanceIndicator' elementinin background-color özelliğini güncelle
                            $('#importanceIndicator').css('background-color', color);
                        }
                
                        // Diyalog HTML
                        const dialogHtml = `
                            <div id="addDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <form id="addForm">
                                        <h5 style="margin-bottom: 20px; font-weight: bold;">Yeni Görev Ekle</h5>
                                        
                                        <!-- Renk Seçimi -->
                                        <div>
                                            <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                            <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                                ${colors.map((color, index) => `
                                                    <div class="color-circle" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                                    ${((index + 1) % 7 === 0) ? '<div style="flex-basis: 100%; height: 0; margin-bottom: 15px;"></div>' : ''}
                                                `).join('')}
                                            </div>
                                        </div>

                                        <!-- İkon Seçimi -->
                                        <div class="mb-3">
                                            <label for="iconSelection" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                                İkon Seçimi:
                                                <i class="fas fa-search" id="searchIconCalendarAdd" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                                <div id="searchContainerCalendarAdd" style="display: none; margin-left: 10px;">
                                                    <input type="text" id="searchInputCalendarAdd" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                                </div>
                                            </label>
                                            <div id="iconSelection" style="margin-top: 10px;">
                                                ${icons.map(category => `
                                                    <div class="icon-category" style="margin-bottom: 20px;">
                                                        <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                            ${category.title}
                                                        </h4>
                                                        <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                            ${category.icons.map(icon => `
                                                                <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                                    <i class="fas ${icon}" style="font-size: 20px; color: ${gorev_ikon_renk};"></i>
                                                                    <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                                        ${icon.replace("fa-", "").replace("-", " ")}
                                                                    </span>
                                                                </div>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                
                                        <!-- Görev Tanımı -->
                                        <div class="mb-3">
                                            <label for="taskDescription" class="form-label" style=" font-weight: bold;">Görev Tanımı:</label>
                                            <input type="text" class="form-control" id="taskDescription" value="${gorev_tanimi}">
                                        </div>
                
                                        <!-- Görev Açıklaması -->
                                        <div class="mb-3">
                                            <label for="taskDetails" class="form-label" style=" font-weight: bold;">Görev Açıklaması:</label>
                                            <textarea class="form-control" id="taskDetails">${gorev_aciklama}</textarea>
                                        </div>
                
                                        <!-- Kategori -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <label for="taskCategory" class="mb-0" style=" font-weight: bold;">Kategori:</label> <!-- Flexbox gap ile mesafe verildi -->
                                            <select class="form-select" id="taskCategory" style="width: 200px;">
                                                <!-- Kategoriler buraya dinamik olarak eklenecek -->
                                            </select>
                                        </div>
                
                                        <!-- Tarih -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 20px;">
                                            <label for="taskDate" class="mb-0" style=" font-weight: bold;">Tarih:</label> <!-- Flexbox gap ile mesafe verildi -->
                                            <div style="display: flex; align-items: center; width: 150px;">
                                                <input type="text" class="form-control" id="taskDate" value="${formattedDateString}" readonly>
                                                <i id="calendarIcon" class="fas fa-calendar-alt" style="cursor: pointer; margin-left: 10px;"></i>
                                            </div>
                                        </div>

                                        <!-- Tekrar -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <label for="taskRepeat" class="mb-0" style=" font-weight: bold;">Tekrar:</label> <!-- Flexbox gap ile mesafe verildi -->
                                            <select class="form-select" id="taskRepeat" style="width: 150px;">
                                                <option value="Tekrar Etme" ${gorev_tekrar === "1" ? "selected" : ""}>Tekrar Etme</option>
                                                <option value="Günlük" ${gorev_tekrar === "G" ? "selected" : ""}>Günlük</option>
                                                <option value="Haftalık" ${gorev_tekrar === "H" ? "selected" : ""}>Haftalık</option>
                                                <option value="Aylık" ${gorev_tekrar === "A" ? "selected" : ""}>Aylık</option>
                                                <option value="Yıllık" ${gorev_tekrar === "Y" ? "selected" : ""}>Yıllık</option>
                                                <option value="Hafta İçi" ${gorev_tekrar === "HA" ? "selected" : ""}>Hafta İçi</option>
                                                <option value="Hafta Sonu" ${gorev_tekrar === "HS" ? "selected" : ""}>Hafta Sonu</option>
                                                <option value="Özel" ${gorev_tekrar.startsWith('OHA-') || gorev_tekrar.startsWith('OT-') ? "selected" : ""}>Özel</option>
                                            </select>
                                        </div>
                
                                        <!-- Altın -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- Altın İkonu -->
                                            <i class="fas fa-coins" style="color: gold; font-size: 20px;"></i>
                                            
                                            <!-- Altın Girişi -->
                                            <input type="number" class="form-control" id="taskGold" value="${gorev_altin}" min="0" max="100" style="width: 100px;">
                                        </div>
                
                                        <!-- TP -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- TP Yazısı -->
                                            <label for="taskTp" class="mb-0" style=" font-weight: bold;">TP:</label>
                                            
                                            <!-- TP Girişi -->
                                            <input type="number" class="form-control" id="taskTp" value="${gorev_tp}" min="0" max="100" style="width: 100px;">
                                        </div>
                
                                       <!-- Önem Derecesi -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- Önem Derecesi Yazısı -->
                                            <label for="taskOnemDerecesi" class="mb-0" style=" font-weight: bold;">Önem Derecesi:</label>
                                            
                                            <!-- Dinamik Renk Dairesi -->
                                            <div id="importanceIndicator" class="rounded-circle" style="width: 20px; height: 20px; margin-right: 10px;"></div>
                                            
                                            <!-- Önem Derecesi Seçimi -->
                                            <select class="form-select" id="taskOnemDerecesi" style="width: 120px;">
                                                <option value="Yüksek">Yüksek</option>
                                                <option value="Orta">Orta</option>
                                                <option value="Düşük">Düşük</option>
                                            </select>
                                        </div>
                
                                        <!-- Butonlar -->
                                        <div style="margin-top: 30px;">
                                            <button type="button" id="confirmAdd" class="btn btn-primary" style="margin-right: 10px;">Ekle</button>
                                            <button type="button" id="cancelAdd" class="btn btn-secondary">İptal</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        `;
                
                        // Diyalog kutusunu sayfaya ekle
                        $('body').append(dialogHtml);
                
                        const initialValue = onem_derecesi;
                        updateImportanceIndicator(initialValue);
                        $('#taskOnemDerecesi').val(onem_derecesi);
                
                        // Seçenek değiştiğinde güncelleme işlemi
                        $('#taskOnemDerecesi').change(function() {
                            playSoundOption();
                
                            const selectedValue = $(this).val();
                            updateImportanceIndicator(selectedValue);
                        });                         
                        
                        // Arama simgesine tıklama
                        $('#searchIconCalendarAdd').on('click', function () {
                            const $searchContainer = $('#searchContainerCalendarAdd');
                            $searchContainer.toggle(); // Görünürlüğü değiştirir
                        });

                        // Arama girişine yazı yazıldıkça ikonları filtreleme
                        $('#searchInputCalendarAdd').on('input', function () {
                            const query = $(this).val().toLowerCase();

                            // Filtreleme işlemi
                            const filteredIcons = icons.map(category => ({
                                title: category.title,
                                icons: category.icons.filter(icon => icon.includes(query))
                            })).filter(category => category.icons.length > 0);

                            // Güncellenmiş ikon listesi
                            const $iconSelection = $('#iconSelection');
                            $iconSelection.html(filteredIcons.map(category => `
                                <div class="icon-category" style="margin-bottom: 20px;">
                                    <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                        ${category.title}
                                    </h4>
                                    <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                        ${category.icons.map(icon => `
                                            <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                <i class="fas ${icon}" style="font-size: 20px; color: ${gorev_ikon_renk};"></i>
                                                <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                    ${icon.replace("fa-", "").replace("-", " ")}
                                                </span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join(''));
                        });

                        // Arama girişinin dışına tıklanınca gizleme
                        $(document).on('click', function (e) {
                            const $searchContainer = $('#searchContainerCalendarAdd');
                            if (!$(e.target).closest('#searchContainerCalendarAdd, #searchIconCalendarAdd').length) {
                                $searchContainer.hide(); // Giriş kutusunu gizle
                            }
                        });
                
                        // Kategorileri API'den çekme
                        $.ajax({
                            url: '/api/categories', // API endpoint
                            method: 'GET',
                            success: function(response) { // 'categories' yerine 'response' kullanıyoruz
                                const categories = response.data; // 'data' kısmına erişiyoruz
                        
                                // Kategorileri menüye ekleme
                                categories.forEach(function(category) {
                                    $('#taskCategory').append(`
                                        <option value="${category.category_name}" ${gorev_kategori === category.category_name ? 'selected' : ''}>
                                            ${category.category_name}
                                        </option>
                                    `);
                                });
                            },
                            error: function() {
                                console.error('Kategoriler yüklenemedi.');
                            }
                        });
                
                        // İkon Seçimi: Başlangıçta task.gorev_ikon'a göre ikon seçili yapılacak
                        $('#iconSelection .icon-option').each(function() {
                            if ($(this).data('icon') === gorev_ikon) {
                                $(this).addClass('selected');
                
                               // $(this).css('border', '2px solid black'); // Seçilen ikonu vurgula
                            }
                        });
                
                        // Renk Seçimi: Başlangıçta task.gorev_ikon_renk'e göre renk seçili yapılacak
                        $('.color-circle').each(function() {
                            if ($(this).data('color') === gorev_ikon_renk) {
                                $(this).addClass('selected');
                                // Seçilen rengi ikona uygula
                                $('#iconSelection .fas').css('color', gorev_ikon_renk);
                            }
                        });
                
                        // Renk seçimi dinamik renk değişimi
                        $('.color-circle').on('click', function () {
                            playSoundClick();
                
                            const selectedColor = $(this).data('color');
                            
                            // Tüm renk dairelerinden 'selected' sınıfını kaldır
                            $('.color-circle').removeClass('selected');
                            
                            // Seçilen renk dairesine 'selected' sınıfını ekle
                            $(this).addClass('selected');
                
                            $('#iconSelection .fas').css('color', selectedColor);
                            gorev_ikon_renk = selectedColor;
                        });
                
                        // İkon seçimi
                        $('.icon-option').on('click', function () {
                            playSoundClick();
                
                            gorev_ikon = $(this).data('icon');
                
                            // Tüm ikonlar üzerindeki 'selected' sınıfını kaldır
                            $('.icon-option').removeClass('selected');
                            
                            // Tıklanan ikona 'selected' sınıfını ekle
                            $(this).addClass('selected');
                            
                        });
                
                        var selectedDate=gorev_tarih;
                
                        // Takvim simgesine tıklandığında takvim diyalog penceresini açma
                        $('#calendarIcon').click(function() {
                            playSoundClick();
                
                            // Tarihi Türkçe formatına uygun şekilde güncelle
                            var today = new Date();
                            var day = today.getDate().toString().padStart(2, '0');
                            var month = (today.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                            var year = today.getFullYear();
                            var formattedDateString = `${year}-${month}-${day}`; // YYYY-MM-DD formatı
                
                            // Ana formdaki tarih alanını güncelle
                            //$('#taskDate').val(formattedDateString);
                
                            // Takvim diyalog penceresini dinamik olarak oluştur
                            var calendarDialogHtml = `
                                <div id="calendarDialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                    <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        <h5 style="margin-bottom: 20px;">Tarih Seçin</h5>
                                        <input type="date" id="calendarInput" class="form-control" style="margin-bottom: 20px;">
                                        <div>
                                            <button type="button" id="confirmDate" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                            <button type="button" id="cancelDate" class="btn btn-secondary">İptal</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        
                            // Takvim diyalog penceresini body'ye ekle
                            $('body').append(calendarDialogHtml);
                        
                            // Takvim diyalog penceresini göster
                            $('#calendarDialog').fadeIn();
                
                            $('#calendarInput').val(formattedDateString); // Bugünün tarihini YYYY-MM-DD formatında ayarla
                        
                            // Takvim diyalog penceresindeki "Onayla" butonuna tıklanınca tarih ana pencerede güncellenir
                            $('#confirmDate').click(function() {
                                playSoundClick();
                
                                selectedDate = $('#calendarInput').val();  // Takvimden seçilen tarihi al
                                if (selectedDate) {
                                    // Tarihi Türkçe formatına uygun şekilde güncelle
                                    var formattedDate = new Date(selectedDate);
                                    var day = formattedDate.getDate().toString().padStart(2, '0');
                                    var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                                    var year = formattedDate.getFullYear();
                                    var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl
                        
                                    selectedDate=formattedDateString;
                                    // Ana formdaki tarih alanını güncelle
                                    $('#taskDate').val(formattedDateString);
                                }
                        
                                // Takvim diyalog penceresini kapat
                                $('#calendarDialog').fadeOut(function() {
                                    // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                                    $('#calendarDialog').remove();
                                });
                            });
                        
                            // Takvim diyalog penceresindeki "İptal" butonuna tıklanınca pencere kapanır
                            $('#cancelDate').click(function() {
                                playSoundClick();
                
                                $('#calendarDialog').fadeOut(function() {
                                    // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                                    $('#calendarDialog').remove();
                                });
                            });
                        });
                        
                        // "İptal" butonuna tıklanırsa takvim diyalog penceresini kapatma
                        $('#cancelDate').click(function() {
                            playSoundClick();
                
                            $('#calendarDialog').fadeOut();
                        });
                
                        // "Onayla" butonuna tıklanırsa tarih güncellenmesi
                        $('#confirmDate').click(function() {
                            playSoundClick();
                
                            const selectedDate = $('#calendarInput').val();
                            if (selectedDate) {
                                // Türkçe formata uygun tarih güncellemesi (gg.aa.yyyy formatı)
                                const formattedDate = new Date(selectedDate).toLocaleDateString('tr-TR');
                                $('#taskDate').val(formattedDate);
                                $('#calendarDialog').fadeOut();
                            }
                        });         
                        
                        function convertDateToISO(dateString) {
                            // Gelen tarih formatı: "20.12.2024"
                            const [day, month, year] = dateString.split('.'); // Tarihi gün, ay ve yıl olarak ayır
                            return `${year}-${month}-${day}`; // ISO formatında birleştir
                        }

                        // 'Özel' seçeneği seçildiğinde diyalog penceresini göster
                        $('#taskRepeat').on('change', function() {
                            if ($(this).val() === "Özel") {
                                showCustomDialog();
                            }
                        });

                        function showCustomDialog() {
                            // Diğer içerik, değerler gibi değişkenlerinize uygun şekilde
                            const dialogHtml = `
                                <div id="specialDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                    <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        <h5 style="font-weight: bold; margin-bottom: 10px;">ÖZEL GÜN BELİRLEME</h5>
                                        
                                        <!-- Gün Sayısı ve Haftanın Günleri Seçenekleri (Her zaman üstte) -->
                                        <div class="mb-3">
                                            <input type="radio" name="repeatType" value="days" id="repeatDays" checked /> Gün Sayısı
                                            <input type="radio" name="repeatType" value="week" id="repeatWeek" /> Haftanın Günleri
                                        </div>
                    
                                        <!-- Sayı Seçimi -->
                                        <div class="mb-3" id="customRepeatDaysContainer" style=" margin-bottom: 10px;">
                                            <label for="customRepeatDays">Gün Seçimi (2-6 arası):</label>
                                            <input type="number" id="customRepeatDays" min="2" max="6" style="width: 60px;" /> günde 1
                                        </div>
                                        
                                        <!-- Haftanın Günleri Seçimi -->
                                        <div id="weekDaysContainer" style="display: none; margin-bottom: 10px;">
                                            <div>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="monday" /> Pazartesi
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="tuesday" /> Salı
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="wednesday" /> Çarşamba
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="thursday" /> Perşembe
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="friday" /> Cuma
                                                </label>
                                                <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                    <input type="checkbox" id="saturday" /> Cumartesi
                                                </label>
                                                <label style="display: inline-flex; align-items: center;">
                                                    <input type="checkbox" id="sunday" /> Pazar
                                                </label>
                                            </div>
                                        </div>

                    
                                        <!-- Onayla ve İptal Butonları -->
                                        <div>
                                            <button type="button" id="confirmCustom" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                            <button type="button" id="cancelCustom" class="btn btn-secondary">İptal</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                    
                            // Diğer içeriklerle birlikte diyalog penceresini ekleyin
                            $('body').append(dialogHtml);
                    
                            // Gün Sayısı ve Haftanın Günleri seçenekleri arasındaki değişiklikleri kontrol et
                            $('input[name="repeatType"]').on('change', function() {
                                if ($('#repeatDays').is(':checked')) {
                                    $('#weekDaysContainer').hide(); // Haftanın günleri kutusunu gizle
                                    $('#customRepeatDaysContainer').show(); // Gün sayısı kutusunu göster
                                } else if ($('#repeatWeek').is(':checked')) {
                                    $('#weekDaysContainer').show(); // Haftanın günleri kutusunu göster
                                    $('#customRepeatDaysContainer').hide(); // Gün sayısı kutusunu gizle
                                }
                            });
                    
                            // Onayla butonuna tıklama
                            $('#confirmCustom').on('click', function() {
                                let repeatValue = '';
                    
                                // Seçilen tür ve değer doğrultusunda taskRepeat değerini güncelle
                                if ($('#repeatDays').is(':checked')) {
                                    const repeatDays = $('#customRepeatDays').val();
                                    if (repeatDays) {
                                        repeatValue = `OT-${repeatDays}`;
                                    }
                                } else if ($('#repeatWeek').is(':checked')) {
                                    const selectedDays = [];
                                    const daysMap = {
                                        'monday': '1',
                                        'tuesday': '2',
                                        'wednesday': '3',
                                        'thursday': '4',
                                        'friday': '5',
                                        'saturday': '6',
                                        'sunday': '7'
                                    };
                        
                                    // Haftanın günleri seçilirse sayısal değerleri al
                                    $('#weekDaysContainer input[type="checkbox"]:checked').each(function() {
                                        const dayId = $(this).attr('id');
                                        if (daysMap[dayId]) {
                                            selectedDays.push(daysMap[dayId]);
                                        }
                                    });
                        
                                    // Seçilen günleri "OHA-" ile başlat ve sayısal değerleri ekle
                                    if (selectedDays.length) {
                                        repeatValue = `OHA-${selectedDays.join('')}`;
                                    }
                                }
                            
                                // 'taskRepeat' değerini güncelle ve diyalog penceresini kapat
                                //$('#taskRepeat').val(repeatValue);
                                ozel_gun=repeatValue;
                                $('#specialDialog').remove(); // Diyalog penceresini kapat
                            });
                    
                            // İptal butonuna tıklama, diyalog penceresini kapat
                            $('#cancelCustom').on('click', function() {
                                $('#specialDialog').remove(); // Diyalog penceresini kapat
                            });
                        }
                
                        // Güncelle butonuna tıklama işlemi
                        $('#confirmAdd').on('click', async function () {
                            playSoundClick();
                
                            const description = $('#taskDescription').val().trim();
                            const details = $('#taskDetails').val().trim();
                            const iconClass = $('#iconSelection .icon-option.selected').data('icon') || 'default-icon'; // Seçilen ikonu al
                            const iconColor = $('#colorSelection .color-circle.selected').data('color') || '#000000'; // Seçilen rengi al
                            const category = $('#taskCategory').val().trim().replace(/\s+/g, ' '); // Güncellenen kategori adı
                            const date = convertDateToISO(selectedDate); // "2024-12-20"
                            const repeatOption = $('#taskRepeat').val(); // Select öğesindeki seçili değeri al
                            let repeatOptionText = '';
                            
                            switch (repeatOption) {
                                case "Tekrar Etme":
                                    repeatOptionText = "1";
                                    break;
                                case "Günlük":
                                    repeatOptionText = "G";
                                    break;
                                case "Haftalık":
                                    repeatOptionText = "H";
                                    break;
                                case "Aylık":
                                    repeatOptionText = "A";
                                    break;
                                case "Yıllık":
                                    repeatOptionText = "Y";
                                    break;
                                case "Hafta İçi":
                                    repeatOptionText = "HA";
                                    break;
                                case "Hafta Sonu":
                                    repeatOptionText = "HS";
                                    break;
                                case "Özel":
                                    repeatOptionText = ozel_gun;
                                    break;
                                default:
                                    repeatOptionText = "";
                            }
                
                            const goldAmount = parseInt($('#taskGold').val() || "0", 10);
                            const tpAmount = parseInt($('#taskTp').val() || "0", 10);       
                                              
                            // Güncellenen veriler
                            const taskData = {
                                gorev_ikon: iconClass,
                                gorev_ikon_renk: iconColor,
                                gorev_tanimi: description,
                                gorev_aciklama: details,
                                gorev_tarih: date,
                                gorev_kategori: category,
                                gorev_tp: tpAmount,
                                gorev_altin: goldAmount,
                                gorev_yapildimi: false,
                                gorev_durumu: "",
                                gorev_tekrar: repeatOptionText,
                                onem_derecesi: $('#taskOnemDerecesi').val(),
                                gorev_tamamlanma_tarihi: ""
                            };
                
                            // Boş bırakma kontrolü
                            if (!description) {
                                alert("Görev tanımı boş bırakılamaz!");
                                return;
                            }
                
                            $.ajax({
                                url: '/api/tasks', // API endpoint
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(taskData), // JSON string'e dönüştürüyoruz
                                success: function(response) {
                                    if (response.success) {
                                        alert("Görev başarıyla eklendi!");
                                        $('#addDialog').remove();
                                        // Görev listesini yeniden yüklemek için gerekli kodlar
                                        // Örneğin, aşağıdaki gibi bir fonksiyon ile görevleri yeniden yükleyebilirsiniz:
                                        loadTasks(date); // 'date' parametresini doğru bir şekilde ilettiğinizden emin olun
                                    }
                                },
                                error: function(xhr) {
                                    const errorResponse = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu";
                                    alert("Görev eklenirken bir hata oluştu: " + errorResponse);
                                }
                            });

                            calendarFunction();
                             
                        });
                    
                        // İptal butonuna tıklama işlemi
                        $('#cancelAdd').on('click', function () {
                            playSoundClick();
                
                            $('#addDialog').remove(); // Sadece diyalog kutusunu kaldır
                        });
                    });
                },
                error: function () {
                    console.error(`${date} tarihine ait görevler yüklenirken bir hata oluştu.`);
                }
            });
        }
    
        // Görev kartlarını göster
        function displayTasks(tasks) {
            // $taskListContainer öğesini her zaman doğru şekilde hedefle
            const $taskListContainer = $('#taskListContainer'); // Burada doğru container'ı hedefliyoruz.
    
            // Eğer görevler yoksa, uygun mesajı göster
            $taskListContainer.html(''); // Yeni bir görev listesi yüklendiği için önce eski içerik temizlenir

            if (!tasks || tasks.length === 0) {
                $taskListContainer.append('<p>Gösterilecek görev bulunamadı.</p>');
                return;
            }
    
            const taskCards = tasks.map(task => {
                let gorevTekrarFormatted = task.gorev_tekrar;

                // Eğer "OHA-" ile başlıyorsa
                if (gorevTekrarFormatted.startsWith("OHA-")) {
                    const numbers = gorevTekrarFormatted.slice(4); // "OHA-" kısmını çıkar
                    let days = [];
                    
                    // Günleri 1 karakter boşlukla ayırarak ekle
                    if (numbers.includes("1")) days.push("Pzt");
                    if (numbers.includes("2")) days.push("Sa");
                    if (numbers.includes("3")) days.push("Ça");
                    if (numbers.includes("4")) days.push("Pe");
                    if (numbers.includes("5")) days.push("Cu");
                    if (numbers.includes("6")) days.push("Ctesi");
                    if (numbers.includes("7")) days.push("Pa");
            
                    gorevTekrarFormatted = days.join(" ");
                }
            
                // Eğer "OT-" ile başlıyorsa
                else if (gorevTekrarFormatted.startsWith("OT-")) {
                    const number = gorevTekrarFormatted.slice(3); // "OT-" kısmını çıkar
                    gorevTekrarFormatted = `${number} günde 1`; // Sayıyı alıp yanına "T" ekle
                }
                
                const priorityColors = {
                    "Yüksek": "red",
                    "Orta": "blue",
                    "Düşük": "brown"
                };
                    
                return `
                    <div class="task-card" data-id="${task.gorev_sira_no}"  data-tp="${task.gorev_tp}" 
                        data-altin="${task.gorev_altin}" data-gorevkategori="${task.gorev_kategori}" style="border: 1px solid #ddd; margin-bottom: 10px; padding: 10px; border-radius: 5px; background-color: #fff;">
                        <div class="d-flex align-items-center">
                            <div class="task-priority-icon d-flex align-items-center justify-content-center me-3" style="width: 10px; height: 10px; border-radius: 10px; background-color: ${priorityColors[task.onem_derecesi]};"></div>
                            <div class="task-icon d-flex align-items-center justify-content-center" style="color: ${task.gorev_ikon_renk}; font-size: 2rem; width: 50px; height: 50px;">
                                <i class="fas ${task.gorev_ikon}"></i>
                            </div>
                            <div class="task-info ms-2">
                                <div><strong>${task.gorev_tanimi}</strong></div>
                                <div>${task.gorev_aciklama}</div>
                                 <div class="task-details d-flex flex-wrap">
                                    <span class="me-3"><i class="fas fa-tags"></i> ${task.gorev_kategori}</span>
                                    <span class="me-3"><i class="fas fa-redo"></i> ${gorevTekrarFormatted}</span>
                                    <span class="me-3"><i class="fas fa-coins" style="color: gold;"></i> ${task.gorev_altin}</span>
                                    <span class="me-3"><strong>TP:</strong> ${task.gorev_tp}</span>
                                </div>
                            </div>
                            <div class="task-actions ms-auto d-flex align-items-center">
                                <button class="btn btn-success complete-task-calendar me-2" style="font-size: 1.5rem; position: relative;">
                                    <i class="fas fa-check-circle"></i>
                                </button>
                                <button class="btn btn-danger failure-task-calendar me-2" style="font-size: 1.5rem; position: relative;">
                                    <i class="fas fa-times-circle"></i>
                                </button>
                                <button class="btn btn-danger delete-task-calendar" style="font-size: 1.5rem;">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="btn btn-primary edit-task-calendar ms-2" style="font-size: 1.5rem;">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;

            });
    
            $taskListContainer.append(taskCards.join(''));

            $(document).on('click', '.complete-task-calendar', function () {
                playSoundSuccess();
    
                const $taskCard = $(this).closest('.task-card');
                const taskId = $taskCard.data('id');
                const gorevKategori = $taskCard.data('gorevkategori');
       
                // Get today's date in the format YYYY-MM-DD
                const today = new Date().toISOString().split('T')[0]; // Example: "2024-12-20"
            
                // Animate the check icon
                const $checkIcon = $(this).find('.fa-check-circle');
                $checkIcon.css({
                    transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                    transform: "scale(1.5)",
                    color: "green"
                });
            
                setTimeout(() => {
                    $checkIcon.css('transform', 'scale(1)');
                }, 300);
    
                // Get gorev_tp and gorev_altin values from taskCard
                const gorev_tp = parseInt($taskCard.data('tp'), 10) || 0; // Default to 0 if not provided
                const gorev_altin = parseInt($taskCard.data('altin'), 10) || 0; // Default to 0 if not provided
    
                // Update usertp and usergold variables
                if (!$(this).data('updated')) { // Ensure usertp and usergold are only updated once
                    usertp += gorev_tp;
                    usergold += gorev_altin;
                    $(this).data('updated', true); // Flag to prevent multiple updates
                }                  
          
                // Check if userlevel is greater than 0 and usertp becomes less than 0
                if (usertp >=50) {
                    playSoundMagic();
    
                    userlevel += 1;
                    usertp -=50;
    
                    // Update the UI with the new values
                    $('.userlevel').text(userlevel)
                        .addClass('animateValue')  // Animasyonu başlat
                        .one('animationend', function() {  // Animasyon tamamlandığında sınıfı kaldır
                            $(this).removeClass('animateValue');
                    });
                } else {
                    $('.userlevel').text(userlevel);
                }
    
                // Update the UI with the new values
                $('.usergold').text(usergold);
                $('.usertp').text(usertp);
    
                //Veriler güncelleniyor
                updateUserData();

                $.ajax({
                    url: '/api/categories', // Kategori verilerinin olduğu API
                    type: 'GET',
                    success: function (response) {
                        // API'nin döndürdüğü yapıyı kontrol edin
                        const categories = Array.isArray(response.data) ? response.data : [];
                        
                        if (!Array.isArray(categories)) {
                            console.error('Beklenen bir dizi, ancak farklı bir veri yapısı alındı:', response);
                            return;
                        }
                
                        // İlgili kategoriyi bul
                        const category = categories.find(cat => cat.category_name === gorevKategori);
                    
                        if (!category) {
                            console.error(`Kategori bulunamadı: ${gorevKategori}`);
                            return;
                        }
                
                        let categoryName = category.category_name;
                        let categoryLevel = parseInt(category.category_level, 10) || 0;
                        let categoryTp = parseInt(category.category_tp, 10) || 0;
                
                        // Eğer 'updated' flag'i yoksa kategori verisini güncelle
                        if (!$(this).data('updated')) {
                            categoryTp += gorev_tp;
                
                            // Eğer categoryTp 50'yi aşarsa, seviyeyi arttır
                            if (categoryTp > 50) {
                                categoryTp -= gorev_tp;
                                categoryLevel += 1; // Seviye artır
                            }
                
                            $(this).data('updated', true); // Bir kez güncelleme yapılması için flag
                
                            // Kategoriyi güncelleme API isteği
                            $.ajax({
                                url: '/api/categories', // Kategori güncelleme API'si
                                type: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    id: category.id, // Kategori ID'si
                                    category_name: categoryName,
                                    category_level: categoryLevel,
                                    category_tp: categoryTp
                                }),
                                success: function () {
                                    console.log(`Kategori başarıyla güncellendi: ${categoryName}`);
                                },
                                error: function (err) {
                                    console.error('Kategori güncellenirken hata oluştu:', err);
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.error('Kategori verileri alınırken hata oluştu:', err);
                    }
                });
                
                // Mark the task as completed and remove the card
                setTimeout(() => {
                    // Update the task's state (e.g., `gorev_yapildimi = true`)
                    $.ajax({
                        url: `/api/tasks/${taskId}`,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            gorev_yapildimi: true, // Set the task as completed
                            gorev_durumu: "Başarılı",
                            gorev_tamamlanma_tarihi: today // Add today's date as completion date
                        }),
                        success: function (response) {
                            console.log(`Görev ${taskId} başarıyla tamamlandı.`);

                            const updatedTask = response.updatedTask; // Güncellenen görev verisini al
                            // İlgili kategori ve diğer verileri güncelleyebilirsiniz.

                            $taskCard.remove(); // Remove the task card from the UI
                        },
                        error: function (err) {
                            console.error('Görev güncellenirken hata oluştu:', err);
                        }
                    });

                    //Veriler güncelleniyor
                    updateUserData();
    
                    calendarFunction();   
        
                }, 600); 
    
            });       
    
            $(document).on('click', '.failure-task-calendar', function () {
                playSoundFail();
    
                const $taskCard = $(this).closest('.task-card');
                const taskId = $taskCard.data('id');
    
                // Diyalog penceresini oluştur
                $('body').append(`
                    <div id="customDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                            <div style="background: white; padding: 20px; border-radius: 8px; width: 300px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <p>Bu görev başarısız sayılacak. Kabul ediyor musunuz?</p>
                                <button id="confirmFailure" class="btn btn-danger">Onayla</button>
                                <button id="cancelFailure" class="btn btn-secondary">İptal</button>
                            </div>
                    </div>
                `);
    
                // Diyalog penceresini göster
                $('#customDialog').fadeIn();
    
                // "Onayla" butonuna tıklanması durumunda
                $(document).on('click', '#confirmFailure', function () {
                    playSoundFail();
                    // Bugünün tarihini al
                    const today = new Date().toISOString().split('T')[0]; // Example: "2024-12-20"
                    const gorevKategori = $taskCard.data('gorevkategori');

                    // Get gorev_tp and gorev_altin values from taskCard
                    const gorev_tp = parseInt($taskCard.data('tp'), 10) || 0; // Default to 0 if not provided
                    const gorev_altin = parseInt($taskCard.data('altin'), 10) || 0; // Default to 0 if not provided
    
                    // Update usertp and usergold variables
                    usertp -= gorev_tp;
                    usergold -= gorev_altin;
    
                    // Check if userlevel is greater than 0 and usertp becomes less than 0
                    if (usertp < 0) {
                        if (userlevel > 0) {
                            // If userlevel is greater than 0, decrease userlevel by 1 and set usertp to (50 - gorev_tp)
                            userlevel -= 1;
                            usertp+=50;
                        } else {
                            // If userlevel is 0 or less, set usertp to 0
                            usertp = 0;
                        }
                    }
    
                    if (usergold<0) {
                        usergold=0;
                    }
    
                    // Update the UI with the new values
                    $('.usertp').text(usertp);
                    $('.usergold').text(usergold);
                    $('.userlevel').text(userlevel);
    
                    //Veriler güncelleniyor
                    updateUserData();
                    
                    $.ajax({
                        url: '/api/categories', // Kategori verilerinin olduğu API
                        type: 'GET',
                        success: function (response) {
                            // API'nin döndürdüğü yapıyı kontrol edin
                            const categories = response.data || []; // API'den dönen kategoriler
                    
                            if (!Array.isArray(categories)) {
                                console.error('Beklenen bir dizi, ancak farklı bir veri yapısı alındı:', response);
                                return;
                            }
                    
                            // İlgili kategoriyi bul
                            const category = categories.find(cat => cat.category_name === gorevKategori);
                    
                            if (!category) {
                                console.error(`Kategori bulunamadı: ${gorevKategori}`);
                                return;
                            }
                    
                            let categoryName = category.category_name;
                            let categoryLevel = parseInt(category.category_level, 10) || 0;
                            let categoryTp = parseInt(category.category_tp, 10) || 0;
                    
                            if (!$(this).data('updated')) { // Ensure usertp and usergold are only updated once
                                if ((categoryTp - gorev_tp) > 0) {
                                    categoryTp -= gorev_tp;
                                } else if (categoryLevel > 0) {
                                    categoryLevel -= 1; // Seviye düşür
                                    categoryTp += 50 - gorev_tp;
                                }
                    
                                $(this).data('updated', true); // Flag to prevent multiple updates
                            }
                    
                            // Kategoriyi güncelle
                            $.ajax({
                                url: '/api/categories', // PUT isteği ile kategori adı ile güncelleme
                                type: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    category_name: categoryName, // Kategori adı
                                    category_level: categoryLevel,
                                    category_tp: categoryTp
                                }),
                                success: function () {
                                    console.log(`Kategori başarıyla güncellendi: ${categoryName}`);
                                },
                                error: function (err) {
                                    console.error('Kategori güncellenirken hata oluştu:', err);
                                }
                            });
                        },
                        error: function (err) {
                            console.error('Kategori verileri alınırken hata oluştu:', err);
                        }
                    });
                    
                    // Mark the task as completed and remove the card
                    // Görev güncellemesi (başarısızlık durumu ve gorev_yapildimi: true olarak)
                    $.ajax({
                        url: `/api/tasks/${taskId}`,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            gorev_yapildimi: true, // Görevi tamamlanmış olarak işaretle
                            gorev_durumu: "Başarısız",
                            gorev_tamamlanma_tarihi: today // Bugünün tarihini tamamlanma tarihi olarak ekle
                        }),
                        success: function (response) {
                            console.log(`Görev ${taskId} başarısız olarak güncellendi.`);
                            
                            $taskCard.remove(); // Görev kartını UI'dan kaldır

                            $('#customDialog').fadeOut(500, function() {
                                $(this).remove();
                            });

                        },
                        error: function (err) {
                            console.error('Görev güncellenirken hata oluştu:', err);
                        }
                    });
    
                    //Veriler güncelleniyor
                    updateUserData();

                    calendarFunction();   
    
                });
    
                // "İptal" butonuna tıklanması durumunda
                $(document).on('click', '#cancelFailure', function () {
                    playSoundClick();
    
                    $('#customDialog').fadeOut(500, function() {
                        $(this).remove();
                    });

                });
    
            });
        
            // Silme işlemi
            $(document).off('click', '.delete-task-calendar').on('click', '.delete-task-calendar', function () {
                playSoundDelete();
    
                const taskCard = $(this).closest('.task-card');
                const taskId = taskCard.data('id');
    
                // Diyalog kutusunu oluştur
                const dialogHtml = `
                    <div id="deleteDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                        <div style="background: white; padding: 20px; border-radius: 8px; width: 300px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <p style="margin-bottom: 20px;">Bu görev silinecek. Emin misiniz?</p>
                            <div>
                                <button id="confirmDelete" class="btn btn-danger" style="margin-right: 10px;">Onayla</button>
                                <button id="cancelDelete" class="btn btn-secondary">İptal</button>
                            </div>
                        </div>
                    </div>
                `;
    
                // Diyalog kutusunu sayfaya ekle
                $('body').append(dialogHtml);
    
                // Onayla butonuna tıklama işlemi
                $('#confirmDelete').on('click', async function () {
                    playSoundDelete();
    
                    try {
                        const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error(`Silme hatası: ${response.status}`);
                        taskCard.remove(); // Görevi kaldır
                    } catch (error) {
                        console.error("Görev silinirken hata oluştu:", error);
                        alert("Görev silinirken bir hata oluştu.");
                    } finally {                        
                        $('#deleteDialog').fadeOut(500, function() {
                            $(this).remove();
                        });
                    }
    
                    //Veriler güncelleniyor
                    updateUserData();

                    calendarFunction();   

                });
    
                // İptal butonuna tıklama işlemi
                $('#cancelDelete').on('click', function () {
                    playSoundClick();
    
                    $('#deleteDialog').fadeOut(500, function() {
                        $(this).remove();
                    });
                    
                });
            });
    
            $(document).off('click', '.edit-task-calendar').on('click', '.edit-task-calendar', function () {
                playSoundClick();
    
                const taskCard = $(this).closest('.task-card');
                const taskId = taskCard.data('id');
    
                let task; // Task objesini dışarıda tanımladık
                      
                /// Task verilerini al (örnek bir veri alım yöntemi, bunu back-end'e uygun şekilde güncelleyebilirsiniz)
                $.ajax({
                    url: `/api/tasks`, // Tüm görevleri almak için endpoint
                    type: 'GET',
                    data: {
                        filter: 'all',   // Burada filter parametresini ekliyoruz (örneğin 'today', 'overdue', 'completed', vb.)
                        search: '',    // Arama parametresi
                        sort: null   // Sıralama parametresi (öncelik, kategori, tarih vb.)
                    },
                    success: function (response) {
                        task = response.find(t => t.gorev_sira_no === taskId); // ID'ye göre görevi bul
                        if (task) {
                            var formattedDate = new Date(task.gorev_tarih);
                            var day = formattedDate.getDate().toString().padStart(2, '0');
                            var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                            var year = formattedDate.getFullYear();
                            var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl
    
                            // Önem Derecesi İndikatörünü Güncelleme Fonksiyonu
                            function updateImportanceIndicator(value) {
                                let color = '';
    
                                // Seçilen 'onem_derecesi' değerine göre renk atama
                                if (value === 'Yüksek') {
                                    color = 'red';
                                } else if (value === 'Orta') {
                                    color = 'blue';
                                } else {
                                    color = 'brown';
                                }
    
                                // 'importanceIndicator' elementinin background-color özelliğini güncelle
                                $('#importanceIndicator').css('background-color', color);
                            }
    
                            // Diyalog HTML
                            const dialogHtml = `
                                <div id="editDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                    <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        <form id="editForm">
                                            <h5 style="margin-bottom: 20px; font-weight: bold;">Görev Düzenleme</h5>
                                            
                                            <!-- Renk Seçimi -->
                                            <div>
                                                <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                                <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                                    ${colors.map((color, index) => `
                                                        <div class="color-circle" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                                        ${((index + 1) % 7 === 0) ? '<div style="flex-basis: 100%; height: 0; margin-bottom: 15px;"></div>' : ''}
                                                    `).join('')}
                                                </div>
                                            </div>
    
                                            <!-- İkon Seçimi -->
                                            <div class="mb-3">
                                                <label for="iconSelection" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                                    İkon Seçimi:
                                                    <i class="fas fa-search" id="searchIconCalendarEdit" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                                    <div id="searchContainerCalendarEdit" style="display: none; margin-left: 10px;">
                                                        <input type="text" id="searchInputCalendarEdit" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                                    </div>
                                                </label>
                                                <div id="iconSelection" style="margin-top: 10px;">
                                                    ${icons.map(category => `
                                                        <div class="icon-category" style="margin-bottom: 20px;">
                                                            <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                                ${category.title}
                                                            </h4>
                                                            <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                                ${category.icons.map(icon => `
                                                                    <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                                        <i class="fas ${icon}" style="font-size: 20px; color: ${task.gorev_ikon_renk};"></i>
                                                                        <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                                            ${icon.replace("fa-", "").replace("-", " ")}
                                                                        </span>
                                                                    </div>
                                                                `).join('')}
                                                            </div>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
    
                                            <!-- Görev Tanımı -->
                                            <div class="mb-3">
                                                <label for="taskDescription" class="form-label" style=" font-weight: bold;">Görev Tanımı:</label>
                                                <input type="text" class="form-control" id="taskDescription" value="${task.gorev_tanimi}">
                                            </div>
    
                                            <!-- Görev Açıklaması -->
                                            <div class="mb-3">
                                                <label for="taskDetails" class="form-label" style=" font-weight: bold;">Görev Açıklaması:</label>
                                                <textarea class="form-control" id="taskDetails">${task.gorev_aciklama}</textarea>
                                            </div>
    
                                            <!-- Kategori -->
                                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                                <label for="taskCategory" class="mb-0" style=" font-weight: bold;">Kategori:</label> <!-- Flexbox gap ile mesafe verildi -->
                                                <select class="form-select" id="taskCategory" style="width: 200px;">
                                                    <!-- Kategoriler buraya dinamik olarak eklenecek -->
                                                </select>
                                            </div>
    
                                            <!-- Tarih -->
                                            <div class="mb-3 d-flex align-items-center" style="gap: 20px;">
                                                <label for="taskDate" class="mb-0" style=" font-weight: bold;">Tarih:</label> <!-- Flexbox gap ile mesafe verildi -->
                                                <div style="display: flex; align-items: center; width: 150px;">
                                                    <input type="text" class="form-control" id="taskDate" value="${formattedDateString}" readonly>
                                                    <i id="calendarIcon" class="fas fa-calendar-alt" style="cursor: pointer; margin-left: 10px;"></i>
                                                </div>
                                            </div>
 
                                            <!-- Tekrar -->
                                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                                <label for="taskRepeat" class="mb-0" style=" font-weight: bold;">Tekrar:</label> <!-- Flexbox gap ile mesafe verildi -->
                                                <select class="form-select" id="taskRepeat" style="width: 150px;">
                                                    <option value="Tekrar Etme" ${task.gorev_tekrar === "1" ? "selected" : ""}>Tekrar Etme</option>
                                                    <option value="Günlük" ${task.gorev_tekrar === "G" ? "selected" : ""}>Günlük</option>
                                                    <option value="Haftalık" ${task.gorev_tekrar === "H" ? "selected" : ""}>Haftalık</option>
                                                    <option value="Aylık" ${task.gorev_tekrar === "A" ? "selected" : ""}>Aylık</option>
                                                    <option value="Yıllık" ${task.gorev_tekrar === "Y" ? "selected" : ""}>Yıllık</option>
                                                    <option value="Hafta İçi" ${task.gorev_tekrar === "HA" ? "selected" : ""}>Hafta İçi</option>
                                                    <option value="Hafta Sonu" ${task.gorev_tekrar === "HS" ? "selected" : ""}>Hafta Sonu</option>
                                                    <option value="Özel" ${task.gorev_tekrar.startsWith('OHA-') || task.gorev_tekrar.startsWith('OT-') ? "selected" : ""}>Özel</option>
                                                </select>
                                            </div> 
    
                                            <!-- Altın -->
                                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                                <!-- Altın İkonu -->
                                                <i class="fas fa-coins" style="color: gold; font-size: 20px;"></i>
                                                
                                                <!-- Altın Girişi -->
                                                <input type="number" class="form-control" id="taskGold" value="${task.gorev_altin}" min="0" max="100" style="width: 100px;">
                                            </div>
    
                                            <!-- TP -->
                                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                                <!-- TP Yazısı -->
                                                <label for="taskTp" class="mb-0" style=" font-weight: bold;">TP:</label>
                                                
                                                <!-- TP Girişi -->
                                                <input type="number" class="form-control" id="taskTp" value="${task.gorev_tp}" min="0" max="100" style="width: 100px;">
                                            </div>
    
                                           <!-- Önem Derecesi -->
                                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                                <!-- Önem Derecesi Yazısı -->
                                                <label for="taskOnemDerecesi" class="mb-0" style=" font-weight: bold;">Önem Derecesi:</label>
                                                
                                                <!-- Dinamik Renk Dairesi -->
                                                <div id="importanceIndicator" class="rounded-circle" style="width: 20px; height: 20px; margin-right: 10px;"></div>
                                                
                                                <!-- Önem Derecesi Seçimi -->
                                                <select class="form-select" id="taskOnemDerecesi" style="width: 120px;">
                                                    <option value="Yüksek">Yüksek</option>
                                                    <option value="Orta">Orta</option>
                                                    <option value="Düşük">Düşük</option>
                                                </select>
                                            </div>
    
                                            <!-- Butonlar -->
                                            <div style="margin-top: 30px;">
                                                <button type="button" id="confirmEdit" class="btn btn-primary" style="margin-right: 10px;">Güncelle</button>
                                                <button type="button" id="cancelEdit" class="btn btn-secondary">İptal</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            `;
    
                            // Diyalog kutusunu sayfaya ekle
                            $('body').append(dialogHtml);
    
                            const initialValue = task.onem_derecesi;
                            updateImportanceIndicator(initialValue);
                            $('#taskOnemDerecesi').val(task.onem_derecesi);
    
                            // Seçenek değiştiğinde güncelleme işlemi
                            $('#taskOnemDerecesi').change(function() {
                                playSoundOption();
    
                                const selectedValue = $(this).val();
                                updateImportanceIndicator(selectedValue);
                            });       
                            
                            // Arama simgesine tıklama
                            $('#searchIconCalendarEdit').on('click', function () {
                                const $searchContainer = $('#searchContainerCalendarEdit');
                                $searchContainer.toggle(); // Görünürlüğü değiştirir
                            });

                            // Arama girişine yazı yazıldıkça ikonları filtreleme
                            $('#searchInputCalendarEdit').on('input', function () {
                                const query = $(this).val().toLowerCase();

                                // Filtreleme işlemi
                                const filteredIcons = icons.map(category => ({
                                    title: category.title,
                                    icons: category.icons.filter(icon => icon.includes(query))
                                })).filter(category => category.icons.length > 0);

                                // Güncellenmiş ikon listesi
                                const $iconSelection = $('#iconSelection');
                                $iconSelection.html(filteredIcons.map(category => `
                                    <div class="icon-category" style="margin-bottom: 20px;">
                                        <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                            ${category.title}
                                        </h4>
                                        <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                            ${category.icons.map(icon => `
                                                <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                    <i class="fas ${icon}" style="font-size: 20px; color: ${task.gorev_ikon_renk};"></i>
                                                    <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                        ${icon.replace("fa-", "").replace("-", " ")}
                                                    </span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join(''));
                            });

                            // Arama girişinin dışına tıklanınca gizleme
                            $(document).on('click', function (e) {
                                const $searchContainer = $('#searchContainerCalendarEdit');
                                if (!$(e.target).closest('#searchContainerCalendarEdit, #searchIconCalendarEdit').length) {
                                    $searchContainer.hide(); // Giriş kutusunu gizle
                                }
                            });
    
                            // Kategorileri API'den çekme
                            $.ajax({
                                url: '/api/categories', // API endpoint
                                method: 'GET',
                                success: function(response) { // 'categories' yerine 'response' kullanıyoruz
                                    const categories = response.data; // 'data' kısmına erişiyoruz
                            
                                    // Kategorileri menüye ekleme
                                    categories.forEach(function(category) {
                                        $('#taskCategory').append(`
                                            <option value="${category.category_name}" ${task.gorev_kategori === category.category_name ? 'selected' : ''}>
                                                ${category.category_name}
                                            </option>
                                        `);
                                    });
                                },
                                error: function() {
                                    console.error('Kategoriler yüklenemedi.');
                                }
                            });
    
                            // İkon Seçimi: Başlangıçta task.gorev_ikon'a göre ikon seçili yapılacak
                            $('#iconSelection .icon-option').each(function() {
                                if ($(this).data('icon') === task.gorev_ikon) {
                                    $(this).addClass('selected');
    
                                   // $(this).css('border', '2px solid black'); // Seçilen ikonu vurgula
                                }
                            });
    
                            // Renk Seçimi: Başlangıçta task.gorev_ikon_renk'e göre renk seçili yapılacak
                            $('.color-circle').each(function() {
                                if ($(this).data('color') === task.gorev_ikon_renk) {
                                    $(this).addClass('selected');
                                    // Seçilen rengi ikona uygula
                                    $('#iconSelection .fas').css('color', task.gorev_ikon_renk);
                                }
                            });
     
                            // Renk seçimi dinamik renk değişimi
                            $('.color-circle').on('click', function () {
                                playSoundOption();
    
                                const selectedColor = $(this).data('color');
                                
                                // Tüm renk dairelerinden 'selected' sınıfını kaldır
                                $('.color-circle').removeClass('selected');
                                
                                // Seçilen renk dairesine 'selected' sınıfını ekle
                                $(this).addClass('selected');
    
                                $('#iconSelection .fas').css('color', selectedColor);
                                task.gorev_ikon_renk = selectedColor;
                            });
    
                            // İkon seçimi
                            $('.icon-option').on('click', function () {
                                playSoundOption();
                                
                                task.gorev_ikon = $(this).data('icon');
    
                                // Tüm ikonlar üzerindeki 'selected' sınıfını kaldır
                                $('.icon-option').removeClass('selected');
                                
                                // Tıklanan ikona 'selected' sınıfını ekle
                                $(this).addClass('selected');
                                
                            });
    
                            var selectedDate2=task.gorev_tarih;
    
                            // Takvim simgesine tıklandığında takvim diyalog penceresini açma
                            $('#calendarIcon').click(function() {
                                // Tarihi Türkçe formatına uygun şekilde güncelle
                                playSoundClick();
    
                                var formattedDate = new Date(task.gorev_tarih);
                                var day = formattedDate.getDate().toString().padStart(2, '0');
                                var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                                var year = formattedDate.getFullYear();
                                var formattedDateString = `${year}-${month}-${day}`; // YYYY-MM-DD formatı
                    
                                // Ana formdaki tarih alanını güncelle
                                //$('#taskDate').val(formattedDateString);
    
                                // Takvim diyalog penceresini dinamik olarak oluştur
                                var calendarDialogHtml = `
                                    <div id="calendarDialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                        <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                            <h5 style="margin-bottom: 20px;">Tarih Seçin</h5>
                                            <input type="date" id="calendarInput" class="form-control" style="margin-bottom: 20px;">
                                            <div>
                                                <button type="button" id="confirmDate" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                                <button type="button" id="cancelDate" class="btn btn-secondary">İptal</button>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            
                                // Takvim diyalog penceresini body'ye ekle
                                $('body').append(calendarDialogHtml);
                            
                                // Takvim diyalog penceresini göster
                                $('#calendarDialog').fadeIn();
    
                                $('#calendarInput').val(task.gorev_tarih); // Bugünün tarihini YYYY-MM-DD formatında ayarla
                            
                                // Takvim diyalog penceresindeki "Onayla" butonuna tıklanınca tarih ana pencerede güncellenir
                                $('#confirmDate').click(function() {
                                    playSoundClick();
    
                                    selectedDate2 = $('#calendarInput').val();  // Takvimden seçilen tarihi al
                                    if (selectedDate2) {
                                        // Tarihi Türkçe formatına uygun şekilde güncelle
                                        var formattedDate = new Date(selectedDate2);
                                        var day = formattedDate.getDate().toString().padStart(2, '0');
                                        var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                                        var year = formattedDate.getFullYear();
                                        var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl
                            
                                        // Ana formdaki tarih alanını güncelle
                                        $('#taskDate').val(formattedDateString);
                                    }
                            
                                    // Takvim diyalog penceresini kapat
                                    $('#calendarDialog').fadeOut(function() {
                                        // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                                        $('#calendarDialog').remove();
                                    });
                                });
                            
                                // Takvim diyalog penceresindeki "İptal" butonuna tıklanınca pencere kapanır
                                $('#cancelDate').click(function() {
                                    playSoundClick();
    
                                    $('#calendarDialog').fadeOut(function() {
                                        // Takvim diyalog penceresi DOM'dan tamamen kaldırıldığında
                                        $('#calendarDialog').remove();
                                    });
                                });
                            });
                            
                            // "İptal" butonuna tıklanırsa takvim diyalog penceresini kapatma
                            $('#cancelDate').click(function() {
                                playSoundClick();
    
                                $('#calendarDialog').fadeOut();
                            });
    
                            // "Onayla" butonuna tıklanırsa tarih güncellenmesi
                            $('#confirmDate').click(function() {
                                playSoundClick();
    
                                const selectedDate2 = $('#calendarInput').val();
                                if (selectedDate2) {
                                    // Türkçe formata uygun tarih güncellemesi (gg.aa.yyyy formatı)
                                    const formattedDate = new Date(selectedDate2).toLocaleDateString('tr-TR');
                                    $('#taskDate').val(formattedDate);
                                    $('#calendarDialog').fadeOut();
                                }
                            });      
                            
                            // 'Özel' seçeneği seçildiğinde diyalog penceresini göster
                            $('#taskRepeat').on('change', function() {
                                if ($(this).val() === "Özel") {
                                    showCustomDialog();
                                }
                            });

                            function showCustomDialog() {
                                // Diğer içerik, değerler gibi değişkenlerinize uygun şekilde
                                const dialogHtml = `
                                    <div id="specialDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                        <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                            <h5 style="font-weight: bold; margin-bottom: 10px;">ÖZEL GÜN BELİRLEME</h5>
                            
                                            <!-- Gün Sayısı ve Haftanın Günleri Seçenekleri (Her zaman üstte) -->
                                            <div class="mb-3">
                                                <input type="radio" name="repeatType" value="days" id="repeatDays" checked /> Gün Sayısı
                                                <input type="radio" name="repeatType" value="week" id="repeatWeek" /> Haftanın Günleri
                                            </div>
                            
                                            <!-- Sayı Seçimi -->
                                            <div class="mb-3" id="customRepeatDaysContainer" style="margin-bottom: 10px;">
                                                <label for="customRepeatDays">Gün Seçimi (2-6 arası):</label>
                                                <input type="number" id="customRepeatDays" min="2" max="6" style="width: 60px;" /> günde 1
                                            </div>
                            
                                            <!-- Haftanın Günleri Seçimi -->
                                            <div id="weekDaysContainer" style="display: none; margin-bottom: 10px;">
                                                <div>
                                                    <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                        <input type="checkbox" id="monday" /> Pazartesi
                                                    </label>
                                                    <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                        <input type="checkbox" id="tuesday" /> Salı
                                                    </label>
                                                    <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                        <input type="checkbox" id="wednesday" /> Çarşamba
                                                    </label>
                                                    <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                        <input type="checkbox" id="thursday" /> Perşembe
                                                    </label>
                                                    <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                        <input type="checkbox" id="friday" /> Cuma
                                                    </label>
                                                    <label style="display: inline-flex; align-items: center; margin-right: 10px;">
                                                        <input type="checkbox" id="saturday" /> Cumartesi
                                                    </label>
                                                    <label style="display: inline-flex; align-items: center;">
                                                        <input type="checkbox" id="sunday" /> Pazar
                                                    </label>
                                                </div>
                                            </div>
                            
                                            <!-- Onayla ve İptal Butonları -->
                                            <div>
                                                <button type="button" id="confirmCustom" class="btn btn-primary" style="margin-right: 10px;">Onayla</button>
                                                <button type="button" id="cancelCustom" class="btn btn-secondary">İptal</button>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            
                                // Diğer içeriklerle birlikte diyalog penceresini ekleyin
                                $('body').append(dialogHtml);
                            
                                // Gün Sayısı ve Haftanın Günleri seçenekleri arasındaki değişiklikleri kontrol et
                                $('input[name="repeatType"]').on('change', function() {
                                    if ($('#repeatDays').is(':checked')) {
                                        $('#weekDaysContainer').hide(); // Haftanın günleri kutusunu gizle
                                        $('#customRepeatDaysContainer').show(); // Gün sayısı kutusunu göster
                                    } else if ($('#repeatWeek').is(':checked')) {
                                        $('#weekDaysContainer').show(); // Haftanın günleri kutusunu göster
                                        $('#customRepeatDaysContainer').hide(); // Gün sayısı kutusunu gizle
                                    }
                                });
                            
                                // Onayla butonuna tıklama
                                $('#confirmCustom').on('click', function() {
                                    let repeatValue = '';
                            
                                    // Seçilen tür ve değer doğrultusunda taskRepeat değerini güncelle
                                    if ($('#repeatDays').is(':checked')) {
                                        const repeatDays = $('#customRepeatDays').val();
                                        if (repeatDays) {
                                            repeatValue = `OT-${repeatDays}`;
                                        }
                                    } else if ($('#repeatWeek').is(':checked')) {
                                        const selectedDays = [];
                                        const daysMap = {
                                            'monday': '1',
                                            'tuesday': '2',
                                            'wednesday': '3',
                                            'thursday': '4',
                                            'friday': '5',
                                            'saturday': '6',
                                            'sunday': '7'
                                        };
                            
                                        // Haftanın günleri seçilirse sayısal değerleri al
                                        $('#weekDaysContainer input[type="checkbox"]:checked').each(function() {
                                            const dayId = $(this).attr('id');
                                            if (daysMap[dayId]) {
                                                selectedDays.push(daysMap[dayId]);
                                            }
                                        });
                            
                                        // Seçilen günleri "OHA-" ile başlat ve sayısal değerleri ekle
                                        if (selectedDays.length) {
                                            repeatValue = `OHA-${selectedDays.join('')}`;
                                        }
                                    }
                            
                                    // 'taskRepeat' değerini güncelle ve diyalog penceresini kapat
                                    //$('#taskRepeat').val(repeatValue);
                                    ozel_gun = repeatValue;
                                    $('#specialDialog').remove(); // Diyalog penceresini kapat
                                });
                            
                                // İptal butonuna tıklama, diyalog penceresini kapat
                                $('#cancelCustom').on('click', function() {
                                    $('#specialDialog').remove(); // Diyalog penceresini kapat
                                });
                            }
    
                            // Güncelle butonuna tıklama işlemi
                            $('#confirmEdit').on('click', async function () {
                                playSoundClick();
    
                                const description = $('#taskDescription').val().trim();
                                const details = $('#taskDetails').val().trim();
                                const iconClass = $('#iconSelection .icon-option.selected').data('icon') || 'default-icon'; // Seçilen ikonu al
                                const iconColor = $('#colorSelection .color-circle.selected').data('color') || '#000000'; // Seçilen rengi al
                                const category = $('#taskCategory').val().trim().replace(/\s+/g, ' '); // Güncellenen kategori adı
                                const date2 = selectedDate2; // Seçilen tarih
                               
                                const goldAmount = parseInt($('#taskGold').val() || "0", 10);
                                const tpAmount = parseInt($('#taskTp').val() || "0", 10);                                                      

                                const repeatOption = $('#taskRepeat').val(); // Select öğesindeki seçili değeri al
                                let repeatOptionText = $('#taskRepeat').val();
                                
                                switch (repeatOption) {
                                    case "Tekrar Etme":
                                        repeatOptionText = "1";
                                        break;
                                    case "Günlük":
                                        repeatOptionText = "G";
                                        break;
                                    case "Haftalık":
                                        repeatOptionText = "H";
                                        break;
                                    case "Aylık":
                                        repeatOptionText = "A";
                                        break;
                                    case "Yıllık":
                                        repeatOptionText = "Y";
                                        break;
                                    case "Hafta İçi":
                                        repeatOptionText = "HA";
                                        break;
                                    case "Hafta Sonu":
                                        repeatOptionText = "HS";
                                        break;
                                    case "Özel":
                                        repeatOptionText =ozel_gun;
                                        break;
                                    default:
                                        repeatOptionText = "";
                                }

                                // Güncellenen veriler JSON formatında
                                const taskData = {
                                    gorev_ikon: iconClass,
                                    gorev_ikon_renk: iconColor,
                                    gorev_tanimi: description,
                                    gorev_aciklama: details,
                                    gorev_tarih: date2,
                                    gorev_kategori: category,
                                    gorev_tp: tpAmount,
                                    gorev_altin: goldAmount,
                                    gorev_yapildimi: false,
                                    gorev_durumu: "",
                                    gorev_tekrar: repeatOptionText,
                                    onem_derecesi: $('#taskOnemDerecesi').val(),
                                    gorev_tamamlanma_tarihi: ""
                                };
    
                                // Boş bırakma kontrolü
                                if (!description) {
                                    alert("Görev tanımı boş bırakılamaz!");
                                    return;
                                }
    
                                /* const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                                if (!response.ok) throw new Error(`Silme hatası: ${response.status}`);
                                taskCard.remove(); // Görevi kaldır */
    
                                $.ajax({
                                    url: `/api/tasks/${taskId}`, // Görev ID'sine uygun endpoint
                                    type: 'PUT',
                                    contentType: 'application/json',
                                    data: JSON.stringify(taskData),
                                    success: function (response) {
                                        if (response.success) {
                                            //alert("Görev başarıyla güncellendi!");
                                            alert("Görev başarıyla güncellendi!");
                                            $('#editDialog').remove();
                                            // Görev listesini yeniden yüklemek için gerekli kodlar
                                        }
                                    },
                                    error: function (xhr) {
                                        const errorResponse = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu";
                                        alert("Görev güncellenirken bir hata oluştu: " + errorResponse);
                                    }
                                });
    
                                //Veriler güncelleniyor
                                updateUserData();

                                calendarFunction();   
                                
                            });
                        
                            // İptal butonuna tıklama işlemi
                            $('#cancelEdit').on('click', function () {
                                playSoundClick();
    
                                $('#editDialog').remove(); // Sadece diyalog kutusunu kaldır
                            });
                        } else {
    
                            alert("Görev bulunamadı!");
                        }
                    },
                    error: function (xhr, status, error) {
                        alert("Görev verileri alınırken bir hata oluştu: " + error);
                    }
                    
                });
           
            });    

        }
    }
     
    // Hedefler Butonu Fonksiyonu
    function goalsFunction() {
        $('#tasksContainer').html('');
        $('#tasksContainer').removeAttr('style');


        // Popup menü HTML'i
        const filterPopupHTML = `
        <div style="position: relative;">
            <button id="filterPopupBtnGoal" class="btn btn-secondary"></button>
            <div id="filterMenuGoal" style="display: none; position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #ddd; border-radius: 5px; z-index: 1000; width: 120px;">
                <div class="filter-option-goal" data-filter="action">Yürürlükte</div>
                <div class="filter-option-goal" data-filter="completed">Ulaşılan</div>
            </div>
        </div>
        `;        

        let filter = selectedFilterGoal;

        let goalCount=0;

        // Hedefleri listeleme fonksiyonu
        const fetchGoals = async () => {
            try {
                // Filtre değerini belirle
                const filterValue = filter || 'action'; // Eğer filter varsa, onu kullan; yoksa 'action' kullan
        
                // API çağrısını yap
                const response = await $.ajax({
                    url: `/api/goals`,
                    type: 'GET',
                    data: { filter: filterValue } // filter parametresini API'ye gönder
                });
        
                // API'den gelen yanıtın dizi formatında olup olmadığını kontrol et
                if (!Array.isArray(response)) {
                    throw new Error("Backend'den dönen yanıt dizi formatında değil.");
                }
        
                // Görev uzunluğunu al
                goalCount = response.length;
        
                // Görev sayısını ekrana yansıt
                $('#tasksContainer .goal-count').text(`Hedef Sayısı: ${goalCount}`);
        
                // Görevleri ekrana yazdır
                displayGoals(response);
            } catch (err) {
                console.error('Hedefler alınırken hata oluştu:', err);
                $('#goalsList').html('<p>Hedefler yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>');
            }
        };        

        // Hedef sayısını tasksContainer'a ekle
        $('#tasksContainer').html(`
            <div id="goalBar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; position: sticky; top: 0; background-color: #fff; z-index: 10; padding: 10px;">
                ${filterPopupHTML}
                <span class="goal-count" style="font-size: 16px;">Hedef Sayısı: <strong>${goalCount}</strong></span>
                <button id="addGoalBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Yeni Hedef
                </button>
            </div>
            <div id="goalsList" style="max-height: 500px; overflow-y: auto; padding-right: 10px;"></div>
        `);    

         // Görevleri DOM'a ekleme fonksiyonu
        const displayGoals = (goals) => {
            if (!goals || goals.length === 0) {
                $('#goalsList').html('<p>Gösterilecek hedef bulunamadı.</p>');
                return;
            }
        
            const goalCards = goals.map(goal => {
                const formattedDate = new Date(goal.hedef_tarih).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
        
                // Butonları gösterme/gizleme durumunu belirlemek
                const goalActions = !goal.hedef_ulasildimi
                    ? `
                        <div class="goal-actions ms-auto d-flex align-items-center">
                            <button class="btn btn-success complete-goal me-2" style="font-size: 1.5rem; position: relative;">
                                <i class="fas fa-check-circle"></i>
                            </button>
                            <button class="btn btn-danger failure-goal me-2" style="font-size: 1.5rem; position: relative;">
                                <i class="fas fa-times-circle"></i>
                            </button>
                            <button class="btn btn-danger delete-goal" style="font-size: 1.5rem;">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button class="btn btn-primary edit-goal ms-2" style="font-size: 1.5rem;">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>`
                    : '';
        
                // Duruma göre sağ tarafta yeşil tik veya kırmızı çarpı simgesi
                const goalStatusIcon = goal.hedef_ulasildimi
                    ? (goal.hedef_durumu === 'Başarılı' 
                        ? '<i class="fas fa-check-circle" style="color: green;"></i>' 
                        : '<i class="fas fa-times-circle" style="color: red;"></i>')
                    : '';
        
                return `
                    <div class="goal-card" data-id="${goal.id}"  data-tp="${goal.hedef_tp}" 
        data-altin="${goal.hedef_altin}" data-kategori="${goal.hedef_kategori}" style="border: 1px solid #ddd; margin-bottom: 10px; padding: 10px; border-radius: 5px; background-color: #fff;">
                        <div class="d-flex align-items-center">
                            <div class="goal-icon d-flex align-items-center justify-content-center" style="color: ${goal.hedef_ikon_renk}; font-size: 2rem; width: 50px; height: 50px;">
                                <i class="fas ${goal.hedef_ikon}"></i>
                            </div>
                            <div class="goal-info ms-2">
                                <div class="goal-title"><strong>${goal.hedef_tanimi}</strong></div>
                                <div class="goal-description">${goal.hedef_aciklama}</div>
                                <div class="goal-details d-flex flex-wrap">
                                    <span class="me-3"><i class="fas fa-tags"></i> ${goal.hedef_kategori}</span>
                                    <span class="me-3"><i class="fas fa-coins" style="color: gold;"></i> ${goal.hedef_altin}</span>
                                    <span class="me-3"><strong>TP:</strong> ${goal.hedef_tp}</span>
                                </div>
                            </div>
                            <div class="goal-actions ms-auto d-flex align-items-center">
                                ${goalActions}
                                ${goalStatusIcon}
                            </div>
                        </div>
                    </div>
                `;
            });
        
            $('#goalsList').html(goalCards.join(''));
        };

        // İlk kez hedefleri yükle
        fetchGoals();

        // `#filterPopupBtn` öğesini bul ve metni güncelle
        // Filtreye göre içeriği güncelle
        switch (filter) {
            case 'action':
                $('#filterPopupBtnGoal').text("Yürürlükte");
                break;
            case 'completed':
                $('#filterPopupBtnGoal').text("Ulaşılan");
                break;
            default:
                $('#filterPopupBtnGoal').text("Yürürlükte"); // Varsayılan durum
                break;
        }

        // Popup menü işlevselliği
        $('#filterPopupBtnGoal').click((event) => {
            
            $('#filterMenuGoal').hide(); // Filtre menüsünü gizle

            event.stopPropagation(); // Tıklamanın document'e yayılmasını engelle
            playSoundClick(); // Ses çal
            $('#filterMenuGoal').toggle(); // Menü görünürlüğünü değiştir
        });

        $('.filter-option-goal').click(function () {
            
            playSoundOption();
            
            filter = $(this).data('filter');
            $('#filterPopupBtnGoal').text($(this).text());

            selectedFilterGoal=filter;

            //Veriler Güncelleniyor
            updateUserData();

            $('#filterMenuGoal').hide();
            fetchGoals();
        });

        // Document üzerinde bir yere tıklanınca menüleri kapat
        $(document).click(() => {
            $('#filterMenuGoal').hide(); // Filtre menüsünü gizle
        });

        // Menüye tıklanırsa document'e yayılmasını engelle
        $('#filterMenuGoal').click((event) => {
            event.stopPropagation(); // Tıklamanın document'e yayılmasını engelle
        });

        $(document).off('click', '#addGoalBtn').on('click', '#addGoalBtn', function () {
            playSoundClick();
        
            var today = new Date();
            var day = today.getDate().toString().padStart(2, '0');
            var month = (today.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
            var year = today.getFullYear();
            var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl
               
            let hedef_ikon="fa-weight-hanging";
            let hedef_ikon_renk='black';
            let hedef_tanimi='';
            let hedef_aciklama='';
            let hedef_kategori = "Genel";
            let hedef_tp = 0;
            let hedef_altin=0;
            let hedef_ulasildimi = false;
            let hedef_durumu = "";
            let hedef_tamamlanma_tarihi = "";
            let hedef_takip_notlari = "";
            let hedef_geribildirim = "";

            // Diyalog HTML
            const dialogHtml = `
                <div id="addDialogGoal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <form id="addForm">
                            <h5 style="margin-bottom: 20px; font-weight: bold;">Yeni Hedef Ekle</h5>
                          
                            <!-- Renk Seçimi -->
                            <div>
                                <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                    ${colors.map((color, index) => `
                                        <div class="color-circle" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                        ${((index + 1) % 7 === 0) ? '<div style="flex-basis: 100%; height: 0; margin-bottom: 15px;"></div>' : ''}
                                    `).join('')}
                                </div>
                            </div>

                            <!-- İkon Seçimi -->
                            <div class="mb-3">
                                <label for="iconSelectionAddGoal" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                    İkon Seçimi:
                                    <i class="fas fa-search" id="searchIconGoalAdd" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                    <div id="searchContainerGoalAdd" style="display: none; margin-left: 10px;">
                                        <input type="text" id="searchInputGoalAdd" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                    </div>
                                </label>
                                <div id="iconSelectionAddGoal" style="margin-top: 10px;">
                                    ${icons.map(category => `
                                        <div class="icon-category" style="margin-bottom: 20px;">
                                            <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                ${category.title}
                                            </h4>
                                            <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                ${category.icons.map(icon => `
                                                    <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                        <i class="fas ${icon}" style="font-size: 20px; color: ${hedef_ikon_renk};"></i>
                                                        <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                            ${icon.replace("fa-", "").replace("-", " ")}
                                                        </span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Hedef Tanımı -->
                            <div class="mb-3">
                                <label for="goalDescription" class="form-label" style=" font-weight: bold;">Hedef Tanımı:</label>
                                <input type="text" class="form-control" id="goalDescription" value="${hedef_tanimi}">
                            </div>

                            <!-- Hedef Açıklaması -->
                            <div class="mb-3">
                                <label for="goalDetails" class="form-label" style=" font-weight: bold;">Hedef Açıklaması:</label>
                                <textarea class="form-control" id="goalDetails">${hedef_aciklama}</textarea>
                            </div>

                            <!-- Kategori -->
                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                <label for="goalCategory" class="mb-0" style=" font-weight: bold;">Kategori:</label> <!-- Flexbox gap ile mesafe verildi -->
                                <select class="form-select" id="goalCategory" style="width: 200px;">
                                    <!-- Kategoriler buraya dinamik olarak eklenecek -->
                                </select>
                            </div>

                            <!-- Altın -->
                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                <!-- Altın İkonu -->
                                <i class="fas fa-coins" style="color: gold; font-size: 20px;"></i>
                                
                                <!-- Altın Girişi -->
                                <input type="number" class="form-control" id="goalGold" value="${hedef_altin}" min="0" max="100" style="width: 100px;">
                            </div>

                            <!-- TP -->
                            <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                <!-- TP Yazısı -->
                                <label for="goalTp" class="mb-0" style=" font-weight: bold;">TP:</label>
                                
                                <!-- TP Girişi -->
                                <input type="number" class="form-control" id="goalTp" value="${hedef_tp}" min="0" max="100" style="width: 100px;">
                            </div>

                            <!-- Butonlar -->
                            <div style="margin-top: 30px;">
                                <button type="button" id="confirmAddGoal" class="btn btn-primary" style="margin-right: 10px;">Ekle</button>
                                <button type="button" id="cancelAddGoal" class="btn btn-secondary">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            // Diyalog kutusunu sayfaya ekle
            $('body').append(dialogHtml);       
            
            // Arama simgesine tıklama
            $('#searchIconGoalAdd').on('click', function () {
                const $searchContainer = $('#searchContainerGoalAdd');
                $searchContainer.toggle(); // Görünürlüğü değiştirir
            });

            // Arama girişine yazı yazıldıkça ikonları filtreleme
            $('#searchInputGoalAdd').on('input', function () {
                const query = $(this).val().toLowerCase();

                // Filtreleme işlemi
                const filteredIcons = icons.map(category => ({
                    title: category.title,
                    icons: category.icons.filter(icon => icon.includes(query))
                })).filter(category => category.icons.length > 0);

                // Güncellenmiş ikon listesi
                const $iconSelection = $('#iconSelectionAddGoal');
                $iconSelection.html(filteredIcons.map(category => `
                    <div class="icon-category" style="margin-bottom: 20px;">
                        <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                            ${category.title}
                        </h4>
                        <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                            ${category.icons.map(icon => `
                                <div class="icon-option-add-goal" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                    <i class="fas ${icon}" style="font-size: 20px; color: ${hedef_ikon_renk};"></i>
                                    <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                        ${icon.replace("fa-", "").replace("-", " ")}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join(''));
            });

            // Arama girişinin dışına tıklanınca gizleme
            $(document).on('click', function (e) {
                const $searchContainer = $('#searchContainerGoalAdd');
                if (!$(e.target).closest('#searchContainerGoalAdd, #searchIconGoalAdd').length) {
                    $searchContainer.hide(); // Giriş kutusunu gizle
                }
            });

            // Kategorileri API'den çekme
            $.ajax({
                url: '/api/categories', // API endpoint
                method: 'GET',
                success: function(response) { 
                    // API'den dönen veriyi kontrol et
                    if (response.success) {
                        const categories = response.data; // 'data' kısmına erişiyoruz
            
                        // Kategorileri menüye ekleme
                        categories.forEach(function(category) {
                            $('#goalCategory').append(`
                                <option value="${category.category_name}" ${hedef_kategori === category.category_name ? 'selected' : ''}>
                                    ${category.category_name}
                                </option>
                            `);
                        });
                    } else {
                        console.error('Kategoriler alınamadı:', response.error);
                    }
                },
                error: function() {
                    console.error('Kategoriler yüklenemedi.');
                }
            });
            

            // İkon Seçimi: Başlangıçta task.gorev_ikon'a göre ikon seçili yapılacak
            $('#iconSelectionAddGoal .icon-option').each(function() {
                if ($(this).data('icon') === hedef_ikon) {
                    $(this).addClass('selected');

                    // $(this).css('border', '2px solid black'); // Seçilen ikonu vurgula
                }
            });

            // Renk Seçimi: Başlangıçta task.gorev_ikon_renk'e göre renk seçili yapılacak
            $('.color-circle').each(function() {
                if ($(this).data('color') === hedef_ikon_renk) {
                    $(this).addClass('selected');
                    // Seçilen rengi ikona uygula
                    $('#iconSelectionAddGoal .fas').css('color', hedef_ikon_renk);
                }
            });

            // Renk seçimi dinamik renk değişimi
            $('.color-circle').on('click', function () {
                playSoundClick();

                const selectedColor = $(this).data('color');
                
                // Tüm renk dairelerinden 'selected' sınıfını kaldır
                $('.color-circle').removeClass('selected');
                
                // Seçilen renk dairesine 'selected' sınıfını ekle
                $(this).addClass('selected');

                $('#iconSelectionAddGoal .fas').css('color', selectedColor);
                hedef_ikon_renk = selectedColor;
            });

            // İkon seçimi
            $('.icon-option').on('click', function () {
                playSoundClick();

                hedef_ikon = $(this).data('icon');

                // Tüm ikonlar üzerindeki 'selected' sınıfını kaldır
                $('.icon-option').removeClass('selected');
                
                // Tıklanan ikona 'selected' sınıfını ekle
                $(this).addClass('selected');
                
            });

            // Güncelle butonuna tıklama işlemi
            $('#confirmAddGoal').on('click', async function () {
                playSoundClick();

                const description = $('#goalDescription').val().trim();
                const details = $('#goalDetails').val().trim();
                const iconClass = $('#iconSelectionAddGoal .icon-option.selected').data('icon') || 'default-icon'; // Seçilen ikonu al
                const iconColor = $('#colorSelection .color-circle.selected').data('color') || '#000000'; // Seçilen rengi al
                const category = $('#goalCategory').val().trim().replace(/\s+/g, ' '); // Güncellenen kategori adı
         
                const goldAmount = parseInt($('#goalGold').val() || "0", 10);
                const tpAmount = parseInt($('#goalTp').val() || "0", 10);       
                                    
                // Güncellenen veriler JSON formatında
                const goalData = {
                    hedef_ikon: iconClass,
                    hedef_ikon_renk: iconColor,
                    hedef_tanimi: description,
                    hedef_aciklama: details,
                    hedef_kategori: category,
                    hedef_tp: tpAmount,
                    hedef_altin: goldAmount,
                    hedef_ulasildimi: false,
                    hedef_durumu: "",
                    hedef_tamamlanma_tarihi: "",
                    hedef_takip_notlari: "",
                    hedef_geribildirim: ""
                };

                // Boş bırakma kontrolü
                if (!description) {
                    alert("Hedef tanımı boş bırakılamaz!");
                    return;
                }

                $.ajax({
                    url: `/api/goals`, // Görev ID'sine uygun endpoint
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(goalData), // Veriyi JSON string'e dönüştürmelisiniz
                    success: function (response) {
                        if (response.success) {
                            alert("Hedef başarıyla eklendi!");
                            $('#addDialogGoal').remove();
                            // Görev listesini yeniden yüklemek için gerekli kodlar
                        } else {
                            alert("Hedef eklenirken bir sorun oluştu.");
                        }
                    },
                    error: function (xhr) {
                        const errorResponse = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu";
                        alert("Hedef eklenirken bir hata oluştu: " + errorResponse);
                    }
                });

                fetchGoals();
                
            });
        
            // İptal butonuna tıklama işlemi
            $('#cancelAddGoal').on('click', function () {
                playSoundClick();

                $('#addDialogGoal').remove(); // Sadece diyalog kutusunu kaldır
            });
        
        }); 

        $(document).on('click', '.complete-goal', function () {
            playSoundSuccess();
    
            const $goalCard = $(this).closest('.goal-card');
            const goalId = $goalCard.data('id');
            const hedefKategori = $goalCard.data('kategori');
        
            // Get today's date in the format YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0]; // Example: "2024-12-20"
        
            // Animate the check icon
            const $checkIcon = $(this).find('.fa-check-circle');
            $checkIcon.css({
                transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                transform: "scale(1.5)",
                color: "green"
            });
        
            setTimeout(() => {
                $checkIcon.css('transform', 'scale(1)');
            }, 300);
    
            // Get hedef_tp and hedef_altin values from goalCard
            const hedef_tp = parseInt($goalCard.data('tp'), 10) || 0; // Default to 0 if not provided
            const hedef_altin = parseInt($goalCard.data('altin'), 10) || 0; // Default to 0 if not provided
    
            // Update usertp and usergold variables
            if (!$(this).data('updated')) { // Ensure usertp and usergold are only updated once
                usertp += hedef_tp;
                usergold += hedef_altin;
                $(this).data('updated', true); // Flag to prevent multiple updates
            }                  
      
            // Check if userlevel is greater than 0 and usertp becomes less than 0
            if (usertp >=50) {
                playSoundMagic();
    
                userlevel += 1;
                usertp -=50;
    
                // Update the UI with the new values
                $('.userlevel').text(userlevel)
                    .addClass('animateValue')  // Animasyonu başlat
                    .one('animationend', function() {  // Animasyon tamamlandığında sınıfı kaldır
                        $(this).removeClass('animateValue');
                });
            } else {
                $('.userlevel').text(userlevel);
            }
    
            // Update the UI with the new values
            $('.usergold').text(usergold);
            $('.usertp').text(usertp);
    
           //Veriler güncelleniyor
           updateUserData();

           $.ajax({
                url: '/api/categories', // Kategori verilerinin olduğu API
                type: 'GET',
                success: function (response) {
                    // API'nin döndürdüğü yapıyı kontrol edin
                    const categories = response.data || []; // Kategori verilerini alıyoruz
            
                    if (!Array.isArray(categories)) {
                        console.error('Beklenen bir dizi, ancak farklı bir veri yapısı alındı:', response);
                        return;
                    }
            
                    // İlgili kategoriyi bul
                    const category = categories.find(cat => cat.category_name === hedefKategori);
            
                    if (!category) {
                        console.error(`Kategori bulunamadı: ${hedefKategori}`);
                        return;
                    }
            
                    let categoryName = category.category_name;
                    let categoryLevel = parseInt(category.category_level, 10) || 0;
                    let categoryTp = parseInt(category.category_tp, 10) || 0;
            
                    if (!$(this).data('updated')) { // Ensure usertp and usergold are only updated once
                        categoryTp += hedef_tp;
            
                        if (categoryTp > 50) {
                            categoryTp -= 50;
                            categoryLevel += 1; // Seviye artır
                        }
            
                        $(this).data('updated', true); // Flag to prevent multiple updates
                    }
            
                    // Kategoriyi güncelle
                    $.ajax({
                        url: '/api/categories', // Kategori güncelleme API'si
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            id: category.id, // Kategori ID'si
                            category_name: categoryName,
                            category_level: categoryLevel,
                            category_tp: categoryTp
                        }),
                        success: function () {
                            console.log(`Kategori başarıyla güncellendi: ${categoryName}`);
                        },
                        error: function (err) {
                            console.error('Kategori güncellenirken hata oluştu:', err);
                        }
                    });
                },
                error: function (err) {
                    console.error('Kategori verileri alınırken hata oluştu:', err);
                }
            });
        
            // Mark the task as completed and remove the card
            setTimeout(() => {
                // Update the task's state (e.g., `hedef_ulasildimi = true`)
                $.ajax({
                    url: `/api/goals/${goalId}`,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        hedef_ulasildimi: true, // Set the task as completed
                        hedef_durumu: "Başarılı",
                        hedef_tamamlanma_tarihi: today // Add today's date as completion date
                    }),
                    success: function (response) {
                        console.log(`Hedef ${goalId} başarıyla tamamlandı.`);
                
                        // Güncellenen hedef bilgilerini alıp işleyebiliriz
                        if (response.success && response.updatedGoal) {
                            const updatedGoal = response.updatedGoal;
                            console.log('Güncellenmiş Hedef:', updatedGoal);
                
                            // Başarılı bir güncelleme sonrası hedefleri tekrar yüklemek için fetchGoals() fonksiyonunu çağırıyoruz
                            fetchGoals();
                
                            // Güncellenen hedefi UI'dan kaldırmak için ilgili kartı (veya öğeyi) siliyoruz
                            $goalCard.remove();  // Hedef kartını UI'dan kaldırıyoruz
                        }
                    },
                    error: function (err) {
                        console.error('Hedef güncellenirken hata oluştu:', err);
                    }
                });
    
                selectedFilterGoal=filter;

                //Veriler güncelleniyor
                updateUserData();
    
                goalsFunction();   
    
            }, 600); 
    
        });  

        $(document).on('click', '.failure-goal', function () {
            playSoundFail();
    
            const $goalCard = $(this).closest('.goal-card');
            const goalId = $goalCard.data('id');
    
            // Diyalog penceresini oluştur
            $('body').append(`
                <div id="customDialogGoal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                        <div style="background: white; padding: 20px; border-radius: 8px; width: 300px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <p>Bu hedefe ulaşılamadı sayılacak. Kabul ediyor musunuz?</p>
                            <button id="confirmFailureGoal" class="btn btn-danger">Onayla</button>
                            <button id="cancelFailureGoal" class="btn btn-secondary">İptal</button>
                        </div>
                </div>
            `);
    
            // Diyalog penceresini göster
            $('#customDialogGoal').fadeIn();
    
            // "Onayla" butonuna tıklanması durumunda
            $(document).on('click', '#confirmFailureGoal', function () {
                playSoundFail();
                // Bugünün tarihini al
                const today = new Date().toISOString().split('T')[0]; // Example: "2024-12-20"
                const hedefKategori = $goalCard.data('hedefkategori');
    
                // Get hedef_tp and hedef_altin values from goalCard
                const hedef_tp = parseInt($goalCard.data('tp'), 10) || 0; // Default to 0 if not provided
                const hedef_altin = parseInt($goalCard.data('altin'), 10) || 0; // Default to 0 if not provided
    
                // Update usertp and usergold variables
                usertp -= hedef_tp;
                usergold -= hedef_altin;
    
                // Check if userlevel is greater than 0 and usertp becomes less than 0
                if (usertp < 0) {
                    if (userlevel > 0) {
                        // If userlevel is greater than 0, decrease userlevel by 1 and set usertp to (50 - hedef_tp)
                        userlevel -= 1;
                        usertp+=50;
                    } else {
                        // If userlevel is 0 or less, set usertp to 0
                        usertp = 0;
                    }
                }
    
                if (usergold<0) {
                    usergold=0;
                }
    
                // Update the UI with the new values
                $('.usertp').text(usertp);
                $('.usergold').text(usergold);
                $('.userlevel').text(userlevel);
    
                //Veriler güncelleniyor
                updateUserData();

                $.ajax({
                    url: '/api/categories', // Kategori verilerinin olduğu API
                    type: 'GET',
                    success: function (response) {
                        // API'nin döndürdüğü yapıyı kontrol et
                        const categories = response.success ? response.data : [];
                
                        if (!Array.isArray(categories)) {
                            console.error('Beklenen bir dizi, ancak farklı bir veri yapısı alındı:', response);
                            return;
                        }
                
                        // İlgili kategoriyi bul
                        const category = categories.find(cat => cat.category_name === gorevKategori);
                
                        if (!category) {
                            console.error(`Kategori bulunamadı: ${gorevKategori}`);
                            return;
                        }
                
                        let categoryName = category.category_name;
                        let categoryLevel = parseInt(category.category_level, 10) || 0;
                        let categoryTp = parseInt(category.category_tp, 10) || 0;
                
                        if (!$(this).data('updated')) { // Kullanıcı tipi ve altın yalnızca bir kez güncellenmeli
                            if ((categoryTp - hedef_tp) > 0) {
                                categoryTp -= hedef_tp;
                            } else if (categoryLevel > 0) {
                                categoryLevel -= 1; // Seviye düşür
                                categoryTp += 50 - hedef_tp;
                            }
                
                            $(this).data('updated', true); // Çoklu güncellemeyi engellemek için bayrak
                        }
                
                        // Kategoriyi güncelle
                        $.ajax({
                            url: `/api/categories`, // Güncelleme API'si
                            type: 'PUT',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                id: category.id, // Kategori ID'si
                                category_name: categoryName,
                                category_level: categoryLevel,
                                category_tp: categoryTp
                            }),
                            success: function () {
                                console.log(`Kategori başarıyla güncellendi: ${categoryName}`);
                            },
                            error: function (err) {
                                console.error('Kategori güncellenirken hata oluştu:', err);
                            }
                        });
                    },
                    error: function (err) {
                        console.error('Kategori verileri alınırken hata oluştu:', err);
                    }
                });
                
                // Mark the task as completed and remove the card
                // Hedef güncellemesi (başarısızlık durumu ve hedef_ulasildimi: true olarak)
                $.ajax({
                    url: `/api/goals/${goalId}`,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        hedef_ulasildimi: true, // Hedefi tamamlanmış olarak işaretle
                        hedef_durumu: "Başarısız",
                        hedef_tamamlanma_tarihi: today // Bugünün tarihini tamamlanma tarihi olarak ekle
                    }),
                    success: function (response) {
                        if (response.success) {
                            console.log(`Hedef ${goalId} başarıyla güncellendi.`);
                            
                            // UI'dan hedef kartını kaldır
                            $goalCard.remove(); 
                            
                            // Diyalog penceresini gizle ve kaldır
                            $('#customDialogGoal').fadeOut(); 
                            $('#customDialogGoal').remove();
                
                            // Güncel hedefleri tekrar al
                            fetchGoals();
                        } else {
                            console.error('Hedef güncellenirken beklenmedik bir hata oluştu:', response.error);
                        }
    
                    },
                    error: function (err) {
                        console.error('Hedef güncellenirken hata oluştu:', err);
                    }
                });
    
                selectedFilterGoal=filter;

                //Veriler güncelleniyor
                updateUserData();
    
                goalsFunction();
    
            });
    
            // "İptal" butonuna tıklanması durumunda
            $(document).on('click', '#cancelFailureGoal', function () {
                playSoundClick();
    
                $('#customDialog').fadeOut(500, function() {
                    $(this).remove();
                });
                
            });
    
        });

        $(document).off('click', '.delete-goal').on('click', '.delete-goal', function () {
            playSoundDelete();
    
            const goalCard = $(this).closest('.goal-card');
            const goalId = goalCard.data('id');
    
            // Diyalog kutusunu oluştur
            const dialogHtml = `
                <div id="deleteDialogGoal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; padding: 20px; border-radius: 8px; width: 300px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <p style="margin-bottom: 20px;">Bu hedef silinecek. Emin misiniz?</p>
                        <div>
                            <button id="confirmDeleteGoal" class="btn btn-danger" style="margin-right: 10px;">Onayla</button>
                            <button id="cancelDeleteGoal" class="btn btn-secondary">İptal</button>
                        </div>
                    </div>
                </div>
            `;
    
            // Diyalog kutusunu sayfaya ekle
            $('body').append(dialogHtml);
    
            // Onayla butonuna tıklama işlemi
            $('#confirmDeleteGoal').on('click', async function () {
                playSoundDelete(); // Silme sesi çalma
            
                try {
                    const response = await fetch(`/api/goals/${goalId}`, { 
                        method: 'DELETE' 
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Silme hatası: ${errorData.error || response.status}`);
                    }
            
                    // Hedef başarıyla silindi, kartı UI'dan kaldır
                    goalCard.remove(); 
            
                } catch (error) {
                    console.error("Hedef silinirken hata oluştu:", error);
                    alert("Hedef silinirken bir hata oluştu.");
                } finally {
                    // Diyalog penceresini kaldır
                    $('#deleteDialogGoal').remove(); 
                }
            
                // Güncel hedefleri tekrar al
                fetchGoals();
            });
            
    
            // İptal butonuna tıklama işlemi
            $('#cancelDeleteGoal').on('click', function () {
                playSoundClick();
    
                $('#deleteDialogGoal').fadeOut(500, function() {
                    $(this).remove();
                });

            });
        });

        $(document).off('click', '.edit-goal').on('click', '.edit-goal', function () {
            playSoundClick();
    
            const goalCard = $(this).closest('.goal-card');
            const goalId = goalCard.data('id');
    
            let goal; // goal objesini dışarıda tanımladık
                  
            /// goal verilerini al (örnek bir veri alım yöntemi, bunu back-end'e uygun şekilde güncelleyebilirsiniz)
            $.ajax({
                url: `/api/goals`, // Tüm görevleri almak için endpoint
                type: 'GET',
                data: {
                    filter: 'action' // veya 'completed', filtreleme yapmak için
                },
                success: function (response) {
                    goal = response.find(t => t.id === goalId); // ID'ye göre görevi bul
                    if (goal) {
                        var formattedDate = new Date(goal.hedef_tarih);
                        var day = formattedDate.getDate().toString().padStart(2, '0');
                        var month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');  // Ay 0-11 arası olduğu için +1 yapılır
                        var year = formattedDate.getFullYear();
                        var formattedDateString = `${day}.${month}.${year}`;  // Format: gün.ay.yıl  
        
                        // Diyalog HTML
                        const dialogHtml = `
                            <div id="editDialogGoal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                                <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 90%; overflow-y: auto; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <form id="editForm">
                                        <h5 style="margin-bottom: 20px; font-weight: bold;">Hedef Düzenleme</h5>
                                 
                                        <!-- Renk Seçimi -->
                                        <div>
                                            <label for="colorSelection" style=" font-weight: bold;">Renk Seçimi:</label>
                                            <div id="colorSelection" style="display: flex; flex-wrap: wrap; margin-top: 10px; margin-left: 15px;">
                                                ${colors.map((color, index) => `
                                                    <div class="color-circle" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; cursor: pointer; margin: 10px;" data-color="${color}"></div>
                                                    ${((index + 1) % 7 === 0) ? '<div style="flex-basis: 100%; height: 0; margin-bottom: 15px;"></div>' : ''}
                                                `).join('')}
                                            </div>
                                        </div>

                                        <!-- İkon Seçimi -->
                                        <div class="mb-3">
                                            <label for="iconSelection" style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                                                İkon Seçimi:
                                                <i class="fas fa-search" id="searchIconGoalEdit" style="cursor: pointer; font-size: 18px; color: #333;"></i>
                                                <div id="searchContainerGoalEdit" style="display: none; margin-left: 10px;">
                                                    <input type="text" id="searchInputGoalEdit" class="form-control" placeholder="İkon ara..." style="width: 200px;" />
                                                </div>
                                            </label>
                                            <div id="iconSelection" style="margin-top: 10px;">
                                                ${icons.map(category => `
                                                    <div class="icon-category" style="margin-bottom: 20px;">
                                                        <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                                            ${category.title}
                                                        </h4>
                                                        <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                                            ${category.icons.map(icon => `
                                                                <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                                    <i class="fas ${icon}" style="font-size: 20px; color: ${goal.hedef_ikon_renk};"></i>
                                                                    <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                                        ${icon.replace("fa-", "").replace("-", " ")}
                                                                    </span>
                                                                </div>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
    
                                        <!-- Hedef Tanımı -->
                                        <div class="mb-3">
                                            <label for="goalDescription" class="form-label" style=" font-weight: bold;">Hedef Tanımı:</label>
                                            <input type="text" class="form-control" id="goalDescription" value="${goal.hedef_tanimi}">
                                        </div>
    
                                        <!-- Hedef Açıklaması -->
                                        <div class="mb-3">
                                            <label for="goalDetails" class="form-label" style=" font-weight: bold;">Hedef Açıklaması:</label>
                                            <textarea class="form-control" id="goalDetails">${goal.hedef_aciklama}</textarea>
                                        </div>
    
                                        <!-- Kategori -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <label for="goalCategory" class="mb-0" style=" font-weight: bold;">Kategori:</label> <!-- Flexbox gap ile mesafe verildi -->
                                            <select class="form-select" id="goalCategory" style="width: 200px;">
                                                <!-- Kategoriler buraya dinamik olarak eklenecek -->
                                            </select>
                                        </div>
    
                                        <!-- Altın -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- Altın İkonu -->
                                            <i class="fas fa-coins" style="color: gold; font-size: 20px;"></i>
                                            
                                            <!-- Altın Girişi -->
                                            <input type="number" class="form-control" id="goalGold" value="${goal.hedef_altin}" min="0" max="100" style="width: 100px;">
                                        </div>
    
                                        <!-- TP -->
                                        <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                                            <!-- TP Yazısı -->
                                            <label for="goalTp" class="mb-0" style=" font-weight: bold;">TP:</label>
                                            
                                            <!-- TP Girişi -->
                                            <input type="number" class="form-control" id="goalTp" value="${goal.hedef_tp}" min="0" max="100" style="width: 100px;">
                                        </div>
    
                                        <!-- Butonlar -->
                                        <div style="margin-top: 30px;">
                                            <button type="button" id="confirmEditGoal" class="btn btn-primary" style="margin-right: 10px;">Güncelle</button>
                                            <button type="button" id="cancelEditGoal" class="btn btn-secondary">İptal</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        `;
    
                        // Diyalog kutusunu sayfaya ekle
                        $('body').append(dialogHtml);

                        // Arama simgesine tıklama
                        $('#searchIconGoalEdit').on('click', function () {
                            const $searchContainer = $('#searchContainerGoalEdit');
                            $searchContainer.toggle(); // Görünürlüğü değiştirir
                        });

                        // Arama girişine yazı yazıldıkça ikonları filtreleme
                        $('#searchInputGoalEdit').on('input', function () {
                            const query = $(this).val().toLowerCase();

                            // Filtreleme işlemi
                            const filteredIcons = icons.map(category => ({
                                title: category.title,
                                icons: category.icons.filter(icon => icon.includes(query))
                            })).filter(category => category.icons.length > 0);

                            // Güncellenmiş ikon listesi
                            const $iconSelection = $('#iconSelection');
                            $iconSelection.html(filteredIcons.map(category => `
                                <div class="icon-category" style="margin-bottom: 20px;">
                                    <h4 style="text-align: center; font-size: 1.25rem; color: #333; margin-bottom: 10px;">
                                        ${category.title}
                                    </h4>
                                    <div class="icon-list d-flex flex-wrap" style="gap: 10px; justify-content: center;">
                                        ${category.icons.map(icon => `
                                            <div class="icon-option" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;" data-icon="${icon}">
                                                <i class="fas ${icon}" style="font-size: 20px; color: ${goal.hedef_ikon_renk};"></i>
                                                <span style="margin-top: 5px; font-size: 0.875rem; color: #555;">
                                                    ${icon.replace("fa-", "").replace("-", " ")}
                                                </span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join(''));
                        });

                        // Arama girişinin dışına tıklanınca gizleme
                        $(document).on('click', function (e) {
                            const $searchContainer = $('#searchContainerGoalEdit');
                            if (!$(e.target).closest('#searchContainerGoalEdit, #searchIconGoalEdit').length) {
                                $searchContainer.hide(); // Giriş kutusunu gizle
                            }
                        });

                        // Kategorileri API'den çekme
                        $.ajax({
                            url: '/api/categories', // API endpoint
                            method: 'GET',
                            success: function(response) { // 'categories' yerine 'response' kullanıyoruz
                                const categories = response.data; // 'data' kısmına erişiyoruz
                        
                                // Kategorileri menüye ekleme
                                categories.forEach(function(category) {
                                    $('#goalCategory').append(`
                                        <option value="${category.category_name}" ${goal.hedef_kategori === category.category_name ? 'selected' : ''}>
                                            ${category.category_name}
                                        </option>
                                    `);
                                });
                            },
                            error: function() {
                                console.error('Kategoriler yüklenemedi.');
                            }
                        });
    
                        // İkon Seçimi: Başlangıçta task.gorev_ikon'a göre ikon seçili yapılacak
                        $('#iconSelection .icon-option').each(function() {
                            if ($(this).data('icon') === goal.hedef_ikon) {
                                $(this).addClass('selected');
    
                               // $(this).css('border', '2px solid black'); // Seçilen ikonu vurgula
                            }
                        });
    
                        // Renk Seçimi: Başlangıçta task.gorev_ikon_renk'e göre renk seçili yapılacak
                        $('.color-circle').each(function() {
                            if ($(this).data('color') === goal.hedef_ikon_renk) {
                                $(this).addClass('selected');
                                // Seçilen rengi ikona uygula
                                $('#iconSelection .fas').css('color', goal.hedef_ikon_renk);
                            }
                        });
    
                        // Renk seçimi dinamik renk değişimi
                        $('.color-circle').on('click', function () {
                            playSoundOption();
    
                            const selectedColor = $(this).data('color');
                            
                            // Tüm renk dairelerinden 'selected' sınıfını kaldır
                            $('.color-circle').removeClass('selected');
                            
                            // Seçilen renk dairesine 'selected' sınıfını ekle
                            $(this).addClass('selected');
    
                            $('#iconSelection .fas').css('color', selectedColor);
                            goal.hedef_ikon_renk = selectedColor;
                        });
    
                        // İkon seçimi
                        $('.icon-option').on('click', function () {
                            playSoundOption();
                            
                            goal.hedef_ikon = $(this).data('icon');
    
                            // Tüm ikonlar üzerindeki 'selected' sınıfını kaldır
                            $('.icon-option').removeClass('selected');
                            
                            // Tıklanan ikona 'selected' sınıfını ekle
                            $(this).addClass('selected');
                            
                        });      
    
                        // Güncelle butonuna tıklama işlemi
                        $('#confirmEditGoal').on('click', async function () {
                            playSoundClick();
    
                            const description = $('#goalDescription').val().trim();
                            const details = $('#goalDetails').val().trim();
                            const iconClass = $('#iconSelection .icon-option.selected').data('icon') || 'default-icon'; // Seçilen ikonu al
                            const iconColor = $('#colorSelection .color-circle.selected').data('color') || '#000000'; // Seçilen rengi al
                            const category = $('#goalCategory').val().trim().replace(/\s+/g, ' '); // Güncellenen kategori adı
                            const goldAmount = parseInt($('#goalGold').val() || "0", 10);
                            const tpAmount = parseInt($('#goalTp').val() || "0", 10);                                                      
                          
                            // Güncellenen veriler JSON formatında
                            const goalData = {
                                hedef_ikon: iconClass,
                                hedef_ikon_renk: iconColor,
                                hedef_tanimi: description,
                                hedef_aciklama: details,
                                hedef_kategori: category,
                                hedef_tp: tpAmount,
                                hedef_altin: goldAmount,
                                hedef_ulasildimi: false,
                                hedef_durumu: "",
                                hedef_tamamlanma_tarihi: "",
                                hedef_takip_notlari: goal.hedef_takip_notlari,
                                hedef_geribildirim: goal.hedef_geribildirim
                            };
    
                            // Boş bırakma kontrolü
                            if (!description) {
                                alert("Hedef tanımı boş bırakılamaz!");
                                return;
                            }
    
                            $.ajax({
                                url: `/api/goals/${goalId}`, // Hedef ID'sine uygun endpoint
                                type: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify(goalData),
                                success: function (response) {
                                    if (response.success) {
                                        alert("Hedef başarıyla güncellendi!");
                                        $('#editDialogGoal').remove();
                                        // Hedef listesini yeniden yüklemek için gerekli kodlar
                                        
                                        fetchGoals();
                                    }
                                },
                                error: function (xhr) {
                                    const errorResponse = xhr.responseJSON?.error || "Bilinmeyen bir hata oluştu";
                                    alert("Hedef güncellenirken bir hata oluştu: " + errorResponse);
                                }
                            });
                            
    
                        });
                    
                        // İptal butonuna tıklama işlemi
                        $('#cancelEditGoal').on('click', function () {
                            playSoundClick();
    
                            $('#editDialogGoal').remove(); // Sadece diyalog kutusunu kaldır
                        });
                    } else {
    
                        alert("Hedef bulunamadı!");
                    }
                },
                error: function (xhr, status, error) {
                    alert("Hedef verileri alınırken bir hata oluştu: " + error);
                }
                
            });
       
        }); 

    }

    // Alışkanlık Takibi Butonu Fonksiyonu
    function habitTrackerFunction() {
        $('#tasksContainer').html('');
        $('#tasksContainer').removeAttr('style');

    
        const maxDays = 31; // Maximum number of days in the table
        let habitsData = [];
    
        function fetchHabitsData(category = '', completed = '') {
            // API'ye filtreleme parametrelerini gönderecek şekilde sorgu yapıyoruz
            const queryParams = {};
        
            if (category) {
                queryParams.category = category;  // Kategori filtresi varsa ekliyoruz
            }
        
            if (completed) {
                queryParams.completed = completed;  // Tamamlanmışlık durumu varsa ekliyoruz
            }
        
            $.get('/api/habits', queryParams, (data) => {
                if (Array.isArray(data)) {
                    habitsData = data.map(habit => ({
                        id: habit.id,
                        aliskanlik_tanimi: habit.aliskanlik_tanimi,
                        aliskanlik_aciklama: habit.aliskanlik_aciklama || '',
                        aliskanlik_baslangic_tarihi: habit.aliskanlik_baslangic_tarihi,
                        aliskanlik_gun_sayisi: habit.aliskanlik_gun_sayisi,
                        aliskanlik_gunluk_takip: habit.aliskanlik_gunluk_takip,
                        aliskanlik_kategori: habit.aliskanlik_kategori,
                        aliskanlik_tp: habit.aliskanlik_tp || 0,
                        aliskanlik_altin: habit.aliskanlik_altin || 0,
                        aliskanlik_ulasildimi: habit.aliskanlik_ulasildimi,
                        aliskanlik_durumu: habit.aliskanlik_durumu
                    }));
                    renderTable();  // Veriyi tabloda render et
                } else {
                    console.error('Invalid habits data received from API.');
                }
            }).fail((err) => {
                console.error('Failed to fetch habits data:', err);
            });
        }

        // Yardımcı Fonksiyon
        function parseToArray(value) {
            if (Array.isArray(value)) {
                return value; // Zaten bir array ise, olduğu gibi döndür
            }
            try {
                return JSON.parse(value); // String olarak geliyorsa JSON.parse ile çöz
            } catch (e) {
                console.error('aliskanlik_gunluk_takip cannot be parsed to an array:', value, e);
                return []; // Hata durumunda boş bir array döndür
            }
        }
        
        function showAddHabitDialog() {
            let aliskanlik_kategori = "Genel";

            const dialogHtml = `
                <div id='addHabitDialog' class='dialog' style="width: 370px; margin: 0 auto;">
                    <!-- Başlık Eklendi -->
                    <div class='dialog-header' style="display: flex; justify-content: center;">
                        <h4 style="margin-bottom:10px; font-weight: bold;">ALIŞKANLIK EKLEME</h4>
                    </div>
                    
                    <!-- Alışkanlık Adı Alanı -->
                    <div class='form-group' style="margin-top: 5px;">
                        <label for='habitName' style="font-weight: bold;">Alışkanlık Adı:</label>
                        <input type='text' id='habitName' style="width: 100%;  padding: 5px; box-sizing: border-box;"/>
                    </div>

                    <div class='form-group'>
                        <label for='habitDescription' style="font-weight: bold;">Açıklama:</label>
                        <textarea id='habitDescription'></textarea>
                    </div>
                    
                    <div class='form-group row'>
                        <label for='habitStartDate' class='col-label'>Başlangıç Tarihi:</label>
                        <input type='date' id='habitStartDate' class='col-input'>
                    </div>

                    <!-- Alışkanlık Gün Sayısı Alanı -->
                    <div class='form-group row'>
                        <label for='habitDaysCount' class='col-label'>Alışkanlık Gün Sayısı:</label>
                        <input type='number' id='habitDaysCount' class='col-input' min="1" max="31">
                    </div>
                    
                    <div class="form-group row align-items-center">
                        <label for="habitCategory" class="col-auto" style="font-weight: bold;">Kategori:</label>
                        <div class="col-auto">
                            <select class="form-select" id="habitCategory" style="width: 150px;">
                                <!-- Kategoriler buraya dinamik olarak eklenecek -->
                            </select>
                        </div>
                    </div>

                    <div class='form-group row'>
                        <label for='habitTP' class='col-label'>TP:</label>
                        <input type='number' id='habitTP' class='col-input'>
                    </div>

                    <div class='form-group row'>
                        <label for='habitGold' class='col-label'>Altın:</label>
                        <input type='number' id='habitGold' class='col-input'>
                    </div>
                                        
                    <div class='button-group'>
                        <button id='confirmAddHabit' class='btn btn-success'>Onayla</button>
                        <button id='cancelAddHabit' class='btn btn-danger'>İptal</button>
                    </div>
                </div>
                `;
    
            $('body').append(dialogHtml);

            // Kategorileri API'den çekme
            $.ajax({    
                url: '/api/categories', // API endpoint
                method: 'GET',
                success: function(response) { // 'categories' yerine 'response' kullanıyoruz
                    const categories = response.data; // 'data' kısmına erişiyoruz
            
                    // Kategorileri menüye ekleme
                    categories.forEach(function(category) {
                        $('#habitCategory').append(`
                            <option value="${category.category_name}" ${aliskanlik_kategori === category.category_name ? 'selected' : ''}>
                                ${category.category_name}
                            </option>
                        `);
                    });
                },
                error: function() {
                    console.error('Kategoriler yüklenemedi.');
                }
            });
    
            $('#confirmAddHabit').click(() => {
                // Gün sayısını alıyoruz
                let aliskanlikGunSayisi = parseInt($('#habitDaysCount').val());

                // Eğer girilen değer 1 ile 31 arasında değilse, uyarı veriyoruz
                if (aliskanlikGunSayisi < 1 || aliskanlikGunSayisi > 31) {
                    alert('Lütfen geçerli bir gün sayısı girin (1 ile 31 arasında).');
                    return;  // Geçerli olmayan değer girildiğinde işlem durur
                }

                console.log("aliskanlikGunSayisi",aliskanlikGunSayisi);

                // `aliskanlik_gunluk_takip` dizisini gün sayısına göre oluşturuyoruz
                let aliskanlikGunlukTakip = Array(aliskanlikGunSayisi).fill(false);
                console.log("aliskanlikGunlukTakip",aliskanlikGunlukTakip);
            
                const newHabit = {
                    aliskanlik_tanimi: $('#habitName').val(),
                    aliskanlik_aciklama: $('#habitDescription').val(),
                    aliskanlik_baslangic_tarihi: $('#habitStartDate').val(),
                    aliskanlik_gun_sayisi: aliskanlikGunSayisi,
                    aliskanlik_gunluk_takip: aliskanlikGunlukTakip,
                    aliskanlik_kategori: $('#habitCategory').val(),
                    aliskanlik_tp: parseInt($('#habitTP').val()) || 0,
                    aliskanlik_altin: parseInt($('#habitGold').val()) || 0,
                    aliskanlik_ulasildimi: false,
                    aliskanlik_durumu: ''
                };

                $.ajax({
                    url: '/api/habits',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(newHabit), // Veriyi JSON formatında gönder
                    success: (response) => {
                        if (response.success) {
                            // Yeni alışkanlık başarılı bir şekilde eklendiyse
                            habitsData.push(response.newHabit); // Yeni alışkanlık verisini listeye ekle
                            renderTable(); // Tabloyu yeniden render et
                            $('#addHabitDialog').remove(); // Alışkanlık ekleme dialogunu kapat
                        } else {
                            console.error('Yeni alışkanlık eklenirken hata oluştu:', response.error);
                        }
                    },
                    error: (err) => {
                        console.error('Failed to add habit:', err);
                    }
                });
            
            });

            $('#cancelAddHabit').click(() => {
                $('#addHabitDialog').fadeOut(500, function() {
                    $(this).remove();
                });                
            });
            
        }
    
        function renderTable() {
            let tableHtml = `
                <div class='table-container'  style="max-height: 570px; overflow-y: auto;  overflow-x: hidden; padding: 10px;">
                    <!-- Başlık Ekleniyor -->
                    <h5 style="font-weight: bold; text-align: center; margin-bottom: 10px;">ALIŞKANLIK TAKİP ÇİZELGESİ</h5>
                    
                    <!-- Tablo Başlangıcı -->
                    <table id='habitTable' class='table'>
                    <colgroup>
                        <col style="width: 200px;">
                        <!-- Diğer sütun genişliklerini tanımlayın -->
                    </colgroup>
                        <thead>
                            <tr>
                                <th>Alışkanlık</th>`;
                    
                        // Gün Sayıları
                        for (let i = 1; i <= maxDays; i++) {
                            tableHtml += `<th>${i}</th>`;
                        }
            
                        tableHtml += `</tr></thead><tbody>`;
            
                        // Alışkanlık Verilerini İşleme
                        habitsData.forEach((habit) => {
                            tableHtml += `<tr data-id='${habit.id}'>
                                <td class='editable-habit hoverable-text' data-id='${habit.id}'>${habit.aliskanlik_tanimi}</td>`;
            
                            // Günlük Takip Durumu
                            for (let day = 0; day < habit.aliskanlik_gun_sayisi; day++) {
                                const checked = parseToArray(habit.aliskanlik_gunluk_takip)[day] === true ? 'checked' : ''; // Sadece true ise checked ekle
                                const disabled = day > 0 && !parseToArray(habit.aliskanlik_gunluk_takip)[day - 1] ? 'disabled' : ''; // Önceki gün yapılmadıysa disable
                                tableHtml += `<td><input type='checkbox' class='habit-checkbox' data-day='${day}' ${checked} ${disabled}></td>`;
                            }
            
                            // Geriye Kalan Günler İçin Boş Alan
                            for (let day = habit.aliskanlik_gun_sayisi; day < maxDays; day++) {
                                tableHtml += `<td></td>`;
                            }
            
                            tableHtml += `</tr>`;
                        });
            
                        tableHtml += `</tbody></table>
                </div>
                <!-- Yeni Alışkanlık Ekleme Butonu -->
                <button id='addHabitBtn' class='btn btn-primary'>Yeni Alışkanlık Ekle</button>
                `;
            
            $('#tasksContainer').html(tableHtml);
        
        
            // Alışkanlık adı tıklanınca düzenleme diyalog kutusunu aç
            $('#tasksContainer').on('click', '.editable-habit', function () {
                const habitId = parseInt($(this).data('id')); // Alışkanlık ID'sini alın
                const habit = habitsData.find(h => h.id === habitId); // ID'ye göre eşleşen alışkanlığı bulun
            
                if (!habit) {
                    console.error('Habit not found for ID:', habitId);
                    return; // Eğer alışkanlık bulunamazsa işlemi sonlandır
                }
            
                // Düzenleme diyalog kutusunu oluştur
                const editDialogHtml = `
                    <div id='editHabitDialog' class='dialog' style="width: 370px; margin: 0 auto;"> 
                        <!-- Başlık Eklendi -->
                        <div class='dialog-header' style="display: flex; justify-content: center;">
                            <h4 style="font-weight: bold;">ALIŞKANLIK GÜNCELLEME</h4>
                        </div>
                        
                        <!-- Alışkanlık Adı Alanı -->
                        <div class='form-group' style="margin-top: 5px;">
                            <label for='editHabitName' style="font-weight: bold;">Alışkanlık Adı:</label>
                            <input type='text' id='editHabitName' style="width: 100%;  padding: 5px; box-sizing: border-box;" value='${habit.aliskanlik_tanimi}' />
                        </div>
                
                        <!-- Açıklama Alanı -->
                        <div class='form-group'>
                            <label for='editHabitDescription' style="font-weight: bold; margin-bottom: 5px;">Açıklama:</label>
                            <textarea id='editHabitDescription'>${habit.aliskanlik_aciklama}</textarea>
                        </div>
                        
                        <!-- Tarih Alanı -->
                        <div class='form-group row'>                             
                            <label for='editHabitStartDate' class='col-label'>Başlangıç Tarihi:</label>
                            <input type='date' id='editHabitStartDate' class='col-input' value='${habit.aliskanlik_baslangic_tarihi || ''}' />
                        </div>

                        <!-- Alışkanlık Gün Sayısı Alanı -->
                        <div class='form-group row'>
                            <label for='editHabitDaysCount' class='col-label'>Alışkanlık Gün Sayısı:</label>
                            <input type='number' id='editHabitDaysCount' class='col-input' min="1" max="31" value='${habit.aliskanlik_gun_sayisi}' />
                        </div>
                        
                        <!-- Kategori Alanı -->
                        <div class="form-group row align-items-center">
                            <label for="editHabitCategory" class="col-auto" style="font-weight: bold;">Kategori:</label>
                            <div class="col-auto">
                                <select class="form-select" id="editHabitCategory" value='${habit.aliskanlik_kategori}' style="width: 150px;">
                                    <!-- Kategoriler buraya dinamik olarak eklenecek -->
                                </select>
                            </div>
                        </div>
                        
                        <!-- TP Alanı -->
                        <div class='form-group row'>
                            <label for='editHabitTP' class='col-label'>TP:</label>
                            <input type='number' id='editHabitTP' class='col-input' value='${habit.aliskanlik_tp || ''}' />
                        </div>

                        <!-- Altın Alanı -->
                        <div class='form-group row'>                            
                            <label for='editHabitGold' class='col-label'>Altın:</label>
                            <input type='number' id='editHabitGold' class='col-input' value='${habit.aliskanlik_altin || ''}' />
                        </div>
                        
                        <!-- Butonlar -->
                        <div class='button-group'>
                            <button id='saveHabitChanges' class='btn btn-success'>Güncelle</button>
                            <button id='cancelEditHabit' class='btn btn-secondary'>İptal</button>
                        </div>
                    </div>
                `;
            
                // Diyalog kutusunu DOM'a ekle
                $('body').append(editDialogHtml);

                // Kategorileri API'den çekme
                $.ajax({    
                    url: '/api/categories', // API endpoint
                    method: 'GET',
                    success: function(response) { // 'categories' yerine 'response' kullanıyoruz
                        if (response.success) {
                            const categories = response.data; // API'den dönen kategori verisi
                
                            // Kategorileri menüye ekleme
                            categories.forEach(function(category) {
                                $('#editHabitCategory').append(`
                                    <option value="${category.category_name}" ${habit.aliskanlik_kategori === category.category_name ? 'selected' : ''}>
                                        ${category.category_name}
                                    </option>
                                `);
                            });
                        } else {
                            console.error('Kategoriler okunamadı:', response.error);
                        }
                    },
                    error: function() {
                        console.error('Kategoriler yüklenemedi.');
                    }
                });
            
                // Kaydet butonuna tıklandığında düzenlemeleri uygula
                $('#saveHabitChanges').click(() => {
                    habit.aliskanlik_tanimi = $('#editHabitName').val();
                    habit.aliskanlik_aciklama = $('#editHabitDescription').val();
                    habit.aliskanlik_baslangic_tarihi = $('#editHabitStartDate').val();
                    habit.aliskanlik_bitis_tarihi = $('#editHabitEndDate').val();
            
                    // Sunucuya güncellenmiş veriyi gönder
                    $.ajax({
                        url: `/api/habits/${habitId}`,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(habit),
                        success: () => {
                            renderTable(); // Tabloyu yeniden çiz
                            $('#editHabitDialog').remove(); // Diyalog kutusunu kaldır
                        },
                        error: (err) => {
                            console.error('Failed to save changes:', err);
                        }
                    });
                });
            
                // İptal butonuna tıklandığında diyalog kutusunu kapat
                $('#cancelEditHabit').click(() => {
                    $('#editHabitDialog').fadeOut(500, function() {
                        $(this).remove();
                    });
                    
                });
            });
            
        }
    
        function handleCheckboxClick(e) {
            playSoundClick();

            const checkbox = $(e.target);
            const row = checkbox.closest('tr');
            const habitId = parseInt(row.data('id'));
            const day = parseInt(checkbox.data('day'));
    
            const habit = habitsData.find(habit => habit.id === habitId);

            
            // `aliskanlik_gunluk_takip` dizisini JSON formatında parse et
            let gunlukTakip = [];
            try {
                gunlukTakip = JSON.parse(habit.aliskanlik_gunluk_takip);
                if (!Array.isArray(gunlukTakip)) {
                    gunlukTakip = []; // Dizi değilse boş bir dizi olarak başlat
                }
            } catch (err) {
                console.error('Error parsing aliskanlik_gunluk_takip:', err);
                gunlukTakip = []; // Hata durumunda boş bir dizi başlat
            }

            // İlgili günü güncelle
            gunlukTakip[day] = checkbox.is(':checked');

            habit.aliskanlik_gunluk_takip = gunlukTakip;
   
            // Eğer alışkanlığın tüm günleri tamamlandıysa
            if (Array.isArray(habit.aliskanlik_gunluk_takip)) {
                if (habit.aliskanlik_gunluk_takip.every(val => val)) {
                    playSoundSuccess();
    
                    // Update usertp and usergold variables
                    if (!$(this).data('updated')) { // Ensure usertp and usergold are only updated once
                        usertp += habit.aliskanlik_tp;
                        usergold += habit.aliskanlik_altin;
                        $(this).data('updated', true); // Flag to prevent multiple updates
                    }                  
            
                    // Check if userlevel is greater than 0 and usertp becomes less than 0
                    if (usertp >=50) {
                        playSoundMagic();
    
                        userlevel += 1;
                        usertp -=50;
    
                        // Update the UI with the new values
                        $('.userlevel').text(userlevel)
                            .addClass('animateValue')  // Animasyonu başlat
                            .one('animationend', function() {  // Animasyon tamamlandığında sınıfı kaldır
                                $(this).removeClass('animateValue');
                        });
                    } else {
                        $('.userlevel').text(userlevel);
                    }
    
                    // Update the UI with the new values
                    $('.usergold').text(usergold);
                    $('.usertp').text(usertp);
    
                    const $goalCard = $(this).closest('.goal-card');
                    const goalId = $goalCard.data('id');
                    const hedefKategori = $goalCard.data('kategori');
         
                    $.ajax({
                         url: '/api/categories', // Kategori verilerinin olduğu API
                         type: 'GET',
                         success: function (response) {
                             // API'nin döndürdüğü yapıyı kontrol edin
                             const categories = Array.isArray(response) ? response : response.data || [];
                     
                             if (!Array.isArray(categories)) {
                                 console.error('Beklenen bir dizi, ancak farklı bir veri yapısı alındı:', response);
                                 return;
                             }
         
                             // İlgili kategoriyi bul
                             const category = categories.find(cat => cat.category_name === habit.aliskanlik_kategori);
                 
                             if (!category) {
                                 console.error(`Kategori bulunamadı: ${hedefKategori}`);
                                 return;
                             }
         
                             let categoryName = category.category_name;
                             let categoryLevel = parseInt(category.category_level, 10) || 0;
                             let categoryTp = parseInt(category.category_tp, 10) || 0;
         
                             if (!$(this).data('updated')) { // Ensure usertp and usergold are only updated once
                                 categoryTp += habit.aliskanlik_tp;
         
                                 if (categoryTp > 50) {
                                     categoryTp -= 50;
                                     categoryLevel += 1; // Seviye artır
                                 }
         
                                 $(this).data('updated', true); // Flag to prevent multiple updates
                             }   
         
                             // Kategoriyi güncelle
                             $.ajax({
                                 url: `/api/categories`,
                                 type: 'PUT',
                                 contentType: 'application/json',
                                 data: JSON.stringify({
                                     id: category.id, // Kategori ID'si
                                     category_name: categoryName,
                                     category_level: categoryLevel,
                                     category_tp: categoryTp
                                 }),
                                 success: function () {
                                     console.log(`Kategori başarıyla güncellendi: ${categoryName}`);
                                 },
                                 error: function (err) {
                                     console.error('Kategori güncellenirken hata oluştu:', err);
                                 }
                             });
                         },
                         error: function (err) {
                             console.error('Kategori verileri alınırken hata oluştu:', err);
                         }
                         
                     });
    
                    //Veriler güncelleniyor
                    updateUserData();
    
                    // Alışkanlık tablodan kaldırılır
                    habitsData = habitsData.filter(h => h.id !== habitId);
    
                    $.ajax({
                        url: `/api/habits/${habitId}`,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            aliskanlik_tanimi: habit.aliskanlik_tanimi,
                            aliskanlik_baslangic_tarihi: habit.aliskanlik_baslangic_tarihi,
                            aliskanlik_gun_sayisi: habit.aliskanlik_gun_sayisi,
                            aliskanlik_gunluk_takip: JSON.stringify(habit.aliskanlik_gunluk_takip), // Günlük takip verisi
                            aliskanlik_kategori: habit.aliskanlik_kategori || '', // Kategori
                            aliskanlik_tp: habit.aliskanlik_tp || 0, // TP
                            aliskanlik_altin: habit.aliskanlik_altin || 0, // Altın
                            aliskanlik_ulasildimi: true,
                            aliskanlik_durumu: "Başarılı"
                        }),
                        success: (response) => {
                            if (response.success) {
                                console.log('Alışkanlık başarıyla güncellendi:', habit.id);
                                // Alışkanlık tamamlandığında diyalog penceresini aç
                                openCompletionDialog(habit);
                            } else {
                                console.error('Alışkanlık güncellenemedi:', response.error);
                            }
                        },
                        error: (err) => {
                            console.error('Failed to update habit:', err);
                        },
                    });
    
                    return;
    
                }
            } else {
                console.error('aliskanlik_gunluk_takip is not an array:', habit.aliskanlik_gunluk_takip);
            }

            // Güncellenmiş diziyi string formatına çevir
            habit.aliskanlik_gunluk_takip = JSON.stringify(gunlukTakip);
    
            updateHabit(habitId, habit);
        }
    
        function updateHabit(id, updatedHabit) {
            $.ajax({
                url: `/api/habits/${id}`,
                type: 'PUT',
                contentType: 'application/json',
                data:  JSON.stringify({
                    ...updatedHabit, // Diğer tüm alanları ekle
                    aliskanlik_gunluk_takip: updatedHabit.aliskanlik_gunluk_takip // Günlük takip stringi
                }),
                success: (response) => {
                  // API yanıtında success varsa
                  if (response.success) {
                        const habitIndex = habitsData.findIndex(habit => habit.id === id);
                        if (habitIndex >= 0) {
                            // Güncellenen alışkanlığı güncel verilerle değiştir
                            habitsData[habitIndex] = response.updatedHabit;
                            renderTable(); // Tabloyu güncelle
                        }
                    } else {
                        console.error('Güncelleme başarısız:', response.error);
                    }
                },
                error: (err) => {
                    console.error('Failed to update habit:', err);
                },
            });
        }

        function openCompletionDialog(habit) {
            const formattedDate = new Date(habit.aliskanlik_baslangic_tarihi);
            const day = String(formattedDate.getDate()).padStart(2, '0'); // Pad with leading zero if day < 10
            const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
            const year = formattedDate.getFullYear();
            const formattedDateString = `${day}.${month}.${year}`;

            const completionDialogHtml = `
                <div id='completionDialog' class='dialog'>
                    <div class='dialog-header' style="display: flex; justify-content: center;">
                        <h4 style="font-weight: bold;">Alışkanlık Tamamlandı</h4>
                    </div>
                    
                    <div class='form-group'><br>
                        <label><strong>Alışkanlık Adı:</strong> ${habit.aliskanlik_tanimi}</label><br>
                        <label><strong>Başlangıç Tarihi:</strong> ${formattedDateString}</label><br>
                        <label><strong>Gün Sayısı:</strong> ${habit.aliskanlik_gun_sayisi}</label><br>
                        <label><strong>Bitiş Tarihi:</strong> ${new Date().toLocaleDateString()}</label><br>
                        <label><strong>Kazanılan TP:</strong> ${habit.aliskanlik_tp}</label><br>
                        <label><strong>Kazanılan Altın:</strong> ${habit.aliskanlik_altin}</label><br>
                    </div>
        
                    <div class='button-group'>
                        <button id='completionDialogOk' class='btn btn-success'>Tamam</button>
                    </div>
                </div>
            `;
            
            // Diyalog kutusunu DOM'a ekle
            $('body').append(completionDialogHtml);
        
            // Tamam butonuna tıklandığında diyalog kutusunu kapat
            $('#completionDialogOk').click(() => {
                $('#completionDialog').fadeOut(500, function() {
                    $(this).remove();

                    habitTrackerFunction();
                });
            });
        }
        
        $('#tasksContainer').on('click', '#addHabitBtn', showAddHabitDialog);
        $('#tasksContainer').on('change', '.habit-checkbox', handleCheckboxClick);
    
        fetchHabitsData(); // Fetch habits data from API
    }
    
    // Ayarlar Butonu Fonksiyonu
    function settingsFunction() {
        // Temizleme
        $('#tasksContainer').html('');
        $('#tasksContainer').removeAttr('style');

    
        // Ayar öğeleri ve ikonlar
        const settings = [
            { text: "Profil Adını Değiştir", icon: "fa-user-edit", action: changeProfileName },
            { text: "Profil Resmini Değiştir", icon: "fa-image", action: changeProfilePicture },
            { text: "Şifreyi Değiştir", icon: "fa-key", action: changePassword },
            { text: "Temayı Ayarla", icon: "fa-adjust", action: changeTheme },
            { text: "İlerlemeyi Sil", icon: "fa-eraser", action: resetProgress },
            { text: "Tüm Verileri Sil", icon: "fa-trash", action: resetAllData }
        ];

        // Task container'ın merkezde konumlanması
        $('#tasksContainer').css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '80vh',
            overflow: 'hidden'
        });
    
        // Ayarları ekleme
         settings.forEach((setting, index) => {
            const settingItem = $(`
                <div class="setting-card" style="
                font-size: 18px; 
                margin-bottom: 15px; 
                cursor: pointer; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                width: 300px; 
                height: 60px; 
                border-radius: 10px; 
                background-color: #f5f5f5; 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
                opacity: 0;
                transform: translateY(-50px);
            ">
                    <i class="fas ${setting.icon}" style="margin-right: 10px;"></i>
                    <span>${setting.text}</span>
                </div>
            `);

            settingItem.on('click', setting.action);

            
            $('#tasksContainer').append(settingItem);
    
            // Hover efekti
            settingItem.hover(
                function () {
                    $(this).css({ backgroundColor: "#f0f0f0", borderRadius: "5px" });
                },
                function () {
                    $(this).css({ backgroundColor: "transparent" });
                }
            );

            // Animasyon: Her bir öğeyi sırayla görünür ve aşağı kaydır
            setTimeout(() => {
                settingItem.css({
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'all 0.5s ease-in-out'
                });
            }, index * 200); // Her öğe için 100ms gecikme
    

        });

        // Profil adını değiştirme işlemi  
        function changeProfileName() {
            playSoundClick();

            const dialog = `
                <div class="modal fade" tabindex="-1" id="profileNameModal" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Profil Adı Değiştir</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group mb-3">
                                    <label for="newProfileName" class="form-label fw-bold">Yeni Profil Adı:</label>
                                    <input type="text" class="form-control" id="newProfileName" placeholder="Profil adını girin">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-primary" id="confirmProfileName">Onayla</button>
                                <button class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        
            // Modalı ekle ve göster
            $('body').append(dialog);
            $('#profileNameModal').modal('show');
        
            // Buton click olayı
            $('#confirmProfileName').on('click', function () {
                playSoundClick();
            
                const newName = $('#newProfileName').val().trim();
                if (newName) {
                    username=newName;

                    //Verilre güncelleniyor
                    updateUserData();

                    $('.username').text(newName);
                    $('#profileNameModal').modal('hide');
                    $('#profileNameModal').on('hidden.bs.modal', function () {
                        $(this).remove(); // Modalı DOM'dan kaldır
                    });
                } else {
                    alert('Profil adı boş bırakılamaz.');
                }
            });
        
            // Modal kapandığında DOM'dan kaldır
            $('#profileNameModal').on('hidden.bs.modal', function () {
                playSoundClick();
            
                $(this).remove();
            });
        }
        
        function changeProfilePicture() {
            playSoundClick();
            
            const fileInput = $('<input type="file" accept=".jpg">'); // Sadece .jpg göster
            fileInput.on('change', (event) => {
                playSoundClick();
            
                const file = event.target.files[0];
                if (file) {
                    const fileExtension = file.name.split('.').pop().toLowerCase();
                    if (fileExtension !== 'jpg') {
                        alert('Yalnızca .jpg formatındaki dosyalar kabul edilir.');
                        return;
                    }
        
                    const formData = new FormData();
                    formData.append('profilePicture', file);
        /* 
                    // Sunucuya dosya gönderme
                    fetch('/upload/profile-picture', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Dosya yükleme başarısız oldu.');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.filePath) {

                            profilePicture=data.filePath;

                            //Veriler güncelleniyor
                            updateUserData();

                            // DOM'daki profil resmini güncelle
                            const profilePic = document.querySelector('.user-info .profile-pic');
                            if (profilePic) {
                                profilePic.src = `${data.filePath}?timestamp=${new Date().getTime()}`;
                                // Tarayıcı önbelleğini aşmak için `timestamp` ekleniyor.
                            }

                            //Hero ekranındaki resmi güncelle
                            const observer = new MutationObserver(() => {
                                const profileSectionImg = document.querySelector('.profile-section img');
                                if (profileSectionImg) {
                                    profileSectionImg.src = `${profilePicture}?timestamp=${new Date().getTime()}`;


                                    observer.disconnect(); // İzlemeyi durdur
                                }
                            });
                            
                            observer.observe(document.body, { childList: true, subtree: true });
                            
                            setTimeout(() => {
                                alert('Profil resmi başarıyla güncellendi!');
                            }, 500); 
                        }
                    })
                    .catch(error => {
                        alert(error.message);
                    }); */
                }
            });
            fileInput.click();
        }

        function changePassword() {
            playSoundClick();
            
            const dialog = `
                <div class="modal fade" tabindex="-1" id="passwordModal" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-centered" style="max-width: 300px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title text-center fw-bold w-100">Şifreyi Güncelle</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group mb-3 position-relative">
                                    <label for="oldPasswordChange" class="form-label fw-bold">Eski Şifre:</label>
                                    <input type="password" class="form-control" id="oldPasswordChange" placeholder="Eski şifrenizi girin">
                                    <i class="toggle-password bi bi-eye-slash position-absolute top-50 end-0 translate-middle-y me-2" style="cursor: pointer;"></i>
                                </div>
                                <div class="form-group mb-3 position-relative">
                                    <label for="newPasswordChange" class="form-label fw-bold">Yeni Şifre:</label>
                                    <input type="password" class="form-control" id="newPasswordChange" placeholder="Yeni şifrenizi girin">
                                    <i class="toggle-password bi bi-eye-slash position-absolute top-50 end-0 translate-middle-y me-2" style="cursor: pointer;"></i>
                                </div>
                                <div class="form-group mb-3 position-relative">
                                    <label for="repeatPasswordChange" class="form-label fw-bold">Yeni Şifre Tekrar:</label>
                                    <input type="password" class="form-control" id="repeatPasswordChange" placeholder="Yeni şifreyi tekrar girin">
                                    <i class="toggle-password bi bi-eye-slash position-absolute top-50 end-0 translate-middle-y me-2" style="cursor: pointer;"></i>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-primary" id="updatePassword" disabled>Güncelle</button>
                                <button class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        
            // Modalı ekle ve göster
            $('body').append(dialog);
            $('#passwordModal').modal('show');
        
            // Input değişimini kontrol et
            const inputs = $('#passwordModal input');
            inputs.on('input', () => {
                const allFilled = inputs.toArray().every(input => input.value.trim() !== '');
                $('#updatePassword').prop('disabled', !allFilled);
            });
        
            // Şifre alanlarında göz ikonu ile göster/gizle
            $(document).on('click', '.toggle-password', function () {
                playSoundClick();
            
                const input = $(this).prev('input');
                const isPassword = input.attr('type') === 'password';
                input.attr('type', isPassword ? 'text' : 'password');
                $(this).toggleClass('bi-eye bi-eye-slash');
            });
        
            // Şifre güncelleme işlemi
            $('#updatePassword').on('click', () => {
                playSoundClick();
            
                const oldPassword = $('#oldPasswordChange').val().trim();
                const newPassword = $('#newPasswordChange').val().trim();
                const repeatPassword = $('#repeatPasswordChange').val().trim();
        
                if (password !== oldPassword) {
                    alert('Mevcut şifreyi yanlış girdiniz!');
                    return;
                }
                if (newPassword != repeatPassword) {
                    alert('Yeni şifreler uyuşmuyor!');
                    return;
                }

                password=newPassword;
        
                //Veriler güncelleniyor
                updateUserData();
                
                alert('Şifreniz başarıyla güncellendi!');
                $('#passwordModal').modal('hide');
            });
        
            // Modal kapandığında DOM'dan kaldır
            $('#passwordModal').on('hidden.bs.modal', function () {
                playSoundClick();
            
                $(this).remove();
            });
        }

        function changeTheme() {
            playSoundClick();
            
            const dialog = `
                <div class="modal fade" tabindex="-1" id="themeModal" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-centered" style="max-width: 300px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Temayı Değiştir</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="form-check" style="margin-bottom: 30px;">
                                    <input class="form-check-input" type="radio" name="theme" id="lightTheme" value="light">
                                    <label class="form-check-label" for="lightTheme">Açık Tema</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="theme" id="darkTheme" value="dark">
                                    <label class="form-check-label" for="darkTheme">Koyu Tema</label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-primary" id="confirmThemeChange">Onayla</button>
                                <button class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        
            // Modalı ekle ve göster
            $('body').append(dialog);
            $('#themeModal').modal('show');
        
            // Tema değişikliğini onaylama
            $('#confirmThemeChange').on('click', function () {
                playSoundClick();
            
                savedTheme = $('input[name="theme"]:checked').val();
                
                if (savedTheme) {
                    
                    //Veriler güncelleniyor
                    updateUserData();

                    applyTheme(savedTheme);
                    $('#themeModal').modal('hide');
                } else {
                    alert('Lütfen bir tema seçin.');
                }
            });
        
            // Modal kapandığında DOM'dan kaldır
            $('#themeModal').on('hidden.bs.modal', function () {
                playSoundClick();
            
                $(this).remove();
            });
    
        }

        function resetProgress() {
            playSoundClick();
            
            const dialog = `
                <div class="modal fade" tabindex="-1" id="confirmationDialog" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-centered" style="max-width: 350px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">İlerlemeyi Sıfırla</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Tüm ilerleme puanları silinecek. Emin misiniz?</p>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-danger" id="confirmYes">Evet</button>
                                <button class="btn btn-secondary" data-bs-dismiss="modal" id="confirmNo">Hayır</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Modalı ekle ve göster
            $('body').append(dialog);
            $('#confirmationDialog').modal('show');
        
            // Evet butonuna tıklanınca ilerlemeyi sıfırlama işlemi yapılır
            $('#confirmYes').on('click', function () {     
                playSoundClick();         
        
                userlevel = 0;
                usertp = 0;
                usergold = 0;

                //Veriler güncelleniyor
                updateUserData();
        
                $('.userlevel').text('0');
                $('.usertp').text('0');
                $('.usergold').text('0');
        
                alert('İlerleme sıfırlandı!');
                $('#confirmationDialog').modal('hide');
                $('#confirmationDialog').on('hidden.bs.modal', function () {
                    $(this).remove(); // Modalı DOM'dan kaldır
                });
            });
        
            // Hayır butonuna tıklanınca hiçbir işlem yapılmaz ve diyalog penceresi kapanır
            $('#confirmNo').on('click', function () {
                playSoundClick();
            
                $('#confirmationDialog').modal('hide');
                $('#confirmationDialog').on('hidden.bs.modal', function () {
                    $(this).remove(); // Modalı DOM'dan kaldır
                });
            });
        
            // Modal kapandığında DOM'dan kaldır
            $('#confirmationDialog').on('hidden.bs.modal', function () {
                playSoundClick();
            
                $(this).remove();
            });
        }
            
        function resetAllData() {
            playSoundClick();
                      
            const dialog = `
                <div class="modal fade" tabindex="-1" id="confirmationDialog" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-centered" style="max-width: 350px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Verileri Sıfırla</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Kullanıcı adı ve şifre bilgileri hariç tüm veriler ve ilerlemeler silinecek. İlk ayarlara dönülecek. Emin misiniz?</p>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-danger" id="confirmYes">Evet</button>
                                <button class="btn btn-secondary" data-bs-dismiss="modal" id="confirmNo">Hayır</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        
            // Modalı ekle ve göster
            $('body').append(dialog);
            $('#confirmationDialog').modal('show');
        
            // Evet butonuna tıklanınca tüm veriler sıfırlanır
            $('#confirmYes').on('click', function () {
                playSoundClick();
            
                // Veritabanı sıfırlama işlemi burada yapılır (sunucu kodu gereklidir)
                $.post('/reset-data', function(response) {
            
                   // Uygulama veri sıfırlama işlemleri
                    userlevel = 0;
                    usertp = 0;
                    usergold = 0;

                    //Veriler güncelleniyor
                    updateUserData();
            
                    $('.userlevel').text('0');
                    $('.usertp').text('0');
                    $('.usergold').text('0');
    
                    $('#confirmationDialog').modal('hide');
                    $('#confirmationDialog').on('hidden.bs.modal', function () {
                        $(this).remove(); // Modalı DOM'dan kaldır
                    });
    
                    selectedTheme="light";

                    //Veriler güncelleniyor
                    updateUserData();
                    
                    $('body').css({ backgroundColor: '#fff', color: '#000' });
                    
                    setTimeout(function() {
                        alert(response.message); // Sunucudan gelen yanıt mesajını 0.5 saniye sonra göster
        
                    }, 500); // 500 milisaniye = 0.5 saniye
    
                }).fail(function (err) {
                    // Hata durumunda kullanıcıya bilgi verir
                    console.error('Veritabanı sıfırlama başarısız:', err);
                    alert('Veritabanı sıfırlama işlemi sırasında bir hata oluştu.');
                });
            
            });
        
            // Hayır butonuna tıklanınca hiçbir işlem yapılmaz ve diyalog penceresi kapanır
            $('#confirmNo').on('click', function () {
                playSoundClick();
            
                $('#confirmationDialog').modal('hide');
                $('#confirmationDialog').on('hidden.bs.modal', function () {
                    $(this).remove(); // Modalı DOM'dan kaldır
                });
            });
        
            // Modal kapandığında DOM'dan kaldır
            $('#confirmationDialog').on('hidden.bs.modal', function () {
                playSoundClick();
            
                $(this).remove();
            });
        }

    }
        
    function applyTheme(theme) {
        if (theme === 'light') {
            $('body').css({ backgroundColor: '#fff', color: '#000' });
        } else {
            $('body').css({ backgroundColor: '#000', color: 'orange' });
        }
    }
        
    function playSoundClick() {
        var sound = document.getElementById("click");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundOption() {
        var sound = document.getElementById("option");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundClaps() {
        var sound = document.getElementById("claps");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundSuccess() {
        var sound = document.getElementById("success");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundFail() {
        var sound = document.getElementById("fail");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundLogin() {
        var sound = document.getElementById("login");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundLoginDenied() {
        var sound = document.getElementById("login_denied");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundDelete() {
        var sound = document.getElementById("delete");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundBuy() {
        var sound = document.getElementById("buy");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

    function playSoundMagic() {
        var sound = document.getElementById("magic");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function (error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

});
