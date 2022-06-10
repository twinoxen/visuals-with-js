const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
  // animate: true,
};

const sketch = () => {
  const Dots = new Array(40)
    .fill(Entity())
    .map(
      UpdatePosition(
        () => random.range(0, 1080),
        () => random.range(0, 1080)
      )
    )
    .map(UpdateRadius(() => random.range(4, 12)));

  console.log('here');
  return ({ context, width, height }) => {
    Dots.map(
      UpdatePosition(
        (entity) => (entity.position.x += entity.velocity.x),
        (entity) => (entity.position.y += entity.velocity.y)
      )
    ).map(Drawer(context));
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
    velocity: Vector(random.range(-1, 1), random.range(-1, 1)),
    radius,
  });
}

function Drawer(context) {
  console.log('new context');
  return (entity) => {
    const {
      position: { x, y },
      radius,
    } = entity;

    console.log(context);
    

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

const UpdateRadius =
  (radius = 10) =>
  (entity) => {
    const cRadius = radius instanceof Function ? radius() : radius;

    return Object.freeze({ ...entity, radius: cRadius });
  };

canvasSketch(sketch, settings);
