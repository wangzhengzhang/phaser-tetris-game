// 音效控制 - 简化为只使用clickSound
const soundManager = {
  enabled: localStorage.getItem("tetris-sound-enabled") !== "false", // 默认开启音效

  // // 播放音效
  // play: function (key) {
  //   if (!this.enabled) return;

  //   switch (key) {
  //     case "click":
  //       if (clickSound) clickSound.play();
  //       break;
  //     case "score":
  //       if (scoreSound) scoreSound.play();
  //       break;
  //     // case "complete":
  //     //   if (completeSound) completeSound.play();
  //     //   break;
  //     // case "broken":
  //     //   if (brokenSound) brokenSound.play();
  //     //   break;
  //     default:
  //       break;
  //   }
  // },

  // 切换音效开关状态
  toggle: function () {
    this.enabled = !this.enabled;
    localStorage.setItem("tetris-sound-enabled", this.enabled);
    this.updateIcon();
  },

  // 更新音效图标
  updateIcon: function () {
    const soundIcon = document.getElementById("soundIcon");
    if (this.enabled) {
      // 开启状态的图标
      soundIcon.setAttribute(
        "d",
        "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
      );
    } else {
      // 关闭状态的图标（带斜线）
      soundIcon.setAttribute(
        "d",
        "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
      );
    }
  },
};

scoreManager = {
    scoreMax: localStorage.getItem("tetris-max-score") ?? 0,
    updateMaxScore:function(score){
      if (scoreMax < score) {
        scoreMax = score;
        localStorage.setItem("tetris-max-score", scoreMax);
        document.getElementById("scoreMax").textContent = scoreMax;
      }
    }

}

window.addEventListener("DOMContentLoaded", function () {
  // 初始化音效控制按钮状态
  soundManager.updateIcon();

  document.getElementById("soundToggle").addEventListener("click", () => {
    soundManager.toggle();
  });

  document.getElementById("scoreMax").textContent = scoreManager.scoreMax;
});