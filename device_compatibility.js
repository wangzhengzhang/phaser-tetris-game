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
console.log(
  "window.innerWidth: ",
  window.innerWidth,
  "window.innerHeight: ",
  window.innerHeight
);
console.log("game cell size: ", CELL_SIZE);

// // 禁止双击放大
// let lastClickTime = 0;
// // document.addEventListener(
// //   "click",
// //   function (e) {
// //     const currentTime = Date.now();
// //     // 两次点击间隔小于300ms视为双击
// //     if (currentTime - lastClickTime < 300) {
// //       e.preventDefault(); // 阻止双击行为
// //       e.stopPropagation();
// //     }
// //     lastClickTime = currentTime;
// //   },
// //   { passive: false }
// // );

// // 禁止触摸相关的缩放行为（针对部分浏览器）
// document.addEventListener(
//   "touchstart",
//   function (e) {
//     // 单指双击也可能触发放大，通过触摸次数判断
//     if (e.touches.length === 1) {
//       const currentTime = Date.now();
//       if (currentTime - lastClickTime < 300) {
//         e.preventDefault();
//       }
//       lastClickTime = currentTime;
//     }
//   },
//   { passive: false }
// );

// // 禁止手势缩放（双指操作）
// document.addEventListener(
//   "touchmove",
//   function (e) {
//     if (e.touches.length > 1) {
//       e.preventDefault(); // 阻止双指缩放
//     }
//   },
//   { passive: false }
// );
