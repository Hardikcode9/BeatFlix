
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/styles/MovieGrid.css";
let content = fs.readFileSync(path, "utf8");

// Replace desktop container rules
content = content.replace(
  /\.movie-container\s*\{\s*display:\s*grid;\s*width:\s*100%;\s*grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(220px,\s*1fr\)\);\s*gap:\s*30px;\s*\}/g,
  `.movie-rows-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
}

.movie-container-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 30px;
    width: 100%;
}`
);

// Replace mobile container rules entirely
const oldMobile = /@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*\}\s*$/;
const newMobile = `@media (max-width: 768px) {
    .movie-rows-container {
        gap: 20px;
    }
    .movie-container-row { 
        display: flex !important; 
        flex-direction: row !important;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        padding-bottom: 10px;
        gap: 12px;
        width: 100vw;
        margin-left: -20px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .movie-container-row::-webkit-scrollbar {
        display: none;
    }
    .movie-card-wrapper {
        flex: 0 0 95px !important;
        width: 95px !important;
        min-width: 95px !important;
        max-width: 95px !important;
        scroll-snap-align: start;
    }
    
    .skeleton-grid { 
        display: flex !important;
        overflow-x: auto;
        gap: 12px;
    }
    .skeleton-card {
        flex: 0 0 95px !important;
        width: 95px !important;
        min-width: 95px !important;
    }
}`;

content = content.replace(oldMobile, newMobile);

fs.writeFileSync(path, content);

