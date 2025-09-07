// 在微信浏览网页时，检测swipArea的手指滑动方向

//const eventLog = document.getElementById("eventLog");
const isWechat = /MicroMessenger/i.test(navigator.userAgent);

let startX,
  startY,
  isTouching = false;
let touchTimer = null;

// 处理滑动结束逻辑
function handleTouchEnd(startX, startY, endX, endY) {
  const diffY = endY - startY;
  const diffX = endX - startX;

  if (Math.abs(diffY) > 30 && Math.abs(diffY) > Math.abs(diffX) * 2) {
    touchDirection(diffY > 0 ? 3 : 1);
  } else if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY) * 2) {
    touchDirection(diffX > 0 ? 2 : 4);
  } else {
    //touchDirection("滑动距离不足");
  }
}
// {window.game.scene.keys["TetrisScene"].rotateTetromino();});
// >{window.game.scene.keys["TetrisScene"].moveTetromino(0, 1);});
// > {window.game.scene.keys["TetrisScene"].moveTetromino(-1, 0);});
// => { window.game.scene.keys["TetrisScene"].moveTetromino(1, 0);});
// 1: 上， 2：右，3：下，4：左
function touchDirection(dir) {
  //eventLog.textContent = text;
  if (dir == 1) {
    window.game.scene.keys["TetrisScene"].handleInput({code:'ArrowUp'});
   
  } else if (dir == 2) {
    window.game.scene.keys["TetrisScene"].handleInput({code:'ArrowRight'});
    
  } else if (dir == 3) {
    window.game.scene.keys["TetrisScene"].handleInput({code:'ArrowDown'});
    
  } else if (dir == 4) {
    window.game.scene.keys["TetrisScene"].handleInput({code:'ArrowLeft'});
    
  }
   changeColor(dir);
  //console.log(dir);
}

function changeColor(dir)
{

    textUp.setColor(dir == 1?'#ffffff':'#999999'); // 十六进制（白色）
    textRight.setColor(dir == 2?'#ffffff':'#999999'); // 十六进制（白色）
    textDown.setColor(dir == 3?'#ffffff':'#999999'); // 十六进制（白色）
    textLeft.setColor(dir == 4?'#ffffff':'#999999'); // 十六进制（白色）
   
}
    


function initTouchDirection(areaId) {
  const swipeArea = document.getElementById(areaId);
  console.log("init touch direction");
  // 触摸开始：记录状态并启动超时保护
  swipeArea.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isTouching = true;
      //updateLog("触发 touchstart");

      // 超时保护：若500ms内未触发touchend，强制处理（应对微信拦截）
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        if (isTouching) {
          //updateLog("超时保护：模拟 touchend");
          handleTouchEnd(
            startX,
            startY,
            e.touches[0].clientX,
            e.touches[0].clientY
          );
          isTouching = false;
        }
      }, 500);
    },
    { passive: true }
  );

  // 触摸移动：精准控制默认行为
  swipeArea.addEventListener(
    "touchmove",
    (e) => {
      if (!isWechat) return;

      const touch = e.touches[0];
      const diffY = touch.clientY - startY;
      const diffX = touch.clientX - startX;

      // 关键逻辑：仅在"纯下滑"且在页面顶部时阻止微信默认行为
      // 避免影响正常滚动需求
      if (
        Math.abs(diffY) > Math.abs(diffX) * 2 && // 主要是垂直滑动
        diffY > 10 && // 确实是下滑
        window.scrollY <= 0 // 页面处于顶部（可能触发微信下拉刷新）
      ) {
        e.preventDefault(); // 阻止微信拦截事件
      }
    },
    { passive: false }
  ); // 必须为false才能调用preventDefault

  // 触摸结束：正常处理
  swipeArea.addEventListener(
    "touchend",
    (e) => {
      if (!isTouching) return;

      clearTimeout(touchTimer); // 清除超时保护
      const touch = e.changedTouches[0];
      // updateLog("触发 touchend");
      handleTouchEnd(startX, startY, touch.clientX, touch.clientY);
      isTouching = false;
    },
    { passive: true }
  );

  // 触摸取消：应对事件被强制中断的情况（微信特有）
  swipeArea.addEventListener(
    "touchcancel",
    (e) => {
      if (!isTouching) return;

      clearTimeout(touchTimer);
      const touch = e.changedTouches[0];
      // updateLog("触发 touchcancel（微信可能拦截了事件）");
      handleTouchEnd(startX, startY, touch.clientX, touch.clientY);
      isTouching = false;
    },
    { passive: true }
  );
}


var textUp ;
var textDown;
var textRight;
var textLeft;

