import DataBus from './databus.js'
import BackGround from './runtime/background.js'
import Logo from './runtime/logo.js'
import Score from './runtime/score.js'
import Grid from './runtime/grid.js'
import Music from './runtime/music.js'


let ctx = canvas.getContext('2d')
const databus = new DataBus()

const width = window.innerWidth
const height = window.innerHeight
const ratio = 1
const W = width * 0.8

// 滑块矩阵数量(4x4)
const TILE_SIZE = 4

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

    canvas.removeEventListener('touchstart touchmove touchend', this.touchHandler);

    this.bg = new BackGround(ctx);
    this.logo = new Logo(ctx);
    this.score = new Score(ctx);
    this.grid = new Grid(ctx);
    // this.music = new Music();
  }
}