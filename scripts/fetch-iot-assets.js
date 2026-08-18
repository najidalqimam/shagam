const fs = require("fs");
const https = require("https");
const http = require("http");
const { URL } = require("url");

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, url).href).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

(async () => {
  // Try fetching their intro image for map reference styling only
  const urls = [
    "https://iotsquared.com.sa/images/intro.webp",
    "https://prod.spline.design/FuU3zzP2pQm22no9/scene.splinecode",
  ];
  for (const u of urls) {
    try {
      const buf = await get(u);
      const name = u.includes("intro") ? "tmp-intro.webp" : "tmp-scene.splinecode";
      fs.writeFileSync("D:/projects/shagam/" + name, buf);
      console.log(name, buf.length);
    } catch (e) {
      console.log("fail", u, e.message);
    }
  }
})();
