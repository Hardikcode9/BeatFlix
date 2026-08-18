
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/components/MovieGrid.js";
let content = fs.readFileSync(path, "utf8");

// Add chunking logic right before return
const chunkLogic = `
  const chunkedMovies = [];
  for (let i = 0; i < movies.length; i += 5) {
    chunkedMovies.push(movies.slice(i, i + 5));
  }

  return (
`;

content = content.replace("  return (", chunkLogic);

// Replace JSX structure
const oldJSX = `<div className="movie-container">
        {/* Render Loaded Movies */}
        {movies.length > 0 ? (
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
                      : "https://via.placeholder.com/500x750?text=No+Poster"
                  }
                  title={movie.title || movie.name}
                  rating={movie.rating}
                  year={movie.year}
                  genres={movie.genreNames}
                />
              </div>
            );
          })
        ) : !loading ? (`;

const newJSX = `<div className="movie-rows-container">
        {/* Render Loaded Movies */}
        {chunkedMovies.length > 0 ? (
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
                          : "https://via.placeholder.com/500x750?text=No+Poster"
                      }
                      title={movie.title || movie.name}
                      rating={movie.rating}
                      year={movie.year}
                      genres={movie.genreNames}
                    />
                  </div>
                );
              })}
            </div>
          ))
        ) : !loading ? (`;

content = content.replace(oldJSX, newJSX);

fs.writeFileSync(path, content);

