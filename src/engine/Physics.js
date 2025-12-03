import Matter from 'matter-js';

const { Engine, World, Bodies, Body, Composite, Constraint, Events } = Matter;

export class Physics {
  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.engine.world.gravity.y = 1;
  }

  update(delta) {
    Engine.update(this.engine, delta);
  }

  createGround(x, y, width, height, angle = 0, options = {}) {
    const ground = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      angle,
      friction: 0.8,
      render: { fillStyle: '#5D4E37' },
      ...options
    });
    World.add(this.world, ground);
    return ground;
  }

  createFinishZone(x, y, width, height) {
    const zone = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      isSensor: true,
      label: 'finish',
      render: { fillStyle: 'rgba(0,255,0,0.3)' }
    });
    World.add(this.world, zone);
    return zone;
  }

  createHazard(x, y, width, height) {
    const hazard = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      isSensor: true,
      label: 'hazard',
      render: { fillStyle: '#ff0000' }
    });
    World.add(this.world, hazard);
    return hazard;
  }

  clear() {
    World.clear(this.world);
    Engine.clear(this.engine);
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.engine.world.gravity.y = 1;
  }

  onCollision(callback) {
    Events.on(this.engine, 'collisionStart', callback);
  }
}
