const fs = require('fs');

const verifiedFreeMovies = [
  {
    id: "TIQ5hrfermg",
    youtubeId: "TIQ5hrfermg",
    title: "Hera Pheri",
    year: "2000",
    rating: 8.2,
    duration: "2 hr 18 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Three unlikely roommates get caught up in a kidnapping scheme that goes hilariously wrong.",
    channel: "Goldmines Bollywood"
  },
  {
    id: "AKiynoClCaA",
    youtubeId: "AKiynoClCaA",
    title: "Welcome",
    year: "2007",
    rating: 7.1,
    duration: "2 hr 30 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Two bumbling gangsters try to find a suitable husband for their sister.",
    channel: "Shemaroo Movies"
  },
  {
    id: "dplHbfjJ5ew",
    youtubeId: "dplHbfjJ5ew",
    title: "Dhamaal",
    year: "2007",
    rating: 6.8,
    duration: "2 hr 7 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Four friends try to reach a treasure located in Goa, while a crooked cop is also after it.",
    channel: "Shemaroo Movies"
  },
  {
    id: "ZmE6TN9bYQg",
    youtubeId: "ZmE6TN9bYQg",
    title: "Golmaal: Fun Unlimited",
    year: "2006",
    rating: 7.0,
    duration: "2 hr 22 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Four good-for-nothing friends fool an old blind couple pretending to be their grandsons.",
    channel: "Shemaroo Comedy"
  },
  {
    id: "jzYxbnHHhY4",
    youtubeId: "jzYxbnHHhY4",
    title: "Bhool Bhulaiyaa",
    year: "2007",
    rating: 7.4,
    duration: "2 hr 28 min",
    genre: "Comedy / Horror",
    category: "bollywood",
    desc: "An NRI and his wife decide to stay in his ancestral home, paying no heed to the warnings about ghosts.",
    channel: "T-Series"
  },
  {
    id: "z6Qfk9yYGNs",
    youtubeId: "z6Qfk9yYGNs",
    title: "Phir Hera Pheri",
    year: "2006",
    rating: 7.1,
    duration: "2 hr 33 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Raju, Shyam, and Baburao get involved in a get-rich-quick scheme that spirals into chaos.",
    channel: "Shemaroo Movies"
  },
  {
    id: "5QDKX5ExXqM",
    youtubeId: "5QDKX5ExXqM",
    title: "Hulchul",
    year: "2004",
    rating: 7.0,
    duration: "2 hr 28 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "A man and woman from rival feuding families pretend to fall in love just to seek revenge.",
    channel: "Venus Movies"
  },
  {
    id: "CPtsiS9l5lE",
    youtubeId: "CPtsiS9l5lE",
    title: "Shubh Mangal Saavdhan",
    year: "2017",
    rating: 6.9,
    duration: "1 hr 40 min",
    genre: "Romance / Comedy",
    category: "bollywood",
    desc: "Mudit and Sugandha's relationship faces a test when the groom discovers he has a men's health issue.",
    channel: "Eros Now"
  },
  {
    id: "DrWVatMSBtA",
    youtubeId: "DrWVatMSBtA",
    title: "Khatta Meetha",
    year: "2010",
    rating: 5.8,
    duration: "2 hr 36 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "A struggling road contractor trying to make a living in a corrupt system faces endless comedic hurdles.",
    channel: "Shemaroo Movies"
  },
  {
    id: "TIN2Qv89Muw",
    youtubeId: "TIN2Qv89Muw",
    title: "Chup Chup Ke",
    year: "2006",
    rating: 6.8,
    duration: "2 hr 44 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "A man pretends to be deaf and mute to avoid debt collectors, leading to hilarious situations.",
    channel: "Shemaroo Movies"
  },
  {
    id: "QO9Dmb9-M4k",
    youtubeId: "QO9Dmb9-M4k",
    title: "Hungama",
    year: "2003",
    rating: 7.6,
    duration: "2 hr 33 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Misunderstandings lead to chaos involving a wealthy businessman, his wife, and a group of youngsters.",
    channel: "Venus Movies"
  },
  {
    id: "_hFt4tfTbxo",
    youtubeId: "_hFt4tfTbxo",
    title: "Awara Paagal Deewana",
    year: "2002",
    rating: 6.3,
    duration: "2 hr 44 min",
    genre: "Action / Comedy",
    category: "bollywood",
    desc: "A dentist is caught in a web of dons, diamonds and deceit in this multi-starrer comedy.",
    channel: "Shemaroo Movies"
  },
  {
    id: "coWsaIY0vVc",
    youtubeId: "coWsaIY0vVc",
    title: "Malamaal Weekly",
    year: "2006",
    rating: 6.9,
    duration: "2 hr 18 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "A lottery vendor discovers the winner is dead and plots to claim the prize money with the whole village.",
    channel: "Shemaroo Movies"
  },
  {
    id: "v0P9RO7NHNA",
    youtubeId: "v0P9RO7NHNA",
    title: "Dhol",
    year: "2007",
    rating: 6.4,
    duration: "2 hr 25 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Four lazy friends try to woo their new neighbor to get rich, unaware of her dangerous past.",
    channel: "Shemaroo Movies"
  },
  {
    id: "WjL4i1IpIz0",
    youtubeId: "WjL4i1IpIz0",
    title: "De Dana Dan",
    year: "2009",
    rating: 5.9,
    duration: "2 hr 34 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Two hapless servants plan to kidnap a wealthy woman's dog for ransom.",
    channel: "Eros Now"
  },
  {
    id: "3HNcamQj2Ns",
    youtubeId: "3HNcamQj2Ns",
    title: "Lucknow Central",
    year: "2017",
    rating: 6.2,
    duration: "2 hr 27 min",
    genre: "Drama / Music",
    category: "bollywood",
    desc: "A small-town man's dream of making it big in the music industry gets shattered when he is sent to jail.",
    channel: "Viacom18 Studios"
  },
  {
    id: "E9G2vE2Q414",
    youtubeId: "E9G2vE2Q414",
    title: "Vivah",
    year: "2006",
    rating: 6.6,
    duration: "2 hr 40 min",
    genre: "Romance",
    category: "bollywood",
    desc: "The story of two individuals, and their journey from engagement to marriage and aftermath.",
    channel: "Rajshri"
  },
  {
    id: "z3cjfj0yyuQ",
    youtubeId: "z3cjfj0yyuQ",
    title: "Maine Pyar Kiya",
    year: "1989",
    rating: 7.3,
    duration: "3 hr 12 min",
    genre: "Romance",
    category: "bollywood",
    desc: "A young couple's friendship turns into love, but their families' differences pose a threat.",
    channel: "Rajshri"
  },
  {
    id: "kYJ4zN31l0Q",
    youtubeId: "kYJ4zN31l0Q",
    title: "Housefull",
    year: "2010",
    rating: 5.8,
    duration: "2 hr 25 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "A man who considers himself unlucky tries to get married, but his luck keeps ruining everything.",
    channel: "Shemaroo Movies"
  },
  {
    id: "s3m-Zqj4Uio",
    youtubeId: "s3m-Zqj4Uio",
    title: "Bhagam Bhag",
    year: "2006",
    rating: 6.5,
    duration: "2 hr 40 min",
    genre: "Comedy / Mystery",
    category: "bollywood",
    desc: "Two theater actors in London are framed for murder and go on the run to prove their innocence.",
    channel: "Shemaroo Movies"
  }
];

let freeMoviesCode = fs.readFileSync('./src/pages/FreeMovies.js', 'utf8');

const startIdx = freeMoviesCode.indexOf('const freeMoviesList = [');
const endIdx = freeMoviesCode.indexOf('];\n\nfunction FreeMovies() {') + 2;

const arrayString = 'const freeMoviesList = ' + JSON.stringify(verifiedFreeMovies, null, 2);

freeMoviesCode = freeMoviesCode.substring(0, startIdx) + arrayString + freeMoviesCode.substring(endIdx);

fs.writeFileSync('./src/pages/FreeMovies.js', freeMoviesCode);
console.log('Fixed movies to verified free ones');
