// 初始化i18next


// 检测用户语言
function detectUserLanguage() {
  // 1. 优先从浏览器设置获取语言
  const browserLang = navigator.language || navigator.userLanguage;
  console.log('navigator.language: ',navigator.language);
  console.log('navigator.userLanguage: ',navigator.userLanguage);
  
  // 2. 提取主要语言代码（如从"zh-CN"提取"zh"，从"en-US"提取"en"）
  const primaryLang = browserLang.split('-')[0];
  
  // 3. 可在此处添加自定义映射（如将"zh"映射为"zh-CN"）
  const langMap = {
    'zh': 'zh-CN', // 中文统一使用简体
    'en': 'en'     // 英文保持不变
  };
  
  return langMap[primaryLang] || primaryLang;
}

// 加载语言文件
function loadLanguageFile(lang) {
  return fetch(`./i18next/${lang}.json`)
    .then(response => {
      // 处理 HTTP 错误（404、500等）
      if (!response.ok) {
        // 这里不会阻止浏览器打印404，但可以自定义错误信息
        console.warn(`语言文件不存在: ${lang}.json，将使用默认语言`);
        // 手动抛出错误，进入 catch 流程
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      i18next.addResourceBundle(lang, 'translation', data, true, true);
      return lang;
    })
    .catch(error => {
      // 捕获网络错误或手动抛出的HTTP错误
      console.warn(`加载失败: ${error.message}，切换到英文`);
      // 加载默认语言
      return fetch('./i18next/en.json')
        .then(response => response.json())
        .then(enData => {
          i18next.addResourceBundle('en', 'translation', enData, true, true);
          return 'en';
        });
    });
}

// 检测并加载语言的主函数
async function detectAndLoadLanguage() {
  const detectedLang = detectUserLanguage();
  console.log("detected language: ", detectedLang);
  
  return loadLanguageFile(detectedLang)
    .then(loadedLang => {
      // 切换到成功加载的语言
      i18next.changeLanguage(loadedLang);
      
      // 可选：更新页面语言属性（便于CSS适配RTL等）
      document.documentElement.lang = loadedLang;

      if(detectedLang== 'zh-CN') return ; // 网页中默认是中文，可以省略这一步，不需要翻译。     
        renderTranslations();             // 渲染翻译内容
    });
}

// 手动切换语言的函数（供按钮调用）
function changeLanguage(lang) {
  loadLanguageFile(lang)
    .then(loadedLang => {
      i18next.changeLanguage(loadedLang);
      renderTranslations();
      document.documentElement.lang = loadedLang;
    });
}

// 一下两种方式二选一即可
// 1. 手动给需要修改的元素赋值。每个元素需要定义id 属性
function render() {
  document.getElementById("btnNewGame").textContent = i18next.t("newgame");
  document.getElementById("btnPauseGame").textContent = i18next.t("pause");
  document.getElementById("spDescription").textContent = i18next.t("description");
  document.getElementById("divScore").textContent = i18next.t("score");
  document.getElementById("divLevel").textContent = i18next.t("level");
  document.getElementById("divMaxScore").textContent = i18next.t("maxScore");
  //document.getElementById("link4").textContent = i18next.t("g2048");
}


// 2. 自动查找需要修改的元素。每个元素需要定义 data-i18n 属性
function renderTranslations() {
  // 1. 获取所有带有data-i18n属性的元素
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    // 2. 获取翻译键（如 "welcome"、"button.submit"）
    const key = element.getAttribute('data-i18n');
    
    // 3. 获取插值参数（从data-i18n-options属性读取JSON）
    let options = {};
    const optionsStr = element.getAttribute('data-i18n-options');
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch (e) {
        console.error('Invalid JSON in data-i18n-options:', e);
      }
    }
    
    // 4. 翻译并替换元素内容
    const translation = i18next.t(key, options);
    element.textContent = translation;
  });
}


async function initI18N(){
  i18next.init({
    lng: 'en', // 默认为英文
    fallbackLng: 'en', // 无对应语言时使用英文
    debug: false, // 生产环境关闭调试
    interpolation: {
      escapeValue: false // 不转义HTML，如需安全处理可设为true
    }
  });

  await detectAndLoadLanguage();
}
