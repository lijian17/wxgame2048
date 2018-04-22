import Pool from '../js/base/pool.js'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;

    this.pool = new Pool();

    this.reset();
  }

  /**
   * 游戏初始化设置
   */
  reset(){
    this.frame = 0;// 游戏帧
    this.score = 0;// 当前得分
    this.bestScore = 0;// 历史记录
    this.grids = [];// 网格
    this.tiles = [];// 滑块
    this.animations = []; // 滑块动画
    this.gameOver = false;// 标记游戏是否结束
  }

  /**
   * 回收网格，进入对象池
   * 此后不进入帧循环
   * @param grid 网格对象
   */
  removeGrid(grid){
    let temp = this.grids.shift();

    temp.visible = false;

    this.pool.recover('grid', grid);
  }

  /**
   * 回收滑块，进入对象池
   * 此后不进入帧循环
   * @parma tile 滑块对象
   */
  removeTile(tile){
    let temp = this.tiles.shift();

    temp.visible = false;

    this.pool.recover('tile', tile);
  }
}