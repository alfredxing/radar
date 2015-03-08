var DETAILED_WEATHER = ["wind", "dewpoint", "pressure", "visiblity", "humidity"];

function updateOptions() {
    var options = {};
    $(".option").each(function() {
        options[$(this).attr("data-option")] = $(this).hasClass("selected");
    });
    console.log(options);

    $.ajax({
        url: '/user/preferences',
        data: JSON.stringify(options),
        type: 'PATCH',
        contentType: 'application/json'
    });
}

$(window).load(function() {
    $("#refresh").click(function() {
        // Refresh radar
        $.getJSON("/data/radar.json", function(res) {
            window.data = res;
            overlay.draw();
        });

        // Refresh weather
        $.getJSON("/weather", function(res) {
            $("#temp").text(data.current.temperature);
            $("#condition").text(data.current.condition);
            $("[data-tag=updated]").text((new Date(data.current.updated)).toLocaleString());

            for (var i = 0; i < DETAILED_WEATHER.length; i++) {
                var tag = DETAILED_WEATHER[i];
                $("[data-tag=" + tag + "]").text(data.current[tag]);
            }
        });

        return false;
    });

    $("body").on('click', '#preferences.collapsed', function() {
        $(this).toggleClass("collapsed");
    });
    $("#preferences .close").click(function(e) {
        $("#preferences").toggleClass("collapsed");
        e.stopPropagation();
    });

    $(".option").click(function() {
        $(this).toggleClass("selected");
        updateOptions();
    });

    // Convert last updated string to human readable date
    $("[data-tag=updated]").text(function() {
        return (new Date($(this).text())).toLocaleString()
    });
});
