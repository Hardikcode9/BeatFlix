import avatar from "../assets/images/movies/avatar.jpg";
import avengersEndgame from "../assets/images/movies/avengers-endgame.jpg";
import bahubali from "../assets/images/movies/bahubali.jpg";
import dangal from "../assets/images/movies/dangal.jpg";
import theDarkKnight from "../assets/images/movies/dark-knight.jpg";
import dhurandhar from "../assets/images/movies/dhurandhar.jpg";
import inception from "../assets/images/movies/inception.jpg";
import interstellar from "../assets/images/movies/interstellar.webp";
import rrr from "../assets/images/movies/rrr.jpg";
import shawshank from "../assets/images/movies/shawshank-redemption.jpg";
import spiderMan from "../assets/images/movies/spiderman.jpg";
import titanic from "../assets/images/movies/titanic.jpg";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    poster: interstellar,
    genre: ["Sci-Fi", "Adventure"],
    mood: "Mind-Blowing",
    rating: 8.7,
    year: 2014,
    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    description:
      "A team of astronauts travels through a mysterious wormhole in search of a new home for humanity as Earth faces extinction.",
  },

  {
    id: 2,
    title: "Inception",
    poster: inception,
    genre: ["Sci-Fi", "Thriller"],
    mood: "Mind-Blowing",
    rating: 8.8,
    year: 2010,
    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    description:
      "A skilled thief enters people's dreams to steal secrets but is offered one final mission that could change his life forever.",
  },

  {
    id: 3,
    title: "Dhurandhar",
    poster: dhurandhar,
    genre: ["Action", "Thriller"],
    mood: "Action",
    rating: 8.5,
    year: 2025,
    trailer: "https://youtu.be/BKOVzHcjEIo?si=vuRDy_XuVVqes3dB",
    description:
      "An action-packed thriller filled with dangerous missions, powerful enemies, and intense suspense.",
  },

  {
    id: 4,
    title: "Dangal",
    poster: dangal,
    genre: ["Drama", "Sports"],
    mood: "Motivational",
    rating: 8.4,
    year: 2016,
    trailer: "https://www.youtube.com/watch?v=x_7YlGv9u1g",
    description:
      "A former wrestler trains his daughters to become world-class champions and break barriers in women's wrestling.",
  },

  {
    id: 5,
    title: "Avatar",
    poster: avatar,
    genre: ["Sci-Fi", "Adventure"],
    mood: "Adventure",
    rating: 7.9,
    year: 2009,
    trailer: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
    description:
      "A marine is sent to the alien world of Pandora where he must choose between following orders and protecting its people.",
  },

  {
    id: 6,
    title: "Avengers: Endgame",
    poster: avengersEndgame,
    genre: ["Action", "Adventure"],
    mood: "Action",
    rating: 8.4,
    year: 2019,
    trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    description:
      "The Avengers reunite for one final battle against Thanos to restore hope and save the universe.",
  },

  {
    id: 7,
    title: "Baahubali",
    poster: bahubali,
    genre: ["Action", "Drama"],
    mood: "Adventure",
    rating: 8.0,
    year: 2015,
    trailer: "https://www.youtube.com/watch?v=sOEg_YZQsTI",
    description:
      "A courageous young man discovers his royal heritage and fights to reclaim his kingdom from a ruthless ruler.",
  },

  {
    id: 8,
    title: "The Dark Knight",
    poster: theDarkKnight,
    genre: ["Action", "Crime"],
    mood: "Mind-Blowing",
    rating: 9.0,
    year: 2008,
    trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    description:
      "Batman faces the Joker, a brilliant criminal who pushes Gotham City into chaos and tests the limits of justice.",
  },

  {
    id: 9,
    title: "RRR",
    poster: rrr,
    genre: ["Action", "Drama"],
    mood: "Action",
    rating: 7.8,
    year: 2022,
    trailer: "https://www.youtube.com/watch?v=NgBoMJy386M",
    description:
      "Two fearless revolutionaries form an extraordinary friendship while fighting against British rule in India.",
  },

  {
    id: 10,
    title: "The Shawshank Redemption",
    poster: shawshank,
    genre: ["Drama"],
    mood: "Motivational",
    rating: 9.3,
    year: 1994,
    trailer: "https://www.youtube.com/watch?v=NmzuHjWmXOc",
    description:
      "A banker wrongly imprisoned never loses hope as he builds friendships and plans an unforgettable escape.",
  },

  {
    id: 11,
    title: "Spider-Man",
    poster: spiderMan,
    genre: ["Action", "Adventure"],
    mood: "Fun",
    rating: 8.4,
    year: 2021,
    trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    description:
      "Peter Parker faces his greatest challenge yet as villains from different universes threaten the people he loves.",
  },

  {
    id: 12,
    title: "Titanic",
    poster: titanic,
    genre: ["Romance", "Drama"],
    mood: "Romantic",
    rating: 7.9,
    year: 1997,
    trailer: "https://www.youtube.com/watch?v=kVrqfYjkTdQ",
    description:
      "A young couple from different worlds fall deeply in love aboard the ill-fated RMS Titanic during its maiden voyage.",
  },
];

export default movies;