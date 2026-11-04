export const COLS = 21;
export const ROWS = 13;

export type Grid = boolean[][];

export interface Cell {
  col: number;
  row: number;
}

const DIRECTIONS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function isOpenCell(walls: Grid, col: number, row: number): boolean {
  return row >= 0 && col >= 0 && row < ROWS && col < COLS && !walls[row][col];
}

export function generateMaze(): Grid {
  const walls: Grid = Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(true));
  const stack: Cell[] = [{ col: 1, row: 1 }];
  walls[1][1] = false;

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const options = DIRECTIONS.filter(([dc, dr]) => {
      const col = current.col + dc * 2;
      const row = current.row + dr * 2;
      return col > 0 && col < COLS - 1 && row > 0 && row < ROWS - 1 && walls[row][col];
    });

    if (options.length === 0) {
      stack.pop();
      continue;
    }

    const [dc, dr] = options[Math.floor(Math.random() * options.length)];
    const next = { col: current.col + dc * 2, row: current.row + dr * 2 };
    walls[current.row + dr][current.col + dc] = false;
    walls[next.row][next.col] = false;
    stack.push(next);
  }

  return walls;
}

export function findPath(walls: Grid, from: Cell, to: Cell): Cell[] | null {
  const key = (cell: Cell) => cell.row * COLS + cell.col;
  const previous = new Map<number, Cell>();
  const visited = new Set<number>([key(from)]);
  const queue: Cell[] = [from];

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];

    if (current.col === to.col && current.row === to.row) {
      const path: Cell[] = [current];
      let prev = previous.get(key(current));
      while (prev) {
        path.unshift(prev);
        prev = previous.get(key(prev));
      }
      return path;
    }

    for (const [dc, dr] of DIRECTIONS) {
      const next = { col: current.col + dc, row: current.row + dr };
      if (!isOpenCell(walls, next.col, next.row) || visited.has(key(next))) continue;
      visited.add(key(next));
      previous.set(key(next), current);
      queue.push(next);
    }
  }

  return null;
}
