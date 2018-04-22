import Sprite from '../base/sprite.js'

const BG_IMG_SRC = ''
const BG_STYLE = '#e2eaef'
const BG_WIDTH = window.innerWidth
const BG_HEIGHT = window.innerHeight
const BG_X = 0
const BG_Y = 0

/**
 * 游戏背景类
 * 提供update和render函数实现有动画功能的背景
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_STYLE, BG_WIDTH, BG_HEIGHT, BG_X, BG_Y);
    this.render(ctx);
  }

  update(ctx) {
    
  }

  /**
   * 背景重绘函数
   */
  render(ctx){
    // 整个画布背景
    ctx.save();
    ctx.fillStyle = BG_STYLE;
    ctx.fillRect(BG_X, BG_Y, BG_WIDTH, BG_HEIGHT);
    ctx.restore();
  }
} 
