import { Physics } from './engine/Physics.js';
import { Renderer } from './engine/Renderer.js';
import { Input } from './engine/Input.js';
import { Car } from './game/Car.js';
import { LevelManager, LEVELS } from './game/LevelManager.js';
import { GameState, STATE } from './game/GameState.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.physics = new Physics();
    this.renderer = new Renderer(this.canvas);
    this.input = new Input(this.canvas);
    this.levelManager = new LevelManager(this.physics);
    this.gameState = new GameState();
    this.car = null;
    this.lastTime = 0;
    this.flipTimer = 0;
    this.teleportCooldown = 0;
    this.showHint = true;

    this.setupUI();
    this.setupCollisions();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  setupUI() {
    document.getElementById('start-btn').onclick = () => this.startLevel(0);
    document.getElementById('retry-btn').onclick = () => this.restartLevel();
    document.getElementById('next-btn').onclick = () => this.nextLevel();
    document.getElementById('editor-btn').onclick = () => this.openEditor();
    this.updateLevelSelect();
  }

  updateLevelSelect() {
    const container = document.getElementById('level-select');
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;max-width:400px;margin-top:10px;';
    
    LEVELS.forEach((level, i) => {
      const btn = document.createElement('button');
      btn.className = 'menu-btn level-btn';
      btn.textContent = `${i + 1}`;
      btn.style.cssText = 'padding:8px 14px;margin:3px;font-size:14px;min-width:40px;';
      if (i >= this.gameState.unlockedLevels) {
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
      } else {
        btn.onclick = () => this.startLevel(i);
      }
      grid.appendChild(btn);
    });
    container.appendChild(grid);
  }

  setupCollisions() {
    this.physics.onCollision((event) => {
      event.pairs.forEach(pair => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        
        if (labels.includes('finish') && labels.includes('car-body')) {
          this.win();
        }
        if ((labels.includes('hazard') || labels.includes('fake-portal')) && 
            (labels.includes('car-body') || labels.includes('wheel'))) {
          this.lose();
        }
        if (labels.includes('crusher') && (labels.includes('car-body') || labels.includes('wheel'))) {
          this.lose();
        }
        if (labels.includes('timed-gate') && (labels.includes('car-body') || labels.includes('wheel'))) {
          const gate = pair.bodyA.label === 'timed-gate' ? pair.bodyA : pair.bodyB;
          if (!gate.isOpen) this.lose();
        }
      });
    });

    this.physics.onCollisionActive((event) => {
      event.pairs.forEach(pair => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes('bouncer') && (labels.includes('car-body') || labels.includes('wheel'))) {
          const bouncer = pair.bodyA.label === 'bouncer' ? pair.bodyA : pair.bodyB;
          if (this.car) this.car.bounce(bouncer.bouncepower || 20);
        }
      });
    });
  }

  startLevel(levelIndex) {
    this.physics.clear();
    this.setupCollisions();
    
    this.gameState.currentLevel = levelIndex;
    this.gameState.resetTime();
    
    const level = this.levelManager.loadLevel(levelIndex);
    if (!level) return;

    const spawn = this.levelManager.spawn;
    this.car = new Car(this.physics, spawn.x, spawn.y);
    
    this.renderer.camera = { x: 0, y: 0 };
    this.flipTimer = 0;
    this.teleportCooldown = 0;
    this.showHint = true;
    setTimeout(() => this.showHint = false, 4000);

    document.getElementById('menu-overlay').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('level-display').textContent = `Seviye: ${levelIndex + 1} - ${level.name}`;
    
    this.gameState.setState(STATE.PLAYING);
  }

  restartLevel() {
    this.startLevel(this.gameState.currentLevel);
  }

  nextLevel() {
    const next = this.gameState.currentLevel + 1;
    if (next < LEVELS.length) {
      this.startLevel(next);
    } else {
      this.showMenu();
    }
  }

  win() {
    if (this.gameState.state !== STATE.PLAYING) return;
    this.gameState.setState(STATE.WIN);
    this.gameState.saveBestTime();
    this.gameState.unlockNextLevel();
    this.updateLevelSelect();

    const overlay = document.getElementById('game-over');
    overlay.classList.remove('hidden');
    overlay.classList.add('win');
    document.getElementById('game-over-text').textContent = `🏆 BAŞARDIN! (${this.gameState.time.toFixed(1)}s)`;
    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = this.gameState.currentLevel < LEVELS.length - 1 ? 'inline-block' : 'none';
  }

  lose() {
    if (this.gameState.state !== STATE.PLAYING) return;
    this.gameState.setState(STATE.LOSE);
    
    const overlay = document.getElementById('game-over');
    overlay.classList.remove('hidden', 'win');
    document.getElementById('game-over-text').textContent = '💥 ÇARPTIN!';
    document.getElementById('next-btn').style.display = 'none';
  }

  showMenu() {
    this.gameState.setState(STATE.MENU);
    document.getElementById('menu-overlay').classList.remove('hidden');
    document.getElementById('game-over').classList.add('hidden');
  }

  openEditor() {
    window.location.href = 'editor.html';
  }

  setupEditorButton() {
    const btn = document.getElementById('editor-btn');
    if (btn) btn.onclick = () => this.openEditor();
  }

  update(delta) {
    if (!this.gameState.isPlaying || !this.car) return;

    if (this.input.restart) {
      this.input.keys['KeyR'] = false;
      this.restartLevel();
      return;
    }

    this.car.update(this.input);
    this.physics.update(delta);
    this.levelManager.update(delta, this.car);
    this.gameState.updateTime(delta);

    // Teleport check
    if (this.teleportCooldown <= 0) {
      const teleportExit = this.levelManager.checkTeleport(this.car);
      if (teleportExit) {
        this.car.teleportTo(teleportExit.x, teleportExit.y);
        this.teleportCooldown = 500;
      }
    } else {
      this.teleportCooldown -= delta;
    }

    // Flip detection
    if (this.car.isFlipped) {
      this.flipTimer += delta;
      if (this.flipTimer > 1500) this.lose();
    } else {
      this.flipTimer = 0;
    }

    // Fall detection
    if (this.car.position.y > 600) this.lose();

    document.getElementById('time-display').textContent = `Süre: ${this.gameState.time.toFixed(1)}s`;
  }

  render() {
    this.renderer.clear();

    if (!this.gameState.isMenu && this.car) {
      this.renderer.followTarget(this.car.chassis || this.car.body);
      const lm = this.levelManager;

      // Gravity zones
      lm.gravityZones.forEach(z => this.renderer.drawGravityZone(z));
      
      // Boost/Slow zones
      lm.boostZones.forEach(z => this.renderer.drawBoostZone(z));
      lm.slowZones.forEach(z => this.renderer.drawSlowZone(z));

      // Terrain
      lm.bodies.forEach(body => this.renderer.drawTerrain(body));

      // Moving platforms
      lm.movingPlatforms.forEach(p => this.renderer.drawMovingPlatform(p));

      // Hazards
      lm.hazards.forEach(h => this.renderer.drawHazard(h));

      // Bouncers
      lm.bouncers.forEach(b => this.renderer.drawBouncer(b));

      // Teleports
      lm.teleports.forEach(t => {
        this.renderer.drawTeleport(t.entry, null, true);
        this.renderer.drawTeleport(t.exitBody, null, false);
      });

      // Fake portals
      lm.fakePortals.forEach(f => this.renderer.drawFakePortal(f));

      // Timed gates
      lm.timedGates.forEach(g => this.renderer.drawTimedGate(g));

      // Crushers
      lm.crushers.forEach(c => this.renderer.drawCrusher(c));

      // Finish
      if (lm.finishZone) this.renderer.drawFinish(lm.finishZone);

      // Car - Monster Truck style
      this.renderer.drawMonsterWheel(this.car.wheelBack);
      this.renderer.drawMonsterWheel(this.car.wheelFront);
      this.renderer.drawMonsterTruck(this.car);

      // Hint
      if (this.showHint && lm.currentLevelData?.hint) {
        this.renderer.drawHint(lm.currentLevelData.hint);
      }
    }
  }

  loop(timestamp) {
    const delta = Math.min(timestamp - this.lastTime, 32);
    this.lastTime = timestamp;
    this.update(delta);
    this.render();
    requestAnimationFrame(this.loop);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  
  // Check for custom level
  const params = new URLSearchParams(window.location.search);
  if (params.get('custom') === '1') {
    const customJSON = localStorage.getItem('customLevel');
    if (customJSON) {
      try {
        const customLevel = JSON.parse(customJSON);
        LEVELS.push(customLevel);
        game.startLevel(LEVELS.length - 1);
      } catch(e) {
        console.error('Custom level parse error:', e);
      }
    }
  }
});
