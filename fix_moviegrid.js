
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/styles/MovieGrid.css";
let content = fs.readFileSync(path, "utf8");

const oldMobileCSS = `@media (max-width: 768px) {
    .movie-container { 
        display: grid !important; 
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
        overflow-x: visible;
        justify-content: center; 
        padding-bottom: 20px;
        gap: 12px;
    }
    .movie-container::-webkit-scrollbar {
        display: none;
    }
    .movie-container > * {
        flex: 0 0 95px !important;
        width: 95px !important;
        min-width: 95px !important;
        max-width: 95px !important;
        scroll-snap-align: start;
    }
    .skeleton-grid { 
        display: grid !important; 
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
        overflow-x: visible; 
        gap: 12px; 
    }
    .skeleton-card {
        flex: 0 0 110px;
        width: 110px;
        min-width: 110px;
    }
}`;

const newMobileCSS = `@media (max-width: 768px) {
    .movie-container { 
        display: grid !important; 
        grid-template-columns: repeat(3, 1fr) !important;
        overflow-x: visible;
        justify-content: center; 
        padding-bottom: 20px;
        gap: 10px;
    }
    .movie-container::-webkit-scrollbar {
        display: none;
    }
    .movie-container > * {
        flex: unset !important;
        width: 100% !important;
        min-width: unset !important;
        max-width: unset !important;
        scroll-snap-align: start;
    }
    .skeleton-grid { 
        display: grid !important; 
        grid-template-columns: repeat(3, 1fr) !important;
        overflow-x: visible; 
        gap: 10px; 
    }
    .skeleton-card {
        flex: unset !important;
        width: 100% !important;
        min-width: unset !important;
        max-width: unset !important;
    }
}`;

content = content.replace(oldMobileCSS, newMobileCSS);
fs.writeFileSync(path, content);

