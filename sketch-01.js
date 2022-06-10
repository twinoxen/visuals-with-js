const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    function drawSquare(x, y, width, height, lineWidth = 2) {
      context.lineWidth = lineWidth;
      context.fillStyle = 'black'
      context.fill()
      context.beginPath();
      context.rect(x, y, width, height);
      context.strokeStyle = 'white'
      context.stroke();
    }

    const columns = 6;
    const rows = 5;

    new Array(columns).fill().forEach((item, index) => {
      new Array(rows).fill().forEach((item, j) => {
        const w = width * 0.1;
        const h = height * 0.1;
        const gap = width * 0.03;
        const x = width * 0.17 + (w + gap) * index;
        const y = width * 0.17 + (w + gap) * j;

        drawSquare(x, y, w, h, width * 0.01);

        if (Math.random() > 0.5) {
          return;
        }

        const off = width * 0.02;

        drawSquare(x + off / 2, y + off / 2, w - off, h - off, width * 0.01);
      });
    });
  };
};

canvasSketch(sketch, settings);
