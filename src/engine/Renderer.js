export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0 };
  }

  clear() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  followTarget(target, smoothing = 0.1) {
    const targetX = target.position.x - this.canvas.width / 3;
    const targetY = Math.min(target.position.y - this.canvas.height / 2, 0);
    this.camera.x += (targetX - this.camera.x) * smoothing;
    this.camera.y += (targetY - this.camera.y) * smoothing;
  }

  drawBody(body, color = '#5D4E37') {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    ctx.beginPath();
    const vertices = body.vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  drawCircle(body, color = '#333', showSpoke = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    ctx.beginPath();
    ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.stroke();
    if (showSpoke) {
      ctx.beginPath();
      ctx.moveTo(body.position.x, body.position.y);
      const spokeX = body.position.x + Math.cos(body.angle) * body.circleRadius * 0.7;
      const spokeY = body.position.y + Math.sin(body.angle) * body.circleRadius * 0.7;
      ctx.lineTo(spokeX, spokeY);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    ctx.restore();
  }

  drawFinish(body) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const bounds = body.bounds;
    const x = bounds.min.x, y = bounds.min.y;
    const w = bounds.max.x - bounds.min.x, h = bounds.max.y - bounds.min.y;
    ctx.fillStyle = 'rgba(0, 255, 100, 0.3)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏁 FİNİŞ', x + w/2, y + h/2);
    ctx.restore();
  }

  drawHazard(body) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const bounds = body.bounds;
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);
    ctx.restore();
  }
}
