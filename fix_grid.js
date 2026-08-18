
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/styles/MovieGrid.css";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  /\.movie-container\s*\{\s*display:\s*flex\s*!important;\s*flex-direction:\s*row\s*!important;\s*overflow-x:\s*auto;\s*-webkit-overflow-scrolling:\s*touch;\s*scroll-snap-type:\s*x\s*mandatory;/g,
  ".movie-container { \n        display: grid !important; \n        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;\n        overflow-x: visible;\n        justify-content: center;"
);

content = content.replace(
  /\.skeleton-grid\s*\{\s*display:\s*flex;\s*overflow-x:\s*auto;/g,
  ".skeleton-grid { \n        display: grid !important; \n        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;\n        overflow-x: visible;"
);

fs.writeFileSync(path, content);

