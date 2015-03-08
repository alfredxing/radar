//= require http
//= require radar
//= require ui

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
    var map = document.getElementById('map-canvas');
    canvas.style.position = 'absolute';
    canvas.style.opacity = 0.75;

    this.canvas_ = canvas;
    this.maxedZoom_ = this.getMap().getZoom() == 10;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(canvas);
};

RadarOverlay.prototype.draw = function() {
    if (this.getMap().getZoom() == 10 && this.maxedZoom_)
        return;

    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var center = overlayProjection.fromLatLngToDivPixel(this.origin_);

    var pixelRatio = overlayProjection.getWorldWidth() / 40075017;

    // Resize and position the canvas to fit the indicated dimensions.
    var canvas = this.canvas_;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = ne.x - sw.x;
    canvas.height = sw.y - ne.y;

    canvas.style.left = (center.x - (canvas.width / 2)) + "px";
    canvas.style.top = (center.y - (canvas.height / 2)) + "px";

    draw(canvas, data);

    this.maxedZoom_ = this.getMap().getZoom() == 10;
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
    this.image_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

StationOverlay.prototype.onAdd = function() {
    var image = document.createElement('img');
    image.src = '/images/dot.png';
    image.width = image.height = 20;
    image.style.position = 'absolute';

    this.image_ = image;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(image);
};

StationOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection();

    var center = overlayProjection.fromLatLngToDivPixel(this.origin_);

    // Position the image
    var image = this.image_;
    image.style.left = (center.x - 10) + 'px';
    image.style.top = (center.y - 10) + 'px';
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
        },
        maxZoom: 10
    };

    http.get({
        url: "/data/radar.json",
        onload: function() {
            data = JSON.parse(this.responseText);
            mapOptions.center = { lat: 49.260605, lng: -123.245994};
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            overlay = new RadarOverlay(map);
            var station = new StationOverlay(map);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
