
const width = window.innerWidth
const ratio = window.devicePixelRatio
const W = width * 0.8

/**
 * 事件管理器
 */
export default class EventManager {
  constructor(grid, score) {
    this.grid = grid;
    this.score = score;
    this.isRestart = false;// 是否重新开始
    this.events = {};// 事件集合
    this.listen();
  }

  /**
   * 添加事件到事件管理器
   * @param {Object} event 事件
   * @param {Object} callback 事件触发时的回调
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * 事件触发向外发射处理数据
   * @param {Object} event
   * @param {Object} data
   */
  emit(event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(function (callback) {
        callback(data);
      })
    }
  }

  /**
   * 事件监听
   */
  listen() {
    this.touchstartHandler = this.touchstartEventHandler.bind(this);
    this.touchmoveHandler = this.touchmoveEventHandler.bind(this);
    this.touchendHandler = this.touchendEventHandler.bind(this);
    canvas.addEventListener('touchstart', this.touchstartHandler);
    canvas.addEventListener('touchmove', this.touchmoveHandler);
    canvas.addEventListener('touchend', this.touchendHandler);
  }

  /**
   * 事件绑定
   */
  touchstartEventHandler(e) {
    e.preventDefault();
    this.x0 = e.touches[0].clientX;
    this.y0 = e.touches[0].clientY;
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
    e.preventDefault();
    let X = e.changedTouches[0].clientX;
    let Y = e.changedTouches[0].clientY;

    if (this.score.isRestart(this.x0, this.y0) && this.score.isRestart(X, Y)) {
      console.log(this.x0, this.y0, X, Y, "重新开始");
      this.restart(e);
      return;
    }

    let addX = X - this.x0;
    let addY = Y - this.y0;
    let percent = Math.abs(addX) / Math.abs(addY) > 1 ? true : false;
    if (Math.abs(addX) < W / 50 && Math.abs(addY) < W / 50) {
      return;
    }
    if (-addX > W / 50 && percent) {
      console.log(addX, addY, "向左");
      this.emit('move', 1);
    } else if (addX > W / 50 && percent) {
      console.log(addX, addY, "向右");
      this.emit('move', 3);
    } else if (-addY > W / 50 && !percent) {
      console.log(addX, addY, "向上");
      this.emit('move', 0);
    } else if (addY > W / 50 && !percent) {
      console.log(addX, addY, "向下");
      this.emit('move', 2);
    }
  }

  /**
   * 重新开始
   * @param {Object} event
   */
  restart(event) {
    event.preventDefault();
    this.emit("restart");
  }

  /**
   * 继续玩
   * @param {Object} event
   */
  keepPlaying(event) {
    event.preventDefault();
    this.emit("keepPlaying");
  }

}