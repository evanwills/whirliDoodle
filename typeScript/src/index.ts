import { Wheel, CompoundWheel } from './wheel.interface';
import {IncrementManager} from './incrementManager.interface';
import { PenHolder, TrianglePenHolder, ScissorPenHolder, TSquarePenHolder } from './penHolder.interface';
import { DrawingTable, StaticDrawingTable, RotatingDrawingTable } from './drawingTable.interface';
import {WhirliDoodleMachine} from './whirliDoodleMachine'

const init = {
  steps: 2000000,
  base1: {
    type: 'compound',
    origin: {
      x: 200,
      y: -500
    },
    radiusLength: 250,
    angleIncrement: {
      type: 'IncrementManager',
      value: 0.25
    },
    initialAngle: 37,
    extraWheel: {
      radiusLength: 173,
      angleIncrement: {
        type: 'IncrementManager',
        value: -0.145
      },
      initialAngle: 198.5,
    }
  },
  base2: {
    type: 'compound',
    origin: {
      x: 500,
      y: -550
    },
    radiusLength: 350,
    angleIncrement: {
      type: 'IncrementManager',
      value: 0.485
    },
    initialAngle: 37,
    extraWheel: {
      radiusLength: 121,
      angleIncrement: {
        type: 'IncrementManager',
        value: 0.267
      },
      initialAngle: 289.755,
    }
  },
  penHolder: {
    type: 'ScissorPenHolder',
    arms: [
      {
        length: 723,
        offset: 0.67
      },
      {
        length: 698,
        offset: 0.65
      }
    ]
  },
  drawingTable: {
    type: 'RotatingDrawingTable',
    origin: {
      x: 350,
      y: 200
    },
    angleIncrement: {
      type: 'IncrementManager',
      value: 0.333
    },
    initialAngle: 0,
  }
}

let steps: number = init.steps;

let base1: Wheel;
if (init.base1.type === 'CompoundWheel') {
  const base1Primary = {
    origin: init.base1.origin,
    radiusLength: init.base1.radiusLength,
    angleIncrement: new IncrementManager(init.base1.angleIncrement.value),
    initialAngle: init.base1.initialAngle
  }
  const base1Secondary = {
    origin: init.base1.origin,
    radiusLength: init.base1.extraWheel.radiusLength,
    angleIncrement: new IncrementManager(init.base1.extraWheel.angleIncrement.value),
    initialAngle: init.base1.extraWheel.initialAngle
  }
  base1 = new CompoundWheel(base1Primary, base1Secondary);
} else {
  base1 = new Wheel(init.base1.origin, init.base1.radiusLength, new IncrementManager(init.base1.angleIncrement.value), init.base1.initialAngle);
}


let base2: Wheel;
if (init.base2.type === 'CompoundWheel') {
  const base2Primary = {
    origin: init.base2.origin,
    radiusLength: init.base2.radiusLength,
    angleIncrement: new IncrementManager(init.base2.angleIncrement.value),
    initialAngle: init.base2.initialAngle
  }
  const base2Secondary = {
    origin: init.base2.origin,
    radiusLength: init.base2.extraWheel.radiusLength,
    angleIncrement: new IncrementManager(init.base2.extraWheel.angleIncrement.value),
    initialAngle: init.base2.extraWheel.initialAngle
  }
  base2 = new CompoundWheel(base2Primary, base2Secondary);
} else {
  base2 = new Wheel(init.base2.origin, init.base2.radiusLength, new IncrementManager(init.base2.angleIncrement.value), init.base2.initialAngle);
}

let penArm: PenHolder;
if (init.penHolder.type === 'TrianglePenHolder') {
  penArm = new TrianglePenHolder(init.penHolder.arms[0].length, init.penHolder.arms[1].length);
} else if (init.penHolder.type === 'ScissorPenHolder') {
  penArm = new ScissorPenHolder(init.penHolder.arms[0].length, init.penHolder.arms[0].offset, init.penHolder.arms[1].length, init.penHolder.arms[1].offset);
} else if (init.penHolder.type === 'TSquarePenHolder') {
  penArm = new TSquarePenHolder(init.penHolder.arms[0].length);
}

let drawingTable: DrawingTable
if (init.drawingTable.type !== 'RotatingDrawingTable') {
  drawingTable = new StaticDrawingTable();
} else {
  drawingTable = new RotatingDrawingTable(
    init.drawingTable.origin,
    new IncrementManager(
      init.drawingTable.angleIncrement.value,
    ),
    init.drawingTable.initialAngle
  );
}

let drawer = new WhirliDoodleMachine(base1, base2, penArm, drawingTable);


let output = [];
while (steps >= 0) {
  output.push(drawer.draw());
  steps -= 1;
}
