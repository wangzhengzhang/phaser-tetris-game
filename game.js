// 一个简易的 Phaser 俄罗斯方块游戏
class TetrisScene extends Phaser.Scene {
  preload() {
    this.load.audio("click", "assets/sounds/click.mp3");
    this.load.audio("score", "assets/sounds/score.mp3");
    this.load.audio("broken", "assets/sounds/broken.mp3");
  }
  constructor() {
    super({ key: "TetrisScene" });
    this.grid = [];
    this.tetromino = null;
    this.score = 0;
    this.tetrominoShapes = [
      [[1, 1, 1, 1]], // I
      [
        [1, 1],
        [1, 1],
      ], // O
      [
        [0, 1, 0],
        [1, 1, 1],
      ], // T
      [
        [1, 0, 0],
        [1, 1, 1],
      ], // J
      [
        [0, 0, 1],
        [1, 1, 1],
      ], // L
      [
        [1, 1, 0],
        [0, 1, 1],
      ], // S
      [
        [0, 1, 1],
        [1, 1, 0],
      ], // Z
    ];
    this.colors = [
      0x00ffff, 0xffff00, 0xaa00ff, 0x0000ff, 0xffa500, 0x00ff00, 0xff0000,
    ];
    this.gridWidth = GRID_WIDTH;
    this.gridHeight = GRID_HEIGHT;
    this.cellSize = CELL_SIZE;
    this.dropTime = 500;
    this.lastDrop = 0;
    this.gameOver = false;

    this.MAX_LEVEL = 10;
    this.SCORE_PER_LEVEL = 100; // 每升一级 dropTime - 10;
    this.level = 1;
  }

  checkLevelUp() {
    var newLevel = Math.ceil(this.score / this.SCORE_PER_LEVEL);
    if (newLevel > this.level) this.level = newLevel;
    if (this.level > this.MAX_LEVEL) {
      this.level = MAX_LEVEL;
      this.gameOver = true;
      showModelDialog("恭喜，胜利通关！", "您的得分：" + this.score);
    }
  }

  create() {
    this.blockGroup = this.add.group(); // 新增
    this.initGrid();
    this.spawnTetromino();
    this.input.keyboard.on("keydown", this.handleInput, this);
    this.gameOverText = this.add
      .text(
        (this.gridWidth * this.cellSize) / 2,
        (this.gridHeight * this.cellSize) / 2,
        "",
        { fontSize: "32px", color: "#fff" }
      )
      .setOrigin(0.5)
      .setDepth(10)
      .setVisible(false);

    // 添加场景边框
    const borderThickness = 1;
    const borderColor = 0xf0f0f0;
    const borderRect = this.add.rectangle(
      (this.gridWidth * this.cellSize) / 2,
      (this.gridHeight * this.cellSize) / 2,
      this.gridWidth * this.cellSize,
      this.gridHeight * this.cellSize
    );
    borderRect.setStrokeStyle(borderThickness, borderColor);
    borderRect.setDepth(20);

    // // 右侧显示按键说明
    // this.add.text(
    //     this.gridWidth * this.cellSize + 24,
    //     32,
    //     '操作说明：\n\n← →：左右移动\n↑：旋转\n↓：加速下落\nSpace：硬降\nEnter：重新开始',
    //     {
    //         fontSize: '15px',
    //         color: '#fff',
    //         fontFamily: 'Arial',
    //         wordWrap: { width: 150, useAdvancedWrap: true }
    //     }
    // ).setOrigin(0, 0).setDepth(30);

    // // 显示当前得分
    // this.scoreText = this.add.text(
    //     this.gridWidth * this.cellSize + 24,
    //     200,
    //     '当前得分: 0',
    //     {
    //         fontSize: '15px',
    //         color: '#fff',
    //         fontFamily: 'Arial'
    //     }
    // ).setOrigin(0, 0).setDepth(30);
  }

  update(time) {
    if (this.gameOver) return;
    if (time - this.lastDrop > this.dropTime) {
      this.moveTetromino(0, 1);
      this.lastDrop = time;
    }
    this.drawGrid();
    this.drawTetromino();
  }

  initGrid() {
    this.grid = [];
    for (let y = 0; y < this.gridHeight; y++) {
      let row = [];
      for (let x = 0; x < this.gridWidth; x++) {
        row.push(0);
      }
      this.grid.push(row);
    }
  }

  spawnTetromino() {
    const idx = Phaser.Math.Between(0, this.tetrominoShapes.length - 1);
    const shape = this.tetrominoShapes[idx];
    const color = this.colors[idx];
    const x = Math.floor(this.gridWidth / 2) - Math.floor(shape[0].length / 2);
    const y = 0;
    // 检查新方块是否能放下，不能则游戏结束
    if (!this.canMove(0, 0, shape, x, y)) {
      this.endGame();
      return;
    }
    this.tetromino = { shape, color, x, y };
  }

  moveTetromino(dx, dy) {
    if (this.gameOver) return;
    if (this.canMove(dx, dy, this.tetromino.shape)) {
      this.tetromino.x += dx;
      this.tetromino.y += dy;
    } else if (dy === 1) {
      this.mergeTetromino();
      this.clearLines();
      this.spawnTetromino();
    }
  }

