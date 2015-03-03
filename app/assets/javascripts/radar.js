var COLORS = {
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
var RAD = Math.PI / 180;

function draw(canvas, data) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var floor = Math.floor,
        round = Math.round;

    var centerX = canvas.width / 2,
        centerY = canvas.height / 2;

    var rays = data.rays,
        width = (canvas.width / 2) / data.ngates;

    for (var r = 0; r < data.nrays; r++) {
        var azimuth = rays[r]['azimuth'],
            gates = rays[r]['gates'],
            startAngle = radians(azimuth - 90),
            endAngle = startAngle + RAD;

        for (var v = -30; v <= 75; v+= 5) {
            ctx.fillStyle = COLORS[v.toString()];
            for (var g = 0; g < data.ngates; g++) {
                var gate = gates[g];

                if (gate === "NaN")
                    continue;

                var startRadius = g * width,
                    endRadius = startRadius + width;

                var diff = gate - v;
                if (diff < -2.5 || diff >= 2.5)
                    continue;

                while (g + 1 < data.ngates) {
                    next = gates[g + 1];
                    if (next === "NaN" || next - v < -2.5 || next - v >= 2.5) {
                        break;
                    }
                    endRadius += width;
                    g++;
                }

                ctx.beginPath();
                ctx.arc(centerX,centerY,endRadius,startAngle,endAngle, false); // outer (filled)
                ctx.arc(centerX,centerY,startRadius,endAngle,startAngle, true); // outer (unfills it)
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    ctx.scale(2,2);
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
