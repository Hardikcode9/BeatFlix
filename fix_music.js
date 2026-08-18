
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/styles/MusicDetails.css";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  /\.play-pause-btn \{/g,
  ".play-pause-btn {\n  flex-shrink: 0;"
);

content = content.replace(
  /\.control-btn \{/g,
  ".control-btn {\n  flex-shrink: 0;"
);

fs.writeFileSync(path, content);

