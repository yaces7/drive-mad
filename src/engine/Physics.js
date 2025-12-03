import Matter from 'matter-js';

const { Engine, World, Bodies, Body, Events } = Matter;

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
      isStatic: true, angle, friction: 0.8,
      render: { fillStyle: '#5D4E37' },
      ...options
    });
    World.add(this.world, ground);
    return ground;
  }

  createFinishZone(x, y, width, height) {
    const zone = Bodies.rectangle(x, y, width, height, {
      isStatic: true, isSensor: true, label: 'finish'
    });
    World.add(this.world, zone);
    return zone;
  }

  createHazard(x, y, width, height) {
    const hazard = Bodies.rectangle(x, y, width, height, {
      isStatic: true, isSensor: true, label: 'hazard'
    });
    World.add(this.world, hazard);
    return hazard;
  }

  createBouncer(x, y, width, height, power) {
    const bouncer = Bodies.rectangle(x, y, width, height, {
      isStatic: true, label: 'bouncer', restitution: 2,
      bouncepower: power
    });
    World.add(this.world, bouncer);
    return bouncer;
  }

  createMovingPlatform(x, y, width, height) {
    const platform = Bodies.rectangle(x, y, width, height, {
      isStatic: true, friction: 0.8, label: 'moving-platform'
    });
    World.add(this.world, platform);
    return platform;
  }

  createTeleport(x, y, width, height, type) {
    const teleport = Bodies.rectangle(x, y, width, height, {
      isStatic: true, isSensor: true, label: `teleport-${type}`
    });
    World.add(this.world, teleport);
    return teleport;
  }

  createFakePortal(x, y, width, height) {
    const portal = Bodies.rectangle(x, y, width, height, {
      isStatic: true, isSensor: true, label: 'fake-portal'
    });
    World.add(this.world, portal);
    return portal;
  }

  createTimedGate(x, y, width, height) {
    const gate = Bodies.rectangle(x, y, width, height, {
      isStatic: true, label: 'timed-gate'
    });
    World.add(this.world, gate);
    return gate;
  }

  createCrusher(x, y, width, height) {
    const crusher = Bodies.rectangle(x, y, width, height, {
      isStatic: true, label: 'crusher'
    });
    World.add(this.world, crusher);
    return crusher;
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

  onCollisionActive(callback) {
    Events.on(this.engine, 'collisionActive', callback);
  }
}
