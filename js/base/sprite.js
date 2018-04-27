/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', style = '', width = 0, height = 0, x = 0, y = 0) {
    this.img = new Image();
    this.img.src = imgSrc;

    this.style = style;

    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.visible = true;
  }

  /**
   * 将精灵图绘制在canvas上
   * @param ctx canvas对象
   */
  drawToCanvas(ctx) {
    if (!this.visible) {
      return;
    }

    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX = sp.x + sp.width / 2;
    let spY = sp.y + sp.height / 2;

    if (!sp.visible || !this.visible) {
      return false;
    }

    if ((spX >= this.x) || (spX <= (this.x + this.width)) || (spY >= this.y) || (spY <= (this.y + this.height))) {
      return false;
    }

    return true;
  }
}
