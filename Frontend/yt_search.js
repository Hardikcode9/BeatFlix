const https = require('https');

https.get('https://www.youtube.com/results?search_query=full+movie+free+bollywood+superhit', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const regex = /"title":\{"runs":\[\{"text":"(.*?)"\}\]\}.*?"ownerText":\{"runs":\[\{"text":"(.*?)"\}.*?"videoId":"(.*?)"/g;
    const movies = [];
    const ids = new Set();
    let match;
    while ((match = regex.exec(data)) !== null) {
      if (!ids.has(match[3]) && match[1].toLowerCase().includes('movie')) {
        ids.add(match[3]);
        movies.push({title: match[1], channel: match[2], youtubeId: match[3]});
      }
      if (movies.length >= 10) break;
    }
    console.log(JSON.stringify(movies, null, 2));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
