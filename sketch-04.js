const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const DrawGrid = GridDrawer(context);

    const cols = 10;
    const rows = 10;
    const numCells = cols * rows;

    const gridWidth = width * 0.8;
    const gridHeight = height * 0.8;

    const cellWidth = gridWidth / cols;
    const cellHeight = gridHeight / rows;

    const margin = {
      left: (width - gridWidth) * 0.5,
      right: (width - gridWidth) * 0.5,
      top: (height - gridHeight) * 0.5,
      bottom: (height - gridHeight) * 0.5,
    };

    FillArray(cols).map((item, colIndex) =>
      new FillArray(rows).forEach((item, rowIndex) => {
        const x = colIndex * cellWidth + margin.left + cellWidth * 0.5;
        const y = rowIndex * cellHeight + margin.right + cellHeight * 0.5;

        const w = cellWidth * 0.8;
        const h = cellHeight * 0.8;

        const n = random.noise2D(x + frame * 10, y, 0.001);
        const s = math.mapRange(n, -1, 1, 1, 30);
        const r = n * Math.PI * 0.2;

        DrawGrid(x, y, w, h, r, s);
      })
    );
  };
};

function FillArray(length, fillWith = undefined) {
  return new Array(length).fill(fillWith);
}

function GridDrawer(context) {
  return (x, y, w, h, r, s) => {
    context.save();
    context.translate(x, y);
    context.rotate(r);
    context.lineWidth = s;
    context.beginPath();
    context.moveTo(w * -0.5, 0);
    context.lineTo(w * 0.5, 0);
    context.stroke();
    context.restore();
  };
}

canvasSketch(sketch, settings);
