const fs = require('fs');

const trulyFreeMovies = JSON.parse(fs.readFileSync('truly_free_movies.json', 'utf8'));

// We know Khatta Meetha was good, so let's make it the first one
trulyFreeMovies.unshift({
  "id": "DrWVatMSBtA",
  "youtubeId": "DrWVatMSBtA",
  "title": "Khatta Meetha",
  "year": "2010",
  "rating": 5.8,
  "duration": "2 hr 36 min",
  "genre": "Comedy",
  "category": "bollywood",
  "desc": "A struggling road contractor trying to make a living in a corrupt system faces endless comedic hurdles.",
  "channel": "Shemaroo Movies"
});

// Generate the JS array text
let moviesJs = `const freeMoviesList = [\n`;
for (let i = 0; i < 20; i++) {
  const m = trulyFreeMovies[i];
  if (!m) break;
  // clean up description and title
  const cleanTitle = m.title.replace(/"/g, "'").replace(/\n/g, "");
  const cleanDesc = m.desc.replace(/"/g, "'").replace(/\n/g, "");
  
  moviesJs += `  {
    id: "${m.id}",
    youtubeId: "${m.youtubeId}",
    title: "${cleanTitle}",
    year: "${m.year}",
    rating: ${m.rating},
    duration: "${m.duration}",
    genre: "${m.genre}",
    category: "${m.category}",
    desc: "${cleanDesc}",
    channel: "${m.channel}"
  }`;
  if (i < trulyFreeMovies.length - 1 && i < 19) moviesJs += ",\n";
  else moviesJs += "\n];";
}

let freeMoviesCode = fs.readFileSync('./src/pages/FreeMovies.js', 'utf8');

// Replace the freeMoviesList array
const startIdx = freeMoviesCode.indexOf('const freeMoviesList = [');
const endIdx = freeMoviesCode.indexOf('];\n\nfunction FreeMovies() {') + 2;

freeMoviesCode = freeMoviesCode.substring(0, startIdx) + moviesJs + freeMoviesCode.substring(endIdx);

fs.writeFileSync('./src/pages/FreeMovies.js', freeMoviesCode);
console.log('Successfully updated FreeMovies.js with 20 truly free movies');
