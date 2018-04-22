
let instance

/**
 * 数据存储管理器
 */
export default class LocalStorageManager {
  constructor() {
    if (instance) {
      return instance
    }

    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState";
    var supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : window.fakeStorage

    instance = this
  }

  /**
   * 测试系统浏览器是否支持localStorage存储
   */
  localStorageSupported() {
    var testKey = "test";
    var storage = window.localStorage;
    try {
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 获取历史最高分
   */
  getBestScore() {
    return this.storage.getItem(this.bestScoreKey) || 0
  }

  /**
   * 设置历史最高分
   * @param {Object} score
   */
  setBestScore(score) {
    this.storage.setItem(this.bestScoreKey, score)
  }

  /**
   * 获取游戏状态
   */
  getGameState() {
    var stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null
  }

  /**
   * 将游戏状态数据序列化存储到本地数据库
   * @param {Object} gameState
   */
  setGameState(gameState) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState))
  }

  /**
   * 清除本地数据库记录的游戏状态数据
   */
  clearGameState() {
    this.storage.removeItem(this.gameStateKey)
  }
}