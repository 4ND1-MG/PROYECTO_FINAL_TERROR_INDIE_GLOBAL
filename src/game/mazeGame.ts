import { COLS, ROWS, findPath, generateMaze, isOpenCell, type Cell, type Grid } from '@/game/maze';

export const TILE = 40;
export const WORLD_WIDTH = COLS * TILE;
export const WORLD_HEIGHT = ROWS * TILE;
export const SHARD_TOTAL = 3;

const PLAYER_SPEED = 130;
const SHADOW_SPEED = 92;
const PLAYER_RADIUS = 11;
const SHADOW_RADIUS = 13;
const LIGHT_RADIUS = 150;
const INTERACT_RANGE = 46;
const REPATH_INTERVAL = 0.35;

const START_CELL: Cell = { col: 1, row: 1 };
const SHADOW_CELL: Cell = { col: COLS - 2, row: 1 };
const EXIT_CELL: Cell = { col: COLS - 2, row: ROWS - 2 };

const FLOOR_COLOR = '#0b0b0b';
const WALL_COLOR = '#262626';

export type GameStatus = 'playing' | 'won' | 'caught';
export type GameEvent = 'shard' | 'locked' | 'won' | 'caught';

export interface MazeInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
}

interface Point {
  x: number;
  y: number;
}

export interface MazeGame {
  walls: Grid;
  player: Point;
  shadow: Point;
  shadowTarget: Point;
  repathIn: number;
  exit: Point;
  shards: (Point & { taken: boolean })[];
  collected: number;
  status: GameStatus;
  time: number;
}

const centerOf = (cell: Cell): Point => ({
  x: cell.col * TILE + TILE / 2,
  y: cell.row * TILE + TILE / 2,
});

const cellOf = (point: Point): Cell => ({
  col: Math.floor(point.x / TILE),
  row: Math.floor(point.y / TILE),
});

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const manhattan = (a: Cell, b: Cell) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row);

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function createMazeGame(): MazeGame {
  const walls = generateMaze();
  const candidates: Cell[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = { col, row };
      if (
        isOpenCell(walls, col, row) &&
        manhattan(cell, START_CELL) >= 8 &&
        manhattan(cell, EXIT_CELL) >= 3 &&
        manhattan(cell, SHADOW_CELL) >= 3
      ) {
        candidates.push(cell);
      }
    }
  }

  const shards = shuffle(candidates)
    .slice(0, SHARD_TOTAL)
    .map((cell) => ({ ...centerOf(cell), taken: false }));

  const shadow = centerOf(SHADOW_CELL);

  return {
    walls,
    player: centerOf(START_CELL),
    shadow,
    shadowTarget: shadow,
    repathIn: 0,
    exit: centerOf(EXIT_CELL),
    shards,
    collected: 0,
    status: 'playing',
    time: 0,
  };
}

function collides(walls: Grid, x: number, y: number, radius: number): boolean {
  const left = Math.floor((x - radius) / TILE);
  const right = Math.floor((x + radius) / TILE);
  const top = Math.floor((y - radius) / TILE);
  const bottom = Math.floor((y + radius) / TILE);

  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      if (!isOpenCell(walls, col, row)) return true;
    }
  }
  return false;
}

function moveBody(walls: Grid, body: Point, dx: number, dy: number, radius: number) {
  if (!collides(walls, body.x + dx, body.y, radius)) body.x += dx;
  if (!collides(walls, body.x, body.y + dy, radius)) body.y += dy;
}

function moveShadow(state: MazeGame, dt: number) {
  state.repathIn -= dt;
  if (state.repathIn <= 0) {
    state.repathIn = REPATH_INTERVAL;
    const path = findPath(state.walls, cellOf(state.shadow), cellOf(state.player));
    const next = path && path.length > 1 ? path[1] : cellOf(state.player);
    state.shadowTarget = centerOf(next);
  }

  const dx = state.shadowTarget.x - state.shadow.x;
  const dy = state.shadowTarget.y - state.shadow.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return;

  const step = Math.min(SHADOW_SPEED * dt, dist);
  moveBody(state.walls, state.shadow, (dx / dist) * step, (dy / dist) * step, SHADOW_RADIUS);
}

