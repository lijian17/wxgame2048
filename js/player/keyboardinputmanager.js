
/**
 * 键盘输入管理器
 */
export default class KeyboardInputManager {
  constructor(ctx) {
    this.events = {};
    if (window.navigator.msPointerEnabled) {
      /*Events for IE only*/
      this.eventTouchstart = "MSPointerDown";
      this.eventTouchmove = "MSPointerMove";
      this.eventTouchend = "MSPointerUp"
    } else {
      /*Events for non-IE or IE without msPointerEnabled*/
      this.eventTouchstart = "touchstart";
      this.eventTouchmove = "touchmove";
      this.eventTouchend = "touchend"
    }
    this.listen()
  }

  /**
   * 添加事件到事件管理器
   * @param {Object} event 事件
   * @param {Object} callback 事件触发时的回调
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
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
        callback(data)
      })
    }
  }

  /**
   * 事件监听
   */
  listen() {
    var self = this;
    // var map = {
    //   38: 0,
    //   39: 1,
    //   40: 2,
    //   37: 3,
    //   75: 0,// K
    //   76: 1,// L
    //   74: 2,// J
    //   72: 3,// H
    //   87: 0,// W
    //   68: 1,// D
    //   83: 2,// S
    //   65: 3// A
    // };
    // document.addEventListener("keydown", function (event) {
    //   var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    //   var mapped = map[event.which];
    //   if (!modifiers) {
    //     if (mapped !== undefined) {
    //       event.preventDefault();
    //       self.emit("move", mapped)
    //     }
    //   }
    //   // 82:R键, 重新开始
    //   if (!modifiers && event.which === 82) {
    //     self.restart.call(self, event)
    //   }
    // });
    // 按钮绑定事件(如果PC机则绑定click事件，如果移动设备则绑定touch事件)
    // this.bindButtonPress(".retry-button", this.restart);// 再来一次
    // this.bindButtonPress(".restart-button", this.restart);// 重新开始
    // this.bindButtonPress(".keep-playing-button", this.keepPlaying);// 继续玩
    // 以下是简单滑动事件封装
    var touchStartClientX, touchStartClientY;
    var gameContainer = document.getElementsByClassName("game-container")[0];
    gameContainer.addEventListener(this.eventTouchstart, function (event) {
      if (!window.navigator.msPointerEnabled && event.touches.length > 1 || event.targetTouches > 1) {
        return
      }
      if (window.navigator.msPointerEnabled) {
        touchStartClientX = event.pageX;
        touchStartClientY = event.pageY
      } else {
        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY
      }
      event.preventDefault()
    });
    gameContainer.addEventListener(this.eventTouchmove, function (event) {
      event.preventDefault()
    });
    gameContainer.addEventListener(this.eventTouchend, function (event) {
      if (!window.navigator.msPointerEnabled && event.touches.length > 0 || event.targetTouches > 0) {
        return
      }
      var touchEndClientX, touchEndClientY;
      if (window.navigator.msPointerEnabled) {
        touchEndClientX = event.pageX;
        touchEndClientY = event.pageY
      } else {
        touchEndClientX = event.changedTouches[0].clientX;
        touchEndClientY = event.changedTouches[0].clientY
      }
      var dx = touchEndClientX - touchStartClientX;
      var absDx = Math.abs(dx);
      var dy = touchEndClientY - touchStartClientY;
      var absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) > 10) {
        self.emit("move", absDx > absDy ? dx > 0 ? 1 : 3 : dy > 0 ? 2 : 0)
      }
    })
  }

  /**
   * 重新开始
   * @param {Object} event
   */
  restart(event) {
    event.preventDefault();
    this.emit("restart")
  }

  /**
   * 继续玩
   * @param {Object} event
   */
  keepPlaying(event) {
    event.preventDefault();
    this.emit("keepPlaying")
  }

  /**
   * 按钮绑定事件(如果PC机则绑定click事件，如果移动设备则绑定touch事件)
   * @param {Object} selector
   * @param {Object} fn
   */
  bindButtonPress(selector, fn) {
    var button = document.querySelector(selector);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this))
  }
}