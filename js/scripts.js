var screenWidth, screenHeight, bodyHeight;
var themeDirectory = '';

var map, mapContainer, mapsIcon, mapsIconActive, markersArray = [];
var defaultLat, defaultLng;

var URLCountries = 'https://www.trackcorona.live/api/countries';
var URLStates = 'https://www.trackcorona.live/api/provinces';

var selectEstado;


$(document).ready(function() {
  createVars(); // cache de variables
  setListeners(); // llamado de objetos
  resize();
  //render_map(mapContainer);
  getInfoCountries();
});

function getScrollBarWidth () {
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);
  return (w1 - w2);
};

function createVars(){
  mapContainer = $("#map");
  selectEstado = $("#select-estado");
}

window.onorientationchange = resize;
$(window).resize(function() {
  resize();
});

function resize(){
  screenWidth = $(window).width() + getScrollBarWidth();
  screenHeight = $(window).height();
  console.log("screenWidth: "+screenWidth);
  console.log("screenHeight: "+screenHeight);
}

function setListeners(){
    selectEstado.change(function() {
        var valor = $(this).val();
        if(valor != ''){
            google.maps.event.trigger(markersArray[valor], 'click');
            changeIconMarkerMap(valor);
            console.log('Ha cambiado, y ahora es: '+valor);
        }
    });
}

/*FUNCIONES*/

//Función que crea el mapa
function render_map( $el, $zoom, $arrEstados ) {
	$zoom = typeof $zoom !== 'undefined' ? $zoom : 5;
	var $markers = $arrEstados;

	var args = {
		zoom		: $zoom,
		center		: new google.maps.LatLng(defaultLat, defaultLng),
		mapTypeId	: MY_MAPTYPE_ID,
		mapTypeControl: false,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER,
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		},
		scrollwheel: false,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl: true,
		streetViewControl: false
	};

	
	map = new google.maps.Map(document.getElementById($el.attr("id")),args);
	
	var styledMapOptions = {
		name: 'Escala de grises'
	};
	var customMapType = new google.maps.StyledMapType(styles, styledMapOptions);
	
	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
    
    
    map.markers = [];
    /*
	$markers.each(function(){
    	add_marker($(this), map);
    });
    */
    for(var i=0; i < $markers.length; i++){
        add_marker($markers[i], map, i);
        setOptionsSelect($markers[i], map, i);
    }
	center_map(map, $zoom);
}

function add_marker( $marker, $map, $contador) {
    //var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );
    var latlng = new google.maps.LatLng( $marker.latitude, $marker.longitude );
    //var _id = $marker.attr("id");
    var _id = $contador;
	var _mapsIcon;
	
	_mapsIcon = themeDirectory + "assets/img/pin.png";


   var contentString = setHTMLInfoMap($marker);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

	var marker = new google.maps.Marker({
		position	: latlng,
		map			: $map,
		icon		: _mapsIcon
	});

	google.maps.event.addListener(marker, 'click', function() {
		var id = marker.get("id");
        changeIconMarkerMap(id);
        infowindow.open($map, marker);
	});
		
	
	marker.set("id", _id);
	$map.markers.push(marker);
	markersArray[_id] = marker;

}

function reset_marker_icons(){
	$.each( map.markers, function( i, marker ){
		var id = marker.get("id");
		//var tempID = id.split("-");
		var _mapsIcon = themeDirectory + "assets/img/pin.png";
		marker.setIcon(_mapsIcon);
		marker.setZIndex(100);
	});
}

function center_map($map, $zoom ) {
	$zoom = typeof $zoom !== 'undefined' ? $zoom : 8;
	var bounds = new google.maps.LatLngBounds();
	var count = 0;
	
	$.each( $map.markers, function( i, marker ){
		var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
		if(marker.getMap()!==null){
			count++;
			bounds.extend( latlng );
		}
	});
	if( count == 0 ){
		
	}else if( count == 1 ){
	    $map.setCenter( bounds.getCenter() );
	    $map.setZoom( $zoom );
	}else{
		$map.fitBounds( bounds );
	}
}

function center_marker(marker){
	var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
    map.panTo(latlng);
}

