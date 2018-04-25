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
   * 等分重绘函数
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
  }
}
