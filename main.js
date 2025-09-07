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
// window.addEventListener("DOMContentLoaded", function () {

// });

// 为移动按钮添加按下和释放效果
function setupControlButtonEffects(button) {
  button.addEventListener("mousedown", () => {
    button.classList.add("control-btn-active");
  });
  button.addEventListener("mouseup", () => {
    button.classList.remove("control-btn-active");
  });
  button.addEventListener("mouseleave", () => {
    button.classList.remove("control-btn-active");
  });
  button.addEventListener("touchstart", () => {
    button.classList.add("control-btn-active");
  });
  button.addEventListener("touchend", () => {
    button.classList.remove("control-btn-active");
  });
}

function initMain() {
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

  // 跳转到主页之前先询问，避免误触。
  document.querySelectorAll('#goHomeLink').forEach(link => {
    link.addEventListener('click', function(e) {
      // 自定义提示信息，可根据链接动态生成
      const message = `确定要跳转到主页: ${this.href} 吗？`;
      
      // 如果用户取消，则阻止默认跳转行为
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  });

}

function goHome()
{

}
