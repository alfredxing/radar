var COLORS = ["#cbffff","#cb9ace","#97669a","#653467","#653467","#9b9864","#646464","#00eae6","#00a1f5","#0024f7","#31fc00","#23c300","#178e00","#fff500","#e9ba00","#ff9300","#ff001a","#d60014","#be0010","#f41eff","#9357c8","#fdfdfd","#fdfdfd"];
var RAD = Math.PI / 180;

function draw(canvas, data) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var floor = Math.floor,
        round = Math.round,
        abs = Math.abs;

    var centerX = canvas.width / 2,
        centerY = canvas.height / 2;

    var rays = data.rays,
        width = (canvas.width / 2) / data.ngates;

    for (var r = 0; r < data.nrays; r++) {
        var azimuth = rays[r]['azimuth'],
            gates = rays[r]['gates'],
            startAngle = RAD * (azimuth - 90),
            endAngle = startAngle + RAD;

        for (var g = 0; g < data.ngates; g++) {
            var gate = gates[g];

            if (gate === "NaN")
                continue;

            var startRadius = g * width,
                endRadius = startRadius + width;

            ctx.fillStyle = COLORS[round(gate/5) + 6];

            while (g + 1 < data.ngates) {
                next = gates[g + 1];
                if (next === "NaN" || abs(next - gate) > 2.5) {
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
