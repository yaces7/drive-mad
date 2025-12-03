export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0 };
  }

  clear() {
    const ctx = this.ctx;
    // Gökyüzü gradient - fotoğraftaki gibi
    const skyGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    skyGradient.addColorStop(0, '#4FC3F7');
    skyGradient.addColorStop(0.5, '#81D4FA');
    skyGradient.addColorStop(1, '#B3E5FC');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Arka plan dağlar
    this.drawMountains();
  }

  drawMountains() {
    const ctx = this.ctx;
    const offsetX = -this.camera.x * 0.3; // Parallax
    
    // Arka dağ
    ctx.fillStyle = '#29B6F6';
    ctx.beginPath();
    ctx.moveTo(offsetX % 400 - 200, this.canvas.height);
    ctx.lineTo(offsetX % 400, 150);
    ctx.lineTo(offsetX % 400 + 200, this.canvas.height);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(offsetX % 400 + 200, this.canvas.height);
    ctx.lineTo(offsetX % 400 + 350, 100);
    ctx.lineTo(offsetX % 400 + 500, this.canvas.height);
    ctx.fill();

    // Ön dağ
    ctx.fillStyle = '#0288D1';
    ctx.beginPath();
    ctx.moveTo(offsetX % 500 - 100, this.canvas.height);
    ctx.lineTo(offsetX % 500 + 100, 200);
    ctx.lineTo(offsetX % 500 + 300, this.canvas.height);
    ctx.fill();
  }

  followTarget(target, smoothing = 0.08) {
    const targetX = target.position.x - this.canvas.width / 3;
    const targetY = Math.min(target.position.y - this.canvas.height / 2 + 50, 50);
    this.camera.x += (targetX - this.camera.x) * smoothing;
    this.camera.y += (targetY - this.camera.y) * smoothing;
  }

  // Voxel/pixel tarzı zemin çizimi
  drawGround(body, color = '#4CAF50') {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    
    const bounds = body.bounds;
    const x = bounds.min.x;
    const y = bounds.min.y;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;
    
    // Üst yüzey (çimen)
    ctx.fillStyle = '#66BB6A';
    ctx.fillRect(x, y, w, 8);
    
    // Ana zemin
    ctx.fillStyle = color;
    ctx.fillRect(x, y + 8, w, h - 8);
    
    // Alt kısım (toprak/kaya)
    ctx.fillStyle = '#D7CCC8';
    ctx.fillRect(x, y + h - 15, w, 15);
    
    // Kenar çizgisi (pixel art tarzı)
    ctx.strokeStyle = '#33691E';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    
    ctx.restore();
  }

  // Monster truck çizimi - voxel tarzı
  drawMonsterTruck(car) {
    const ctx = this.ctx;
    const chassis = car.chassis || car.body;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    ctx.translate(chassis.position.x, chassis.position.y);
    ctx.rotate(chassis.angle);

    // Gövde boyutları
    const bodyW = 100;
    const bodyH = 30;
    const cabinW = 40;
    const cabinH = 28;

    // Ana gövde (sarı - fotoğraftaki gibi)
    ctx.fillStyle = '#FDD835';
    this.drawPixelRect(ctx, -bodyW/2, -bodyH/2, bodyW, bodyH);
    
    // Gövde üst highlight
    ctx.fillStyle = '#FFEB3B';
    this.drawPixelRect(ctx, -bodyW/2, -bodyH/2, bodyW, 8);
    
    // Gövde alt gölge
    ctx.fillStyle = '#F9A825';
    this.drawPixelRect(ctx, -bodyW/2, bodyH/2 - 8, bodyW, 8);

    // Kabin (gri motor bölümü - önde)
    ctx.fillStyle = '#90A4AE';
    this.drawPixelRect(ctx, bodyW/2 - 25, -bodyH/2 - cabinH + 5, 30, cabinH);
    
    // Kabin highlight
    ctx.fillStyle = '#B0BEC5';
    this.drawPixelRect(ctx, bodyW/2 - 25, -bodyH/2 - cabinH + 5, 30, 6);

    // Pencereler (koyu)
    ctx.fillStyle = '#37474F';
    this.drawPixelRect(ctx, -bodyW/2 + 10, -bodyH/2 - 18, 25, 15);
    this.drawPixelRect(ctx, -bodyW/2 + 40, -bodyH/2 - 18, 20, 15);

    // Kenar çizgileri
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(-bodyW/2, -bodyH/2, bodyW, bodyH);

    ctx.restore();
  }

  // Büyük monster truck tekerleği
  drawMonsterWheel(wheel) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    ctx.translate(wheel.position.x, wheel.position.y);
    ctx.rotate(wheel.angle);

    const r = wheel.circleRadius;

    // Dış lastik
    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Lastik deseni (tırtıklar)
    ctx.fillStyle = '#37474F';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.fillRect(-4, r - 10, 8, 12);
      ctx.restore();
    }

    // İç jant
    ctx.fillStyle = '#455A64';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Jant merkezi
    ctx.fillStyle = '#546E7A';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Jant kolları
    ctx.strokeStyle = '#37474F';
    ctx.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * r * 0.45, Math.sin(angle) * r * 0.45);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawPixelRect(ctx, x, y, w, h) {
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  drawFinish(body) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    
    const bounds = body.bounds;
    const x = bounds.min.x;
    const y = bounds.min.y;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;
    
    // Damalı bayrak deseni
    const size = 15;
    for (let i = 0; i < w / size; i++) {
      for (let j = 0; j < h / size; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? '#fff' : '#222';
        ctx.fillRect(x + i * size, y + j * size, size, size);
      }
    }
    
    // Bayrak direği
    ctx.fillStyle = '#795548';
    ctx.fillRect(x - 5, y - 50, 8, h + 50);
    
    // Bayrak
    ctx.fillStyle = '#F44336';
    ctx.fillRect(x, y - 45, 40, 25);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('🏁', x + 10, y - 27);
    
    ctx.restore();
  }

  drawHazard(body) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    
    const bounds = body.bounds;
    const x = bounds.min.x;
    const y = bounds.min.y;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;
    
    // Su/tehlike alanı
    ctx.fillStyle = '#1976D2';
    ctx.fillRect(x, y, w, h);
    
    // Dalga efekti
    ctx.fillStyle = '#2196F3';
    for (let i = 0; i < w; i += 20) {
      ctx.beginPath();
      ctx.arc(x + i + 10, y, 8, 0, Math.PI);
      ctx.fill();
    }
    
    ctx.restore();
  }

  // Terrain çizimi (zemin parçaları)
  drawTerrain(body) {
    this.drawGround(body, '#4CAF50');
  }

  // Moving platform
  drawMovingPlatform(platform) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const body = platform.body || platform;
    const b = body.bounds;
    ctx.fillStyle = '#FF9800';
    ctx.fillRect(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y);
    ctx.strokeStyle = '#E65100';
    ctx.lineWidth = 3;
    ctx.strokeRect(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y);
    ctx.restore();
  }

  // Bouncer (zıplatıcı)
  drawBouncer(body) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const b = body.bounds;
    ctx.fillStyle = '#E91E63';
    ctx.fillRect(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText('⬆', b.min.x + 10, b.min.y + 20);
    ctx.restore();
  }

  // Teleport
  drawTeleport(body, color, isEntry) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const b = body.bounds;
    const gradient = ctx.createLinearGradient(b.min.x, b.min.y, b.max.x, b.max.y);
    gradient.addColorStop(0, isEntry ? '#9C27B0' : '#00BCD4');
    gradient.addColorStop(1, isEntry ? '#E1BEE7' : '#B2EBF2');
    ctx.fillStyle = gradient;
    ctx.fillRect(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.fillText(isEntry ? '🌀' : '🎯', b.min.x + 10, b.min.y + 35);
    ctx.restore();
  }

  // Fake portal (tuzak)
  drawFakePortal(body) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const b = body.bounds;
    ctx.fillStyle = '#9C27B0';
    ctx.fillRect(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.fillText('🌀', b.min.x + 10, b.min.y + 35);
    ctx.restore();
  }

  // Timed gate
  drawTimedGate(gate) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const b = gate.bounds;
    ctx.fillStyle = gate.isOpen ? 'rgba(76,175,80,0.5)' : '#F44336';
    ctx.fillRect(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y);
    ctx.restore();
  }

  // Crusher
  drawCrusher(crusher) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const body = crusher.body || crusher;
    const b = body.bounds;
    ctx.fillStyle = '#607D8B';
    ctx.fillRect(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y);
    // Dikenler
    ctx.fillStyle = '#455A64';
    for (let i = b.min.x; i < b.max.x; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, b.max.y);
      ctx.lineTo(i + 7, b.max.y + 10);
      ctx.lineTo(i + 14, b.max.y);
      ctx.fill();
    }
    ctx.restore();
  }

  // Gravity zone
  drawGravityZone(zone) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const x = zone.x - zone.w/2;
    const y = zone.y - zone.h/2;
    ctx.fillStyle = zone.gravity < 0 ? 'rgba(156, 39, 176, 0.3)' : 'rgba(255, 87, 34, 0.3)';
    ctx.fillRect(x, y, zone.w, zone.h);
    ctx.fillStyle = zone.gravity < 0 ? '#9C27B0' : '#FF5722';
    ctx.font = '14px sans-serif';
    ctx.fillText(zone.gravity < 0 ? '⬆ Ters G' : '⬇ Yüksek G', x + 5, y + 20);
    ctx.restore();
  }

  // Boost zone
  drawBoostZone(zone) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const x = zone.x - zone.w/2;
    const y = zone.y - zone.h/2;
    ctx.fillStyle = 'rgba(76, 175, 80, 0.4)';
    ctx.fillRect(x, y, zone.w, zone.h);
    ctx.fillStyle = '#4CAF50';
    ctx.font = '16px sans-serif';
    ctx.fillText('⚡ BOOST', x + 5, y + 25);
    ctx.restore();
  }

  // Slow zone
  drawSlowZone(zone) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const x = zone.x - zone.w/2;
    const y = zone.y - zone.h/2;
    ctx.fillStyle = 'rgba(255, 152, 0, 0.4)';
    ctx.fillRect(x, y, zone.w, zone.h);
    ctx.fillStyle = '#FF9800';
    ctx.font = '16px sans-serif';
    ctx.fillText('🐢 SLOW', x + 5, y + 25);
    ctx.restore();
  }

  // Hint text
  drawHint(text) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(this.canvas.width/2 - 150, 60, 300, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, this.canvas.width/2, 85);
    ctx.textAlign = 'left';
  }

  // Eski metodlar uyumluluk için
  drawBody(body, color) {
    this.drawGround(body, color);
  }

  drawCircle(body, color, showSpoke) {
    this.drawMonsterWheel(body);
  }
}
