tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#faa31b",
        secondary: "#f76c5e",
        dark: "#2d3047",
        light: "#e0e1dd",
        board: "#bbada0",
        cell: "#cdc1b4",
        empty: "#cdc1b4",
        bd: "#10101020",

        "tile-2": "#eee4da",
        "tile-4": "#ede0c8",
        "tile-8": "#f2b179",
        "tile-16": "#f59563",
        "tile-32": "#f67c5f",
        "tile-64": "#f65e3b",
        "tile-128": "#edcf72",
        "tile-256": "#edcc61",
        "tile-512": "#edc850",
        "tile-1024": "#edc53f",
        "tile-2048": "#edc22e",
        "tile-super": "#3c3a32",
      },
      fontFamily: {
        game: ['"Clear Sans"', "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        tile: "0 4px 8px rgba(0, 0, 0, 0.15)",
        button: "0 4px 0 rgba(0, 0, 0, 0.15)",
        "button-hover": "0 6px 0 rgba(0, 0, 0, 0.2)",
      },
    },
  },
  content: [
    "./*.html",    // 扫描 src 下所有 HTML 文件
  ],
};
