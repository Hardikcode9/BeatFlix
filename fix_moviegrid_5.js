
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/styles/MovieGrid.css";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  /grid-template-columns: repeat\(3, 1fr\) !important;/g,
  "grid-template-columns: repeat(5, 1fr) !important;"
);

content = content.replace(
  /gap: 10px;/g,
  "gap: 6px;"
);

fs.writeFileSync(path, content);

