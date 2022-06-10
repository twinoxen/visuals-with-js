const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = () => {
  const Dots = new Array(40)
    .fill(Entity())
    .map(RandomizePosition(settings.dimensions[0], settings.dimensions[1]))
    .map(RandomizeVelocity)
    .map(RandomizeRadius);

  return ({ context, width, height }) => {
    // reset and clear canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    Dots.map(KeepInBounds(width, height))
      .map(MoveWithVelocity)
      .map(Drawer(context));
  };
};

function Vector(x = 0, y = 0) {
  return Object.freeze({
    x,
    y,
  });
}

function Entity(x = 0, y = 0, radius = 10) {
  return Object.freeze({
    position: Vector(x, y),
    velocity: Vector(x, y),
    radius,
  });
}

function Drawer(context) {
  return (entity) => {
    const {
      position: { x, y },
      radius,
    } = entity;

    context.save();
    context.translate(x, y);

    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = 'black';
    context.stroke();
    context.restore();

    return entity;
  };
}

const UpdatePosition =
  (x = 0, y = 0) =>
  (entity) => {
    const cx = x instanceof Function ? x(entity) : x;
    const cy = x instanceof Function ? y(entity) : y;

    return Object.freeze({ ...entity, position: { x: cx, y: cy } });
  };

const UpdateVelocity =
  (x = 0, y = 0) =>
  (entity) => {
    const cx = x instanceof Function ? x(entity) : x;
    const cy = x instanceof Function ? y(entity) : y;

    return Object.freeze({ ...entity, velocity: { x: cx, y: cy } });
  };

const UpdateRadius =
  (radius = 10) =>
  (entity) => {
    const cRadius = radius instanceof Function ? radius() : radius;

    return Object.freeze({ ...entity, radius: cRadius });
  };

const RandomizePosition = (width, height) => (entity) => {
  return Object.freeze({
    ...entity,
    position: {
      x: random.range(0, width),
      y: random.range(0, height),
    },
  });
};

const RandomizeVelocity = (entity) => {
  return Object.freeze({
    ...entity,
    velocity: { x: random.range(-1, 1), y: random.range(-1, 1) },
  });
};

const RandomizeRadius = (entity) => {
  return Object.freeze({
    ...entity,
    radius: random.range(4, 12),
  });
};

function KeepInBounds(width, height) {
  return (entity) => {
    const velocityX =
      entity.position.x <= 0 || entity.position.x >= width
        ? (entity.velocity.x *= -1)
        : entity.velocity.x;

    const velocityY =
      entity.position.y <= 0 || entity.position.y >= height
        ? (entity.velocity.y *= -1)
        : entity.velocity.y;

    return Object.freeze({
      ...entity,
      velocity: { x: velocityX, y: velocityY },
    });
  };
}

const MoveWithVelocity = (entity) => {
  return Object.freeze({
    ...entity,
    position: {
      x: entity.position.x += entity.velocity.x,
      y: entity.position.y += entity.velocity.y,
    },
  });
};

canvasSketch(sketch, settings);