function createTriangleArea(scene) {
  const { width, height } = scene.sys.game.config;
  var d = 0.125;
  var ration = 0.5 - d;
  var ration1 =  1 -  ration;
  // 创建四个三角形区块
  createTriangle(
    scene,
    width*ration,
    height*ration, // 左上角
    width*ration1,
    height*ration, // 右上角
    width/2,
    height/2, // 中间
    0xf76c5e,
    0.1 // 红色系
  );

  createTriangle(
    scene,
    width*ration1,
    height*ration, // 右上角
    width*ration1,
    height*ration1, // 右下角
    width/2,
    height/2, // 中间
    0x003000,
    0.1 // 蓝绿色系
  );

  createTriangle(
    scene,
    width*ration1,
    height*ration1, // 右下角
    width*ration,
    height*ration1, // 左下角
    width/2,
    height/2, // 右上角
    0xffd166,
    0.1 // 黄色系
  );

  createTriangle(
    scene,
    width*ration,
    height*ration1, // 左下角
    width*ration,
    height*ration, // 左上角
    width/2,
    height/2, // 右下角
    0x6a0572,
    0.1 // 紫色系
  );

  // 绘制两条对角线作为边界
  //drawDiagonal(scene, 0, 0, width, height, 0x999999); // 左上到右下
  //drawDiagonal(scene, width, 0, 0, height, 0x999999); // 右上到左下

  // 添加区块标签
  const textStyle = {
    fontSize: isMobile?"14px":"14px",
    fill: "#999999",
    fontWeight: "bold",
    stroke: "#000000",
    strokeThickness: 2,
  };

  ration = 0.5 - d/2;
  ration1 = 1 - ration;

  textUp = scene.add.text(width * 0.5, height * ration, "旋转", textStyle).setOrigin(0.5);
  textRight = scene.add
    .text(width * ration1, height * 0.5, "右移", textStyle)
    .setOrigin(0.5);
  textDown = scene.add
    .text(width * 0.5, height * ration1, "加速", textStyle)
    .setOrigin(0.5);
  textLeft = scene.add
    .text(width *  ration, height * 0.5, "左移", textStyle)
    .setOrigin(0.5);
}

// 创建三角形的辅助函数
function createTriangle(scene, x1, y1, x2, y2, x3, y3, color, alpha) {
  // 创建三角形图形
  const triangle = scene.add.graphics();

  // 绘制并填充三角形
  triangle.fillStyle(color, alpha);
  triangle.beginPath();
  triangle.moveTo(x1, y1);
  triangle.lineTo(x2, y2);
  triangle.lineTo(x3, y3);
  triangle.closePath();
  triangle.fillPath();

  return triangle;
}

// 绘制对角线的辅助函数
function drawDiagonal(scene, x1, y1, x2, y2, color) {
  const line = scene.add.graphics();
  line.lineStyle(4, color, 1);
  line.beginPath();
  line.moveTo(x1, y1);
  line.lineTo(x2, y2);
  line.closePath();
  line.strokePath();
  return line;
}

function initSceneClickDirection(scene) {
  // 在scene的create方法中
  scene.input.on("pointerdown", (pointer) => {
    // pointer包含点击位置信息
    //console.log(`点击位置: (${pointer.x}, ${pointer.y})`);
    const x = pointer.x;
    const y = pointer.y;
    const width = scene.game.canvas.width;
    const height = scene.game.canvas.height;

    let position = calcDirection(x, y, width, height);
    touchDirection(position);
  });

  createTriangleArea(scene);
}

function calcDirection(x, y, width, height) {
  var position = 1;
  // console.log(x, y, width, height);

  x = x - width / 2;
  y = y - height / 2;

  // 判断点击的区域
  //let position = 0;
  let diff = y - x;
  let sum = y + x;

  // 判断上下
  if (diff > 0 && sum > 0) {
    position = 3; // 下
  } else if (diff < 0 && sum < 0) {
    position = 1; // 上
  } else if (diff < 0 && sum > 0) {
    position = 2; // 右
  } else if (diff > 0 && sum < 0) {
    position = 4; // 左
  }
  return position;
}

function initClickDirection(area) {
  console.log("init click direction");
  // 获取容器和结果显示元素
  const container = area; //document.getElementById(areaId);
  //const result = document.getElementById('result');

  // 监听容器的点击事件
  container.addEventListener("click", function (e) {
    // 获取容器的位置和尺寸信息
    const rect = container.getBoundingClientRect();
    // console.log(rect);

    // 计算点击位置相对于容器的坐标
    var x = e.clientX - rect.left; // 相对于容器左侧的X坐标
    var y = e.clientY - rect.top; // 相对于容器顶部的Y坐标

    // 容器的宽高
    const width = rect.width;
    const height = rect.height;
    console.log(x, y, width, height);
    let position = calcDirection(x, y, width, height);
    // x = x - width / 2;
    // y = y - height / 2;

    // // 判断点击的区域
    // let position = 0;
    // let diff = y - x;
    // let sum = y + x;

    // // 判断上下
    // if (diff >0 && sum >0 ) {
    //     position = 3; // 下
    // } else if( diff < 0 && sum < 0 ) {
    //     position = 1; // 上
    // }else if( diff < 0 && sum > 0){
    //   position = 2; // 右
    // }
    // else if(diff > 0 &&  sum   < 0){
    //   position = 4; // 左
    // }

    console.log(position);
    touchDirection(position);

    // 显示结果
    //result.textContent = `点击了：${position}区域 (X: ${Math.round(x)}, Y: ${Math.round(y)})`;

    // 视觉反馈：改变点击区域的背景色
    //highlightSection(position);
  });

  // // 高亮显示被点击的区域
  // function highlightSection(position) {
  //     // 先重置所有区域的背景色
  //     document.querySelectorAll('.section').forEach(section => {
  //         section.style.backgroundColor = '';
  //     });

  //     // 根据点击位置高亮对应区域
  //     if (position.includes('上')) {
  //         document.querySelector('.top').style.backgroundColor = '#c8e6c9';
  //     }
  //     if (position.includes('下')) {
  //         document.querySelector('.bottom').style.backgroundColor = '#c8e6c9';
  //     }
  //     if (position.includes('左')) {
  //         document.querySelector('.left').style.backgroundColor = 'rgba(200, 255, 200, 0.5)';
  //     }
  //     if (position.includes('右')) {
  //         document.querySelector('.right').style.backgroundColor = 'rgba(200, 255, 200, 0.5)';
  //     }

  //     // 1秒后恢复原来的背景色
  //     setTimeout(() => {
  //         document.querySelectorAll('.section').forEach(section => {
  //             section.style.backgroundColor = '';
  //         });
  //     }, 1000);
  // }
}
