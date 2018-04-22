
/**
* 网格
* @param {Object} size 网格的个数(如：4表示4x4)
* @param {Object} previousState 上一局的状态
*/
export default class Grid {
  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty()
  }

  // 置空网格
  empty() {
    var cells = [];
    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];
      for (var y = 0; y < this.size; y++) {
        row.push(null)
      }
    }
    return cells
  }

  /**
   * 恢复上一局棋局
   * @param {Object} state 序列化的数据
   */
  fromState(state) {
    var cells = [];
    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];
      for (var y = 0; y < this.size; y++) {
        var tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null)
      }
    }
    return cells
  }

  // 随机生成有效滑块
  randomAvailableCell() {
    var cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)]
    }
  }

  // 可用的网格块集合(即空白的网格块)
  availableCells() {
    var cells = [];
    this.eachCell(function (x, y, tile) {
      if (!tile) {
        cells.push({
          x: x,
          y: y
        })
      }
    });
    return cells
  }

  /**
   * 输出每一个网格块
   * @param {Object} callback
   */
  eachCell(callback) {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y])
      }
    }
  }

  // 是否还有可移动的网格块(即空白的网格块)
  cellsAvailable() {
    return !!this.availableCells().length
  }

  /**
   * 网格可用的(即空白的网格块)
   * @param {Object} cell
   */
  cellAvailable(cell) {
    return !this.cellOccupied(cell)
  }

  /**
   * 网格已被占用(即不是空白网格块)
   * @param {Object} cell
   */
  cellOccupied(cell) {
    return !!this.cellContent(cell)
  }

  /**
   * 获得网格内容
   * @param {Object} cell
   */
  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y]
    } else {
      return null
    }
  }

  /**
   * 插入滑块
   * @param {Object} tile
   */
  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile
  }

  /**
   * 移除滑块
   * @param {Object} tile
   */
  removeTile(tile) {
    this.cells[tile.x][tile.y] = null
  }

  /**
   * 判断点是否处于控制区内
   * @param {Object} position
   */
  withinBounds(position) {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size
  }

  // 序列化网格数据
  serialize() {
    var cellState = [];
    for (var x = 0; x < this.size; x++) {
      var row = cellState[x] = [];
      for (var y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null)
      }
    }
    return {
      size: this.size,
      cells: cellState
    }
  }
}