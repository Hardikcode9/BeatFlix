import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CollectionPage.css";

const API = "http://localhost:4000/api";
const IMAGE = "https://image.tmdb.org/t/p/w500";

function CollectionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/movies/collections/${slug}`);
        const data = await res.json();

        if (data.success) {
          setTitle(data.title || "Collection");
          setMovies(data.movies || []);
        } else {
          setTitle("Collection");
          setMovies([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  if (loading) {
    return (
      <div className="collection-loading">
        <div className="loader"></div>
        <h2>Loading Collection...</h2>
      </div>
    );
  }

  return (
    <div className="collection-page">

      <h1 className="collection-title">
        {title}
      </h1>

      <div className="collection-grid">

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="collection-card"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={
                movie.poster_path
                  ? `${IMAGE}${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
            />

            <h3>{movie.title}</h3>
          </div>
        ))}

      </div>

    </div>
  );
}

export default CollectionPage;