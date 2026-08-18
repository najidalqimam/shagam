const fs = require("fs");
const js = fs.readFileSync("D:/projects/shagam/tmp-iot-app.js", "utf8");
const html = fs.readFileSync("D:/projects/shagam/tmp-iot.html", "utf8");
const css = fs.readFileSync("D:/projects/shagam/tmp-iot-main.css", "utf8");

const assets = [
  ...js.matchAll(/["']([^"']{3,140}\.(?:glb|gltf|webp|png|jpe?g|hdr|mp4))["']/gi),
].map((m) => m[1]);
console.log("ASSETS\n" + [...new Set(assets)].join("\n"));

console.log("\n---- DRONE CONTEXT ----");
const lower = js.toLowerCase();
let i = -1;
let count = 0;
while ((i = lower.indexOf("drone", i + 1)) !== -1 && count < 40) {
  console.log(js.slice(Math.max(0, i - 60), i + 100).replace(/\s+/g, " "));
  count++;
}

console.log("\n---- HTML DRONE ----");
const m = html.match(/drone_wrap[\s\S]{0,4500}/);
console.log(m ? m[0].slice(0, 4000) : "none");

console.log("\n---- CSS DRONE ----");
const rules =
  css.match(/\.(?:drone[a-zA-Z0-9_-]*|full_page|full_bg)[^{]*\{[^}]+\}/g) || [];
console.log(rules.join("\n"));
