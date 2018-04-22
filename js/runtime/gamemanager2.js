import Sprite from '../base/sprite.js'
let instance

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 游戏网格绘制起始坐标
// const START_X = screenWidth * 0.2 / 2
// const START_Y = screenHeight * 0.2
const START_X = 0
const START_Y = 0

// 游戏网格背景样式及宽高
const GRID_CONTAINER_STYLE = '#a7b6c5'
const GRID_CONTAINER_WIDTH = screenWidth * 0.8
const GRID_CONTAINER_RADIUS = GRID_CONTAINER_WIDTH * 1 / 75

// 游戏网格样式及宽高
// 滑块宽，滑块间间隙，滑块的圆角半径
const GRID_CELL_STYLE = 'rgba(238, 228, 218, 0.35)'
const GRID_CELL_WIDTH = GRID_CONTAINER_WIDTH * 1 / 5
const GRID_CELL_SPACE = GRID_CONTAINER_WIDTH * 1 / 25
const GRID_CELL_RADIUS = GRID_CONTAINER_WIDTH * 1 / 75

/**
* 游戏管理器
*/
export default class GameManager extends Sprite{
  constructor(ctx, size) {
    super(GRID_CONTAINER_STYLE, GRID_CONTAINER_WIDTH, GRID_CONTAINER_WIDTH);
    if (instance) {
      return instance;
    }
    this.size = size;
    this.startTiles = 2;
    this.restart(ctx);
    this.ctx = ctx;

    instance = this
  }

  update(ctx){

  }

  // 重新开始
  restart(ctx) {
    this.restartArr();
    this.addnum(ctx);
  }

  restartArr(){
    this.board = new Array();
    for (var i = 0; i < this.size; i++) {
      this.board[i] = new Array();
      for (var j = 0; j < this.size; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  boardarr() {
    var arr = [];
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.board[i][j] == 0) {
          arr.push(j + "-" + i);
        }
      }
    }
    return arr;
  }

