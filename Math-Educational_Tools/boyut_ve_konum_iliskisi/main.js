//İpucu ekranı gösteriliyor
const baslik="İPUCU";
//Buraya ipucunu yazabilirsin
const ipucu="Bu etkinlikte sıfırdan farklı bir x gerçek sayısının dört ardışık kuvvetinin fiziksel modellemesini keşfedeceksiniz. Sürgüyü kullanarak modeli inceleyiniz ve farklı değerlerin etkisini gözlemleyiniz.";

ipucuDiyalogAc(baslik,ipucu);

updateShape(document.getElementById('slider').value);

function updateShape(value) {

    document.getElementById('sliderValue').textContent = value;

    const shapeContainer = document.getElementById('shape');
    const dimensionText = document.getElementById('dimension');
    const equation = document.getElementById('equation');
    const imgEquaiton = document.createElement('img');

    shapeContainer.innerHTML = '';
    let shapeElement;
    let dimensionLabel;


    switch (value) {
        case '0':
            playSoundOption();

            shapeElement = document.createElement('div');
            shapeElement.className = 'point';
            shapeElement.style.top = '50%';
            shapeElement.style.left = '50%';
            shapeElement.style.transform = 'translate(-50%, -50%)';
            const labelA = document.createElement('div');
            labelA.className = 'label';
            labelA.style.top = 'calc(50% + 15px)';
            labelA.style.left = '50%';
            labelA.style.transform = 'translate(-50%, -20%)';
            labelA.textContent = 'A';
            labelA.style.fontSize="18px";
            shapeContainer.appendChild(shapeElement);
            shapeContainer.appendChild(labelA);
            dimensionLabel = 'Sıfır Boyutlu';

            equation.innerHTML='';
            
            imgEquaiton.src = dataOfEquation(0);
            imgEquaiton.alt = 'Denklem Resmi';

            equation.appendChild(imgEquaiton);
            
            break;
        case '1':
            playSoundOption();

            shapeElement = document.createElement('div');
            shapeElement.className = 'line';
            shapeElement.style.top = '50%';
            shapeElement.style.left = '50%';
            shapeElement.style.transform = 'translate(-50%, -50%)';

            const pointA1 = document.createElement('div');
            pointA1.className = 'point';
            pointA1.style.top = '50%';
            pointA1.style.left = 'calc(38% - 50px)';
            pointA1.style.transform = 'translate(-50%, -50%)';

            const pointB1 = document.createElement('div');
            pointB1.className = 'point';
            pointB1.style.top = '50%';
            pointB1.style.left = 'calc(62% + 50px)';
            pointB1.style.transform = 'translate(-50%, -50%)';

            const labelA1 = document.createElement('div');
            labelA1.className = 'label';
            labelA1.style.top = 'calc(50% + 15px)';
            labelA1.style.left = 'calc(38% - 50px)';
            labelA1.style.transform = 'translate(-50%, -30%)';
            labelA1.textContent = 'A';
            labelA1.style.fontSize="18px";

            const labelB1 = document.createElement('div');
            labelB1.className = 'label';
            labelB1.style.top = 'calc(50% + 15px)';
            labelB1.style.left = 'calc(62% + 50px)';
            labelB1.style.transform = 'translate(-50%, -30%)';
            labelB1.textContent = 'B';
            labelB1.style.fontSize="18px";

            const centerLabel = document.createElement('div');
            centerLabel.className = 'label';
            centerLabel.style.top = 'calc(50% - 20px)';
            centerLabel.style.left = '50%';
            centerLabel.style.transform = 'translate(-50%, -50%)';
            centerLabel.textContent = 'x birim';
            centerLabel.style.fontSize="18px";

            shapeContainer.appendChild(shapeElement);
            shapeContainer.appendChild(pointA1);
            shapeContainer.appendChild(pointB1);
            shapeContainer.appendChild(labelA1);
            shapeContainer.appendChild(labelB1);
            shapeContainer.appendChild(centerLabel);
            dimensionLabel = 'Bir Boyutlu';

            equation.innerHTML='';
            
            imgEquaiton.src = dataOfEquation(1);
            imgEquaiton.alt = 'Denklem Resmi';

            equation.appendChild(imgEquaiton);
            
            break;
        case '2':
            playSoundOption();

            shapeElement = document.createElement('div');
            shapeElement.className = 'square';
            shapeElement.style.top = '50%';
            shapeElement.style.left = '50%';
            shapeElement.style.transform = 'translate(-50%, -50%) scale(2)';

            const pointA2 = document.createElement('div');
            pointA2.className = 'point';
            pointA2.style.top = 'calc(50% - 100px)';
            pointA2.style.left = 'calc(50% - 100px)';
            pointA2.style.transform = 'translate(-50%, -50%)';

            const pointB2 = document.createElement('div');
            pointB2.className = 'point';
            pointB2.style.top = 'calc(50% - 100px)';
            pointB2.style.left = 'calc(50% + 100px)';
            pointB2.style.transform = 'translate(-50%, -50%)';

            const pointC2 = document.createElement('div');
            pointC2.className = 'point';
            pointC2.style.top = 'calc(50% + 100px)';
            pointC2.style.left = 'calc(50% + 100px)';
            pointC2.style.transform = 'translate(-50%, -50%)';

            const pointD2 = document.createElement('div');
            pointD2.className = 'point';
            pointD2.style.top = 'calc(50% + 100px)';
            pointD2.style.left = 'calc(50% - 100px)';
            pointD2.style.transform = 'translate(-50%, -50%)';

            const labelA2 = document.createElement('div');
            labelA2.className = 'label';
            labelA2.style.top = 'calc(50% - 120px)';
            labelA2.style.left = 'calc(50% - 120px)';
            labelA2.style.transform = 'translate(-50%, -50%)';
            labelA2.textContent = 'A';
            labelA2.style.fontSize="18px";

            const labelB2 = document.createElement('div');
            labelB2.className = 'label';
            labelB2.style.top = 'calc(50% - 120px)';
            labelB2.style.left = 'calc(50% + 120px)';
            labelB2.style.transform = 'translate(-50%, -50%)';
            labelB2.textContent = 'B';
            labelB2.style.fontSize="18px";

            const labelC2 = document.createElement('div');
            labelC2.className = 'label';
            labelC2.style.top = 'calc(50% + 120px)';
            labelC2.style.left = 'calc(50% + 120px)';
            labelC2.style.transform = 'translate(-50%, -50%)';
            labelC2.textContent = 'C';
            labelC2.style.fontSize="18px";

            const labelD2 = document.createElement('div');
            labelD2.className = 'label';
            labelD2.style.top = 'calc(50% + 120px)';
            labelD2.style.left = 'calc(50% - 120px)';
            labelD2.style.transform = 'translate(-50%, -50%)';
            labelD2.textContent = 'D';
            labelD2.style.fontSize="18px";

            const leftSideXLabel = document.createElement('div');
            leftSideXLabel.className = 'label';
            leftSideXLabel.style.top = 'calc(50%)';
            leftSideXLabel.style.left = 'calc(50% - 110px)'; // Sol kenarın solunda olacak şekilde
            leftSideXLabel.style.transform = 'translate(-100%, -50%)'; // Sol kenarın hizasında
            leftSideXLabel.textContent = 'x birim';
            leftSideXLabel.style.fontSize="18px";

            const topSideXLabel = document.createElement('div');
            topSideXLabel.className = 'label';
            topSideXLabel.style.top = 'calc(50% - 110px)'; // Üst kenarın üstünde olacak şekilde
            topSideXLabel.style.left = 'calc(50%)';
            topSideXLabel.style.transform = 'translate(-50%, -100%)'; // Üst kenarın hizasında
            topSideXLabel.textContent = 'x birim';
            topSideXLabel.style.fontSize="18px";

            shapeContainer.appendChild(shapeElement);
            shapeContainer.appendChild(pointA2);
            shapeContainer.appendChild(pointB2);
            shapeContainer.appendChild(pointC2);
            shapeContainer.appendChild(pointD2);
            shapeContainer.appendChild(labelA2);
            shapeContainer.appendChild(labelB2);
            shapeContainer.appendChild(labelC2);
            shapeContainer.appendChild(labelD2);
            shapeContainer.appendChild(leftSideXLabel);
            shapeContainer.appendChild(topSideXLabel);

            dimensionLabel = 'İki Boyutlu';
            
            equation.innerHTML='';
            
            imgEquaiton.src = dataOfEquation(2);
            imgEquaiton.alt = 'Denklem Resmi';

            equation.appendChild(imgEquaiton);
            
            break;

        case '3':
            playSoundOption();
            
            shapeElement = document.createElement('div');
            shapeElement.className = 'cube';
            shapeElement.style.top = '50%';
            shapeElement.style.left = '50%';
            shapeElement.style.transform = 'translate(-50%, -50%)';

            const img = document.createElement('img');
            img.style.width="300px";
            img.style.height="300px";

            img.src = kupVerisi();
            img.alt = 'Küp Resmi';

            shapeElement.appendChild(img);

            shapeContainer.appendChild(shapeElement);
            dimensionLabel = 'Üç Boyutlu';
            
            equation.innerHTML='';
            
            imgEquaiton.src = dataOfEquation(3);
            imgEquaiton.alt = 'Denklem Resmi';

            equation.appendChild(imgEquaiton);
            
            break;
        }

    dimensionText.textContent = dimensionLabel;
}

