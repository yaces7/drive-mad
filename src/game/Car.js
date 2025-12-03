import Matter from 'matter-js';

const { Bodies, Body, Constraint, World, Composite } = Matter;

export class Car {
  constructor(physics, x, y) {
    this.physics = physics;
    
    // === ARAÇ PARAMETRELERİ ===
    const chassisWidth = 90;
    const chassisHeight = 30;
    const wheelRadius = 28;
    const wheelGap = 65; // Tekerlekler arası mesafe
    
    // === ŞASE (Ana gövde) ===
    this.chassis = Bodies.rectangle(x, y, chassisWidth, chassisHeight, {
      collisionFilter: { group: -1 },
      friction: 0.8,
      restitution: 0.1,
      density: 0.0015,
      label: 'car-body'
    });

    // === TEKERLEKLER ===
    this.wheelBack = Bodies.circle(x - wheelGap / 2, y + 25, wheelRadius, {
      collisionFilter: { group: -1 },
      friction: 0.9,
      frictionStatic: 1.0,
      restitution: 0.1,
      density: 0.001,
      label: 'wheel'
    });

    this.wheelFront = Bodies.circle(x + wheelGap / 2, y + 25, wheelRadius, {
      collisionFilter: { group: -1 },
      friction: 0.9,
      frictionStatic: 1.0,
      restitution: 0.1,
      density: 0.001,
      label: 'wheel'
    });

    // === SÜSPANSIYON (Constraint'ler) ===
    this.axleBack = Constraint.create({
      bodyA: this.chassis,
      pointA: { x: -wheelGap / 2, y: 20 },
      bodyB: this.wheelBack,
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: 0
    });

    this.axleFont = Constraint.create({
      bodyA: this.chassis,
      pointA: { x: wheelGap / 2, y: 20 },
      bodyB: this.wheelFront,
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: 0
    });

    // Dünyaya ekle
    World.add(physics.world, [
      this.chassis,
      this.wheelBack,
      this.wheelFront,
      this.axleBack,
      this.axleFont
    ]);

    // === KONTROL PARAMETRELERİ ===
    this.enginePower = 0.05;
    this.maxWheelSpeed = 0.4;
    this.tiltPower = 0.002;
    this.maxTiltSpeed = 0.08;
  }

  get body() {
    return this.chassis;
  }

  get position() {
    return this.chassis.position;
  }

  get angle() {
    return this.chassis.angle;
  }

  get isFlipped() {
    const angle = Math.abs(this.chassis.angle % (Math.PI * 2));
    return angle > 2.0 && angle < 4.3;
  }

  // === HAREKET KONTROLLERI ===
  
  accelerate() {
    // Arka tekerleğe tork uygula
    if (this.wheelBack.angularVelocity < this.maxWheelSpeed) {
      Body.setAngularVelocity(
        this.wheelBack, 
        this.wheelBack.angularVelocity + this.enginePower
      );
    }
  }

  reverse() {
    // Geri git
    if (this.wheelBack.angularVelocity > -this.maxWheelSpeed * 0.5) {
      Body.setAngularVelocity(
        this.wheelBack, 
        this.wheelBack.angularVelocity - this.enginePower * 0.7
      );
    }
  }

  tiltLeft() {
    // Sola eğil (havada)
    if (this.chassis.angularVelocity > -this.maxTiltSpeed) {
      Body.setAngularVelocity(
        this.chassis, 
        this.chassis.angularVelocity - this.tiltPower
      );
    }
  }

  tiltRight() {
    // Sağa eğil (havada)
    if (this.chassis.angularVelocity < this.maxTiltSpeed) {
      Body.setAngularVelocity(
        this.chassis, 
        this.chassis.angularVelocity + this.tiltPower
      );
    }
  }

  update(input) {
    if (input.gas) {
      this.accelerate();
    }
    if (input.brake) {
      this.reverse();
    }
    if (input.left) {
      this.tiltLeft();
    }
    if (input.right) {
      this.tiltRight();
    }
  }

  // === ÖZEL HAREKETLER ===
  
  bounce(power) {
    Body.setVelocity(this.chassis, { 
      x: this.chassis.velocity.x, 
      y: -power 
    });
  }

  boost(power) {
    if (this.wheelBack.angularVelocity < this.maxWheelSpeed * 2) {
      Body.setAngularVelocity(
        this.wheelBack, 
        this.wheelBack.angularVelocity + power * 0.02
      );
    }
  }

  slow() {
    Body.setAngularVelocity(
      this.wheelBack, 
      this.wheelBack.angularVelocity * 0.95
    );
    Body.setAngularVelocity(
      this.wheelFront, 
      this.wheelFront.angularVelocity * 0.95
    );
  }

  teleportTo(x, y) {
    const dx = x - this.chassis.position.x;
    const dy = y - this.chassis.position.y;
    
    Body.setPosition(this.chassis, { x, y });
    Body.setPosition(this.wheelBack, { 
      x: this.wheelBack.position.x + dx, 
      y: this.wheelBack.position.y + dy 
    });
    Body.setPosition(this.wheelFront, { 
      x: this.wheelFront.position.x + dx, 
      y: this.wheelFront.position.y + dy 
    });
    
    // Hızları sıfırla
    Body.setVelocity(this.chassis, { x: 0, y: 0 });
    Body.setVelocity(this.wheelBack, { x: 0, y: 0 });
    Body.setVelocity(this.wheelFront, { x: 0, y: 0 });
    Body.setAngularVelocity(this.chassis, 0);
    Body.setAngularVelocity(this.wheelBack, 0);
    Body.setAngularVelocity(this.wheelFront, 0);
  }

  destroy() {
    World.remove(this.physics.world, [
      this.chassis,
      this.wheelBack,
      this.wheelFront,
      this.axleBack,
      this.axleFont
    ]);
  }
}
