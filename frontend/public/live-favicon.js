const frames = [
    "___🚗_",
    "__🚗💨",
    "_🚗💨_",
    "🚗💨▫️",
    "💨▫️▫️",
    "▫️▫️▫️"
];

const canvas = document.createElement("canvas");
canvas.width = 64;
canvas.height = 64;
const ctx = canvas.getContext("2d");
ctx.font = "32px serif";
ctx.textBaseline = "middle";

const favicon = document.getElementById("favicon");

let i = 0;
setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(frames[i % frames.length], 0, canvas.height / 2);
    favicon.href = canvas.toDataURL("image/png");
    i++;
}, 300);