function playSoundClick() {
    var sound = document.getElementById("click");
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
    content.style.textAlign = "justify";
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

function kupVerisi() {
    veri='data:image/png;base64,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';
    return veri;
}

function dataOfEquation(index) {
    let data='';

    switch (index) {
        case 0:

            data='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAIAAACzY+a1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAANUSURBVHhe7dy/VdtQGEBxyCw2BYcJ5AmgYgq5hAGyQRpTho6WKg3yBPEEHArkXRxLfsYWsWSFUOjy3dvIksDN7zz9edLx6Wq1OjFy39LSsEmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8QUlXM7vppPJ6bbJZHo3X6Z9tCL+sPPybjK+XaSVvbJZ+ftmlFY4xRuF82nyy/Ki3FTkWbVhcTuezqsPsNajMFLlrNaqRlzasqltO6BghFupvEgbdhV5vYdnGOtAunx6rI+h+fVlvb7f5XVtuHh8gl3XxCIsXzZnwfNxvdpsfL45I76U9SqmUITL1+d6eXF26LpzdHZRL59fWcMwFGHnIMQOw3g3FV8uCfFFJGw7UqbjLK1QhOlkd6S2U+VQC0XYfc3Zfb063GIdSLtu37tu+wddsHNhuyFWcPDT3GnmctuRGcztFGjq0F+/fWFe7HaWe1vTJk7Dn+buj9gDsGrvC7Msz/Ns919AQMaTin6IPQGrtg8IG1WPD9N+VoyHTccR3wH2GU5lURSzWZ7P1ksm3ibK88IjiM3dyOPhh6MQdh4oIwOSCFsRYwOyCA8iRgdcrWgvIba9QFi3BvyJuzH/72izM6Obh+ZIfGs9JAP6reNNsB1GzGYPwLd4PyXiHOnfiFn+PSogdJp7/uPd6XBx/4v4GvbnBCScT6/u08dd91fId+k/IxzhQcCqsIgwwiZgXhT7J8WoiJvbQ0aHbuM/ML/9xQIRNgF3c6Qdk6chwhC2AVbFRmQQHjWKjEgg7OXTHKWREIdP2HuARUUcOuE/HSFjIg6b8B3g8VuGiIgRf7Tki4Wc5rb9JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyG8k5M/GQvUSNTMNbQAAAAASUVORK5CYII=';
            
            break;

        case 1:
            data='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAIAAACzY+a1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAK3SURBVHhe7d3BcZtAGEDhVWqxmxAVxIXA0SkgHfgijuHmDnyCDlxBJhfTC9lYa8dISMg6ZOblf+8CEnvQzDeAWMRoM01TMnJfytKwSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4QpDc0m1wzlJS0J0/DUlTVm4QmH5o4tGJNwHIdc2zZVtaEDphTy32Lyye9Yru6nH1/LOqqQhGPbPPwq6yn97LrnvJAQ29hWt9+yIZbQb6T4JMQnIT4J8UmIT0J8EuKTEJ+E+DCE+5t671XtWDYsNrZVGfjaymh4E6a+Lh9533b3UjYc9bLblkGvnRmZextc9+UNWiDCSxE/BSjhv24d8QAQC3N5MMJVxPnmAIBAwrMHyoCASMKTiCEBoYSLiEEBpwl71/7tZvtiGZB5B/6asLMzN/eP8z3xvbxLxvHLgSfYlhG3u8f7m7IeI/Qc6THitv4eDJA+zT08HJwOn7sn6qMRV0cmXPwtfXeHfb7lyriEJx+GiIZIJZwD1n3/8aQYDHF/eQhr6TI+3vx2iUg4B/w7R3pm8vR/jkd4CvBPIRFhhKtGARFRhBf5zPfSAIggwot3sGCIGMJPHSFDIUIIDwDXLxkCIfqULz72NLflJMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EsJL6TfTTOIB6MOVBQAAAABJRU5ErkJggg==';

            break;

        case 2:
            data='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAIAAACzY+a1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAM9SURBVHhe7d1BUtpQHIBx6FmkC8cTkBNo9z0CLO0BeoNuYKk7b+AqOUE9QVcld6FJeCAJCeg4ncnn//s2IGSc0d+8JO89HKfb7XZi5L6kR8MmIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIb6ghGVZrJdZNk1lWbYsyjK9SWsbrs1qnn72bvNFno4hFY3w1a/y2qTy1eLw6mqTjsQUjDBfDEkdbHEjMRZhEuwfantemmGo25ny75/m8ebrVfPYbnY9dI0cd8HuSG/mddez9OWnyP8Ws69cZ7MfL81Z9vd93ygdaxI2lcVydvdYP6uuhA+3zWuUXJ1pJvnJr5powPzqmpuaoB1PCCs+3pSwKSphVy9n8tVFJNzkn0WvKR7hfgbfrLCl19AFuyPdzxyqG8/Nwy1p6jBcLMJiOa1vPXFTv7ONfVJR/dKPy9ZnN/WqQZYObOoeXTzvpg7fv03K4ZpDSTWn0zF3uHbtOrMb1NkIPDlyeKOwFW2Zm3A78zbES4An32coCf9HlxE7gLhNvw9EmVRcQGy/HQmQQ3j2RBkZkEQ4iBgbkEXYixgdkLc6c1he6asCBO4VfTTafuHV/VN7JB6qhmRAvyrelm8/4nz19HmWzN4Xcdf+FHG++BkVEPrBi+JX53L48vhcpKfxAhIWy90HXVo93i2jIuIIewHrwiLCCNuAizw/vihGRdxNDxn1TeMDr2+nQIRtwNc10jOLpyHCEA4B1sVGZBBeNIqMSCB8k097lEZCHD/hmwdYVMSxE77rDBkTcdyEHcDLU4aIiP59IT7kMrcdJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchvMnkH/ZuTl6rjHUiAAAAAElFTkSuQmCC';

            break;

        case 3:
            data='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAIAAACzY+a1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAN/SURBVHhe7d0xTttQAIBh6FmSDlVPYJ8AunTqEZyRLt06snUxI9lYmViwT0BOgBjq3CV9dpzUCQ4OKpX88/5/cYwtIfThZ/s9IU5Xq9WJkfvQbg2bhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLii5BwWV7N0jQ93ZSms6ty2R4ktoqrIkvaH3y/JK/ac2DFRVhkLVeWF1VbkW9Vs6I9D1VMhFW+tnoutTmCvBIjuhcu728X9Tb7etbsd5p8+dYYLp6qZh9VRITV0yFBdhERnl03977rPsGWN/k0bXZR+X8qwgh7lU6/14ThJtkLPO6iJSxn6eVj2C4WzfVXP6TeXF9Mms+sIp6dCXgbv9Di8eme+X4f8UC6XNZkVXV/d3k7X1smWfGAG0q9FzYty9n0fB4+hDfDB9hwGvFA2m1y9mP9dg98M4yHMDy/1M3Kdv9Aj79pd8SYrsLm8WWI6PNH2lNpPITTT+uR8rb3wXMz+0Z8uQ+PM6Nts7DQNjAJvZmrbnt+9nadYv9Itf1GxLWKka9UHI84CBjqnpMkWVPS+ZKLTf+l4xCPAWzqLg92S7LDvx0jD7BeOIy4B3jExVQVRZHnWZaHbVFR8dYhlnwHEHcPM0fDfwhB+OJAGTkghvAgYvSAIMJeRAFDqGnu7dpsXwEQuF77BqFmZyYXN7tX4rZwScbpF4JNsPUjJvkNcr39bcLNkT5HTLKfEQMSp7nLX3u3w8X8bmAB6X1HIyxnzeL6bvPzoVXA9xyLsBewLmZEEuEuYFYU3ZtixIjr10NAfa/xr5/ffodRCHcB/86RvjB5GksMwkOAddEjAggHjSJHHD3hUT67V2lkiCMnPPoCixhx1ISvGiGjRRwx4R7g8CtDpIj+WQw+3jS37SUhPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UmIT0J8EuKTEJ+E+CTEJyE+CfFJiE9CfBLikxCfhPgkxCchPgnxSYhPQnwS4pMQn4T4JMQnIT4J8UkI7+TkD2dEhHAXsMsxAAAAAElFTkSuQmCC';

            break;

    }  

    return data;
        
}