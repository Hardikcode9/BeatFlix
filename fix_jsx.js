
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/components/MovieGrid.js";
let content = fs.readFileSync(path, "utf8");

const oldReturn = `  return (
    <section className="movie-grid">
      <div className="movie-container">`;

const newReturn = `  const chunkedMovies = [];
  for (let i = 0; i < movies.length; i += 5) {
    chunkedMovies.push(movies.slice(i, i + 5));
  }

  return (
    <section className="movie-grid">
      <div className="movie-rows-container">`;

content = content.replace(oldReturn, newReturn);

const oldMap = `{movies.length > 0 ? (
          movies.map((movie, index) => {
            const isLoadTrigger = index === movies.length - 5;

            return (
              <div
                key={\`\${movie.id}-\${index}\`}
                ref={isLoadTrigger ? lastMovieRef : null}
              >
                <MovieCard
                  id={movie.id}
                  poster={
                    movie.poster_path
                      ? \`https://image.tmdb.org/t/p/w500\${movie.poster_path}\`
                      : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster"
                  }
                  title={movie.title}
                  genre={movie.genreNames}
                  rating={movie.rating}
                  year={movie.year}
                  index={index}
                />
              </div>
            );
          })
        ) : (`;

const newMap = `{chunkedMovies.length > 0 ? (
          chunkedMovies.map((rowMovies, rowIndex) => (
            <div className="movie-container-row" key={\`row-\${rowIndex}\`}>
              {rowMovies.map((movie, index) => {
                const globalIndex = rowIndex * 5 + index;
                const isLoadTrigger = globalIndex === movies.length - 5;

                return (
                  <div
                    key={\`\${movie.id}-\${globalIndex}\`}
                    ref={isLoadTrigger ? lastMovieRef : null}
                    className="movie-card-wrapper"
                  >
                    <MovieCard
                      id={movie.id}
                      poster={
                        movie.poster_path
                          ? \`https://image.tmdb.org/t/p/w500\${movie.poster_path}\`
                          : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster"
                      }
                      title={movie.title}
                      genre={movie.genreNames}
                      rating={movie.rating}
                      year={movie.year}
                      index={globalIndex}
                    />
                  </div>
                );
              })}
            </div>
          ))
        ) : (`;

content = content.replace(oldMap, newMap);

fs.writeFileSync(path, content);

