export const LEVELS = [
  // Level 1: Düz yol - sadece gaz öğren
  {
    id: 1,
    name: "İlk Adım",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 500, y: 400, w: 1200, h: 40 },
    ],
    finish: { x: 900, y: 350, w: 60, h: 100 }
  },
  // Level 2: Hafif rampa
  {
    id: 2,
    name: "Rampa Zamanı",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 300, y: 400, w: 600, h: 40 },
      { type: 'ground', x: 750, y: 350, w: 300, h: 40, angle: -0.2 },
      { type: 'ground', x: 1050, y: 280, w: 400, h: 40 },
    ],
    finish: { x: 1200, y: 230, w: 60, h: 100 }
  },
  // Level 3: Boşluk atlama
  {
    id: 3,
    name: "Uçuş Dersi",
    spawn: { x: 100, y: 200 },
    terrain: [
      { type: 'ground', x: 300, y: 400, w: 500, h: 40 },
      { type: 'ground', x: 550, y: 380, w: 100, h: 40, angle: -0.25 },
      // Boşluk burada
      { type: 'ground', x: 900, y: 400, w: 400, h: 40 },
    ],
    hazards: [
      { x: 725, y: 480, w: 150, h: 40 }
    ],
    finish: { x: 1050, y: 350, w: 60, h: 100 }
  },
  // Level 4: Dalgalı zemin
  {
    id: 4,
    name: "Dalgalar",
    spawn: { x: 100, y: 150 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 300, h: 40 },
      { type: 'ground', x: 450, y: 380, w: 200, h: 40, angle: 0.15 },
      { type: 'ground', x: 650, y: 350, w: 200, h: 40, angle: -0.15 },
      { type: 'ground', x: 850, y: 380, w: 200, h: 40, angle: 0.15 },
      { type: 'ground', x: 1050, y: 350, w: 200, h: 40, angle: -0.15 },
      { type: 'ground', x: 1250, y: 320, w: 300, h: 40 },
    ],
    finish: { x: 1350, y: 270, w: 60, h: 100 }
  },
  // Level 5: Çoklu atlama
  {
    id: 5,
    name: "Atlama Ustası",
    spawn: { x: 80, y: 150 },
    terrain: [
      { type: 'ground', x: 200, y: 350, w: 250, h: 40 },
      { type: 'ground', x: 320, y: 330, w: 80, h: 40, angle: -0.3 },
      { type: 'ground', x: 550, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 650, y: 330, w: 80, h: 40, angle: -0.3 },
      { type: 'ground', x: 900, y: 350, w: 200, h: 40 },
      { type: 'ground', x: 1150, y: 320, w: 300, h: 40 },
    ],
    hazards: [
      { x: 430, y: 450, w: 100, h: 30 },
      { x: 770, y: 450, w: 100, h: 30 }
    ],
    finish: { x: 1250, y: 270, w: 60, h: 100 }
  }
];

export class LevelManager {
  constructor(physics) {
    this.physics = physics;
    this.currentLevel = 0;
    this.bodies = [];
    this.finishZone = null;
    this.hazards = [];
  }

  loadLevel(levelIndex) {
    const level = LEVELS[levelIndex];
    if (!level) return null;

    this.currentLevel = levelIndex;
    this.bodies = [];
    this.hazards = [];

    // Zemin parçaları
    level.terrain.forEach(t => {
      const body = this.physics.createGround(t.x, t.y, t.w, t.h, t.angle || 0);
      this.bodies.push(body);
    });

    // Finish zone
    this.finishZone = this.physics.createFinishZone(
      level.finish.x, level.finish.y, level.finish.w, level.finish.h
    );

    // Hazards
    if (level.hazards) {
      level.hazards.forEach(h => {
        const hazard = this.physics.createHazard(h.x, h.y, h.w, h.h);
        this.hazards.push(hazard);
      });
    }

    return level;
  }

  get spawn() {
    return LEVELS[this.currentLevel]?.spawn || { x: 100, y: 200 };
  }

  get levelCount() {
    return LEVELS.length;
  }
}
