const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    const cx = width * 0.1;
    const cy = height * 0.1;
    const w = width * 0.01;
    const h = width * 0.1;

    let x, y;

    const sliceCount = 24;
    const radius = width * 0.3;

    new Array(sliceCount).fill().forEach((item, index) => {
      const slice = math.degToRad(360 / sliceCount);
      const angle = slice * index;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();

      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
      context.fillStyle = 'black';
      context.fill();

      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);

      context.lineWidth = random.range(5, 20);

      context.beginPath();
      context.arc(
        0,
        0,
        random.range(radius * 0.7, radius * 1.3),
        slice * random.range(1, -8),
        slice * random.range(1, 5)
      );
      context.stroke();

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
