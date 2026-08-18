
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/styles/MovieDetails.css";
let content = fs.readFileSync(path, "utf8");

content += `
@media (max-aspect-ratio: 16/9) {
  .live-bg-iframe {
    width: 177.77vh;
    height: 100vh;
  }
}
`;

fs.writeFileSync(path, content);

