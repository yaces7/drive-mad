export const STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  WIN: 'win',
  LOSE: 'lose'
};

export class GameState {
  constructor() {
    this.state = STATE.MENU;
    this.currentLevel = 0;
    this.unlockedLevels = parseInt(localStorage.getItem('unlockedLevels') || '1');
    this.time = 0;
    this.bestTimes = JSON.parse(localStorage.getItem('bestTimes') || '{}');
  }

  setState(newState) {
    this.state = newState;
  }

  resetTime() {
    this.time = 0;
  }

  updateTime(delta) {
    if (this.state === STATE.PLAYING) {
      this.time += delta / 1000;
    }
  }

  unlockNextLevel() {
    const next = this.currentLevel + 2;
    if (next > this.unlockedLevels) {
      this.unlockedLevels = next;
      localStorage.setItem('unlockedLevels', next.toString());
    }
  }

  saveBestTime() {
    const key = `level_${this.currentLevel}`;
    const current = this.bestTimes[key];
    if (!current || this.time < current) {
      this.bestTimes[key] = this.time;
      localStorage.setItem('bestTimes', JSON.stringify(this.bestTimes));
    }
  }

  get isPlaying() {
    return this.state === STATE.PLAYING;
  }

  get isMenu() {
    return this.state === STATE.MENU;
  }
}
