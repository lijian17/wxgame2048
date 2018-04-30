import DataBus from './databus.js'
import BackGround from './runtime/background.js'
import Logo from './runtime/logo.js'
import Score from './runtime/score.js'
import Grid from './runtime/grid.js'
import Music from './runtime/music.js'
import Tile from './runtime/tile.js'
import StorageManager from './runtime/localstoragemanager.js'


let ctx = canvas.getContext('2d')
const databus = new DataBus()

const width = window.innerWidth
const height = window.innerHeight
const ratio = 1
const W = width * 0.8

// 滑块矩阵数量(4x4)
const ROW = 4;// 行
const COLUMN = 4;// 列

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0;

    this.restart();
  }

  restart() {
    databus.reset();

    canvas.removeEventListener('touchstart', this.touchstartHandler);
    canvas.removeEventListener('touchmove', this.touchmoveHandler);
    canvas.removeEventListener('touchend', this.touchendHandler);

    this.bg = new BackGround(ctx);
    this.logo = new Logo(ctx);
    this.score = new Score(ctx);
    this.grid = new Grid(ctx, ROW, COLUMN);
    // this.music = new Music();
    this.storageManager = new StorageManager();

    this.bindLoop = this.loop.bind(this);
    this.hasEventBind = false;

    if (!this.hasEventBind) {
      this.hasEventBind = true;
      this.touchstartHandler = this.touchstartEventHandler.bind(this);
      this.touchmoveHandler = this.touchmoveEventHandler.bind(this);
      this.touchendHandler = this.touchendEventHandler.bind(this);
      canvas.addEventListener('touchstart', this.touchstartHandler);
      canvas.addEventListener('touchmove', this.touchmoveHandler);
      canvas.addEventListener('touchend', this.touchendHandler);
    }

    // 清除上一层的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }

  /**
   * 滑块生成逻辑
   */
  tileGenerate() {
    new Tile(ctx, 0, 0);
  }

  /**
   * 事件绑定
   */
  touchstartEventHandler(e) {
    e.preventDefault();
    this.x0 = e.touches[0].clientX / ratio;
    this.y0 = e.touches[0].clientY / ratio;
    return false;
  }

  /**
   * 事件绑定
   */
  touchmoveEventHandler(e) {
    e.preventDefault();
  }

  /**
   * 事件绑定
   */
  touchendEventHandler(e) {
    console.log("touchendEventHandler");
    e.preventDefault();
    let X = e.changedTouches[0].clientX / ratio;
    let Y = e.changedTouches[0].clientY / ratio;
    let addX = X - this.x0;
    let addY = Y - this.y0;
    let percent = Math.abs(addX) / Math.abs(addY) > 1 ? true : false;
    if (Math.abs(addX) < W / 50 && Math.abs(addY) < W / 50) {
      return;
    }
    if (-addX > W / 50 && percent) {
      console.log(addX, addY, "向左");
    } else if (addX > W / 50 && percent) {
      console.log(addX, addY, "向右");
    } else if (-addY > W / 50 && !percent) {
      console.log(addX, addY, "向上");
    } else if (addY > W / 50 && !percent) {
      console.log(addX, addY, "向下");
    }
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.bg.render(ctx);
    this.logo.render(ctx);
    this.score.render(ctx);
    this.grid.render(ctx);
    databus.tiles.forEach((item) => { item.render(ctx) });

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx);
      }
    });

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.score.render(ctx);

      if (!this.hasEventBind) {
        this.hasEventBind = true;
        this.touchstartHandler = this.touchstartEventHandler.bind(this);
        this.touchmoveHandler = this.touchmoveEventHandler.bind(this);
        this.touchendHandler = this.touchendEventHandler.bind(this);
        canvas.addEventListener('touchstart', this.touchstartHandler);
        canvas.addEventListener('touchmove', this.touchmoveHandler);
        canvas.addEventListener('touchend', this.touchendHandler);
      }
    }

  }

  /**
   * 游戏逻辑更新主函数
   */
  update() {
    if (databus.gameOver) {
      return;
    }

    this.bg.update();
    this.logo.update();
    this.score.update(this.score.score++);
    this.grid.update();
    databus.tiles.forEach((item) => { item.update() });
  }

  loop() {
    databus.frame++;

    this.update();
    this.render();

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }
}