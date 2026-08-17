const https = require('https');
const fs = require('fs');

function fetchSearchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  // query: "full movie hindi comedy", filter: >20 minutes (EgIYQQ%3D%3D)
  const url = 'https://www.youtube.com/results?search_query=full+movie+hindi+comedy&sp=EgIYQQ%253D%253D';
  const html = await fetchSearchPage(url);
  
  const regex = /"videoId":"(.*?)".*?"title":\{"runs":\[\{"text":"(.*?)"\}\]\}.*?"lengthText":\{"accessibility":\{"accessibilityData":\{"label":"(.*?)"\}\}/g;
  
  const movies = [];
  const seenIds = new Set();
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    const title = match[2];
    const lengthStr = match[3];
    
    // Check if it's actually long (contains 'hour' or 'hours')
    if (lengthStr.includes('hour') && !seenIds.has(id)) {
      seenIds.add(id);
      // clean up title
      movies.push({
        id: id,
        youtubeId: id,
        title: title.substring(0, 60),
        year: "2024",
        rating: 7.0,
        duration: lengthStr.replace('hours', 'hr').replace('minutes', 'min').replace('seconds', 'sec').replace('hour', 'hr').replace('minute', 'min').replace('second', 'sec').replace(/,/g, ''),
        genre: "Comedy",
        category: "bollywood",
        desc: title,
        channel: "YouTube"
      });
    }
    
    if (movies.length >= 25) break;
  }
  
  fs.writeFileSync('real_movies.json', JSON.stringify(movies, null, 2));
  console.log(`Found ${movies.length} movies.`);
}

main();
