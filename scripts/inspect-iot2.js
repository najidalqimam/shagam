const fs = require("fs");
const js = fs.readFileSync("D:/projects/shagam/tmp-iot-app.js", "utf8");

function dumpAround(needle, n = 20, radius = 180) {
  const lower = js.toLowerCase();
  const target = needle.toLowerCase();
  let i = -1;
  let count = 0;
  console.log(`\n==== ${needle} ====`);
  while ((i = lower.indexOf(target, i + 1)) !== -1 && count < n) {
    console.log(js.slice(Math.max(0, i - radius), i + radius).replace(/\s+/g, " "));
    count++;
  }
}

dumpAround("GLTFLoader", 10, 200);
dumpAround(".glb", 30, 120);
dumpAround("gltf", 30, 120);
dumpAround("droneCanvas", 10, 250);
dumpAround("PerspectiveCamera", 10, 200);
dumpAround("map", 5, 80);
dumpAround("TextureLoader", 15, 150);
dumpAround("load(", 20, 100);

// Find webpack require module IDs near drone function
const droneFn = js.indexOf("function drone()");
console.log("\n==== DRONE FUNCTION START ====");
console.log(js.slice(droneFn, droneFn + 8000).replace(/\s+/g, " ").slice(0, 7000));
