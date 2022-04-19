console.log("here");

let celToFerData = [];
let ferToCelData = [];

for (let i = -500; i < 500; i++) {
    celToFerData.push({
        c: i,
        f: (i * 1.8) + 32
    });
}
for (let i = -500; i < 500; i++) {
    ferToCelData.push({
        c: (i - 32) * 0.5556,
        f: i,
    });
}
console.log(celToFerData, ferToCelData);


