import Sprite from '../base/sprite.js'

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
  constructor(ctx, row, column) {
    super(GRID_CONTAINER_IMG_SRC, GRID_CONTAINER_STYLE, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH, START_X, START_Y);

    this.row = row;// 行
    this.column = column;// 列
    this.render(ctx);
  }

  update() {
  }

  /**
   * 重绘游戏网格
   */
  render(ctx) {
    this.fillRoundRect(ctx, START_X, START_Y, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH, GRID_CONTAINER_RADIUS, GRID_CONTAINER_STYLE);
    this.drawGrid(ctx);
  }

  drawGrid(ctx) {
    for (var i = 0; i < this.row; i++) {
      for (var j = 0; j < this.column; j++) {
        this.fillRoundRect(ctx, START_X + GRID_CELL_SPACE * (j + 1) + GRID_CELL_WIDTH * j, START_Y + GRID_CELL_SPACE * (i + 1) + GRID_CELL_WIDTH * i, GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, GRID_CELL_STYLE);
      }
    }
  }
}
