//= require google-maps
//= require http
//= require radar

// Globals
var overlay, data;

// Radar overlay
RadarOverlay.prototype = new google.maps.OverlayView();

function RadarOverlay(map) {
    this.map_ = map;

    this.origin_ = new google.maps.LatLng(data.lat, data.lon, false);

    // Compute bounds
    var spherical = google.maps.geometry.spherical;
    var swBound = spherical.computeOffset(this.origin_, 325269.119346, -135);
    var neBound = spherical.computeOffset(this.origin_, 325269.119346, 45);
    this.bounds_ = new google.maps.LatLngBounds(swBound, neBound);

    // Define a property to hold the image's div. We'll
    // actually create this canvas upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.canvas_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

RadarOverlay.prototype.onAdd = function() {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 4096;
    canvas.style.position = 'absolute';
    canvas.style.opacity = 0.5;

    this.canvas_ = canvas;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(canvas);
};

RadarOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize and position the canvas to fit the indicated dimensions.
    var canvas = this.canvas_;
    canvas.style.left = sw.x + 'px';
    canvas.style.top = ne.y + 'px';
    canvas.width = (ne.x - sw.x);
    canvas.height = (sw.y - ne.y);

    draw(canvas, data);
};

// Station overlay
StationOverlay.prototype = new google.maps.OverlayView();

function StationOverlay(map) {
    this.map_ = map;

    this.origin_ = new google.maps.LatLng(data.lat, data.lon, false);

    // Compute bounds
    var spherical = google.maps.geometry.spherical;
    var swBound = spherical.computeOffset(this.origin_, 325269, -135);
    var neBound = spherical.computeOffset(this.origin_, 325269, 45);
    this.bounds_ = new google.maps.LatLngBounds(swBound, neBound);

    // Define a property to hold the image's div. We'll
    // actually create this canvas upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.canvas_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

StationOverlay.prototype.onAdd = function() {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 4096;
    canvas.style.position = 'absolute';

    this.canvas_ = canvas;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(canvas);
};

StationOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize and position the canvas to fit the indicated dimensions.
    var canvas = this.canvas_;
    canvas.style.left = sw.x + 'px';
    canvas.style.top = ne.y + 'px';
    canvas.width = (ne.x - sw.x);
    canvas.height = (sw.y - ne.y);

    drawImage(canvas);
};

// Init
function initialize() {
    var mapStyles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];

    var mapOptions = {
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
        // styles: mapStyles
    };

    http.get({
        url: "/data/radar.json",
        onload: function() {
            data = JSON.parse(this.responseText);
            mapOptions.center = { lat: 49.260605, lng: -123.245994};
            // mapOptions.center = { lat: data.lat, lng: data.lon };
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            var radar = new RadarOverlay(map);
            var station = new StationOverlay(map);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
