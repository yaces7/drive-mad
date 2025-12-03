import Matter from 'matter-js';

export const LEVELS = [
  // === TUTORIAL (1-5) ===
  {
    id: 1, name: "İlk Adım", hint: "Gaz ver ve finiş çizgisine ulaş!",
    spawn: { x: 100, y: 200 },
    terrain: [{ type: 'ground', x: 500, y: 400, w: 1200, h: 40 }],
    finish: { x: 900, y: 350, w: 60, h: 100 }
  },
  {
    id: 2, name: "Rampa Zamanı", hint: "Rampadan hız al!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 300, y: 400, w: 600, h: 40 },
      { type: 'ground', x: 750, y: 350, w: 300, h: 40, angle: -0.2 },
      { type: 'ground', x: 1050, y: 280, w: 400, h: 40 }
    ],
    finish: { x: 1200, y: 230, w: 60, h: 100 }
  },
  {
    id: 3, name: "Uçuş Dersi", hint: "Havadayken sol/sağ ile denge kur!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 300, y: 400, w: 500, h: 40 },
      { type: 'ground', x: 550, y: 380, w: 100, h: 40, angle: -0.25 },
      { type: 'ground', x: 900, y: 400, w: 400, h: 40 }
    ],
    hazards: [{ x: 725, y: 480, w: 150, h: 40 }],
    finish: { x: 1050, y: 350, w: 60, h: 100 }
  },
  {
    id: 4, name: "Dalgalar", hint: "Hızını kontrol et, dengeyi koru!",
    spawn: { x: 100, y: 150 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 300, h: 40 },
      { type: 'ground', x: 450, y: 380, w: 200, h: 40, angle: 0.15 },
      { type: 'ground', x: 650, y: 350, w: 200, h: 40, angle: -0.15 },
      { type: 'ground', x: 850, y: 380, w: 200, h: 40, angle: 0.15 },
      { type: 'ground', x: 1050, y: 350, w: 200, h: 40, angle: -0.15 },
      { type: 'ground', x: 1250, y: 320, w: 300, h: 40 }
    ],
    finish: { x: 1350, y: 270, w: 60, h: 100 }
  },
  {
    id: 5, name: "Atlama Ustası", hint: "Her boşlukta doğru açıyla atla!",
    spawn: { x: 80, y: 150 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 250, h: 40 },
      { type: 'ground', x: 320, y: 330, w: 80, h: 40, angle: -0.3 },
      { type: 'ground', x: 550, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 650, y: 330, w: 80, h: 40, angle: -0.3 },
      { type: 'ground', x: 900, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 1150, y: 320, w: 300, h: 40 }
    ],
    hazards: [{ x: 430, y: 450, w: 100, h: 30 }, { x: 770, y: 450, w: 100, h: 30 }],
    finish: { x: 1250, y: 270, w: 60, h: 100 }
  },

  // === TRAMBOLIN & BOUNCE (6-10) ===
  {
    id: 6, name: "Zıpla!", hint: "Trambolinler seni yukarı fırlatır!",
    spawn: { x: 100, y: 300 },
    terrain: [
      { type: 'ground', x: 200, y: 400, w: 200, h: 40 },
      { type: 'ground', x: 600, y: 300, w: 200, h: 40 },
      { type: 'ground', x: 1000, y: 200, w: 300, h: 40 }
    ],
    bouncers: [
      { x: 400, y: 450, w: 120, h: 20, power: 25 },
      { x: 800, y: 380, w: 120, h: 20, power: 20 }
    ],
    finish: { x: 1100, y: 150, w: 60, h: 100 }
  },
  {
    id: 7, name: "Bounce Combo", hint: "Ardışık trambolinlerle yüksel!",
    spawn: { x: 80, y: 350 },
    terrain: [
      { type: 'ground', x: 150, y: 420, w: 150, h: 40 },
      { type: 'ground', x: 1100, y: 100, w: 300, h: 40 }
    ],
    bouncers: [
      { x: 300, y: 450, w: 100, h: 20, power: 22 },
      { x: 500, y: 400, w: 100, h: 20, power: 22 },
      { x: 700, y: 320, w: 100, h: 20, power: 22 },
      { x: 900, y: 220, w: 100, h: 20, power: 22 }
    ],
    hazards: [{ x: 600, y: 480, w: 800, h: 30 }],
    finish: { x: 1150, y: 50, w: 60, h: 100 }
  },
  {
    id: 8, name: "Hassas Zıplama", hint: "Çok hızlı olma, kontrollü zıpla!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 500, y: 350, w: 80, h: 40 },
      { type: 'ground', x: 750, y: 350, w: 80, h: 40 },
      { type: 'ground', x: 1000, y: 350, w: 200, h: 40 }
    ],
    bouncers: [
      { x: 350, y: 380, w: 80, h: 15, power: 18 },
      { x: 620, y: 380, w: 80, h: 15, power: 18 },
      { x: 870, y: 380, w: 80, h: 15, power: 18 }
    ],
    hazards: [{ x: 600, y: 480, w: 600, h: 30 }],
    finish: { x: 1050, y: 300, w: 60, h: 100 }
  },

  // === HAREKETLI PLATFORMLAR (9-12) ===
  {
    id: 9, name: "Bekle ve Atla", hint: "Platform gelene kadar bekle!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 250, h: 40 },
      { type: 'ground', x: 900, y: 350, w: 300, h: 40 }
    ],
    movingPlatforms: [
      { x: 500, y: 350, w: 150, h: 30, moveX: 200, moveY: 0, speed: 0.002 }
    ],
    hazards: [{ x: 550, y: 480, w: 300, h: 30 }],
    finish: { x: 1000, y: 300, w: 60, h: 100 }
  },
  {
    id: 10, name: "Asansör", hint: "Dikey platformla yukarı çık!",
    spawn: { x: 100, y: 350 },
    terrain: [
      { type: 'ground', x: 200, y: 420, w: 200, h: 40 },
      { type: 'ground', x: 600, y: 150, w: 400, h: 40 }
    ],
    movingPlatforms: [
      { x: 400, y: 300, w: 120, h: 25, moveX: 0, moveY: 150, speed: 0.0015 }
    ],
    finish: { x: 750, y: 100, w: 60, h: 100 }
  },
  {
    id: 11, name: "Platform Dansı", hint: "Zamanlamayı yakala!",
    spawn: { x: 80, y: 300 },
    terrain: [
      { type: 'ground', x: 150, y: 400, w: 150, h: 40 },
      { type: 'ground', x: 1200, y: 300, w: 200, h: 40 }
    ],
    movingPlatforms: [
      { x: 350, y: 380, w: 100, h: 25, moveX: 0, moveY: 80, speed: 0.003 },
      { x: 550, y: 350, w: 100, h: 25, moveX: 100, moveY: 0, speed: 0.002 },
      { x: 800, y: 320, w: 100, h: 25, moveX: 0, moveY: 100, speed: 0.0025 },
      { x: 1000, y: 350, w: 100, h: 25, moveX: 80, moveY: 0, speed: 0.003 }
    ],
    hazards: [{ x: 700, y: 480, w: 800, h: 30 }],
    finish: { x: 1250, y: 250, w: 60, h: 100 }
  },
  {
    id: 12, name: "Çapraz Geçiş", hint: "Çapraz hareket eden platformlar!",
    spawn: { x: 100, y: 250 },
    terrain: [
      { type: 'ground', x: 180, y: 380, w: 180, h: 40 },
      { type: 'ground', x: 1100, y: 200, w: 250, h: 40 }
    ],
    movingPlatforms: [
      { x: 400, y: 350, w: 120, h: 25, moveX: 80, moveY: 80, speed: 0.002 },
      { x: 650, y: 280, w: 120, h: 25, moveX: -80, moveY: 80, speed: 0.002 },
      { x: 900, y: 250, w: 120, h: 25, moveX: 80, moveY: -50, speed: 0.0025 }
    ],
    hazards: [{ x: 650, y: 480, w: 600, h: 30 }],
    finish: { x: 1150, y: 150, w: 60, h: 100 }
  },

  // === BUZ & YAPISKAN ZEMİN (13-15) ===
  {
    id: 13, name: "Buz Pateni", hint: "Buzda kayarsın, dikkatli frenle!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 200, h: 40 },
      { type: 'ice', x: 550, y: 350, w: 400, h: 40 },
      { type: 'ground', x: 900, y: 350, w: 200, h: 40 }
    ],
    hazards: [{ x: 1050, y: 380, w: 40, h: 80 }],
    finish: { x: 950, y: 300, w: 60, h: 100 }
  },
  {
    id: 14, name: "Yapışkan Tuzak", hint: "Yapışkan zeminde hız kaybedersin!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 200, h: 40 },
      { type: 'sticky', x: 450, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 650, y: 330, w: 100, h: 40, angle: -0.3 },
      { type: 'ground', x: 900, y: 280, w: 300, h: 40 }
    ],
    finish: { x: 1000, y: 230, w: 60, h: 100 }
  },
  {
    id: 15, name: "Zemin Karması", hint: "Her zemin farklı davranır!",
    spawn: { x: 80, y: 200 },
    terrain: [
      { type: 'ground', x: 180, y: 350, w: 180, h: 40 },
      { type: 'ice', x: 400, y: 350, w: 150, h: 40 },
      { type: 'sticky', x: 600, y: 350, w: 100, h: 40 },
      { type: 'ground', x: 750, y: 330, w: 100, h: 40, angle: -0.2 },
      { type: 'ice', x: 950, y: 280, w: 200, h: 40 },
      { type: 'ground', x: 1200, y: 280, w: 200, h: 40 }
    ],
    hazards: [{ x: 1350, y: 310, w: 40, h: 80 }],
    finish: { x: 1250, y: 230, w: 60, h: 100 }
  },

  // === YERÇEKİMİ DEĞİŞİMİ (16-18) ===
  {
    id: 16, name: "Ters Dünya", hint: "Mavi zonlarda yerçekimi tersine döner!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 250, y: 350, w: 300, h: 40 },
      { type: 'ground', x: 750, y: 150, w: 300, h: 40 },
      { type: 'ground', x: 1200, y: 350, w: 300, h: 40 }
    ],
    gravityZones: [
      { x: 550, y: 250, w: 150, h: 300, gravity: -1 },
      { x: 950, y: 250, w: 150, h: 300, gravity: 1 }
    ],
    finish: { x: 1300, y: 300, w: 60, h: 100 }
  },
  {
    id: 17, name: "Yerçekimi Labirenti", hint: "Doğru zonlardan geç!",
    spawn: { x: 80, y: 350 },
    terrain: [
      { type: 'ground', x: 150, y: 420, w: 150, h: 40 },
      { type: 'ground', x: 500, y: 100, w: 200, h: 40 },
      { type: 'ground', x: 850, y: 420, w: 200, h: 40 },
      { type: 'ground', x: 1200, y: 200, w: 250, h: 40 }
    ],
    gravityZones: [
      { x: 320, y: 250, w: 120, h: 400, gravity: -1.5 },
      { x: 680, y: 250, w: 120, h: 400, gravity: 1.5 },
      { x: 1020, y: 300, w: 120, h: 300, gravity: -1.2 }
    ],
    hazards: [{ x: 600, y: 480, w: 400, h: 30 }],
    finish: { x: 1280, y: 150, w: 60, h: 100 }
  },
  {
    id: 18, name: "Hafif Yerçekimi", hint: "Ay'da gibi! Yavaş düşersin.",
    spawn: { x: 100, y: 300 },
    lowGravity: 0.3,
    terrain: [
      { type: 'ground', x: 200, y: 400, w: 200, h: 40 },
      { type: 'ground', x: 500, y: 350, w: 100, h: 40 },
      { type: 'ground', x: 750, y: 280, w: 100, h: 40 },
      { type: 'ground', x: 1000, y: 200, w: 100, h: 40 },
      { type: 'ground', x: 1300, y: 150, w: 250, h: 40 }
    ],
    hazards: [{ x: 750, y: 480, w: 800, h: 30 }],
    finish: { x: 1380, y: 100, w: 60, h: 100 }
  },

  // === TELEPORT (19-21) ===
  {
    id: 19, name: "Portal Atlayışı", hint: "Portala gir, diğerinden çık!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 250, h: 40 },
      { type: 'ground', x: 900, y: 200, w: 300, h: 40 }
    ],
    teleports: [
      { x1: 380, y1: 300, x2: 750, y2: 150, w: 60, h: 80 }
    ],
    hazards: [{ x: 550, y: 450, w: 300, h: 40 }],
    finish: { x: 1000, y: 150, w: 60, h: 100 }
  },
  {
    id: 20, name: "Portal Zinciri", hint: "Doğru portalı seç!",
    spawn: { x: 80, y: 300 },
    terrain: [
      { type: 'ground', x: 150, y: 400, w: 150, h: 40 },
      { type: 'ground', x: 500, y: 300, w: 150, h: 40 },
      { type: 'ground', x: 900, y: 400, w: 150, h: 40 },
      { type: 'ground', x: 1300, y: 250, w: 200, h: 40 }
    ],
    teleports: [
      { x1: 280, y1: 350, x2: 430, y2: 250, w: 50, h: 70 },
      { x1: 580, y1: 250, x2: 830, y2: 350, w: 50, h: 70 },
      { x1: 1000, y1: 350, x2: 1220, y2: 200, w: 50, h: 70 }
    ],
    hazards: [{ x: 700, y: 480, w: 600, h: 30 }],
    finish: { x: 1380, y: 200, w: 60, h: 100 }
  },
  {
    id: 21, name: "Yanlış Portal", hint: "Kırmızı portal tehlikeli!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 800, y: 350, w: 400, h: 40 }
    ],
    teleports: [
      { x1: 380, y1: 300, x2: 650, y2: 300, w: 50, h: 70 }
    ],
    fakePortals: [
      { x: 450, y: 300, w: 50, h: 70 }
    ],
    hazards: [{ x: 550, y: 450, w: 200, h: 40 }],
    finish: { x: 1050, y: 300, w: 60, h: 100 }
  },

  // === ZAMANLI KAPILAR & ENGELLER (22-25) ===
  {
    id: 22, name: "Zamanlı Kapı", hint: "Kapı açıkken geç!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 300, y: 350, w: 400, h: 40 },
      { type: 'ground', x: 800, y: 350, w: 400, h: 40 }
    ],
    timedGates: [
      { x: 550, y: 280, w: 30, h: 120, openTime: 2000, closeTime: 2000 }
    ],
    finish: { x: 950, y: 300, w: 60, h: 100 }
  },
  {
    id: 23, name: "Kapı Koşusu", hint: "Hızlı ol, kapılar beklemez!",
    spawn: { x: 80, y: 200 },
    terrain: [
      { type: 'ground', x: 600, y: 350, w: 1200, h: 40 }
    ],
    timedGates: [
      { x: 300, y: 280, w: 25, h: 100, openTime: 1500, closeTime: 1500, offset: 0 },
      { x: 550, y: 280, w: 25, h: 100, openTime: 1500, closeTime: 1500, offset: 500 },
      { x: 800, y: 280, w: 25, h: 100, openTime: 1500, closeTime: 1500, offset: 1000 },
      { x: 1050, y: 280, w: 25, h: 100, openTime: 1500, closeTime: 1500, offset: 1500 }
    ],
    finish: { x: 1150, y: 300, w: 60, h: 100 }
  },
  {
    id: 24, name: "Ezici Tuzak", hint: "Eziciler arasından geç!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 600, y: 400, w: 1000, h: 40 }
    ],
    crushers: [
      { x: 350, y: 200, w: 80, h: 150, speed: 0.004 },
      { x: 600, y: 200, w: 80, h: 150, speed: 0.005 },
      { x: 850, y: 200, w: 80, h: 150, speed: 0.004 }
    ],
    finish: { x: 1050, y: 350, w: 60, h: 100 }
  },
  {
    id: 25, name: "Ritim Ustası", hint: "Kapı ve ezici ritmine uy!",
    spawn: { x: 80, y: 200 },
    terrain: [
      { type: 'ground', x: 700, y: 380, w: 1400, h: 40 }
    ],
    timedGates: [
      { x: 400, y: 310, w: 25, h: 100, openTime: 2000, closeTime: 1500, offset: 0 },
      { x: 900, y: 310, w: 25, h: 100, openTime: 2000, closeTime: 1500, offset: 1000 }
    ],
    crushers: [
      { x: 650, y: 200, w: 70, h: 130, speed: 0.003 },
      { x: 1150, y: 200, w: 70, h: 130, speed: 0.004 }
    ],
    finish: { x: 1350, y: 330, w: 60, h: 100 }
  },

  // === BOOST & SLOW ZONLAR (26-28) ===
  {
    id: 26, name: "Turbo!", hint: "Yeşil zonlar hız verir!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 500, y: 350, w: 100, h: 40, angle: -0.3 },
      { type: 'ground', x: 1000, y: 250, w: 400, h: 40 }
    ],
    boostZones: [
      { x: 350, y: 320, w: 100, h: 60, power: 15 }
    ],
    hazards: [{ x: 700, y: 400, w: 200, h: 40 }],
    finish: { x: 1150, y: 200, w: 60, h: 100 }
  },
  {
    id: 27, name: "Hız Kontrolü", hint: "Kırmızı zonlar yavaşlatır!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 600, y: 350, w: 1000, h: 40 }
    ],
    boostZones: [
      { x: 300, y: 320, w: 80, h: 50, power: 12 }
    ],
    slowZones: [
      { x: 600, y: 320, w: 150, h: 60 },
      { x: 900, y: 320, w: 100, h: 60 }
    ],
    hazards: [{ x: 1150, y: 380, w: 40, h: 80 }],
    finish: { x: 1050, y: 300, w: 60, h: 100 }
  },
  {
    id: 28, name: "Boost Atlayışı", hint: "Boost ile uzak platformlara ulaş!",
    spawn: { x: 80, y: 300 },
    terrain: [
      { type: 'ground', x: 150, y: 400, w: 150, h: 40 },
      { type: 'ground', x: 350, y: 380, w: 100, h: 40, angle: -0.35 },
      { type: 'ground', x: 1000, y: 300, w: 400, h: 40 }
    ],
    boostZones: [
      { x: 250, y: 370, w: 80, h: 50, power: 20 }
    ],
    hazards: [{ x: 650, y: 480, w: 400, h: 40 }],
    finish: { x: 1150, y: 250, w: 60, h: 100 }
  },

  // === PUZZLE KOMBİNASYONLARI (29-35) ===
  {
    id: 29, name: "Buz + Trambolin", hint: "Buzda kay, trambolinle zıpla!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 200, h: 40 },
      { type: 'ice', x: 500, y: 350, w: 300, h: 40 },
      { type: 'ground', x: 950, y: 200, w: 300, h: 40 }
    ],
    bouncers: [{ x: 750, y: 380, w: 100, h: 20, power: 25 }],
    finish: { x: 1050, y: 150, w: 60, h: 100 }
  },
  {
    id: 30, name: "Portal + Platform", hint: "Portaldan çık, platforma bin!",
    spawn: { x: 100, y: 350 },
    terrain: [
      { type: 'ground', x: 180, y: 420, w: 180, h: 40 },
      { type: 'ground', x: 1100, y: 200, w: 300, h: 40 }
    ],
    teleports: [{ x1: 320, y1: 370, x2: 600, y2: 300, w: 50, h: 70 }],
    movingPlatforms: [
      { x: 750, y: 280, w: 120, h: 25, moveX: 150, moveY: 0, speed: 0.002 }
    ],
    hazards: [{ x: 700, y: 480, w: 500, h: 30 }],
    finish: { x: 1180, y: 150, w: 60, h: 100 }
  },
  {
    id: 31, name: "Yerçekimi + Kapı", hint: "Yerçekimi değişince kapı açılır!",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 250, y: 350, w: 300, h: 40 },
      { type: 'ground', x: 700, y: 150, w: 200, h: 40 },
      { type: 'ground', x: 1100, y: 350, w: 300, h: 40 }
    ],
    gravityZones: [{ x: 500, y: 250, w: 120, h: 300, gravity: -1.2 }],
    timedGates: [{ x: 850, y: 80, w: 25, h: 100, openTime: 3000, closeTime: 2000 }],
    finish: { x: 1200, y: 300, w: 60, h: 100 }
  },
  {
    id: 32, name: "Boost + Ezici", hint: "Boost al, eziciden kaç!",
    spawn: { x: 80, y: 200 },
    terrain: [{ type: 'ground', x: 700, y: 380, w: 1400, h: 40 }],
    boostZones: [{ x: 200, y: 350, w: 80, h: 50, power: 18 }],
    crushers: [
      { x: 450, y: 200, w: 100, h: 150, speed: 0.006 },
      { x: 700, y: 200, w: 100, h: 150, speed: 0.005 },
      { x: 950, y: 200, w: 100, h: 150, speed: 0.006 }
    ],
    finish: { x: 1200, y: 330, w: 60, h: 100 }
  },

  {
    id: 33, name: "Tam Karışık", hint: "Her şey var! Dikkatli ol.",
    spawn: { x: 80, y: 300 },
    terrain: [
      { type: 'ground', x: 150, y: 400, w: 150, h: 40 },
      { type: 'ice', x: 400, y: 380, w: 200, h: 40 },
      { type: 'ground', x: 800, y: 200, w: 200, h: 40 },
      { type: 'sticky', x: 1100, y: 350, w: 150, h: 40 },
      { type: 'ground', x: 1400, y: 300, w: 200, h: 40 }
    ],
    bouncers: [{ x: 600, y: 420, w: 100, h: 20, power: 22 }],
    gravityZones: [{ x: 950, y: 280, w: 100, h: 200, gravity: 0.5 }],
    timedGates: [{ x: 1250, y: 280, w: 25, h: 100, openTime: 2500, closeTime: 2000 }],
    hazards: [{ x: 700, y: 480, w: 300, h: 30 }],
    finish: { x: 1480, y: 250, w: 60, h: 100 }
  },
  {
    id: 34, name: "Labirent", hint: "Doğru yolu bul!",
    spawn: { x: 100, y: 100 },
    terrain: [
      { type: 'ground', x: 200, y: 180, w: 200, h: 30 },
      { type: 'ground', x: 450, y: 280, w: 200, h: 30 },
      { type: 'ground', x: 200, y: 380, w: 200, h: 30 },
      { type: 'ground', x: 700, y: 180, w: 200, h: 30 },
      { type: 'ground', x: 950, y: 280, w: 200, h: 30 },
      { type: 'ground', x: 1200, y: 180, w: 200, h: 30 }
    ],
    teleports: [
      { x1: 350, y1: 130, x2: 380, y2: 230, w: 40, h: 60 },
      { x1: 600, y1: 230, x2: 630, y2: 130, w: 40, h: 60 },
      { x1: 350, y1: 330, x2: 880, y2: 230, w: 40, h: 60 },
      { x1: 1100, y1: 230, x2: 1130, y2: 130, w: 40, h: 60 }
    ],
    hazards: [{ x: 600, y: 450, w: 800, h: 30 }],
    finish: { x: 1280, y: 130, w: 60, h: 80 }
  },
  {
    id: 35, name: "Son Sınav", hint: "Tüm becerilerin test ediliyor!",
    spawn: { x: 80, y: 350 },
    lowGravity: 0.6,
    terrain: [
      { type: 'ground', x: 150, y: 420, w: 150, h: 40 },
      { type: 'ice', x: 450, y: 380, w: 200, h: 40 },
      { type: 'ground', x: 900, y: 150, w: 200, h: 40 },
      { type: 'sticky', x: 1200, y: 300, w: 150, h: 40 },
      { type: 'ground', x: 1550, y: 200, w: 250, h: 40 }
    ],
    bouncers: [{ x: 650, y: 420, w: 100, h: 20, power: 28 }],
    movingPlatforms: [{ x: 1050, y: 220, w: 100, h: 25, moveX: 0, moveY: 80, speed: 0.002 }],
    teleports: [{ x1: 1320, y1: 250, x2: 1450, y2: 150, w: 45, h: 65 }],
    crushers: [{ x: 1600, y: 80, w: 60, h: 100, speed: 0.003 }],
    hazards: [{ x: 800, y: 480, w: 600, h: 30 }],
    finish: { x: 1650, y: 150, w: 60, h: 100 }
  }
];


