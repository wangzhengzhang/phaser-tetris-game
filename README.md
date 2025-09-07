- 在线试玩(Online Demo): https://zhengzhang.wang/game/tetris/
- 游戏主界面截图

![](./screenshot.png)

- How to run
``` cmd
npm install -g http-server
git clone https://github.com/wangzhengzhang/phaser-tetris-game.git
cd phaser-tetris-game
http-server
或 http-server -c-1 -H "Cache-Control: no-cache, no-store, must-revalidate" -H "Pragma: no-cache" -H "Expires: 0"
``` 

- css minify
``` cmd
yarn add -D tailwindcss@3.4.1 postcss autoprefixer
node node_modules/tailwindcss/lib/cli.js init -p
node node_modules/tailwindcss/lib/cli.js -i ./tailwind.css -o ./tailwind.min.css --minify
```