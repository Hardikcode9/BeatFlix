const https = require('https');
const fs = require('fs');

const queries = [
  'Hera Pheri 2000 full movie hd',
  'Welcome 2007 full movie hd',
  'Dhamaal full movie hd',
  'Golmaal: Fun Unlimited full movie',
  'Bhool Bhulaiyaa full movie',
  'Chup Chup Ke full movie',
  'Munna Bhai MBBS full movie',
  '3 Idiots full movie',
  'Chennai Express full movie',
  'Hum Aapke Hain Koun full movie',
  'Vivah full movie',
  'Khatta Meetha full movie',
  'Hulchul full movie',
  'De Dana Dan full movie',
  'Garam Masala full movie',
  'Bhagam Bhag full movie',
  'Malaa Mal Weekly full movie',
  'Dhol full movie',
  'Hungama full movie',
  'Awara Paagal Deewana full movie',
  'Housefull full movie'
];

async function searchYouTube(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const regex = /"videoId":"(.*?)".*?"title":\{"runs":\[\{"text":"(.*?)"\}\]\}/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
          const title = match[2].toLowerCase();
          if (!title.includes('trailer') && !title.includes('teaser') && !title.includes('song') && !title.includes('scene')) {
             resolve({ query, id: match[1], title: match[2] });
             return;
          }
        }
        resolve(null);
      });
    }).on('error', reject);
  });
}

async function main() {
  const results = [];
  for (const q of queries) {
    const res = await searchYouTube(q);
    if (res) results.push(res);
  }
  console.log(JSON.stringify(results, null, 2));
}

main();
