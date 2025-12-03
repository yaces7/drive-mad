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
    this.input = new Input();
    this.levelManager = new LevelManager(this.physics);
    this.gameState = new GameState();
    this.car = null;
    this.lastTime = 0;
    this.flipTimer = 0;

    this.setupUI();
    this.setupCollisions();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  setupUI() {
    // Start button
    document.getElementById('start-btn').onclick = () => this.startLevel(0);
    document.getElementById('retry-btn').onclick = () => this.restartLevel();
    document.getElementById('next-btn').onclick = () => this.nextLevel();

    // Level select
    this.updateLevelSelect();
  }

  updateLevelSelect() {
    const container = document.getElementById('level-select');
    container.innerHTML = '';
    
    LEVELS.forEach((level, i) => {
      const btn = document.createElement('button');
      btn.className = 'menu-btn level-btn';
      btn.textContent = `${i + 1}`;
      btn.style.padding = '10px 20px';
      btn.style.margin = '4px';
      btn.style.fontSize = '16px';
      
      if (i >= this.gameState.unlockedLevels) {
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
      } else {
        btn.onclick = () => this.startLevel(i);
      }
      container.appendChild(btn);
    });
  }

  setupCollisions() {
    this.physics.onCollision((event) => {
      event.pairs.forEach(pair => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        
        if (labels.includes('finish') && labels.includes('car-body')) {
          this.win();
        }
        if (labels.includes('hazard') && (labels.includes('car-body') || labels.includes('wheel'))) {
          this.lose();
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

    document.getElementById('menu-overlay').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('level-display').textContent = `Seviye: ${levelIndex + 1}`;
    
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

  update(delta) {
    if (!this.gameState.isPlaying || !this.car) return;

    // Input handling
    if (this.input.restart) {
      this.input.keys['KeyR'] = false;
      this.restartLevel();
      return;
    }

    this.car.update(this.input);
    this.physics.update(delta);
    this.gameState.updateTime(delta);

    // Flip detection
    if (this.car.isFlipped) {
      this.flipTimer += delta;
      if (this.flipTimer > 1500) {
        this.lose();
      }
    } else {
      this.flipTimer = 0;
    }

    // Fall detection
    if (this.car.position.y > 600) {
      this.lose();
    }

    // Update HUD
    document.getElementById('time-display').textContent = `Süre: ${this.gameState.time.toFixed(1)}s`;
  }

  render() {
    this.renderer.clear();

    if (!this.gameState.isMenu && this.car) {
      this.renderer.followTarget(this.car.body);

      // Draw terrain
      this.levelManager.bodies.forEach(body => {
        this.renderer.drawBody(body, '#6B5344');
      });

      // Draw hazards
      this.levelManager.hazards.forEach(hazard => {
        this.renderer.drawHazard(hazard);
      });

      // Draw finish
      if (this.levelManager.finishZone) {
        this.renderer.drawFinish(this.levelManager.finishZone);
      }

      // Draw car
      this.renderer.drawBody(this.car.body, '#e74c3c');
      this.renderer.drawCircle(this.car.wheelBack, '#2c3e50', true);
      this.renderer.drawCircle(this.car.wheelFront, '#2c3e50', true);
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

// Start game
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