export function updateMazeGame(state: MazeGame, dt: number, input: MazeInput): GameEvent[] {
  if (state.status !== 'playing') return [];

  const events: GameEvent[] = [];
  state.time += dt;

  let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  let dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }
  moveBody(state.walls, state.player, dx * PLAYER_SPEED * dt, dy * PLAYER_SPEED * dt, PLAYER_RADIUS);

  moveShadow(state, dt);

  if (input.interact) {
    const shard = state.shards.find(
      (s) => !s.taken && distance(s, state.player) <= INTERACT_RANGE,
    );
    if (shard) {
      shard.taken = true;
      state.collected++;
      events.push('shard');
    } else if (distance(state.exit, state.player) <= INTERACT_RANGE) {
      events.push('locked');
    }
  }

  if (distance(state.exit, state.player) <= INTERACT_RANGE && state.collected >= SHARD_TOTAL) {
    state.status = 'won';
    events.push('won');
  } else if (distance(state.player, state.shadow) < PLAYER_RADIUS + SHADOW_RADIUS - 4) {
    state.status = 'caught';
    events.push('caught');
  }

  return events;
}

export function renderMazeGame(ctx: CanvasRenderingContext2D, state: MazeGame) {
  ctx.fillStyle = FLOOR_COLOR;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  ctx.fillStyle = WALL_COLOR;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (!isOpenCell(state.walls, col, row)) {
        ctx.fillRect(col * TILE, row * TILE, TILE, TILE);
      }
    }
  }

  const exitOpen = state.collected >= SHARD_TOTAL;
  ctx.save();
  ctx.shadowBlur = exitOpen ? 24 : 0;
  ctx.shadowColor = '#39ff14';
  ctx.fillStyle = exitOpen ? '#39ff14' : '#7f1d1d';
  ctx.fillRect(state.exit.x - 12, state.exit.y - 12, 24, 24);
  ctx.restore();

  const pulse = 0.5 + 0.5 * Math.sin(state.time * 4);
  for (const shard of state.shards) {
    if (shard.taken) continue;
    const size = 5 + pulse * 2;
    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.rotate(Math.PI / 4);
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#bae6fd';
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(-size, -size, size * 2, size * 2);
    ctx.restore();
  }

  const angle = Math.atan2(state.player.y - state.shadow.y, state.player.x - state.shadow.x);
  const shadowRadius = SHADOW_RADIUS + Math.sin(state.time * 6) * 1.5;
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = 'rgba(220,38,38,0.8)';
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.arc(state.shadow.x, state.shadow.y, shadowRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fca5a5';
  for (const offset of [-0.35, 0.35]) {
    ctx.beginPath();
    ctx.arc(
      state.shadow.x + Math.cos(angle + offset) * shadowRadius * 0.45,
      state.shadow.y + Math.sin(angle + offset) * shadowRadius * 0.45,
      2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.shadowBlur = 12;
  ctx.shadowColor = 'rgba(229,229,229,0.6)';
  ctx.fillStyle = '#e5e5e5';
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const flicker = 1 + Math.sin(state.time * 17) * 0.02;
  const light = ctx.createRadialGradient(
    state.player.x,
    state.player.y,
    LIGHT_RADIUS * 0.2 * flicker,
    state.player.x,
    state.player.y,
    LIGHT_RADIUS * flicker,
  );
  light.addColorStop(0, 'rgba(0,0,0,0)');
  light.addColorStop(0.6, 'rgba(0,0,0,0.7)');
  light.addColorStop(1, 'rgba(0,0,0,0.97)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
}
