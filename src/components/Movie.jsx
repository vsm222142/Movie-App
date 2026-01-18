import { useState } from "react";
import "./movie.css";

export default function Movie() {

  const [query, setQuery] = useState("");
  const [year,setYear] = useState("");
  const [movies, setMovies] = useState([]);
  const [page,setPage]=useState(1);
  const [totalResults,setTotalResults]=useState(0)

  const apikey = '9165b550';

  async function fetchmovies(pageNumber=1) {
    let response = await fetch(
      `http://www.omdbapi.com/?apikey=${apikey}&s=${query}&y=${year}&page=${pageNumber}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      setMovies(data.Search);
      setTotalResults(data.totalResults);
    } else {
      setMovies([]);
      alert(data.Error);
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") {
      setPage(1)
      fetchmovies(1);
    }
  }

  const handleSearchClick = () => {
    setPage(1);
    fetchmovies(1);
  }

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1980; y--) {
    years.push(y);
  }

  const handleYearChange=(e)=>{
    setYear(e.target.value);
    setPage(1);
    fetchmovies(1);
  }

  const handlePrev=()=>{
    if(page>1){
      const newPage=page-1;
      setPage(newPage);
      fetchmovies(newPage)
    }
  }

  const handleNext= ()=>{
    const maxPage=Math.ceil(totalResults/10);
    if(page<maxPage){
      const newPage=page+1;
      setPage(newPage);
      fetchmovies(newPage);
    }
  }

  return (
    <>
      <div className="movie-container">
        <h1 className="movie-title">🎬 Movie Search App</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search movie name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />

          <select value={year} onChange={handleYearChange}>
            <option value="">Select Year</option>
            {years.map((i)=>(
              <option value={i} key={i}>{i}</option>
            ))}
          </select>

          {/* NEW BUTTON */}
          <button className="search-btn" onClick={handleSearchClick}>
            Search
          </button>
        </div>
      </div>

      <div className="movie-list">

        {movies.map((m)=>(
          <div key={m.imdbID} className="movie-card">
            <img src={m.Poster} alt={m.Title} />

            <div className="movie-info">
              <h3>{m.Title}</h3>
              <p><strong>Year:</strong> {m.Year}</p>
              <p><strong>Type:</strong> {m.Type}</p>
            </div>
          </div>
        ))}

        <div className="pagination">
          <button onClick={handlePrev} disabled={page===1}>
            Previous
          </button>

          <span>
            Page {page} of {Math.ceil(totalResults/10)}
          </span>

          <button
            onClick={handleNext}
            disabled={page===Math.ceil(totalResults/10)}>
            Next
          </button>
        </div>
      </div>
    </>
  )
}
