function draw(canvas, data) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var colors = {
        "-30": "#cbffff",
        "-25": "#cb9ace",
        "-20": "#97669a",
        "-15": "#653467",
        "-10": "#653467",
        "-5": "#9b9864",
        "0": "#646464",
        "5": "#00eae6",
        "10": "#00a1f5",
        "15": "#0024f7",
        "20": "#31fc00",
        "25": "#23c300",
        "30": "#178e00",
        "35": "#fff500",
        "40": "#e9ba00",
        "45": "#ff9300",
        "50": "#ff001a",
        "55": "#d60014",
        "60": "#be0010",
        "65": "#f41eff",
        "70": "#9357c8",
        "75": "#fdfdfd",
        ">75": "#fdfdfd"
    };

    var floor = Math.floor,
        round = Math.round;

    var centerX = floor(canvas.width / 2),
        centerY = floor(canvas.height / 2);

    var rays = data.rays,
        width = floor((canvas.width / 2) / data.ngates);

    for (var i = 0; i < data.nrays; i++) {
        var ray = rays[i],
            gates = ray['gates'];

        var startAngle = radians(ray.azimuth - 90),
            endAngle = startAngle + radians(1);

        for (var v = -30; v <= 75; v+= 5) {
            ctx.fillStyle = colors[v.toString()];
            for (var j = 0; j < data.ngates; j++) {
                var startRadius = j * width,
                    endRadius = startRadius + width;

                if (gates[j] === "NaN")
                    continue;

                var value = 5 * round(gates[j] / 5);

                if (value != v)
                    continue;

                while (gates[j+1] == value) {
                    endRadius += width;
                    j++;
                }

                ctx.beginPath();
                // console.log(centerX, centerY, startRadius, endRadius, startAngle, endAngle);
                ctx.arc(centerX,centerY,endRadius,startAngle,endAngle, false); // outer (filled)
                ctx.arc(centerX,centerY,startRadius,endAngle,startAngle, true); // outer (unfills it)
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // ctx.fillRect(0, 0, 100, 100);
}

function drawImage(canvas) {
    var centerX = canvas.width / 2,
        centerY = canvas.height / 2;

    var dotImage = new Image();
    dotImage.src = 'images/dot.png';
    dotImage.onload = function(){
        canvas.getContext("2d").drawImage(dotImage, centerX - 10, centerY - 10);
    }
}

function radians(degrees) {
    return degrees * Math.PI / 180;
}
