import BackGround from './runtime/background.js'
import GameManager from './runtime/gamemanager.js'
import Logo from './runtime/logo.js'
import Scores from './runtime/scores.js'

let ctx = canvas.getContext('2d')

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
    this.aniId = 0

    this.restart();
    // 事件绑定
    this.initEvent();
  }

  restart() {
    if (this.bg == null) {
      this.bg = new BackGround(ctx);
    } else {
      this.bg.update(ctx);
    }
    if (this.logo == null) {
      this.logo = new Logo(ctx);
    } else {
      this.logo.update(ctx);
    }
    if (this.scores == null) {
      this.scores = new Scores(ctx);
    } else {
      this.scores.update(0);
    }
    if (this.gamemanager == null) {
      this.gamemanager = new GameManager(ctx, TILE_SIZE);
    } else {
      this.gamemanager.restart(ctx);
    }
  }

  update() {
    this.bg.update(ctx);
    this.gamemanager.update(ctx);
  }

  initEvent() {
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.x0 = e.touches[0].clientX / ratio;
      this.y0 = e.touches[0].clientY / ratio;
      return false;
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      var X = e.changedTouches[0].clientX / ratio;
      var Y = e.changedTouches[0].clientY / ratio;
      var addX = X - this.x0;
      var addY = Y - this.y0;
      var percent = Math.abs(addX) / Math.abs(addY) >= 1 ? true : false;
      if (Math.abs(addX) < W / 50 && Math.abs(addY) < W / 50) {
        return;
      };
      let isGameTerminated = true;
      if (- addX > W / 50 && percent) {
        this.update();
        ctx.save();
        this.gamemanager.left();
        isGameTerminated = this.gamemanager.addnum(ctx);
        ctx.restore();
        console.log(addX, addY, "向左")
      } else if (addX > W / 50 && percent) {
        this.update();
        ctx.save();
        this.gamemanager.right();
        isGameTerminated = this.gamemanager.addnum(ctx);
        ctx.restore();
        console.log(addX, addY, "向右")
      } else if (- addY > W / 50 && !percent) {
        this.update();
        ctx.save();
        this.gamemanager.up();
        isGameTerminated = this.gamemanager.addnum(ctx);
        ctx.restore();
        console.log(addX, addY, "向上")
      } else if (addY > W / 50 && !percent) {
        this.update();
        ctx.save();
        this.gamemanager.down();
        isGameTerminated = this.gamemanager.addnum(ctx);
        ctx.restore();
        console.log(addX, addY, "向下")
      }
      this.logo.update(ctx);
      this.scores.update(this.gamemanager.getScores());
      if (isGameTerminated) {
        wx.showModal({
          title: '温馨提示',
          content: 'game over!',
          showCancel: true,
          cancelText: '下次再战',
          confirmText: '再来一局',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              this.restart();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }.bind(this),
          fail: function (res) { console.log('用户点击fail'); },
          complete: function (res) { console.log('用户点击complete'); },
        });
      }
      console.table(this.gamemanager.board);
    });
  }
}