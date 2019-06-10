import Tile from '../runtime/tile.js'

export default class GameInfo {
  constructor(row = 4, column = 4) {
    this.row = row;
    this.column = column;

    gridEmpty();
  }

  gridEmpty() {
    this.tiles = [];
    for (let x = 0; x < this.row; x++) {
      let row = this.tiles[x] = [];
      for (let y = 0; y < this.column; y++) {
        row.push(null);
      }
    }
  }

  /**
   * 恢复上一局棋局
   * @param {Object} state 序列化的数据
   */
  gridFromState(state) {
    this.tiles = [];
    for (let x = 0; x < this.row; x++) {
      let row = this.tiles[x] = [];
      for (let y = 0; y < this.column; y++) {
        let tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null);
      }
    }
  }

  // 随机生成有效滑块
  gridRandomAvailableCell() {
    let cells = this.gridAvailableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)]
    }
  }

  // 可用的网格块集合(即空白的网格块)
  gridAvailableCells() {
    let cells = [];
    this.gridEachCell(function (x, y, tile) {
      if (!tile) {
        cells.push({
          x: x,
          y: y
        })
      }
    });
    return cells
  }

  // 输出每一个网格块
  gridEachCell(callback) {
    for (let x = 0; x < this.row; x++) {
      for (let y = 0; y < this.column; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }
}