import Tile from '../runtime/tile.js'
import DataBus from '../databus.js'

let databus = new DataBus()

export default class HTMLActuator {
  constructor(tileContainer, scoreContainer, bestContainer, messageContainer) {
    this.tileContainer = tileContainer;
    this.scoreContainer = scoreContainer;
    this.bestContainer = bestContainer;
    this.messageContainer = messageContainer;
    this.score = 0;
  }

  /**
   * 执行滑动动作
   * @param {Object} grid 网格场地
   * @param {Object} metadata 游戏相关元数据
   */
  actuate(grid, metadata) {
    var self = this;
    window.requestAnimationFrame(function () {
      // self.clearContainer(self.tileContainer);// 先清理展示控件数据
      grid.cells.forEach(function (column) {
        column.forEach(function (cell) {
          if (cell) {
            self.addTile(cell)
          }
        })
      });
      self.updateScore(metadata.score);
      self.updateBestScore(metadata.bestScore);
      var maxScore = 0;
      for (let i in grid.cells) {
        for (let j in grid.cells[i]) {
          if (grid.cells[i][j]) {
            maxScore = maxScore > grid.cells[i][j].value ? maxScore : grid.cells[i][j].value
          }
        }
      }
      // 游戏是否结束
      if (metadata.terminated) {
        if (metadata.over) {
          self.message(false, maxScore)
        } else if (metadata.won) {
          self.message(true)
        }
      }
    })
  }

  // 继续游戏
  continueGame() {
    this.clearMessage();
  }

  /**
   * 清空容器
   * @param {Object} container 要被清理的容器
   */
  clearContainer(container) {
    container.update();
  }

  /**
   * 清空容器
   * @param {Object} container 要被清理的容器
   */
  clearTileContainer(tileContainer) {
    for(tile in tileContainer) {
      databus.removeTile(tile);
    }
  }

  /**
   * 添加滑块
   * @param {Object} tile
   */
  addTile(tile) {
    var self = this;
    var position = tile.previousPosition || {
      x: tile.x,
      y: tile.y
    }
    // var positionClass = this.positionClass(position);
    // // 样式列表：滑块样式、滑块数值样式、滑块坐标位置样式
    // var classes = ["tile", "tile-" + tile.value, positionClass];
    // // 添加特别的样式(滑块数字内容变多需要相应调整字体大小)
    // if (tile.value > 2048) classes.push("tile-super");
    // this.applyClasses(wrapper, classes);
    // inner.classList.add("tile-inner");
    // inner.textContent = tile.value;

    let _tile = databus.pool.getItemByClass('tile', Tile);

    // 如果自定义了滑块显示文本，则使用之
    // if (window.my_list) {
    //   inner.textContent = my_list[tile.value] || tile.value;
    //   if (inner.textContent.substring(0, 4) == "http") {
    //     inner.innerHTML = '<img src="' + inner.textContent + '" class="tile-inner"/>'
    //   }
    //   // 根据文字数量，动态计算文字大小
    //   inner.style.fontSize = 1 / inner.textContent.length * 90 + "px";
    //   inner.style.fontFamily = ""
    // }
    if (tile.previousPosition) {
      // 上一个坐标点
      // window.requestAnimationFrame(function () {
      //   classes[2] = self.positionClass({
      //     x: tile.x,
      //     y: tile.y
      //   });
      //   self.applyClasses(wrapper, classes)
      // })
      _tile.init(position, tile.value, 3);
    } else if (tile.mergedFrom) {
      // 滑块合并
      // classes.push("tile-merged");
      // this.applyClasses(wrapper, classes);
      // tile.mergedFrom.forEach(function (merged) {
      //   self.addTile(merged)
      // })
      _tile.init(position, tile.value, 2);
    } else {
      // 添加新的滑块
      // classes.push("tile-new");
      // this.applyClasses(wrapper, classes)
      _tile.init(position, tile.value, 1);
    }
    // 将滑块文本容器添加进滑块容器，最后将滑块容器添加进滑块组容器
    // wrapper.appendChild(inner);
    // this.tileContainer.appendChild(wrapper)
    databus.tiles.push(_tile);
  }

  /**
   * 设置样式
   * @param {Object} element 要被设置样式的元素
   * @param {Object} classes 样式集合
   */
  applyClasses(element, classes) {
    element.setAttribute("class", classes.join(" "))
  }

  /**
   * 使正常化坐标位置
   * @param {Object} position
   */
  normalizePosition(position) {
    return {
      x: position.x + 1,
      y: position.y + 1
    }
  }

  /**
   * 滑块坐标点的样式
   * @param {Object} position
   */
  positionClass2(position) {
    position = this.normalizePosition(position);
    return "tile-position-" + position.x + "-" + position.y
  }

  /**
   * 更新当前分数
   * @param {Object} score
   */
  updateScore(score) {
    this.clearContainer(this.scoreContainer);
    var difference = score - this.score;// 计算出增加的分数
    this.score = score;
    this.scoreContainer.score = this.score;
    // 添加一个增加分数的动画效果
    // if (difference > 0) {
    //   var addition = document.createElement("div");
    //   addition.classList.add("score-addition");
    //   addition.textContent = "+" + difference;
    //   this.scoreContainer.appendChild(addition)
    // }
  }

  /**
   * 更新历史最高分
   * @param {Object} bestScore
   */
  updateBestScore(bestScore) {
    this.bestContainer.score = bestScore
  }

  /**
   * 游戏结束时提示语(网格已满游戏结束，如果滑块最大4096则won,否则over)
   * @param {Object} won
   * @param {Object} score
   */
  message(won, score) {
    var type = won ? "game-won" : "game-over";
    var message = won ? "你赢了！54大学生提示您：包养小三需谨慎，一招回到解放前。" : my_mark[score] || "Game over!";
    switch (score) {
      case 32:
        sharemessage = wx_relay_desc = "今天还要写100000行代码……我是小程序员，写累了我来到54大学生玩了一把游戏!";
        break;
      case 64:
        sharemessage = wx_relay_desc = "老板您的咖啡，摩卡不加奶油，趁热。我是小经理，我在54大学生玩着游戏喝着咖啡，是不是有些小惬意，嘎嘎。。。";
        break;
      case 128:
        sharemessage = wx_relay_desc = "最近肾有点跟不上了……我是总经理，工作真的很累，工作之余我来到54大学生玩了一把小游戏";
        break;
      case 256:
        sharemessage = wx_relay_desc = "人生理想总算完成一个啦！我是CEO，我高兴的来到54大学生玩了一把小游戏，呵呵!";
        break;
      case 512:
        sharemessage = wx_relay_desc = "谁把我的蓝色小药丸藏起来了？我在54大学生的游戏频道迎风逆袭，爽";
        break;
      case 1024:
        sharemessage = wx_relay_desc = "江山美人我都要……我在54大学生的游戏频道迎风逆袭，爽";
        break;
      case 2048:
        sharemessage = wx_relay_desc = "喂，苍老师在么？我们一起在54大学生游戏频道打一局小游戏，爽一把吧!";
        break;
      case 4096:
        sharemessage = wx_relay_desc = "我刚刚被举报，因为我包小三。各位54大学生的小伙伴们千万别学我啊啊啊!!!";
        break
    }
    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName("p")[0].textContent = message
  }

  // 清理游戏描述消息，游戏继续
  clearMessage() {
    // TODO 待处理
    // this.messageContainer.classList.remove("game-won");
    // this.messageContainer.classList.remove("game-over");
  }
}