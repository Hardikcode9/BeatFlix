
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/App.js";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  /import GlobalMusicPlayer from "\.\/components\/GlobalMusicPlayer";/,
  "import GlobalMusicPlayer from \"./components/GlobalMusicPlayer\";\nimport ScrollToTop from \"./components/ScrollToTop\";"
);

content = content.replace(
  /<BrowserRouter>/,
  "<BrowserRouter>\n        <ScrollToTop />"
);

fs.writeFileSync(path, content);