//Función que cambia el ícono del mapa y el hover de los items del menú
function changeIconMarkerMap(_id){
	reset_marker_icons();
	//var tempID = _id.split("-");
	//console.log('tempID:'+tempID[1]);
	
	var marker = markersArray[_id];
	var _mapsIconActive = themeDirectory + "assets/img/pin_active.png";	
	marker.setIcon(_mapsIconActive);
	
	center_marker(marker);
	marker.setZIndex(200);
}

var MY_MAPTYPE_ID = 'custom_style';

var styles = [
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7b7b7b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c8d7d4"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
]

/*FUNCIONES*/ 

function getInfoCountries(){
    $.ajax({
        url: URLCountries,
        type: 'GET',
        dataType : 'json',
        beforeSend: function () {
            console.log('Haciendo algo...');
        },
        success: function (response) {
            console.log('Respuesta: ');
            var arrPaises = response.data;
            var pais = arrPaises.find(item => item.country_code === "us");
            defaultLat = pais.latitude;
            defaultLng = pais.longitude;
            getInfoStates();
            setDatosGenerales(pais);
        }
    });
};

function getInfoStates() {
    $.ajax({
        url: URLStates,
        type: 'GET',
        dataType : 'json',
        beforeSend: function () {
            console.log('Haciendo algo...');
        },
        success: function (response) {
            console.log('arrEstados: ');
            var arrEstadosResponse = response.data;
            var arrEstados = [];
            for(var i=0; i < arrEstadosResponse.length; i++){
                if(arrEstadosResponse[i].country_code === "us"){
                    arrEstados.push(arrEstadosResponse[i]);
                }                
            }
            console.log(arrEstados);
            render_map(mapContainer, 6, arrEstados);
        }
    });
};

function setHTMLInfoMap($marker){
    var nombre = $marker.location;
    var total = $marker.confirmed;
    var fallecidos = $marker.dead;
    var recuperados = $marker.recovered;
    var activos = total - (fallecidos + recuperados);

    var HTML = '';
    HTML+= '<div class="row">';
        HTML+= '<div class="col-12">';
            HTML+= '<h3 class="text-center">'+nombre+'</h3>';
            HTML+= '<ul class="list-group gris">';
                HTML+= '<li class="list-group-item d-flex justify-content-between align-items-center rojo">';
                    HTML+= 'Total de casos';
                    HTML+= '<span class="badge badge-total badge-pill">'+total+'</span>';
                HTML+= '</li>';
                HTML+= '<li class="list-group-item d-flex justify-content-between align-items-center">';
                    HTML+= 'Activos';
                    HTML+= '<span class="badge badge-activos badge-pill">'+activos+'</span>';
                HTML+= '</li>';
                HTML+= '<li class="list-group-item d-flex justify-content-between align-items-center">';
                    HTML+= 'Recuperados';
                    HTML+= '<span class="badge badge-recuperados badge-pill">'+recuperados+'</span>';
                HTML+= '</li>';
                HTML+= '<li class="list-group-item d-flex justify-content-between align-items-center">';
                    HTML+= 'Fallecidos';
                    HTML+= '<span class="badge badge-fallecidos badge-pill">'+fallecidos+'</span>';
                HTML+= '</li>';
           HTML+= '</ul>';
        HTML+= '</div>';
    HTML+= '</div>';

    return HTML;
}

function setDatosGenerales($pais){
    var total = $pais.confirmed;
    var fallecidos = $pais.dead;
    var recuperados = $pais.recovered;
    var activos = total - (fallecidos + recuperados);
    var actualizado = $pais.updated;

    $('#tag-casos-activos').html(activos);
    $('#tag-casos-recuperados').html(recuperados);
    $('#tag-casos-fallecidos').html(fallecidos);
    $('#tag-casos-total').html(total);
    $('#tag-ultima-actualizacion').html('Última actualización<br>'+actualizado);
}

function setOptionsSelect($marker, $map, $contador){
    var _estado = $marker.location;
    var _id = $contador;
    var HTML = '';
    HTML+= '<option value="'+_id+'">'+_estado+'</option>';
    $('#select-estado').append(HTML);
}
