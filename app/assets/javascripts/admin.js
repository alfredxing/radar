$(window).load(function() {
    $("#update-radar").click(function() {
        $("#radar-out").text("Processing...")
        $.post("/admin/update/radar", function(data) {
            if (data === true)
                $("#radar-out").text("Radar successfully refreshed!")
            else
                $("#radar-out").text("An error occured. Please check the server logs for details.")
        });
    });
});