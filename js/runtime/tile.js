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
  constructor() {
    super(GRID_CONTAINER_IMG_SRC, GRID_CONTAINER_STYLE, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH, START_X, START_Y);
  }

  init(position, value, mode) {
    this.x = position.x;
    this.y = position.y;
    console.info("this.x:" + this.x);
    console.info("this.y:" + this.y);
    this.value = value || 2;
    this.previousPosition = null;// 滑块上一坐标点
    this.mergedFrom = null;
    this.mode = mode || 1;// 滑块模式(0:普通；1:新生成；2:合并；3:滑动)

    this.initGridAnimation();
  }

  initGridAnimation() {
    // 滑块模式(0:普通；1:新生成；2:合并；3:滑动)
    switch (this.mode) {
      case 0:
        break;
      case 1:
        this.initGridAnimation_new();
        break;
      case 2:
        this.initGridAnimation_merged();
        break;
      case 3:
        this.initGridAnimation_move();
        break;
      default:
        break;
    }
  }

  initGridAnimation_move() {
    let frames = [];

    if (!this.previousPosition) {
      return;
    }

    let offsetX = this.previousPosition.x - this.x;
    let offsetY = this.previousPosition.y - this.y;

    let dx = offsetX / 20;
    let dy = offsetY / 20;

    for (let i = 0; i <= 20; i++) {
      frames.push(new TileMetadata(this.value,
        this.num_color(this.value),
        GRID_CELL_WIDTH,
        GRID_CELL_WIDTH,
        START_X + this.leftpad(this.x) + dx * i,
        START_Y + this.toppad(this._t) + dy * i));
    }
    this.initFrames(frames);
  }

  initGridAnimation_merged() {
    let frames = [];

    for (let i = 0; i < 10; i++) {
      frames.push(new TileMetadata(this.value,
        this.num_color(this.value),
        GRID_CELL_WIDTH + i * 2,
        GRID_CELL_WIDTH + i * 2,
        START_X + this.leftpad(this.x) - i,
        START_Y + this.toppad(this.y) - i));
    }
    for (let i = 9; i >= 0; i--) {
      frames.push(new TileMetadata(this.value,
        this.num_color(this.value), GRID_CELL_WIDTH + i * 2,
        GRID_CELL_WIDTH + i * 2,
        START_X + this.leftpad(this.x) - i,
        START_Y + this.toppad(this.y) - i));
    }
    this.initFrames(frames);
  }

  initGridAnimation_new() {
    let frames = [];

    for (let i = 0; i < 10; i++) {
      frames.push(new TileMetadata(this.value,
        this.num_color(this.value),
        GRID_CELL_WIDTH + i * 2,
        GRID_CELL_WIDTH + i * 2,
        START_X + this.leftpad(this.x) - i,
        START_Y + this.toppad(this.y) - i));
    }
    for (let i = 9; i >= 0; i--) {
      frames.push(new TileMetadata(this.value,
        this.num_color(this.value),
        GRID_CELL_WIDTH + i * 2,
        GRID_CELL_WIDTH + i * 2,
        START_X + this.leftpad(this.x) - i,
        START_Y + this.toppad(this.y) - i));
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

  render(ctx) {
    // 有动画帧在播放，则不绘制正常模式
    if (this.isPlaying) {
      return;
    }

    this.fillRoundRect(ctx,
      START_X + this.leftpad(this.x),
      START_Y + this.leftpad(this.y),
      GRID_CELL_WIDTH,
      GRID_CELL_WIDTH,
      GRID_CELL_RADIUS,
      this.num_color(this.value));

    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "bold 24px Arial";
    ctx.fillText(this.value,
      START_X + this.leftpad(this.x) + GRID_CELL_WIDTH / 2,
      START_Y + this.toppad(this.y) + GRID_CELL_WIDTH / 2)
    ctx.closePath();
  }

  // 每一帧更新滑块位置
  update() {
    // this.y += this[__.speed];

    // // 对象回收
    // if (this.y > window.innerHeight + this.height) {
    //   databus.removeEnemey(this)
    // }
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
