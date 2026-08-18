
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/styles/MovieGrid.css";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  /grid-template-columns: repeat\(5, 1fr\) !important;/g,
  "grid-template-columns: repeat(3, 1fr) !important;"
);

content = content.replace(
  /gap: 6px;/g,
  "gap: 12px;"
);

fs.writeFileSync(path, content);

