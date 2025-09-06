// 1. 配置需要加载的JS文件列表（按依赖顺序排列）

var loadedResources = 0;
var totalResources = jsFiles.length + cssFiles.length;
var resourceStatus = {}

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const resourceList = document.getElementById("resourceList");
const progressOverlay = document.getElementById("progressOverlay");
const mainContent = document.getElementById("mainContent");

// 4. 监控每个资源的加载状态
function monitorResource(url) {
  // 创建资源项显示
  const listItem = document.createElement("div");
  listItem.className = "resource-item";
  listItem.key = url;
  resourceList.appendChild(listItem);
  updateProgressForItem(url);
  // updateProgressForItem(url); // 未知状态
}

// 5. 开始监控所有资源
jsFiles.forEach(monitorResource);
cssFiles.forEach(monitorResource);

// 5. 单个JS文件加载函数（返回Promise便于顺序控制）
function loadSingleScript(filePath) {
  return new Promise((resolve, reject) => {
    // 创建script标签
    const script = document.createElement("script");
    script.src = filePath;
    script.type = "text/javascript";

    // 加载成功回调
    script.onload = () => {
      loadedResources++; // 已加载计数+1
      resourceStatus[filePath] = true; // 记录加载状态

      updateProgressForItem(filePath,true);
      updateProgressBar(); // 更新进度
      resolve(); // 通知Promise完成
    };

    // 加载失败回调
    script.onerror = (error) => {

      console.error(`文件加载失败: ${filePath}`, error);
      resourceStatus[filePath] = false; // 记录加载状态
      updateProgressForItem(filePath,false);

      reject(new Error(`加载文件 ${filePath} 时出错`));
    };

    // 将script标签添加到页面（开始加载）
    document.head.appendChild(script);
  });
}

function loadSingleCSS(filePath) {
  return new Promise((resolve, reject) => {
    // 创建script标签
    const css = document.createElement("link");
    css.href = filePath;
    css.rel="stylesheet"; 

    // 加载成功回调
    css.onload = () => {
      loadedResources++; // 已加载计数+1
      resourceStatus[filePath] = true; // 记录加载状态
      updateProgressForItem(filePath,true); // 更新进度
      updateProgressBar(); // 更新进度
      resolve(); // 通知Promise完成
    };

    // 加载失败回调
    css.onerror = (error) => {
       resourceStatus[filePath] = false; // 记录加载状态
      updateProgressForItem(filePath,false); // 更新进度
      reject(new Error(`加载文件 ${filePath} 时出错`));
    };

    // 将css标签添加到页面（开始加载）
    document.head.appendChild(css);
  });
}

async function loadAllCss() {
  try {
    // 循环加载每个文件（await确保顺序执行）
    for (const file of cssFiles) {
      await loadSingleCSS(file);
    }
  } catch (error) {
    // 捕获加载过程中的错误（避免程序崩溃）
    console.error("CSS文件加载过程出错:", error);
  }
}

// 6. 批量加载所有JS文件（顺序加载，保证依赖正确）
async function loadAllScripts() {
  try {
    // 循环加载每个文件（await确保顺序执行）
    for (const file of jsFiles) {
      await loadSingleScript(file);
    }
  } catch (error) {
    // 捕获加载过程中的错误（避免程序崩溃）
    console.error("JS文件加载过程出错:", error);
  }
}


// 3. 更新进度
function updateProgressBar() {
  const progress =
    totalResources > 0
      ? Math.round((loadedResources / totalResources) * 100)
      : 100;

  progressBar.style.width = `${progress}%`;
  progressPercent.textContent = `${progress}%`;

  // 所有资源加载完成
  if (progress === 100) {
    setTimeout(() => {
      progressOverlay.style.opacity = 0;
      setTimeout(() => {
        progressOverlay.style.display = "none";
        mainContent.style.display = "block";
        initApplication();
      }, 10);
    }, 500);
  }
}

function updateProgressForItem(key, status = "") {
  Array.from(resourceList.children).forEach((item) => {
    if (item.key === key) {
      var status = resourceStatus[item.key];
      var names = item.key.replace(/\/+$/, "").split("/"); // 替换掉末尾的 / (如果存在)
      var name = names.pop();
      //console.log(name, status);
      //if(!name)name = names.pop();

      if (status === true) {
        // 加载成功
        item.innerHTML = `
                <span class="icon icon-success"></span>
                <span>${name}</span>
              `;
      } else if (status === false) {
        // 加载失败
        item.innerHTML = `
                <span class="icon icon-error"></span>
                <span>${name}(加载失败)</span>
              `;
      } else {
        // 加载中
        item.innerHTML = `
                <span class="icon icon-loading"></span>
                <span>${name}</span>
              `;
      }
    }
  });
}

loadAllScripts();
loadAllCss();

async function appendHtml(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("加载失败");
  const html = await response.text();
  document.getElementById("mainHiddenContent").innerHTML += html;
  return true;
}

// 加载并插入外部HTML
async function includeHTML(url, containerId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("加载失败");

    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;

    // 可选：如果加载的HTML中包含脚本，需要手动执行
    executeScripts(document.getElementById(containerId));
  } catch (error) {
    console.error("加载HTML出错:", error);
  }
}

// 执行动态加载的脚本
function executeScripts(container) {
  const scripts = container.querySelectorAll("script");
  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    // 复制所有属性
    Array.from(oldScript.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}
