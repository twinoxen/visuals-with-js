const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');
const { Pane } = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const PARAMS = {
  speed: 0.5,
  columns: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
  color: { r: 0, g: 0, b: 0 },
  opacity: 1,
  shape: 'line',
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const DrawGrid = GridDrawer(context);

    const cols = PARAMS.columns;
    const rows = PARAMS.rows;
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

        const f = PARAMS.animate ? frame : PARAMS.frame;

        // const n = random.noise2D(x + frame * 10, y, 0.001);
        const n = random.noise3D(x, y, f * 10, PARAMS.freq, PARAMS.amp);

        const s = math.mapRange(n, -1, 1, PARAMS.scaleMin, PARAMS.scaleMax);
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
    context.lineCap = PARAMS.lineCap;
    context.strokeStyle = `rgba(${PARAMS.color.r},${PARAMS.color.g},${PARAMS.color.b},${PARAMS.opacity})`;

    context.beginPath();

    if (PARAMS.shape === 'line') {
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
    } else {
      context.beginPath();
      context.arc(0, 0, 10, 0, 2 * Math.PI);
    }

    context.stroke();
    context.restore();
  };
}

function SetupPane() {
  const pane = new Pane({
    title: 'Parameters',
  });

  const f1 = pane.addFolder({
    title: 'Grid',
  });

  f1.addInput(PARAMS, 'columns', { min: 1, max: 200, step: 1 });
  f1.addInput(PARAMS, 'rows', { min: 1, max: 200, step: 1 });

  const f2 = pane.addFolder({
    title: 'Transforms',
  });

  f2.addInput(PARAMS, 'scaleMin', { min: 1, max: 999 });
  f2.addInput(PARAMS, 'scaleMax', { min: 1, max: 999 });
  f2.addInput(PARAMS, 'freq', { min: 0.001, max: 0.01 });
  f2.addInput(PARAMS, 'animate');
  f2.addInput(PARAMS, 'frame', { min: 1, max: 999, step: 1 });
  f2.addInput(PARAMS, 'amp', { min: 0.001, max: 5 });
  f2.addInput(PARAMS, 'lineCap', {
    options: { butt: 'butt', round: 'round', square: 'square' },
  });
  f2.addInput(PARAMS, 'color');
  f2.addInput(PARAMS, 'shape', {
    options: { line: 'line', circle: 'circle' },
  });
  f2.addInput(PARAMS, 'opacity', { min: 0.01, max: 1 });
}

function paddy(num, padlen, padchar) {
  var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
  var pad = new Array(1 + padlen).join(pad_char);
  return (pad + num).slice(-pad.length);
}

SetupPane();
canvasSketch(sketch, settings);
