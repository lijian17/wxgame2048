import Sprite from './sprite.js'
import DataBus from '../databus.js'

let databus = new DataBus();

const __ = {
  timer: Symbol('timer')
}

export default class Animation extends Sprite {
  constructor(imgSrc = '', style = '', width = 0, height = 0, x = 0, y = 0) {
    super(imgSrc, style, width, height, x, y)

    // 当前动画是否播放中
    this.isPlaying = false;

    // 动画是否需要循环播放
    this.loop = false;

    // 每一帧的时间间隔
    this.interval = 1000 / 60;

    // 帧定时器
    this[__.timer] = null;

    // 当前播放的帧
    this.index = -1;

    // 总帧数
    this.count = 0;

    // 帧图片集合
    this.imgList = [];

    /**
     * 推入到全局动画池里面
     * 便于全局绘图的时候遍历和绘制当前动画帧
     */
    databus.animations.push(this);
  }

  /**
   * 初始化帧动画的所有帧
   * 为了简单，只支持一个帧动画
   */
  initFrames(imgList) {
    imgList.forEach((imgList) => {
      let img = new Image();
      img.src = imgSrc;

      this.imgList.push(img);
    });

    this.count = imgList.length;
  }

  // 将播放中的帧绘制到canvas上
  aniRender(ctx) {
    ctx.drawImage(this.imgList[this.index], this.spX, this.spY, this.width * 1.2, this.height * 1.2);
  }

  /**
   * 播放预定的帧动画
   * @param index 当前帧
   * @param loop 是否循环播放
   */
  playAnimation(index = 0, loop = false) {
    // 动画播放的时候精灵图不再展示，播放帧动画的具体帧
    this.visible = false;

    this.isPlaying = true;
    this.pool = pool;

    this.index = index;

    if (this.interval > 0 && this.count) {
      this[__.timer] = setInterval(this.frameLoop.bind(this), this.interval);
    }
  }

  // 停止帧动画播放
  stop() {
    this.isPlaying = false;

    if (this[__.timer]) {
      clearInterval(this[__.timer]);
    }
  }

  // 帧遍历
  frameLoop() {
    this.index++;

    if (this.index > this.count - 1) {
      if (this.loop) {
        this.index = 0;
      } else {
        this.index--;
        this.stop();
      }
    }
  }
}