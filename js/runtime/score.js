import Sprite from '../base/sprite.js'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 历史记录
const BEST_SCORE_WIDTH = 60
const BEST_SCORE_HEIGHT = 30
const BEST_SCORE_START_X = screenWidth - 20 - BEST_SCORE_WIDTH
const BEST_SCORE_START_Y = 50
const BEST_SCORE_RADIUS = screenWidth * 0.8 * 1 / 75
const BEST_SCORE_STYLE = "#b3c0cd"

// 当前得分
const SCORE_WIDTH = 60
const SCORE_HEIGHT = 30
const SCORE_START_X = BEST_SCORE_START_X - SCORE_WIDTH - 10
const SCORE_START_Y = 50
const SCORE_RADIUS = screenWidth * 0.8 * 1 / 75
const SCORE_STYLE = "#b3c0cd"

// 重新开始
const RESTART_WIDTH = 60
const RESTART_HEIGHT = 24
const RESTART_START_X = BEST_SCORE_START_X
const RESTART_START_Y = 85
const RESTART_RADIUS = screenWidth * 0.8 * 1 / 75
const RESTART_STYLE = "#b3c0cd"

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class Score extends Sprite {
  constructor(ctx) {
    super();

    this.score = 0;
    this.best = 0;
    this.render(ctx);
  }

  update(_score) {
    this.score = _score;
    if (this.score > this.best) {
      this.best = this.score;
    }
  }

  updateScore(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "10px Arial bold";
    ctx.fillText(this.score, SCORE_START_X + SCORE_WIDTH / 2, SCORE_START_Y + SCORE_HEIGHT * 3 / 4);
    ctx.closePath();
  }

  updateBest(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "10px Arial bold";
    ctx.fillText(this.best, BEST_SCORE_START_X + BEST_SCORE_WIDTH / 2, BEST_SCORE_START_Y + BEST_SCORE_HEIGHT * 3 / 4);
    ctx.closePath();
  }

  /**
   * 得分重绘函数
   */
  render(ctx) {
    // 绘制当前得分
    this.fillRoundRect(ctx, SCORE_START_X, SCORE_START_Y, SCORE_WIDTH, SCORE_HEIGHT, SCORE_RADIUS, SCORE_STYLE);
    ctx.fillStyle = "#eee4da";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "8px Arial bold";
    ctx.fillText("当前得分", SCORE_START_X + SCORE_WIDTH / 2, SCORE_START_Y + SCORE_HEIGHT * 1 / 4);
    this.updateScore(ctx);

    // 绘制历史记录
    this.fillRoundRect(ctx, BEST_SCORE_START_X, BEST_SCORE_START_Y, BEST_SCORE_WIDTH, BEST_SCORE_HEIGHT, BEST_SCORE_RADIUS, BEST_SCORE_STYLE);
    ctx.fillStyle = "#eee4da";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "8px Arial bold";
    ctx.fillText("历史记录", BEST_SCORE_START_X + BEST_SCORE_WIDTH / 2, BEST_SCORE_START_Y + BEST_SCORE_HEIGHT * 1 / 4);
    this.updateBest(ctx);


    // 绘制重新开始
    this.fillRoundRect(ctx, RESTART_START_X, RESTART_START_Y, RESTART_WIDTH, RESTART_HEIGHT, RESTART_RADIUS, RESTART_STYLE);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "8px Arial bold";
    ctx.fillText("重新开始", RESTART_START_X + RESTART_WIDTH / 2, RESTART_START_Y + RESTART_HEIGHT / 2);
  }

  /**
   * 判断点是否在重新开始按钮内部(即是否点击了重新开始按钮)
   */
  isRestart(x, y) {
    if (x >= RESTART_START_X
      && x <= (RESTART_START_X + RESTART_WIDTH)
      && y >= RESTART_START_Y
      && y <= (RESTART_START_Y + RESTART_HEIGHT)) {
      return true;
    }
    return false;
  }
}
