import Sprite from '../base/sprite.js'
let instance

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 游戏网格绘制起始坐标
const START_X = screenWidth * 0.2 / 2
const START_Y = screenHeight * 0.2

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
    this.ctx = ctx;
    this.restart(ctx);
    this.scores = 0; 
    this.addscores = 0;
    
    instance = this
  }

  update(ctx){

  }

  // 重新开始
  restart(ctx) {
    this.scores = 0;
    this.addscores = 0;
    this.restartArr();
    // this.drawGrid();
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
      return true;
    }
    var randnum = Math.floor(Math.random() * arr.length);
    var point = arr[randnum];

    var m = parseInt(point.substr(0, 1));
    var n = parseInt(point.substr(2, 1));
    var num = Math.random() >= 0.5 ? 4 : 2;
    this.board[n][m] = num;
    this.fillRoundRect(ctx, START_X + this.leftpad(m), START_Y + this.toppad(n), GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, this.num_color(num));
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"//得写在font之前
    ctx.font = "bold 24px Arial";
    ctx.fillText(num, START_X + this.leftpad(m) + GRID_CELL_WIDTH / 2, START_Y + this.toppad(n) + GRID_CELL_WIDTH / 2)
    ctx.closePath();

    return false;// 表明还可以继续移动滑块，游戏未结束
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

  //-------------------------------------------------------------------------------------------------------------------
  up() {
    for (var i = 1; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookup(j, i);
        }
      }
    }
    this.drawGrid();
  }

  down() {
    for (var i = 2; i >= 0; i--) {//从下面开始遍历！
      for (var j = 0; j < this.size; j++) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookdown(j, i);
        }
      }
    }
    this.drawGrid();
  }

  left() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 1; j < this.size; j++) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookleft(j, i);
        }
      }
    }
    this.drawGrid();
  }

  right() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 2; j >= 0; j--) {//1,3
        if (this.board[i][j] != 0) {//(j, i)
          this.lookright(j, i);
        }
      }
    }
    this.drawGrid();
  }

  move(m, n, num, M, N) {
    this.fillRoundRect(this.ctx, START_X + this.leftpad(M), START_Y + this.toppad(N), GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, this.num_color(num));
    if (num != 0) {
      this.text(M, N, num);
    }
    this.board[N][M] = num;
    this.fillRoundRect(this.ctx, START_X + this.leftpad(m), START_Y
     + this.toppad(n), GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, this.num_color(0));
    this.board[n][m] = 0;
  }

  text(m, n, num) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillText(num, START_X + this.leftpad(m) + this.w / 2, START_Y + this.toppad(n) + this.w / 2)
    this.ctx.closePath();
  }

  drawGrid() {
    for (var m = 0; m < this.size; m++) {
      for (var n = 0; n < this.size; n++) {
        this.drawTile(n, m, this.board[m][n]);
      }
    }
  }

  drawTile(m, n, num) {
    this.fillRoundRect(this.ctx, START_X + this.leftpad(m), START_Y + this.toppad(n), GRID_CELL_WIDTH, GRID_CELL_WIDTH, GRID_CELL_RADIUS, this.num_color(num));
    if (num == 0) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"//得写在font之前
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillText(num, START_X + this.leftpad(m) + GRID_CELL_WIDTH / 2, START_Y + this.toppad(n) + GRID_CELL_WIDTH / 2)
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
          this.scores = this.addscores;
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
          this.scores = this.addscores;
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
          this.scores = this.addscores;
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
          this.scores = this.addscores;
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

  getScores() {
    return this.scores;
  }

  getAddScores() {
    return this.addscores;
  }
}