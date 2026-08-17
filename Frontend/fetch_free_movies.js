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
  const url = 'https://www.youtube.com/results?search_query=full+movie+hindi+comedy+-rent+-buy&sp=EgIYQQ%253D%253D';
  const html = await fetchSearchPage(url);
  
  // We need to parse the JSON embedded in the page to correctly avoid "Buy or rent"
  // The JSON is in `var ytInitialData = {...};`
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
  if (!match) {
    console.log("Could not find ytInitialData");
    return;
  }
  
  const data = JSON.parse(match[1]);
  let contents = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
  
  const movies = [];
  
  for (let item of contents) {
    if (item.videoRenderer) {
      const vid = item.videoRenderer;
      
      // Check for rent/buy badges
      let isPremium = false;
      if (vid.badges) {
        for (let badge of vid.badges) {
          if (badge.metadataBadgeRenderer && (badge.metadataBadgeRenderer.label === 'Buy or rent' || badge.metadataBadgeRenderer.label === 'Rent')) {
            isPremium = true;
            break;
          }
        }
      }
      
      if (!isPremium && vid.lengthText) {
        const lengthStr = vid.lengthText.simpleText; // e.g., "2:18:04"
        const parts = lengthStr.split(':');
        if (parts.length === 3 && parseInt(parts[0]) >= 1) { // At least 1 hour long
           movies.push({
             id: vid.videoId,
             youtubeId: vid.videoId,
             title: vid.title.runs[0].text.substring(0, 60),
             year: "2024",
             rating: 7.0,
             duration: `${parts[0]} hr ${parts[1]} min`,
             genre: "Comedy",
             category: "bollywood",
             desc: vid.title.runs[0].text,
             channel: vid.ownerText ? vid.ownerText.runs[0].text : "YouTube"
           });
        }
      }
    }
  }
  
  fs.writeFileSync('truly_free_movies.json', JSON.stringify(movies, null, 2));
  console.log(`Found ${movies.length} truly free movies.`);
}

main();
