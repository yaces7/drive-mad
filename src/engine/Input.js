export class Input {
  constructor() {
    this.keys = {};
    this.setupKeyboard();
    this.setupTouch();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  setupTouch() {
    const bindTouch = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[key] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[key] = false; });
    };
    bindTouch('touch-gas', 'ArrowUp');
    bindTouch('touch-brake', 'ArrowDown');
    bindTouch('touch-left', 'ArrowLeft');
    bindTouch('touch-right', 'ArrowRight');
  }

  get gas() { return this.keys['ArrowUp'] || this.keys['KeyW']; }
  get brake() { return this.keys['ArrowDown'] || this.keys['KeyS']; }
  get left() { return this.keys['ArrowLeft'] || this.keys['KeyA']; }
  get right() { return this.keys['ArrowRight'] || this.keys['KeyD']; }
  get restart() { return this.keys['KeyR']; }
}
