const fs = require('fs');

const realMovies = JSON.parse(fs.readFileSync('real_movies.json', 'utf8'));

// Generate the JS array text
let moviesJs = `const freeMoviesList = [\n`;
for (let i = 0; i < 20; i++) {
  const m = realMovies[i];
  // clean up description
  const cleanDesc = m.desc.split('"}]')[0].replace(/"/g, "'");
  moviesJs += `  {
    id: "${m.id}",
    youtubeId: "${m.youtubeId}",
    title: "${m.title.replace(/"/g, "'")}",
    year: "${m.year}",
    rating: ${m.rating},
    duration: "${m.duration}",
    genre: "${m.genre}",
    category: "${m.category}",
    desc: "${cleanDesc}",
    channel: "${m.channel}"
  }`;
  if (i < 19) moviesJs += ",\n";
  else moviesJs += "\n];";
}

let freeMoviesCode = fs.readFileSync('./src/pages/FreeMovies.js', 'utf8');

// Replace the freeMoviesList array
const startIdx = freeMoviesCode.indexOf('const freeMoviesList = [');
const endIdx = freeMoviesCode.indexOf('];\n\nfunction FreeMovies() {') + 2;

freeMoviesCode = freeMoviesCode.substring(0, startIdx) + moviesJs + freeMoviesCode.substring(endIdx);

// Remove the hollywood filter button
freeMoviesCode = freeMoviesCode.replace(/<button className={`filter-tab \${filter === 'hollywood' \? 'active' : ''}`} onClick=\{\(\) => setFilter\('hollywood'\)\}>\s*🎬 Hollywood Classics\s*<\/button>/g, '');

// Also remove Hollywood mentions in text
freeMoviesCode = freeMoviesCode.replace('Bollywood blockbusters & Hollywood classics.', 'Bollywood blockbusters & Comedies.');

fs.writeFileSync('./src/pages/FreeMovies.js', freeMoviesCode);
console.log('Successfully updated FreeMovies.js with 20 real live movies');
