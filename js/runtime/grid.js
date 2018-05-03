import Sprite from '../base/sprite.js'
import Tile from '../runtime/tile.js'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 游戏网格绘制起始坐标
const START_X = screenWidth * 0.2 / 2
const START_Y = screenHeight * 0.2

// 游戏网格背景样式及宽高
const GRID_CONTAINER_IMG_SRC = ''
const GRID_CONTAINER_STYLE = '#a7b6c5'
const GRID_CONTAINER_WIDTH = screenWidth * 0.8
const GRID_CONTAINER_RADIUS = GRID_CONTAINER_WIDTH * 1 / 75

// 游戏网格样式及宽高
// 滑块宽，滑块间间隙，滑块的圆角半径
const GRID_CELL_STYLE = 'rgba(238, 228, 218, 0.35)'
const GRID_CELL_WIDTH = GRID_CONTAINER_WIDTH * 1 / 5
const GRID_CELL_SPACE = GRID_CONTAINER_WIDTH * 1 / 25
const GRID_CELL_RADIUS = GRID_CONTAINER_WIDTH * 1 / 75

/**
 * 游戏网格类
 * 提供render函数实现重绘网格功能
 */
export default class Grid extends Sprite {
  constructor(ctx, row, column, previousState) {
    super(GRID_CONTAINER_IMG_SRC, GRID_CONTAINER_STYLE, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH, START_X, START_Y);

    this.row = row;// 行
    this.column = column;// 列

    this.render(ctx);

    this.cells = previousState ? this.fromState(previousState) : this.empty();
  }

  update() {
  }

  /**
   * 重绘游戏网格
   */
  render(ctx) {
    this.fillRoundRect(ctx,
      START_X,
      START_Y,
      GRID_CONTAINER_WIDTH,
      GRID_CONTAINER_WIDTH,
      GRID_CONTAINER_RADIUS,
      GRID_CONTAINER_STYLE);
    this.drawGrid(ctx);
    this.drawCell(ctx);
  }

  drawCell(ctx) {
    
  }

  drawGrid(ctx) {
    for (var i = 0; i < this.row; i++) {
      for (var j = 0; j < this.column; j++) {
        this.fillRoundRect(ctx,
          START_X + GRID_CELL_SPACE * (j + 1) + GRID_CELL_WIDTH * j,
          START_Y + GRID_CELL_SPACE * (i + 1) + GRID_CELL_WIDTH * i,
          GRID_CELL_WIDTH,
          GRID_CELL_WIDTH,
          GRID_CELL_RADIUS,
          GRID_CELL_STYLE);
      }
    }
  }

  // 置空网格
  empty() {
    let cells = [];
    for (let x = 0; x < this.row; x++) {
      let row = cells[x] = [];
      for (let y = 0; y < this.column; y++) {
        row.push(null);
      }
    }
    return cells;
  }

  /**
   * 恢复上一局棋局
   * @param {Object} state 序列化的数据
   */
  fromState(state) {
    let cells = [];
    for (let x = 0; x < this.row; x++) {
      let row = cells[x] = [];
      for (let y = 0; y < this.column; y++) {
        let tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null);
      }
    }
    return cells;
  }

  // 随机生成有效滑块
  randomAvailableCell() {
    let cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  // 可用的网格块集合(即空白的网格块)
  availableCells() {
    let cells = [];
    this.eachCell(function (x, y, tile) {
      if (!tile) {
        cells.push({
          x: x,
          y: y
        })
      }
    });
    return cells;
  }

  /**
   * 输出每一个网格块
   * @param {Object} callback
   */
  eachCell(callback) {
    for (let x = 0; x < this.row; x++) {
      for (var y = 0; y < this.column; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }

  // 是否还有可移动的网格块(即空白的网格块)
  cellsAvailable() {
    return !!this.availableCells().length;
  }

  /**
   * 网格可用的(即空白的网格块)
   * @param {Object} cell
   */
  cellAvailable(cell) {
    return !this.cellOccupied(cell);
  }

  /**
   * 网格已被占用(即不是空白网格块)
   * @param {Object} cell
   */
  cellOccupied(cell) {
    return !!this.cellContent(cell);
  }

  /**
   * 获得网格内容
   * @param {Object} cell
   */
  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.x];
    } else {
      return null;
    }
  }

  /**
   * 插入滑块
   * @param {Object} tile
   */
  insertTile(tile) {
    this.cells[tile.x][tile.x] = tile;
  }

  /**
   * 移除滑块
   * @param {Object} tile
   */
  removeTile(tile) {
    this.cells[tile.x][tile.x] = null;
  }

  /**
   * 判断点是否处于控制区内
   * @param {Object} position
   */
  withinBounds(position) {
    return position.x >= 0 && position.x < this.column && position.y >= 0 && position.y < this.row;
  }

  // 序列化网格数据
  serialize() {
    let cellState = [];
    for (let x = 0; x < this.row; x++) {
      let row = cellState[x] = [];
      for (let y = 0; y < this.column; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
      }
    }
    return {
      row: this.row,
      column: this.column,
      cells: cellState
    }
  }
}
