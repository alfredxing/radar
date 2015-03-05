//= require map

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

$(function() {
    $("#refresh").click(function() {
        initialize();
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
});