export class LevelManager {
  constructor(physics) {
    this.physics = physics;
    this.currentLevel = 0;
    this.bodies = [];
    this.finishZone = null;
    this.hazards = [];
    this.bouncers = [];
    this.movingPlatforms = [];
    this.gravityZones = [];
    this.teleports = [];
    this.fakePortals = [];
    this.timedGates = [];
    this.crushers = [];
    this.boostZones = [];
    this.slowZones = [];
    this.time = 0;
  }

  loadLevel(levelIndex) {
    const level = LEVELS[levelIndex];
    if (!level) return null;
    this.currentLevel = levelIndex;
    this.reset();
    
    // Set gravity
    if (level.lowGravity) {
      this.physics.engine.world.gravity.y = level.lowGravity;
    } else {
      this.physics.engine.world.gravity.y = 1;
    }

    // Terrain
    level.terrain?.forEach(t => {
      const opts = this.getTerrainOptions(t.type);
      const body = this.physics.createGround(t.x, t.y, t.w, t.h, t.angle || 0, opts);
      body.terrainType = t.type;
      this.bodies.push(body);
    });

    // Finish
    this.finishZone = this.physics.createFinishZone(
      level.finish.x, level.finish.y, level.finish.w, level.finish.h
    );

    // Hazards
    level.hazards?.forEach(h => {
      this.hazards.push(this.physics.createHazard(h.x, h.y, h.w, h.h));
    });

    // Bouncers
    level.bouncers?.forEach(b => {
      const body = this.physics.createBouncer(b.x, b.y, b.w, b.h, b.power);
      this.bouncers.push(body);
    });

    // Moving platforms
    level.movingPlatforms?.forEach(p => {
      const body = this.physics.createMovingPlatform(p.x, p.y, p.w, p.h);
      const platform = {
        body,
        moveData: { startX: p.x, startY: p.y, moveX: p.moveX, moveY: p.moveY, speed: p.speed }
      };
      this.movingPlatforms.push(platform);
    });

    // Gravity zones
    level.gravityZones?.forEach(g => {
      this.gravityZones.push({ x: g.x, y: g.y, w: g.w, h: g.h, gravity: g.gravity });
    });

    // Teleports
    level.teleports?.forEach(t => {
      this.teleports.push({
        entry: this.physics.createTeleport(t.x1, t.y1, t.w, t.h, 'entry'),
        exit: { x: t.x2, y: t.y2 },
        exitBody: this.physics.createTeleport(t.x2, t.y2, t.w, t.h, 'exit'),
        w: t.w, h: t.h
      });
    });

    // Fake portals (hazard)
    level.fakePortals?.forEach(f => {
      const body = this.physics.createFakePortal(f.x, f.y, f.w, f.h);
      this.fakePortals.push(body);
    });

    // Timed gates
    level.timedGates?.forEach(g => {
      const body = this.physics.createTimedGate(g.x, g.y, g.w, g.h);
      body.gateData = { openTime: g.openTime, closeTime: g.closeTime, offset: g.offset || 0 };
      this.timedGates.push(body);
    });

    // Crushers
    level.crushers?.forEach(c => {
      const body = this.physics.createCrusher(c.x, c.y, c.w, c.h);
      const crusher = {
        body,
        crusherData: { startY: c.y, speed: c.speed }
      };
      this.crushers.push(crusher);
    });

    // Boost zones
    level.boostZones?.forEach(b => {
      this.boostZones.push({ x: b.x, y: b.y, w: b.w, h: b.h, power: b.power });
    });

    // Slow zones
    level.slowZones?.forEach(s => {
      this.slowZones.push({ x: s.x, y: s.y, w: s.w, h: s.h });
    });

    return level;
  }

