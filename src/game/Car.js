import Matter from 'matter-js';

const { Bodies, Body, Composite, Constraint, World } = Matter;

export class Car {
  constructor(physics, x, y) {
    this.physics = physics;
    
    // Monster truck parametreleri
    const bodyWidth = 100;
    const bodyHeight = 35;
    const wheelRadius = 32; // Büyük tekerlekler
    const wheelBase = 70;   // Tekerlekler arası mesafe
    const suspensionHeight = 25; // Yüksek süspansiyon
    
    // Araç gövdesi - daha ağır ve stabil
    this.body = Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
      friction: 0.9,
      restitution: 0.1,
      density: 0.003,
      label: 'car-body',
      chamfer: { radius: 5 }
    });

    // Kabin (üst kısım)
    this.cabin = Bodies.rectangle(x - 15, y - 25, 40, 25, {
      friction: 0.9,
      restitution: 0.1,
      density: 0.001,
      label: 'car-cabin',
      chamfer: { radius: 3 }
    });

    // Gövde + kabin birleştir
    const carBody = Body.create({
      parts: [this.body, this.cabin],
      friction: 0.9,
      restitution: 0.1
    });
    this.body = carBody;

    // Büyük monster truck tekerlekleri
    const wheelY = y + suspensionHeight;
    
    this.wheelFront = Bodies.circle(x + wheelBase/2, wheelY, wheelRadius, {
      friction: 0.95,
      frictionStatic: 1,
      restitution: 0.05,
      density: 0.004,
      label: 'wheel',
      slop: 0.01
    });

    this.wheelBack = Bodies.circle(x - wheelBase/2, wheelY, wheelRadius, {
      friction: 0.95,
      frictionStatic: 1,
      restitution: 0.05,
      density: 0.004,
      label: 'wheel',
      slop: 0.01
    });

    // Güçlü süspansiyon - monster truck için
    this.suspensionFront = Constraint.create({
      bodyA: this.body,
      pointA: { x: wheelBase/2, y: suspensionHeight },
      bodyB: this.wheelFront,
      stiffness: 0.4,
      damping: 0.2,
      length: 0
    });

    this.suspensionBack = Constraint.create({
      bodyA: this.body,
      pointA: { x: -wheelBase/2, y: suspensionHeight },
      bodyB: this.wheelBack,
      stiffness: 0.4,
      damping: 0.2,
      length: 0
    });

    // Anti-roll bar (daha stabil)
    this.antiRoll = Constraint.create({
      bodyA: this.wheelFront,
      bodyB: this.wheelBack,
      stiffness: 0.1,
      damping: 0.3,
      length: wheelBase
    });

    World.add(physics.world, [
      this.body,
      this.wheelFront,
      this.wheelBack,
      this.suspensionFront,
      this.suspensionBack,
      this.antiRoll
    ]);

    // Kontrol parametreleri
    this.maxSpeed = 18;
    this.acceleration = 0.12;
    this.brakeForce = 0.85;
    this.airControlForce = 0.003;
    this.groundTorque = 0.0015;
  }

  get position() {
    return this.body.position;
  }

  get angle() {
    return this.body.angle;
  }

  get velocity() {
    return this.body.velocity;
  }

  get isFlipped() {
    const angle = this.body.angle % (Math.PI * 2);
    const normalized = angle < 0 ? angle + Math.PI * 2 : angle;
    return normalized > Math.PI * 0.55 && normalized < Math.PI * 1.45;
  }

  get isGrounded() {
    // Basit ground check - tekerlek hızına bak
    return Math.abs(this.wheelBack.angularVelocity) > 0.1 || 
           Math.abs(this.wheelFront.angularVelocity) > 0.1;
  }

  accelerate(direction = 1) {
    const currentSpeed = this.wheelBack.angularVelocity;
    const targetSpeed = direction * this.maxSpeed;
    
    if (Math.abs(currentSpeed) < Math.abs(targetSpeed)) {
      const force = direction * this.acceleration;
      Body.setAngularVelocity(this.wheelBack, currentSpeed + force);
      Body.setAngularVelocity(this.wheelFront, this.wheelFront.angularVelocity + force * 0.7);
    }
  }

  brake() {
    Body.setAngularVelocity(this.wheelBack, this.wheelBack.angularVelocity * this.brakeForce);
    Body.setAngularVelocity(this.wheelFront, this.wheelFront.angularVelocity * this.brakeForce);
  }

  tilt(direction) {
    // Havada denge kontrolü
    const torque = direction * this.airControlForce * 100;
    Body.setAngularVelocity(this.body, this.body.angularVelocity + torque);
  }

  update(input) {
    if (input.gas) {
      this.accelerate(1);
    }
    if (input.brake) {
      this.accelerate(-0.5); // Geri git
    }
    if (input.left) {
      this.tilt(-1);
    }
    if (input.right) {
      this.tilt(1);
    }
    
    // Hiçbir tuşa basılmıyorsa hafif fren
    if (!input.gas && !input.brake) {
      Body.setAngularVelocity(this.wheelBack, this.wheelBack.angularVelocity * 0.995);
      Body.setAngularVelocity(this.wheelFront, this.wheelFront.angularVelocity * 0.995);
    }
  }

  bounce(power) {
    Body.setVelocity(this.body, { 
      x: this.body.velocity.x, 
      y: -power 
    });
  }

  boost(power) {
    const angle = this.body.angle;
    Body.applyForce(this.body, this.body.position, {
      x: Math.cos(angle) * power * 0.001,
      y: 0
    });
    // Tekerleklere de hız ver
    const currentSpeed = this.wheelBack.angularVelocity;
    if (currentSpeed < this.maxSpeed * 1.5) {
      Body.setAngularVelocity(this.wheelBack, currentSpeed + 0.3);
    }
  }

  slow() {
    Body.setAngularVelocity(this.wheelBack, this.wheelBack.angularVelocity * 0.95);
    Body.setAngularVelocity(this.wheelFront, this.wheelFront.angularVelocity * 0.95);
  }

  teleportTo(x, y) {
    const offsetX = x - this.body.position.x;
    const offsetY = y - this.body.position.y;
    
    Body.setPosition(this.body, { x, y });
    Body.setPosition(this.wheelFront, { 
      x: this.wheelFront.position.x + offsetX, 
      y: this.wheelFront.position.y + offsetY 
    });
    Body.setPosition(this.wheelBack, { 
      x: this.wheelBack.position.x + offsetX, 
      y: this.wheelBack.position.y + offsetY 
    });
  }

  destroy() {
    World.remove(this.physics.world, [
      this.body,
      this.wheelFront,
      this.wheelBack,
      this.suspensionFront,
      this.suspensionBack,
      this.antiRoll
    ]);
  }
}
