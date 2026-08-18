"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Recognizable Saudi Arabia silhouette in 0–1000 design space.
 * West = Red Sea, East = Arabian Gulf, South = Yemen, North = Jordan/Iraq.
 */
const KSA_PATH = [
  "M 255 145",
  "C 280 118 320 105 365 102",
  "C 410 100 455 108 495 125",
  "C 540 145 575 175 598 215",
  "C 625 265 640 320 648 375",
  "C 655 420 652 465 638 505",
  "C 620 560 585 605 535 635",
  "C 490 660 440 675 390 678",
  "C 345 680 305 668 275 640",
  "C 245 610 230 570 225 528",
  "C 220 485 228 445 248 410",
  "C 235 375 228 338 232 300",
  "C 236 255 242 210 255 145",
  "Z",
].join(" ");

const CITIES = [
  { nameAr: "الرياض", nameEn: "Riyadh", x: 500, y: 430 },
  { nameAr: "جدة", nameEn: "Jeddah", x: 275, y: 470 },
  { nameAr: "الدمام", nameEn: "Dammam", x: 640, y: 360 },
  { nameAr: "مكة", nameEn: "Makkah", x: 295, y: 500 },
  { nameAr: "المدينة", nameEn: "Madinah", x: 320, y: 355 },
  { nameAr: "أبها", nameEn: "Abha", x: 360, y: 620 },
  { nameAr: "تبوك", nameEn: "Tabuk", x: 290, y: 195 },
  { nameAr: "حائل", nameEn: "Hail", x: 420, y: 295 },
  { nameAr: "نجران", nameEn: "Najran", x: 430, y: 655 },
];

function drawSaudiMap(size = 2048, locale: "ar" | "en" = "ar") {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const s = size / 1000;

  ctx.clearRect(0, 0, size, size);

  const plate = ctx.createRadialGradient(
    size * 0.48,
    size * 0.42,
    size * 0.08,
    size * 0.48,
    size * 0.42,
    size * 0.52,
  );
  plate.addColorStop(0, "rgba(200, 220, 226, 0.65)");
  plate.addColorStop(1, "rgba(234, 234, 234, 0)");
  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.scale(s, s);

  const path = new Path2D(KSA_PATH);

  ctx.save();
  ctx.translate(6, 10);
  ctx.fillStyle = "rgba(40, 70, 80, 0.14)";
  ctx.fill(path);
  ctx.restore();

  ctx.fillStyle = "#b7d0d7";
  ctx.fill(path);

  const landGrad = ctx.createLinearGradient(260, 130, 640, 660);
  landGrad.addColorStop(0, "rgba(255,255,255,0.35)");
  landGrad.addColorStop(0.5, "rgba(46,184,176,0.12)");
  landGrad.addColorStop(1, "rgba(26,100,110,0.18)");
  ctx.fillStyle = landGrad;
  ctx.fill(path);

  ctx.save();
  ctx.clip(path);

  ctx.strokeStyle = "rgba(255,255,255,0.32)";
  ctx.lineWidth = 1.1;
  for (let x = 220; x < 700; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x, 700);
    ctx.stroke();
  }
  for (let y = 120; y < 690; y += 24) {
    ctx.beginPath();
    ctx.moveTo(220, y);
    ctx.lineTo(700, y);
    ctx.stroke();
  }

  for (const [cx, cy, r, color] of [
    [500, 420, 95, "rgba(46,184,176,0.18)"],
    [290, 470, 70, "rgba(26,138,132,0.16)"],
    [630, 360, 60, "rgba(201,166,107,0.2)"],
    [370, 610, 55, "rgba(46,184,176,0.12)"],
    [300, 210, 45, "rgba(140,170,180,0.2)"],
  ] as const) {
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(28, 70, 82, 0.28)";
  ctx.lineWidth = 2.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(275, 470);
  ctx.quadraticCurveTo(390, 445, 500, 430);
  ctx.quadraticCurveTo(580, 395, 640, 360);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(320, 355);
  ctx.quadraticCurveTo(410, 390, 500, 430);
  ctx.quadraticCurveTo(450, 540, 360, 620);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(290, 195);
  ctx.quadraticCurveTo(360, 280, 420, 295);
  ctx.quadraticCurveTo(470, 360, 500, 430);
  ctx.stroke();

  ctx.restore();

  ctx.strokeStyle = "rgba(46,184,176,0.45)";
  ctx.lineWidth = 8;
  ctx.stroke(path);
  ctx.strokeStyle = "#1a8a84";
  ctx.lineWidth = 3.2;
  ctx.stroke(path);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.1;
  ctx.stroke(path);

  for (const city of CITIES) {
    ctx.beginPath();
    ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#2eb8b0";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(city.x, city.y, 12, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(46,184,176,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "600 17px IBM Plex Sans, IBM Plex Sans Arabic, sans-serif";
    ctx.fillStyle = "rgba(28, 51, 68, 0.78)";
    ctx.textAlign = "center";
    ctx.fillText(
      locale === "en" ? city.nameEn : city.nameAr,
      city.x,
      city.y - 14,
    );
  }

  ctx.font = "700 28px IBM Plex Sans, IBM Plex Sans Arabic, sans-serif";
  ctx.fillStyle = "rgba(28, 51, 68, 0.35)";
  ctx.textAlign = "center";
  ctx.fillText(
    locale === "en" ? "Kingdom of Saudi Arabia" : "المملكة العربية السعودية",
    460,
    760,
  );

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export function useSaudiMapTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    return drawSaudiMap(2048);
  }, []);
}

export function SaudiMapMesh() {
  const texture = useSaudiMapTexture();
  if (!texture) return null;

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0, -0.03]} receiveShadow>
        <circleGeometry args={[4.4, 64]} />
        <meshBasicMaterial color="#d2dfe3" transparent opacity={0.5} />
      </mesh>

      <mesh receiveShadow>
        <planeGeometry args={[7.4, 7.4]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.9}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
