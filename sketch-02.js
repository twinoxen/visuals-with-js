const canvasSketch = require('canvas-sketch');
const {
  random,
  math: { degToRad },
} = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = width * 0.1;

    let x, y;

    const sliceCount = 12;
    const radius = width * 0.3;

    new Array(sliceCount).fill().forEach((item, index) => {
      const slice = degToRad(360 / sliceCount);
      const angle = slice * index;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();

      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(1, 3), random.range(1, 3));

      context.beginPath();
      context.rect(-w * 0.5, -h * 0.5, w, h);
      context.fillStyle = 'black';
      context.fill();

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
