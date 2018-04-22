import Sprite from '../base/sprite'

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
export default class Scores extends Sprite {
  constructor(ctx) {
    super("", 0, 0);

    this.ctx = ctx;
    this.score = 0;
    this.best = 0;
    this.render()
  }

  update(_score) {
    this.score = _score;
    if (this.score > this.best) {
      this.best = this.score;
    }
    this.render();
  }

  updateScore() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"//得写在font之前
    this.ctx.font = "10px Arial bold";
    this.ctx.fillText(this.score, SCORE_START_X + SCORE_WIDTH / 2, SCORE_START_Y + SCORE_HEIGHT * 3 / 4);
    this.ctx.closePath();
  }

  updateBest() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"//得写在font之前
    this.ctx.font = "10px Arial bold";
    this.ctx.fillText(this.best, BEST_SCORE_START_X + BEST_SCORE_WIDTH / 2, BEST_SCORE_START_Y + BEST_SCORE_HEIGHT * 3 / 4);
    this.ctx.closePath();
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render() {
    // 绘制当前得分
    this.fillRoundRect(this.ctx, SCORE_START_X, SCORE_START_Y, SCORE_WIDTH, SCORE_HEIGHT, SCORE_RADIUS, SCORE_STYLE);
    // this.ctx.fillRect(240, 50, 40, 30);
    this.ctx.fillStyle = "#eee4da";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"//得写在font之前
    this.ctx.font = "8px Arial bold";
    this.ctx.fillText("当前得分", SCORE_START_X + SCORE_WIDTH / 2, SCORE_START_Y + SCORE_HEIGHT * 1 / 4);
    this.updateScore();

    // 绘制历史记录
    this.fillRoundRect(this.ctx, BEST_SCORE_START_X, BEST_SCORE_START_Y, BEST_SCORE_WIDTH, BEST_SCORE_HEIGHT, BEST_SCORE_RADIUS, BEST_SCORE_STYLE);
    // this.ctx.fillRect(285, 50, 60, 30);
    this.ctx.fillStyle = "#eee4da";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"//得写在font之前
    this.ctx.font = "8px Arial bold";
    this.ctx.fillText("历史记录", BEST_SCORE_START_X + BEST_SCORE_WIDTH / 2, BEST_SCORE_START_Y + BEST_SCORE_HEIGHT * 1 / 4);
    this.updateBest();
  }
}
