//= require map

$(function() {
    $("#refresh").click(function() {
        http.get({
            url: "/data/radar.json",
            onload: function() {
                window.data = JSON.parse(this.responseText);
                overlay.draw();
            }
        });
        return false;
    })
});
