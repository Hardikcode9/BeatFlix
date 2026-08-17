const https = require('https');

const ids = ['3HNcamQj2Ns', '5QDKX5ExXqM', 'CPtsiS9l5lE', 'eRsGyueVLvQ', 'R6MlUcmOul8', 'aqz-KE-bpKQ'];
ids.forEach(id => {
  https.get('https://www.youtube.com/watch?v=' + id, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<title>(.*?)<\/title>/);
      console.log(id, match ? match[1] : 'Unknown');
    });
  });
});
