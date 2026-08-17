const fs = require('fs');

let content = fs.readFileSync('./src/pages/FreeMovies.js', 'utf8');

// The titles look like: "title": "De Dana Dan'}],'accessibility':{'accessibilityData':{'label'",
// We can use regex to clean it.
content = content.replace(/title: "(.*?)\'\}\]\,'accessibility'.*?",/g, (match, p1) => {
  return `title: "${p1}",`;
});

content = content.replace(/desc: "(.*?)\'\}\]\,'accessibility'.*?",/g, (match, p1) => {
  return `desc: "${p1}",`;
});

fs.writeFileSync('./src/pages/FreeMovies.js', content);
console.log('Cleaned up titles and desc');