  addnum(ctx) {
    var arr = this.boardarr();
    if (arr.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: 'game over!',
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    var randnum = Math.floor(Math.random() * arr.length);
    var point = arr[randnum];

    var m = parseInt(point.substr(0, 1));
    var n = parseInt(point.substr(2, 1));
    var num = Math.random() >= 0.5 ? 4 : 2;
    this.board[n][m] = num;
    this.fillRoundRect(ctx, this.leftpad(m), this.toppad(n), GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, this.num_color(num));
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "bold 3rem Arial";
    ctx.fillText(num, this.leftpad(m) + GRID_CELL_WIDTH / 2, this.toppad(n) + GRID_CELL_WIDTH / 2)
    ctx.closePath();
  }

  num_color(n) {
    return "rgb(" + (240 - 10 * n) + "," + (250 - 5 * n) + "," + (250 - n) + ")"
  }

  leftpad(m) {
    return (m + 1) * GRID_CELL_SPACE + GRID_CELL_WIDTH * m;
  }

  toppad(n) {
    return (n + 1) * GRID_CELL_SPACE + GRID_CELL_WIDTH * n;
  }

  //-------------------------------------------------------------------------------------------------------------------
  up() {
    for (var i = 1; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookup(j, i);
        }
      }
    }
  }

  down() {
    for (var i = 2; i >= 0; i--) {//从下面开始遍历！
      for (var j = 0; j < this.size; j++) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookdown(j, i);
        }
      }
    }
  }

  left() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 1; j < this.size; j++) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookleft(j, i);
        }
      }
    }
  }

  right() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 2; j >= 0; j--) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookright(j, i);
        }
      }
    }
  }

  move(m, n, num, M, N) {
    this.fillRoundRect(this.ctx, this.leftpad(M), this.toppad(N), GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, this.num_color(num));
    if (num != 0) {
      this.text(M, N, num);
    }
    this.board[N][M] = num;
    this.fillRoundRect(this.ctx, this.leftpad(m), this.toppad(n), GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, this.num_color(0));
    this.board[n][m] = 0;
  }

  text(m, n, num) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"
    this.ctx.font = "bold 3rem Arial";
    this.ctx.fillText(num, this.leftpad(m) + this.w / 2, this.toppad(n) + this.w / 2)
    this.ctx.closePath();
  }

  //移动函数，遍历若前
  lookup(j, i) {
    for (var y = 0; y < i; y++) {
      if (this.board[y][j] == 0) {//j表示列
        if (this.emptyup(j, y, i)) {
          this.move(j, i, this.board[i][j], j, y);
          return;
        }
      } else if (this.board[y][j] == this.board[i][j]) {
        if (this.emptyup(j, y, i)) {
          this.addscores += 2 * this.board[i][j];
          this.move(j, i, 2 * this.board[i][j], j, y);
          // scores.innerHTML = this.addscores;
        }
      }
    }
  }

  lookdown(j, i) {
    for (var y = 3; y > i; y--) {
      if (this.board[y][j] == 0) {//j表示列
        if (this.emptydown(j, y, i)) {
          this.move(j, i, this.board[i][j], j, y);
          return;
        }
      } else if (this.board[y][j] == this.board[i][j]) {
        if (this.emptydown(j, y, i)) {
          this.addscores += 2 * this.board[i][j];
          this.move(j, i, 2 * this.board[i][j], j, y);
          // scores.innerHTML = this.addscores;
        }
      }

    }
  }

  lookleft(j, i) {//i不变
    for (var y = 0; y < j; y++) {
      if (this.board[i][y] == 0) {//j表示列
        if (this.emptyleft(y, i, j)) {
          this.move(j, i, this.board[i][j], y, i);
          return;
        }

      } else if (this.board[i][y] == this.board[i][j]) {
        if (this.emptyleft(y, i, j)) {
          this.addscores += 2 * this.board[i][j];
          this.move(j, i, 2 * this.board[i][j], y, i);
          // scores.innerHTML = this.addscores;
        }
      }
    }
  }

  //i不变
  lookright(j, i) {
    for (var y = 3; y > j; y--) {
      if (this.board[i][y] == 0) {//j表示列
        if (this.emptyright(y, i, j)) {
          this.move(j, i, this.board[i][j], y, i);
          return;
        }

      } else if (this.board[i][y] == this.board[i][j]) {
        if (this.emptyright(y, i, j)) {
          this.addscores += 2 * this.board[i][j];
          this.move(j, i, 2 * this.board[i][j], y, i);
          // scores.innerHTML = this.addscores;
        }
      }
    }
  }

  emptyup(j, y, i) {//j表示列，y表示行
    if (y + 1 < i) {
      for (var y1 = y + 1; y1 < i; y1++) {//对于前面某个格
        if (this.board[y1][j] != 0) {//注意行、列顺序
          return false;
        }
        return true;
      };

    } else {
      return true;
    }

  }

  emptydown(j, y, i) {//j表示列，y表示行
    if (y > i + 1) {
      for (var y1 = i + 1; y1 < y; y1++) {//对于前面某个格
        if (this.board[y1][j] != 0) {//注意行、列顺序
          return false;
        }
        return true;
      };
    } else {
      return true;
    }
  }

  emptyleft(y, i, j) {//j表示列，y表示行
    if (y + 1 < j) {
      for (var y1 = y + 1; y1 < j; y1++) {//对于前面某个格
        if (this.board[i][y1] != 0) {//注意行、列顺序
          return false;
        }
        return true;
      };
    } else {
      return true;
    }
  }

  emptyright(y, i, j) {//j表示列，y表示行
    if (y > j + 1) {
      for (var y1 = j + 1; y1 < y; y1++) {//对于前面某个格
        if (this.board[i][y1] != 0) {//注意行、列顺序
          return false;
        }
        return true;
      };
    } else {
      return true;
    }
  }

}