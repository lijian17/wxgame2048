
export default class Tile {
  constructor(ctx, position, value) {
    this.ctx = ctx;
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
    this.previousPosition = null;// 滑块上一坐标点
    this.mergedFrom = null
  }

  /**
   * 保存坐标点
   */
  savePosition() {
    this.previousPosition = {
      x: this.x,
      y: this.y
    }
  }

  /**
   * 更新坐标点
   * @param {Object} position
   */
  updatePosition(position) {
    this.x = position.x;
    this.y = position.y
  }

  /**
   * 滑块序列化(坐标数据，数值数据)
   */
  serialize() {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value
    }
  }
}