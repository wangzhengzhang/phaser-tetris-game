// 电脑端
// 手机端
var CELL_SIZE = 32;
var GRID_WIDTH = 13;
var GRID_HEIGHT = 20;

function isMobileByUA() {
  const ua = navigator.userAgent.toLowerCase();
  console.log("ua:", ua);
  // 匹配常见移动设备关键词
  return /mobile|android|iphone|ipad|ipod|ios|blackberry|windows phone/.test(
    ua
  );
}

const isMobile = isMobileByUA();

if (isMobile) {
  CELL_SIZE = Math.floor(window.innerWidth / 13) - 1;
}
var GAME_WIDTH = CELL_SIZE * GRID_WIDTH;
var GAME_HEIGHT = CELL_SIZE * GRID_HEIGHT;
console.log("isMobile:", isMobile);
