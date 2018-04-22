import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 游戏网格绘制起始坐标
const START_X = screenWidth * 0.2 / 2
const START_Y = screenHeight * 0.2

// 游戏网格背景样式及宽高
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
 * 游戏背景类
 * 提供render函数实现重绘背景背景功能(全局背景和游戏网格)
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(GRID_CONTAINER_STYLE, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH);

    this.render(ctx);
  }

  update(ctx){
    this.render(ctx);
  }

  /**
   * 背景重绘函数
   * 先绘制全局背景，再绘制游戏网格
   */
  render(ctx) {
    // 整个画布背景
    ctx.save();
    ctx.fillStyle = "#e2eaef";
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    ctx.restore();

    // 绘制主场景
    this.fillRoundRect(ctx, START_X, START_Y, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH, GRID_CONTAINER_RADIUS, GRID_CONTAINER_STYLE);
    this.drawGrid(ctx);
  }

  drawGrid(ctx) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        this.fillRoundRect(ctx, START_X + GRID_CELL_SPACE * (j + 1) + GRID_CELL_WIDTH * j, START_Y + GRID_CELL_SPACE * (i + 1) + GRID_CELL_WIDTH * i, GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, GRID_CELL_STYLE);
      }
    }
  }
}