  canMove(dx, dy, shape, baseX, baseY) {
    const x0 = baseX !== undefined ? baseX : this.tetromino.x;
    const y0 = baseY !== undefined ? baseY : this.tetromino.y;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          let nx = x0 + x + dx;
          let ny = y0 + y + dy;
          if (nx < 0 || nx >= this.gridWidth || ny >= this.gridHeight)
            return false;
          if (ny >= 0 && this.grid[ny][nx]) return false;
        }
      }
    }
    return true;
  }

  mergeTetromino() {
    const { shape, x, y, color } = this.tetromino;
    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[sy].length; sx++) {
        if (shape[sy][sx]) {
          let gx = x + sx;
          let gy = y + sy;
          if (
            gy >= 0 &&
            gy < this.gridHeight &&
            gx >= 0 &&
            gx < this.gridWidth
          ) {
            this.grid[gy][gx] = color;
          }
        }
      }
    }
  }

  clearLines() {
    let linesCleared = 0;
    for (let y = this.gridHeight - 1; y >= 0; y--) {
      if (this.grid[y].every((cell) => cell)) {
        this.grid.splice(y, 1);
        this.grid.unshift(new Array(this.gridWidth).fill(0));
        linesCleared++;
        y++;
      }
    }
    if (linesCleared > 0) {
      if (soundManager.enabled) this.sound.play("score");
      this.score += linesCleared * 1;
      this.checkLevelUp();
      //this.scoreText.setText(`当前得分: ${this.score}`);
      updateScoreUI(this.score, this.level);
    }
  }

  handleInput(event) {
    if (event.code === "Enter") {
      if (soundManager.enabled) this.sound.play("click");
      this.restartGame();
    }
    if (this.gameOver || !this.tetromino) return;
    if (event.code === "ArrowLeft") {
      if (soundManager.enabled) this.sound.play("click");
      this.moveTetromino(-1, 0);
    }
    if (event.code === "ArrowRight") {
      if (soundManager.enabled) this.sound.play("click");
      this.moveTetromino(1, 0);
    }
    if (event.code === "ArrowDown") {
      if (soundManager.enabled) this.sound.play("click");
      this.moveTetromino(0, 1);
    }
    if (event.code === "ArrowUp") {
      if (soundManager.enabled) this.sound.play("click");
      this.rotateTetromino();
    }
    if (event.code === "Space") {
      if (soundManager.enabled) this.sound.play("click");
      this.hardDrop();
    }
  }

  rotateTetromino() {
    const shape = this.tetromino.shape;
    const rotated = shape[0]
      .map((_, i) => shape.map((row) => row[i]))
      .reverse();
    if (this.canMove(0, 0, rotated)) {
      this.tetromino.shape = rotated;
    }
  }

  hardDrop() {
    while (this.canMove(0, 1, this.tetromino.shape)) {
      this.tetromino.y += 1;
    }
    this.moveTetromino(0, 1);
  }

  drawGrid() {
    this.blockGroup.clear(true, true); // 只清理方块
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.grid[y][x]) {
          this.blockGroup.add(
            this.add.rectangle(
              x * this.cellSize + this.cellSize / 2,
              y * this.cellSize + this.cellSize / 2,
              this.cellSize - 2,
              this.cellSize - 2,
              this.grid[y][x]
            )
          );
        }
      }
    }
  }

  drawTetromino() {
    if (!this.tetromino) return;
    const { shape, x, y, color } = this.tetromino;
    for (let sy = 0; sy < shape.length; sy++) {
      for (let sx = 0; sx < shape[sy].length; sx++) {
        if (shape[sy][sx]) {
          this.blockGroup.add(
            this.add.rectangle(
              (x + sx) * this.cellSize + this.cellSize / 2,
              (y + sy) * this.cellSize + this.cellSize / 2,
              this.cellSize - 2,
              this.cellSize - 2,
              color
            )
          );
        }
      }
    }
  }

  endGame() {
    this.gameOver = true;
    if (soundManager.enabled) this.sound.play("broken");
    // this.gameOverText.setText('    游戏结束\n按 Enter 重新开始');
    // this.gameOverText.setVisible(true);
    showModelDialog("失败！", "您的得分：" + this.score);
  }

  restartGame() {
    console.log("restart game.");
    closeModalDialog();
    this.gameOver = false;
    this.gameOverText.setVisible(false);
    this.blockGroup.clear(true, true); // 清理所有方块显示对象
    this.score = 0;
    this.level = 1;
    updateScoreUI(this.score, this.level);
    // this.scoreText.setText('当前得分: 0');
    this.initGrid();
    this.spawnTetromino();
  }

  // startGame() {
  //     closeModalDialog();
  //     this.scene.resume();
  //     this.gameOver = false;
  //     this.gameOverText.setVisible(false);
  // }
}

// 等待DOM完全就绪（确保容器元素存在）
// document.addEventListener("DOMContentLoaded", function () {

// });



function initGame()
{
    const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH, 
    height: GAME_HEIGHT,
    backgroundColor: "#333333",
    parent: "gameArea",
    scene: [TetrisScene],
  };
  const game = new Phaser.Game(config);
  window.game = game;
}
