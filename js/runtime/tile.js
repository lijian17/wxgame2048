import Animation from '../base/animation.js'
import DataBus from '../databus.js'
import TileMetadata from '../base/tilemetadata.js'

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

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

/**
 * 随机生成一个数
 * @param start 起始值
 * @param end 结束值
 */
function random(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}

/**
 * 游戏网格类
 * 提供render函数实现重绘网格功能
 */
export default class Tile extends Animation {
  constructor(ctx, row, column, position, value) {
    super(GRID_CONTAINER_IMG_SRC, GRID_CONTAINER_STYLE, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH, START_X, START_Y);

    this.row = row;// 行
    this.column = column;// 列

    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
    this.previousPosition = null;// 滑块上一坐标点
    this.mergedFrom = null;

    this.initGridAnimation();
  }

  init(speed) {
    this.x = random();
  }

  initGridAnimation() {
    let frames = [];

    let num = Math.random() >= 0.5 ? 4 : 2;
    for (let i = 0; i < 20; i++) {
      frames.push(new TileMetadata(num, this.num_color(num), GRID_CELL_WIDTH + i * 2, GRID_CELL_WIDTH + i * 2, START_X + this.leftpad(this.column) - i, START_Y + this.toppad(this.row) - i));
    }
    for (let i = 19; i >= 0; i--) {
      frames.push(new TileMetadata(num, this.num_color(num), GRID_CELL_WIDTH + i * 2, GRID_CELL_WIDTH + i * 2, START_X + this.leftpad(this.column) - i, START_Y + this.toppad(this.row) - i));
    }
    this.initFrames(frames);
  }

  num_color(n) {
    var color = "rgba(238, 228, 218, 0.35)";
    switch (n) {
      case 0:
        color = "#c0c7cd";
        break;
      case 2:
        color = "#eee4da";
        break;
      case 4:
        color = "#fde9c6";
        break;
      case 8:
        color = "#ffbc6f";
        break;
      case 16:
        color = "#db7b34";
        break;
      case 32:
        color = "#db5a34";
        break;
      case 64:
        color = "#d14c2d";
        break;
      case 128:
        color = "#c22e2e";
        break;
      case 256:
        color = "#ecc400";
        break;
      case 512:
        color = "#ecc400";
        break;
      case 1024:
        color = "#ecc400";
        break;
      case 2048:
        color = "#ecc400";
        break;
      case 4096:
        color = "#ecc400";
        break
      default:
        color = "#ecc400";
        break;
    }
    return color;
  }

  leftpad(m) {
    return (m + 1) * GRID_CELL_SPACE + GRID_CELL_WIDTH * m;
  }

  toppad(n) {
    return (n + 1) * GRID_CELL_SPACE + GRID_CELL_WIDTH * n;
  }

  // 每一帧更新滑块位置
  update() {
    this.y += this[__.speed];

    // 对象回收
    if (this.y > window.innerHeight + this.height) {
      databus.removeEnemey(this)
    }
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
