const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    angleInput = document.getElementById("angle"),
    speedInput = document.getElementById("speed"), 
    heightInput = document.getElementById("height"),
    xoffsetInput = document.getElementById("xoffset"), // Added xoffset input
    windInput = document.getElementById("wind"), 
    gravityInput = document.getElementById("gravity"),
    intervalInput = document.getElementById("interval");

const defaults = { angle: 45, speed: 50, height: 0, xoffset: 0, wind: 0, gravity: 9.81, interval: 0.05 };

let animationFrame;

window.onload = () => { canvas.width = 1200; canvas.height = 600; drawGrid(); applyDefaults(); };

function applyDefaults() {
    Object.keys(defaults).forEach(key => document.getElementById(key).value = defaults[key]);
}

document.getElementById("simulate").addEventListener("click", simulate);
document.getElementById("export").addEventListener("click", exportData);
document.getElementById("importBtn").addEventListener("click", () => document.getElementById("import").click());
document.getElementById("import").addEventListener("change", handleFileSelect);

function simulate() {
    cancelAnimationFrame(animationFrame);

    const angle = parseFloat(angleInput.value) * (Math.PI / 180), 
          speed = parseFloat(speedInput.value),
          height = parseFloat(heightInput.value), 
          xoffset = parseFloat(xoffsetInput.value), 
          wind = parseFloat(windInput.value),
          gravity = parseFloat(gravityInput.value), 
          interval = parseFloat(intervalInput.value);

    const allInputsAre69 = [angleInput, speedInput, heightInput, xoffsetInput, windInput, gravityInput, intervalInput]
        .every(input => input.value === "69");

    const video = document.createElement("video");
    video.src = './assets/video.webm'; 
    video.loop = true;
    video.muted = !allInputsAre69; // Only enable sound if all inputs are 69
    video.playsInline = true;

    let t = 0, x = xoffset, y = canvas.height - height;

    if (allInputsAre69) {
        setFormulasToRickRoll(); 
        video.play().catch(err => console.error("Video playback failed:", err));
    } else {
        updateFormulas(angle, speed, height, xoffset, wind, gravity); 
        video.pause(); // Ensure video stops playing
    }

    function animate() {
        if (allInputsAre69 && video.readyState >= 2) {  
            ctx.drawImage(
                video, 
                0, 0, video.videoWidth, video.videoHeight, 
                0, 0, canvas.width, canvas.height 
            );
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
        }
        drawGrid();

        if (y <= canvas.height) {
            x = xoffset + speed * Math.cos(angle) * t + wind * t;
            y = canvas.height - (height + speed * Math.sin(angle) * t - 0.5 * gravity * t ** 2);
            const vy = speed * Math.sin(angle) - gravity * t;
            ctx.fillStyle = vy > 0 ? "#58a6ff" : "#8e44ad";
            ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
            t += interval; 
        }

        animationFrame = requestAnimationFrame(animate);
    }

    video.onloadeddata = animate; 
}

function setFormulasToRickRoll() {
    const message = "Never Gonna Give You Up";
    document.getElementById("horizontal").textContent = message;
    document.getElementById("vertical").textContent = message;
    document.getElementById("equation").textContent = message;
}

function updateFormulas(angle, speed, height, xoffset, wind, gravity) {
    const horizontal = `x(t) = ${xoffset} + (${speed.toFixed(5)} * cos(${(angle * 180 / Math.PI).toFixed(5)})) t + ${wind.toFixed(5)} t`,
          vertical = `y(t) = ${height} + (${speed.toFixed(5)} * sin(${(angle * 180 / Math.PI).toFixed(5)})) t - 0.5 * ${gravity.toFixed(5)} * t²`,
          parabola = `y(x) = ${(-gravity / (2 * Math.pow(speed * Math.cos(angle), 2))).toFixed(5)} * (x - ${xoffset})² + ${Math.tan(angle).toFixed(5)} * x + ${height}`; // Adjusted parabola equation

    document.getElementById("horizontal").textContent = horizontal;
    document.getElementById("vertical").textContent = vertical;
    document.getElementById("equation").textContent = parabola;
}

function drawGrid() {
    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let j = 0; j < canvas.height; j += 50) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }
}

function handleFileSelect(event) {
    const file = event.target.files[0], reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => { if (document.getElementById(key)) document.getElementById(key).value = data[key]; });
    };
    reader.readAsText(file);
}

function exportData() {
    const settings = {
        angle: parseFloat(angleInput.value), 
        speed: parseFloat(speedInput.value), 
        height: parseFloat(heightInput.value),
        xoffset: parseFloat(xoffsetInput.value), // Include xoffset in export
        wind: parseFloat(windInput.value), 
        gravity: parseFloat(gravityInput.value), 
        interval: parseFloat(intervalInput.value)
    };
    const blob = new Blob([JSON.stringify(settings)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = "simulation.pms"; link.click();
}

document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
        const formulaText = document.getElementById(button.getAttribute('data-target')).textContent;
        navigator.clipboard.writeText(formulaText).catch(err => console.error('Failed to copy text: ', err));
    });
});
