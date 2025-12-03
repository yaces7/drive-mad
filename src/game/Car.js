import Matter from 'matter-js';

const { Bodies, Body, Composite, Constraint, World } = Matter;

export class Car {
  constructor(physics, x, y) {
    this.physics = physics;
    this.maxSpeed = 15;
    this.torque = 0.002;
    this.airControl = 0.0008;
    
    // Araç gövdesi
    this.body = Bodies.rectangle(x, y, 80, 25, {
      friction: 0.8,
      restitution: 0.2,
      density: 0.002,
      label: 'car-body'
    });

    // Tekerlekler
    const wheelRadius = 18;
    const wheelY = y + 15;
    
    this.wheelFront = Bodies.circle(x + 28, wheelY, wheelRadius, {
      friction: 1,
      restitution: 0.1,
      density: 0.003,
      label: 'wheel'
    });

    this.wheelBack = Bodies.circle(x - 28, wheelY, wheelRadius, {
      friction: 1,
      restitution: 0.1,
      density: 0.003,
      label: 'wheel'
    });

    // Süspansiyon (constraints)
    this.suspensionFront = Constraint.create({
      bodyA: this.body,
      pointA: { x: 28, y: 15 },
      bodyB: this.wheelFront,
      stiffness: 0.5,
      damping: 0.3,
      length: 0
    });

    this.suspensionBack = Constraint.create({
      bodyA: this.body,
      pointA: { x: -28, y: 15 },
      bodyB: this.wheelBack,
      stiffness: 0.5,
      damping: 0.3,
      length: 0
    });

    // Dünyaya ekle
    World.add(physics.world, [
      this.body,
      this.wheelFront,
      this.wheelBack,
      this.suspensionFront,
      this.suspensionBack
    ]);
  }

  get position() {
    return this.body.position;
  }

  get angle() {
    return this.body.angle;
  }

  get isFlipped() {
    const angle = Math.abs(this.body.angle % (Math.PI * 2));
    return angle > Math.PI * 0.6 && angle < Math.PI * 1.4;
  }

  accelerate(force) {
    const speed = this.wheelBack.angularVelocity;
    if (Math.abs(speed) < this.maxSpeed) {
      Body.setAngularVelocity(this.wheelBack, speed + force * 0.5);
      Body.setAngularVelocity(this.wheelFront, this.wheelFront.angularVelocity + force * 0.3);
    }
  }

  brake() {
    Body.setAngularVelocity(this.wheelBack, this.wheelBack.angularVelocity * 0.9);
    Body.setAngularVelocity(this.wheelFront, this.wheelFront.angularVelocity * 0.9);
  }

  tilt(direction) {
    Body.applyForce(this.body, this.body.position, { x: 0, y: 0 });
    Body.setAngularVelocity(this.body, this.body.angularVelocity + direction * this.airControl * 60);
  }

  update(input) {
    if (input.gas) {
      this.accelerate(0.8);
    }
    if (input.brake) {
      this.brake();
    }
    if (input.left) {
      this.tilt(-1);
    }
    if (input.right) {
      this.tilt(1);
    }
  }

  destroy() {
    World.remove(this.physics.world, [
      this.body,
      this.wheelFront,
      this.wheelBack,
      this.suspensionFront,
      this.suspensionBack
    ]);
  }
}
