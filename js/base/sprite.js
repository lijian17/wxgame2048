/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(style = '', width= 0, height = 0, x = 0, y = 0) {
    this.style = style;
    this.width  = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  pathRoundRect(ctx, width, height, radius) {
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 3 * Math.PI / 2, Math.PI, true);
    ctx.lineTo(0, height - radius);
    ctx.arc(radius, height - radius, radius, Math.PI, 0.5 * Math.PI, true);
    ctx.lineTo(width - radius, height);
    ctx.arc(width - radius, height - radius, radius, 0.5 * Math.PI, 0, true);
    ctx.lineTo(width, radius);
    ctx.arc(width - radius, radius, radius, 0, 3 * Math.PI / 2, true);
    ctx.lineTo(radius, 0);
    ctx.closePath();
  }

  /**
  * 绘制圆角矩形(填充)
  * @param {Object} ctx
  * @param {Object} x
  * @param {Object} y
  * @param {Object} width
  * @param {Object} height
  * @param {Object} radius
  */
  fillRoundRect(ctx, x, y, width, height, radius, style) {
    ctx.save();
    ctx.translate(x, y);
    this.pathRoundRect(ctx, width, height, radius);
    ctx.fillStyle = style;
    ctx.fill();
    ctx.restore();
  }
}
