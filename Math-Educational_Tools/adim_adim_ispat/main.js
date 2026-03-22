$(document).ready(function () {
    
    // Zamanlayıcı
    let intervalId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            $('#time').text(timeLeft);
        } else {
            alert("Süre doldu!");
            $('#submit').attr("disabled", true);
        }
    }, 1000);

    const stages = [
        {
            title: "images/adim_1_teorem.png",
            subtitle: "Aşağıdaki teoremin ispatı için <b>'Doğrudan İspat'</b> yöntemi kullanılacaktır.",
            steps: [
                "images/adim_1_steps_1.png",
                "images/adim_1_steps_2.png",
                "images/adim_1_steps_3.png",
                "images/adim_1_steps_4.png",
                "images/adim_1_steps_5.png",
                "images/adim_1_steps_6.png",
                "images/adim_1_steps_7.png",
                "images/adim_1_steps_8.png",
                "images/adim_1_steps_9.png",
                "images/adim_1_steps_10.png",
                "images/adim_1_steps_11.png",
                "images/adim_1_steps_12.png",
            ],
            correctOrder: [
                "images/adim_1_steps_3.png",
                "images/adim_1_steps_7.png",
                "images/adim_1_steps_12.png",
                "images/adim_1_steps_9.png"
            ]
        },
        {
            title: "images/adim_2_teorem.png",
            subtitle: "Aşağıdaki teoremin ispatı için <b>'Matematiksel Tümevarım'</b> yöntemi kullanılacaktır.",
            steps: [
                "images/adim_1_steps_1.png",
                "images/adim_1_steps_2.png",
                "images/adim_1_steps_3.png",
                "images/adim_1_steps_4.png",
                "images/adim_1_steps_5.png",
                "images/adim_1_steps_6.png",
                "images/adim_1_steps_7.png",
                "images/adim_1_steps_8.png",
                "images/adim_1_steps_9.png",
                "images/adim_1_steps_10.png",
                "images/adim_1_steps_11.png",
                "images/adim_1_steps_12.png",
            ],
            correctOrder: [
                "images/adim_1_steps_5.png",
                "images/adim_1_steps_8.png",
                "images/adim_1_steps_2.png",
                "images/adim_1_steps_10.png"
            ]
        },
        {
            title: "images/adim_3_teorem.png",
            subtitle: "Aşağıdaki teoremin ispatı için <b>'Karşıt Ters ile İspat'</b> yöntemi kullanılacaktır.",
            steps: [
                "images/adim_1_steps_1.png",
                "images/adim_1_steps_2.png",
                "images/adim_1_steps_3.png",
                "images/adim_1_steps_4.png",
                "images/adim_1_steps_5.png",
                "images/adim_1_steps_6.png",
                "images/adim_1_steps_7.png",
                "images/adim_1_steps_8.png",
                "images/adim_1_steps_9.png",
                "images/adim_1_steps_10.png",
                "images/adim_1_steps_11.png",
                "images/adim_1_steps_12.png",
            ],
            correctOrder: [
                "images/adim_1_steps_3.png",
                "images/adim_1_steps_7.png",
                "images/adim_1_steps_12.png",
                "images/adim_1_steps_9.png"
            ]
        }
    ];

    let currentStage = 0;
    let score = 0;
    let timeLeft = 300; // 5 dakika

    function startTimer() {
        intervalId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                $('#time').text(timeLeft); // Zaman kalan süreyi güncelle
            } else {
                alert("Süre doldu!");
                $('#submit').attr("disabled", true);
                clearInterval(intervalId); // Zamanlayıcıyı durdur
            }
        }, 1000);
    }

    function loadStage() {
        $('#submit').attr("disabled", true); // Başlangıçta buton pasif

        //let latexTitle='$ ${stage.title} $';

        const stage = stages[currentStage];
        $('#steps').empty();
        $('#dropArea').empty();

        $('#dropArea').html('<h5>İspat adımlarını buraya sıralayınız...</h5>');
        $('#theoremTitle').html(`<img src="${stage.title}" alt="Theorem Image" height="40px" />`);
        $('#theoremSolutionMethod').html(`<div> ${stage.subtitle} </div>`);

        stage.steps.forEach(step => {
            $('#steps').append(`<div class="step" draggable="true"><img src="${step}" alt="Step Image"  height="40px"/></div>`);
        });

        // Sürükleme olayları
        $('.step').on('dragstart', function (event) {
            event.originalEvent.dataTransfer.setData("text/html", $(this).html());
            $(this).addClass('dragged');
        });

        $('.step').on('touchstart', function (event) {
            $(this).addClass('dragged');
        });

        // Bırakma alanı üzerine sürüklenip bırakma
        $('#dropArea').on('dragover', function (event) {
            event.preventDefault();
        });

        $('#dropArea').on('drop', function (event) {
            event.preventDefault();
            const data = event.originalEvent.dataTransfer.getData("text/html");

            // Eğer öğe zaten bırakılmışsa tekrar eklenmesini engelle
            if ($('#dropArea .step').filter(function () {
                return $(this).html().trim() === data.trim();
            }).length === 0) {
                $(this).append(`<div class="step dropped">${data}</div>`);
                $('#submit').attr("disabled", false); // Öğe bırakıldığında buton aktifleşir
            }

            // Alta alta eklenmesini sağlamak için CSS düzenlemesi
            $('#dropArea .step').css({
                'display': 'block',
                'margin': '5px 0'
            });
        });

        // Bırakılan öğenin eski yerine geri taşınması için
        $(document).on('click', '#dropArea .step', function () {
            const imgSrc = $(this).find('img').attr('src');
            $(this).remove(); // Drop alanındaki öğeyi kaldır

            // Eğer sürüklenen öğe eski listeye eklenmemişse ekliyoruz
            if ($('#steps .step img[src="' + imgSrc + '"]').length === 0) {
                $('#steps').append(`<div class="step draggable"><img src="${imgSrc}" alt="Step Image" height="40px"  style="display: block; margin-bottom: 10px;" /></div>`);
            }

            // Yeni eklenen adımın tekrar sürüklenebilir olmasını sağlıyoruz
            $('#steps .step').css('cursor', 'select');
            $('.step').on('dragstart', function (event) {
                event.originalEvent.dataTransfer.setData("text/html", $(this).html());
            });

            // Sonuçları Göster butonunun durumunu kontrol eden fonksiyon
            const stepsEmpty = $('#dropArea .step').length === 0;
            $('#submit').prop('disabled', stepsEmpty);
        });

        // Çift tıklama ile dropArea'ya ekleme
        $(document).on('dblclick', '#steps .step', function () {
            const imgSrc = $(this).find('img').attr('src');

            // Eğer öğe zaten bırakılmışsa tekrar eklenmesini engelle
            if ($('#dropArea .step img[src="' + imgSrc + '"]').length === 0) {
                $('#dropArea').append(`
                    <div class="step dropped">
                        <img src="${imgSrc}" alt="Step Image" height="40px" style="display: block; margin-bottom: 10px;" />
                    </div>
                `);
                //$(this).remove(); // Çift tıklanan öğeyi steps listesinden kaldır
            
                $('#submit').attr("disabled", false); // Öğeler bırakıldığında buton aktifleşir
            }
            
        });

        // Tekrar dene butonuna basıldığında, uygulamayı baştan başlatmadan sadece gerekli işlemleri sıfırlama
        $('#retry').on('click', function () {
            playSoundClick();

            // Alanları sıfırla
            $('#dropArea').empty(); // Sürükleme alanını temizle
            $('#steps').empty();    // Başlangıç öğelerini tekrar ekle

            // İlk adımları yeniden ekleyin
            const initialSteps = stage.steps;
            initialSteps.forEach(step => {
                $('#steps').append(`<div class="step" draggable="true"><img src="${step}" alt="Step Image" /></div>`);
            });

            // Yeniden sürüklenebilir olmasını sağlıyoruz
            $('#steps .step').on('dragstart', function (event) {
                event.originalEvent.dataTransfer.setData("text/html", $(this).html());
            });

            // Butonları yeniden aktif hale getir
            $('#submit').attr("disabled", true); // Sıfırladıktan sonra Submit butonu pasifleşsin

            // Zamanlayıcıyı başlat ve gerekli sıfırlamaları yap
            currentStage = 0;
            score = 0;
            $('#resultMessage').hide();
            timeLeft = 300;
            startTimer();
            loadStage();
        });
        
    }

    // Oyun başlangıcı için animasyon
    $('#startGame').on('click', function () {
        playSoundClick();

        //İpucu ekranı gösteriliyor
        const baslik="İPUCU";
        //Buraya ipucunu yazabilirsin
        const ipucu="Mobil cihaz kullanıyorsanız uygulamanın en iyi deneyimini yaşamak için lütfen ekranınızı yatay konuma çeviriniz.<br>Bu etkinlikte, sizden üç farklı teoremin ispat adımlarını verilen süre içerisinde doğru sıralamanız ve her aşamayı hatasız bir şekilde geçmeniz beklenmektedir. Eğer herhangi bir adımda hata yapılırsa etkinlik baştan başlatılacaktır. Başarılar.";

        ipucuDiyalogAc(baslik,ipucu);

        loadStage(); // İlk aşama yükleniyor
        
        $('#introModal').fadeOut(500, function () {
            
            $('#gameContent').fadeIn(500);
            if ($('#parallax-background').length === 0) {
                const background = $('<div id="parallax-background"></div>');
                $('body').append(background);
            }

            $('#parallax-background').css({
                'background-image': 'url("images/arka-plan.jpeg")',
                'position': 'fixed',
                'background-attachment' : 'fixed',
                'background-repeat' : 'no-repeat',
                'opacity' : '0.25',
                'top': '0',
                'left': '0',
                'height': '100%',
                'min-height' : '100vh',
                'z-index': '-2',
                'background-size': 'cover',
                'background-position': 'center'
            });
        });
    });

    // Sonuçları göster butonu
    $('#submit').on('click', function () {
        playSoundClick();

        clearInterval(intervalId); // Zamanlayıcıyı durdur

        let userOrder = [];
        $('#dropArea .step').each(function () {
            const stepText = $(this).text().trim(); // Metin içeriği
            const image = $(this).find('img').attr('src'); // Görsel kaynağını al
            userOrder.push({ text: stepText, image: image }); // Metin ve image bilgilerini diziye ekle
          
        });
        
        // Tüm sürüklenebilir öğeleri ve alanları pasif hale getirme
        $('.step').attr('draggable', 'false').addClass('disabled');
        $('#dropArea').addClass('disabled');

        const stage = stages[currentStage];
        let correctSteps = 0;
        let incorrectSteps = 0;
        $('#score').empty();

        // Doğru sıralama kontrolü
        const isCorrectOrder = userOrder.length === stage.correctOrder.length && 
        userOrder.every((step, index) => 
            
            step.image === stage.correctOrder[index]
        );

        // Sonuçları Göster butonunu pasif yap
        $('#submit').attr("disabled", true);

        if (isCorrectOrder) {
            
            playSoundSuccess();

            if (currentStage === 1){
                score+=3;
            } else  if (currentStage === 2){
                score+=3;
            } else if (currentStage === 3){
                score+=2;
            }

            // Tüm sürüklenebilir öğeleri ve alanları pasif hale getirme
            $('.draggable').attr('draggable', 'false').addClass('disabled');
            $('.drop-area').addClass('disabled');

            $('#nextGame').remove(); // Önceki oyun butonunu kaldır

            // Üçüncü adımda başarı sağlandığında
            if (currentStage === 2) {

                playSoundClaps();

                // Etkinliği sonlandırma
                $('#resultMessage').text("Bütün adımlar başarı ile tamamlandı. Tebrikler!").show();

                // Başa Dön ve Bitir butonlarını göster
                $('#submit').after('<button id="finish" class="btn btn-danger" style="margin-left: 10px;">Bitir</button>');
                $('#submit').after('<button id="reset" class="btn btn-secondary" style="margin-left: 10px;">Başa Dön</button>');
                
                $('#finish').on('click', function() {
                    playSoundClick();

                    // Etkinliği sonlandırma
                    $('#resultMessage').text("Etkinlik sonlandırıldı").show();

                    // Tüm butonları pasifleştir
                    $('button').prop('disabled', true);
                    
                    // Tüm sürüklenebilir öğeleri pasifleştir
                    $('.step').attr('draggable', false);

                    score = 0;
                    $('#finish').remove();
                    $('#reset').remove();

                });
    
                $('#reset').on('click', function() {
                    playSoundClick();

                    resetGame();

                });
            } else {
                // Sonraki Oyun butonunu göster
                $('#submit').after('<button id="nextGame" class="btn btn-primary" style="margin-left: 10px; display: inline-block; width: 150px;">Sonraki Oyun</button>');
                $('#resultMessage').text("Tebrikler! İspatı doğru bildiniz.").show();
                $('#nextGame').on('click', function () {
                    playSoundClick();

                    currentStage++;

                    resetDraggable();

                    $('#resultMessage').hide();
                    $('#nextGame').remove();
                    $('#submit').attr("disabled", false);
                    timeLeft=300;

                    // Zamanlayıcıyı başlat
                    startTimer();

                    loadStage();
                });
            }
        } else {

            playSoundFail();

            $('#submit').after('<button id="retry" class="btn btn-warning" style="margin-left: 10px; display: inline-block; width: 150px;">Tekrar Dene</button>');
            $('#resultMessage').text("Maalesef ispat adımlarını doğru sıralayamadınız! Tekrar Dene butonuna basarak bir daha deneyebilirsiniz.").show();
            $('#retry').on('click', function() {
                playSoundClick();
                resetGame();
            });
        }

        stage.steps.forEach((step, index) => {
            const isCorrect = userOrder[index] && 
            userOrder[index].image === stage.correctOrder[index];

            if (isCorrect) {
                correctSteps++;
                $(`#dropArea .step:eq(${index})`).append('<span class="result-icon correct" style="position: relative; font-size: 18px;">✓<span class="score-positive" style="position: absolute; top: -10px; right: -17px; color: green; font-size: 16px;">+1</span></span>');
            } else {
                incorrectSteps++;
                $(`#dropArea .step:eq(${index})`).append('<span class="result-icon incorrect" style="position: relative; font-size: 18px;">✗<span class="score-negative" style="position: absolute; top: -10px; right: -17px; color: red; font-size: 16px;">-1</span></span>');
            }

        });

    });

    function resetGame() {
        currentStage = 0;
        score = 0;
        $('#resultMessage').hide();
        $('#finish').remove();
        $('#reset').remove();
        $('#retry').remove();
        $('#submit').attr("disabled", false);
        $('.step').attr('draggable', 'true').removeClass('disabled');
        $('#dropArea').removeClass('disabled');
        timeLeft = 300;
        startTimer();
        loadStage();
    }
    
    function resetDraggable() {
        $('.step').attr('draggable', 'true').removeClass('disabled');
        $('#dropArea').removeClass('disabled');
    }

    // Tekrar dene butonu
    $('#retry').on('click', function () {
        playSoundClick();

        currentStage = 0;
        score = 0;

        // Tüm sürüklenebilir öğeleri ve alanları tekrar aktif hale getirme
        $('.step').attr('draggable', 'true').removeClass('disabled');
        $('#dropArea').removeClass('disabled');

        $('#score').text(`Puan: ${score}`);

        // Zamanlayıcıyı başlat
        startTimer();

        loadStage();
        
    });

    function ipucuDiyalogAc(baslik, ipucu) {
    
        // Dialog arkaplanını oluştur
        const overlay = document.createElement('div');
        overlay.className = 'dialog-ipucu-overlay';

        // Dialog kutusunu oluştur
        const dialogBox = document.createElement('div');
        dialogBox.className = 'dialog-ipucu-box';

        // Başlık ve resim konteynerini oluştur
        const titleContainer = document.createElement('div');
        titleContainer.className = 'dialog-ipucu-title-container';

        // Resmi oluştur
        const img = document.createElement('img');
        // Base64 kodunu buraya ekleyin
        img.src = "images/key.png";
        img.alt = 'İpucu Resmi';
        img.style.width = '50px'; // Gerekirse boyutu ayarlayın
        img.style.height = '50px'; // Gerekirse boyutu ayarlayın

        // Başlığı oluştur
        const title = document.createElement('div');
        title.className = 'dialog-ipucu-title';
        title.textContent = baslik;

        // İçeriği oluştur
        const content = document.createElement('div');
        content.className = 'dialog-ipucu-content';
        content.innerHTML = ipucu;

        // Butonları oluştur
        const buttons = document.createElement('div');
        buttons.className = 'dialog-ipucu-buttons';

        const closeButton = document.createElement('button');
        closeButton.className = 'close-ipucu-button';
        closeButton.textContent = 'Tamam';
        closeButton.addEventListener('click', function() {
            playSoundClick();
            overlay.remove();

        });

        // Elemanları birleştir
        titleContainer.appendChild(img);
        titleContainer.appendChild(title);
        buttons.appendChild(closeButton);
        dialogBox.appendChild(titleContainer);
        dialogBox.appendChild(content);
        dialogBox.appendChild(buttons);
        overlay.appendChild(dialogBox);

        // Dialogu sayfaya ekle
        document.body.appendChild(overlay);
    }   

    function playSoundClick() {
        var sound = document.getElementById("click");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function(error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }
    
    function playSoundSuccess() {
        var sound = document.getElementById("success");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function(error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }
    
    function playSoundFail() {
        var sound = document.getElementById("fail");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function(error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }
    
    function playSoundClaps() {
        var sound = document.getElementById("claps");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function(error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }
    
    function playSoundOption() {
        var sound = document.getElementById("option");
        sound.currentTime = 0; // Sesi baştan çal
        sound.play().catch(function(error) {
            console.log("Ses oynatılamadı: ", error);
        });
    }

});