  getTerrainOptions(type) {
    switch(type) {
      case 'ice': return { friction: 0.01, label: 'ice' };
      case 'sticky': return { friction: 1.5, label: 'sticky' };
      default: return { friction: 0.8 };
    }
  }

  reset() {
    this.bodies = [];
    this.hazards = [];
    this.bouncers = [];
    this.movingPlatforms = [];
    this.gravityZones = [];
    this.teleports = [];
    this.fakePortals = [];
    this.timedGates = [];
    this.crushers = [];
    this.boostZones = [];
    this.slowZones = [];
    this.time = 0;
  }

  update(delta, car) {
    this.time += delta;

    // Moving platforms
    this.movingPlatforms.forEach(p => {
      const d = p.moveData;
      const t = Math.sin(this.time * d.speed);
      const newX = d.startX + d.moveX * t;
      const newY = d.startY + d.moveY * t;
      Matter.Body.setPosition(p.body, { x: newX, y: newY });
    });

    // Timed gates
    this.timedGates.forEach(g => {
      const d = g.gateData;
      const cycle = d.openTime + d.closeTime;
      const phase = (this.time + d.offset) % cycle;
      const isOpen = phase < d.openTime;
      g.isSensor = isOpen;
      g.isOpen = isOpen;
    });

    // Crushers
    this.crushers.forEach(c => {
      const d = c.crusherData;
      const t = Math.abs(Math.sin(this.time * d.speed));
      const newY = d.startY + t * 180;
      Matter.Body.setPosition(c.body, { x: c.body.position.x, y: newY });
    });

    // Gravity zones
    if (car) {
      const carPos = car.position;
      let inGravityZone = false;
      this.gravityZones.forEach(g => {
        if (this.isInZone(carPos, g)) {
          this.physics.engine.world.gravity.y = g.gravity;
          inGravityZone = true;
        }
      });
      if (!inGravityZone && this.gravityZones.length > 0) {
        const level = LEVELS[this.currentLevel];
        this.physics.engine.world.gravity.y = level.lowGravity || 1;
      }

      // Boost zones
      this.boostZones.forEach(b => {
        if (this.isInZone(carPos, b)) {
          car.boost(b.power);
        }
      });

      // Slow zones
      this.slowZones.forEach(s => {
        if (this.isInZone(carPos, s)) {
          car.slow();
        }
      });
    }
  }

  isInZone(pos, zone) {
    return pos.x > zone.x - zone.w/2 && pos.x < zone.x + zone.w/2 &&
           pos.y > zone.y - zone.h/2 && pos.y < zone.y + zone.h/2;
  }

  checkTeleport(car) {
    const carPos = car.position;
    for (const t of this.teleports) {
      const entry = t.entry;
      const bounds = entry.bounds;
      if (carPos.x > bounds.min.x && carPos.x < bounds.max.x &&
          carPos.y > bounds.min.y && carPos.y < bounds.max.y) {
        return t.exit;
      }
    }
    return null;
  }

  get spawn() {
    return LEVELS[this.currentLevel]?.spawn || { x: 100, y: 200 };
  }

  get levelCount() {
    return LEVELS.length;
  }

  get currentLevelData() {
    return LEVELS[this.currentLevel];
  }
}
