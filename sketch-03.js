const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = () => {
  let Dots = new Array(40).fill().map(
    Entity({
      canvasWidth: settings.dimensions[0],
      canvasHeight: settings.dimensions[1],
    })
  );

  return ({ context, width, height }) => {
    clearCanvas(context, width, height);

    Dots = Dots.map(MoveWithVelocity)
      // .map(KeepInBounds(width, height))
      .map(WarpToOtherSide(width, height))
      .map(LineDrawer(context))
      .map(DotDrawer(context));
  };
};

function Vector(x = 0, y = 0) {
  return Object.freeze({
    x,
    y,
  });
}

function Entity({
  positionX = 0,
  positionY = 0,
  velocityX = 0,
  velocityY = 0,
  radius = 0,
  canvasWidth = 0,
  canvasHeight = 0,
} = {}) {
  return function () {
    const posX = positionX || random.range(0, canvasWidth);
    const posY = positionY || random.range(0, canvasHeight);

    const velX = velocityX || random.range(-1, 1);
    const velY = velocityY || random.range(-1, 1);

    const rad = radius || random.range(4, 12);

    return Object.freeze({
      position: Vector(posX, posY),
      velocity: Vector(velX, velY),
      radius: rad,
    });
  };
}

function clearCanvas(context, width, height) {
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
}

function DotDrawer(context) {
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

function LineDrawer(context) {
  return function (entity, index, entityArray) {
    entityArray.forEach((child) => {
      const distance = GetDistance(entity, child);

      if (distance > 200) return;

      context.lineWidth = math.mapRange(distance, 0, 200, 6, 1);

      context.beginPath();
      context.moveTo(entity.position.x, entity.position.y);
      context.lineTo(child.position.x, child.position.y);
      context.stroke();
    });

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

function WarpToOtherSide(width, height) {
  return (entity) => {
    let positionX = entity.position.x;
    if (entity.position.x <= 0) positionX = width;
    if (entity.position.x <= 0) positionX = width - 5;

    let positionY = entity.position.y;
    if (entity.position.y >= height) positionY = 0;
    if (entity.position.y <= 0) positionY = height - 5;

    return {
      ...entity,
      position: { x: positionX, y: positionY },
    };
  };
}

const MoveWithVelocity = (entity) => {
  const x = entity.position.x + entity.velocity.x;
  const y = entity.position.y + entity.velocity.y;

  return {
    ...entity,
    position: {
      x,
      y,
    },
  };
};

const GetDistance = (entity1, entity2) => {
  const distanceX = entity1.position.x - entity2.position.x;
  const distanceY = entity1.position.y - entity2.position.y;

  return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
};

canvasSketch(sketch, settings);
