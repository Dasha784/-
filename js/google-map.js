var google;

function initMap() {
    // Координаты для вашего магазина (ул. Хрещатик, 1, Киев)
    var myLatlng = new google.maps.LatLng(50.4478, 30.5234);
    
    var mapOptions = {
        zoom: 17,  // Увеличено для лучшего отображения улицы
        center: myLatlng,
        scrollwheel: true,  // Разрешаем масштабирование колесом
        disableDefaultUI: false,  // Показываем элементы управления
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                "featureType": "administrative.country",
                "elementType": "geometry",
                "stylers": [
                    {"visibility": "simplified"},
                    {"hue": "#ff0000"}
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [{"visibility": "off"}]
            }
        ]
    };

    // Создаем карту
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Добавляем маркер
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'AlcoMarket',
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Добавляем информационное окно
    var infowindow = new google.maps.InfoWindow({
        content: '<div style="padding:10px;"><h5 style="margin:0;">AlcoMarket</h5><p style="margin:5px 0 0;">вул. Хрещатик, 1, Київ</p></div>'
    });

    // Открываем инфоокно при клике на маркер
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    // Автоматически открываем инфоокно при загрузке
    infowindow.open(map, marker);
}

// Инициализация карты после загрузки API
window.initMap = initMap;
google.maps.event.addDomListener(window, 'load', init);