import DataBus from './databus.js'
import BackGround from './runtime/background.js'
import Logo from './runtime/logo.js'
import Score from './runtime/score.js'
import Grid from './runtime/grid.js'
import Music from './runtime/music.js'
import Tile from './runtime/tile.js'
import StorageManager from './runtime/localstoragemanager.js'
import Actuator from './runtime/htmlactuator.js'
import EventManager from './runtime/eventmanager.js'


let ctx = canvas.getContext('2d')
const databus = new DataBus()

const width = window.innerWidth
const height = window.innerHeight
const ratio = 1
const W = width * 0.8

// 滑块矩阵数量(4x4)
const ROW = 4;// 行
const COLUMN = 4;// 列

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0;

    this.restart();
  }

  restart() {
    databus.reset();

    this.bg = new BackGround(ctx);
    this.logo = new Logo(ctx);
    this.score = new Score(ctx);
    this.grid = new Grid(ctx, ROW, COLUMN);
    // this.music = new Music();
    this.storageManager = new StorageManager();
    this.actuator = new Actuator(this.grid, this.score, this.score, null);
    this.startTiles = 2;
    this.eventManager = new EventManager(this.grid, this.score);
    this.eventManager.on("move", this.move.bind(this));
    // this.eventManager.on("restart", this.restart.bind(this));
    // this.eventManager.on("keepPlaying", this.keepPlaying.bind(this));

    this.storageManager.clearGameState();
    this.actuator.continueGame();

    this.bindLoop = this.loop.bind(this);
    this.hasEventBind = false;
    this.setup();

    // 清除上一层的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }

  /**
   * 滑块生成逻辑
   */
  tileGenerate() {
    new Tile(ctx, 0, 0);
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.bg.render(ctx);
    this.logo.render(ctx);
    this.score.render(ctx);
    this.grid.render(ctx);
    // databus.tiles.forEach((item) => { item.render(ctx) });

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx);
      }
    });

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.score.render(ctx);
    }
  }

  /**
   * 游戏逻辑更新主函数
   */
  update() {
    if (databus.gameOver) {
      return;
    }

    this.bg.update();
    this.logo.update();
    this.score.update(this.score.score++);
    this.grid.update();
    databus.tiles.forEach((item) => { item.update() });
  }

  loop() {
    databus.frame++;

    this.update();
    this.render();

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }

  // 游戏结束了吗？
  isGameTerminated() {
    if (this.over || this.won && !this.keepPlaying) {
      return true;
    } else {
      return false;
    }
  }

  // 恢复游戏状态
  setup() {
    var previousState = this.storageManager.getGameState();
    if (previousState) {
      this.grid = new Grid(ctx, previousState.grid.row, previousState.grid.column, previousState.grid.cells);
      this.score.score = previousState.score;
      this.over = previousState.over;
      this.won = previousState.won;
      this.keepPlaying = previousState.keepPlaying
    } else {
      this.grid = new Grid(ctx, ROW, COLUMN);
      this.score.score = 0;
      this.over = false;
      this.won = false;
      this.keepPlaying = false;
      this.addStartTiles();
    }
    this.actuate();
  }

  // 随机添加开始滑块
  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  // 添加随机滑块
  addRandomTile() {
    if (this.grid.cellsAvailable()) {
      let value = Math.random() < .9 ? 2 : 4;
      let tile = databus.pool.getItemByClass('tile', Tile);
      tile.init(this.grid.randomAvailableCell(), value, 1);
      tile.playAnimation();
      databus.tiles.push(tile);
      this.grid.insertTile(tile);
    }
  }

  // 使滑动
  actuate() {
    // 计算最新分数
    if (this.storageManager.getBestScore() < this.score.score) {
      this.storageManager.setBestScore(this.score.score);
    }
    // 计算游戏最新状态
    if (this.over) {
      this.storageManager.clearGameState();
    } else {
      this.storageManager.setGameState(this.serialize());
    }
    // 游戏执行器执行滑动
    this.actuator.actuate(this.grid, {
      score: this.score.score,
      over: this.over,
      won: this.won,
      bestScore: this.storageManager.getBestScore(),
      terminated: this.isGameTerminated()
    });
  }

  // 序列化游戏状态数据
  serialize() {
    return {
      grid: this.grid.serialize(),
      score: this.score.score,
      over: this.over,
      won: this.won,
      keepPlaying: this.keepPlaying
    }
  }

  // 生产滑块
  prepareTiles() {
    this.grid.eachCell(function (x, y, tile) {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    })
  }

  // 滑动滑块
  moveTile(tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }

  /**
   * 移动
   * @param {Object} direction 方向
   */
  move(direction) {
    let self = this;
    if (this.isGameTerminated()) return;
    let cell, tile;
    let vector = this.getVector(direction);
    let traversals = this.buildTraversals(vector);
    let moved = false;
    this.prepareTiles();
    traversals.x.forEach(function (x) {
      traversals.y.forEach(function (y) {
        cell = {
          x: x,
          y: y
        };
        tile = self.grid.cellContent(cell);
        if (tile) {
          let positions = self.findFarthestPosition(cell, vector);
          let next = self.grid.cellContent(positions.next);
          if (next && next.value === tile.value && !next.mergedFrom) {
            // let merged = new Tile(positions.next, tile.value * 2);

            let merged = databus.pool.getItemByClass('tile', Tile);
            merged.init(positions.next, tile.value * 2, 2);
            merged.playAnimation();
            databus.tiles.push(merged);

            merged.mergedFrom = [tile, next];
            self.grid.insertTile(merged);
            self.grid.removeTile(tile);
            tile.updatePosition(positions.next);
            self.score.score += merged.value;
            if (merged.value === 4096) self.won = true
          } else {
            self.moveTile(tile, positions.farthest)
          }
          if (!self.positionsEqual(cell, tile)) {
            moved = true
          }
        }
      })
    });
    if (moved) {
      this.addRandomTile();
      if (!this.movesAvailable()) {
        this.over = true;
      }
      this.actuate();
    }
  }

  /**
   * 获得一个矢量
   * @param {Object} direction 方向
   */
  getVector(direction) {
    var map = {
      0: { x: 0, y: -1 },
      1: { x: 1, y: 0 },
      2: { x: 0, y: 1 },
      3: { x: -1, y: 0 }
    };
    return map[direction];
  }

  /**
   * 创建遍历
   * @param {Object} vector 矢量
   */
  buildTraversals(vector) {
    let traversals = {
      x: [],
      y: []
    };
    for (let pos = 0; pos < ROW; pos++) {
      traversals.x.push(pos);
    }
    for (let pos = 0; pos < COLUMN; pos++) {
      traversals.y.push(pos);
    }
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    return traversals;
  }

  /**
   * 发现最远的位置
   * @param {Object} cell
   * @param {Object} vector
   */
  findFarthestPosition(cell, vector) {
    let previous;
    do {
      previous = cell;
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      }
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));
    return {
      farthest: previous,
      next: cell
    }
  }

  /**
   * 移动是可行的
   */
  movesAvailable() {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable()
  }

  // 
  tileMatchesAvailable() {
    var self = this;
    var tile;
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        tile = this.grid.cellContent({
          x: x,
          y: y
        });
        if (tile) {
          for (var direction = 0; direction < 4; direction++) {
            var vector = self.getVector(direction);
            var cell = {
              x: x + vector.x,
              y: y + vector.y
            };
            var other = self.grid.cellContent(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * 判断两个点是否相等
   * @param {Object} first
   * @param {Object} second
   */
  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y;
  }
}