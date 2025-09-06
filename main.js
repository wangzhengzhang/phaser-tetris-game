document.addEventListener("keydown", function (event) {
  // console.log(event.keyCode == 32);
  // if (event.keyCode == 32 ) {
  //     event.stopPropagation();  // 阻止事件冒泡
  //     event.preventDefault();   // 阻止默认行为
  // }
});

// 按钮功能实现
let tetrisScene;
let gameInstance;

function restartGame() {
  if (event.pointerId < 0) return; // 点击鼠标时 1，键盘时 -1 ，阻止键盘事件

  enableButtons(0b011); // 启用暂停按钮，禁用开始按钮和重置按钮
  if (tetrisScene && typeof tetrisScene.restartGame === "function") {
    tetrisScene.restartGame();
  } else if (gameInstance) {
    gameInstance.scene.resume("TetrisScene");
  }
}

function togglePauseGame() {
  if (event.pointerId < 0) return; // 点击鼠标时 1，键盘时 -1，阻止键盘事件

  if (gameInstance) {
    //enableButtons(0b100); // 启用开始按钮，禁用暂停和重置按钮

    // 判断游戏当前状态
    if (!gameInstance.scene.isPaused("TetrisScene")) {
      gameInstance.scene.pause("TetrisScene");
      document.getElementById("pauseGame").textContent = "继续";
    } else {
      gameInstance.scene.resume("TetrisScene");
      document.getElementById("pauseGame").textContent = "暂停";
    }
  }
}
//   // 游戏失败结束
//   function gameOver(score) {
//     showModelDialog("失败！","您的得分：" + score);

//   }

//   // 游戏胜利
//   function gameWin(score) {
//     showModelDialog("恭喜，胜利通关！","您的得分：" + score);
//   }

function enableButtons(enableOption) {
  document.getElementById("newGame").disabled = !(enableOption & 0b001);
  document.getElementById("pauseGame").disabled = !(enableOption & 0b010);
}

function updateScoreUI(score, level) {
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  scoreManager.updateMaxScore(score);

}

// 等待 Phaser 游戏加载完成
window.addEventListener("DOMContentLoaded", function () {

  // 监听 Phaser 游戏实例和场景
  if (window.Phaser && window.game) {
    gameInstance = window.game;
    tetrisScene = gameInstance.scene.keys["TetrisScene"];
  }

  if (tetrisScene) return;
  else {
    // 兼容 index.js 里没有挂载到 window 的情况
    setTimeout(() => {
      if (window.game) {
        gameInstance = window.game;
        tetrisScene = gameInstance.scene.keys["TetrisScene"];
      }
    }, 500);
  }
  enableButtons(0b011); // 初始状态，启用开始和重置按钮，禁用暂停按钮
});
