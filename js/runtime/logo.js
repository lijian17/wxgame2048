import Sprite from '../base/sprite.js'

const IMG_SRC = 'images/title.png'
const STYLE = '#776e65'
const WIDTH = 201
const HEIGHT = 39.75
const X = 10
const Y = 20

/**
 * 游戏logo类
 * 提供update和render函数实现有动画功能的logo
 */
export default class Logo extends Sprite {
  constructor(ctx) {
    super(IMG_SRC, STYLE, WIDTH, HEIGHT, X, Y);
    this.render(ctx);
  }

  update() {

  }

  /**
   * logo重绘函数
   */
  render(ctx) {
    // 绘制logo
    this.drawToCanvas(ctx);

    // 绘制描述
    ctx.beginPath();
    ctx.fillStyle = "#776e65";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "10px Arial bold";
    ctx.fillText("大学毕业小屌丝通过努力到达人生巅峰的励(苦)志(逼)过程。", 10, 100);
    ctx.closePath();
  }
}
