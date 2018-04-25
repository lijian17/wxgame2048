const screenWidth = window.innerWidth
const WIDTH = screenWidth * 0.8
const RADIUS = WIDTH * 0.8 * 1 / 75
/**
 * 滑块元数据
 */
export default class TileMetadata {
  constructor(text = '', style = '', width = 0, height = 0, x = 0, y = 0) {
    this.text = text;
    this.style = style;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.radius = RADIUS;
  }
}