export class Input {
  constructor(canvas) {
    this.keys = {};
    this.canvas = canvas;
    this.touchActive = false;
    this.setupKeyboard();
    this.setupCanvasTouch();
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

  setupCanvasTouch() {
    const canvas = this.canvas;
    if (!canvas) return;

    // Touch start - ekranın hangi yarısına dokunulduğuna bak
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.touchActive = true;
      this.handleTouch(e.touches);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.handleTouch(e.touches);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (e.touches.length === 0) {
        this.touchActive = false;
        this.keys['TouchLeft'] = false;
        this.keys['TouchRight'] = false;
        this.keys['TouchGas'] = false;
      } else {
        this.handleTouch(e.touches);
      }
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
      this.touchActive = false;
      this.keys['TouchLeft'] = false;
      this.keys['TouchRight'] = false;
      this.keys['TouchGas'] = false;
    });

    // Mouse desteği (masaüstünde test için)
    canvas.addEventListener('mousedown', (e) => {
      this.handleMouse(e, true);
    });

    canvas.addEventListener('mouseup', (e) => {
      this.keys['TouchLeft'] = false;
      this.keys['TouchRight'] = false;
      this.keys['TouchGas'] = false;
    });

    canvas.addEventListener('mouseleave', (e) => {
      this.keys['TouchLeft'] = false;
      this.keys['TouchRight'] = false;
      this.keys['TouchGas'] = false;
    });
  }

  handleTouch(touches) {
    const rect = this.canvas.getBoundingClientRect();
    const midX = rect.width / 2;

    // Reset touch keys
    this.keys['TouchLeft'] = false;
    this.keys['TouchRight'] = false;
    this.keys['TouchGas'] = false;

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const x = touch.clientX - rect.left;

      // Sol yarı = sola eğil, sağ yarı = sağa eğil
      if (x < midX) {
        this.keys['TouchLeft'] = true;
      } else {
        this.keys['TouchRight'] = true;
      }

      // Her dokunuş gaz verir
      this.keys['TouchGas'] = true;
    }
  }

  handleMouse(e, isDown) {
    if (!isDown) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const midX = rect.width / 2;

    this.keys['TouchGas'] = true;
    if (x < midX) {
      this.keys['TouchLeft'] = true;
    } else {
      this.keys['TouchRight'] = true;
    }
  }

  get gas() { 
    return this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['TouchGas']; 
  }
  get brake() { 
    return this.keys['ArrowDown'] || this.keys['KeyS']; 
  }
  get left() { 
    return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.keys['TouchLeft']; 
  }
  get right() { 
    return this.keys['ArrowRight'] || this.keys['KeyD'] || this.keys['TouchRight']; 
  }
  get restart() { 
    return this.keys['KeyR']; 
  }
}
