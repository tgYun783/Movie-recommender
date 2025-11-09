import { useState, useEffect } from 'react';
import './App.css';

// FastAPI 서버 주소 (docker-compose.yml에서 설정한 'api' 서비스)
// React는 브라우저에서 실행되므로, 'localhost:8000'으로 접근합니다.
const API_URL = 'http://localhost:8000';

function App() {
  // 1. 사용자가 입력 중인 검색어
  const [searchTerm, setSearchTerm] = useState('');
  
  // 2. API로부터 받은 검색 결과 (영화 목록)
  const [searchResults, setSearchResults] = useState([]);
  
  // 3. 사용자가 최종 선택한 영화
  const [selectedMovie, setSelectedMovie] = useState(null);

  // useEffect: searchTerm이 변경될 때마다 실행됩니다.
  useEffect(() => {
    // 사용자가 타이핑을 멈출 때까지 기다리기 (디바운싱)
    const delayDebounceFn = setTimeout(() => {
      // 검색어가 비어있지 않다면 API 호출
      if (searchTerm) {
        fetch(`${API_URL}/search?query=${searchTerm}`)
          .then(response => response.json())
          .then(data => {
            if (data && !data.error) {
              setSearchResults(data);
            } else {
              setSearchResults([]);
            }
          })
          .catch(error => console.error("Search API Error:", error));
      } else {
        // 검색어가 비어있으면 결과 목록도 비움
        setSearchResults([]);
      }
    }, 500); // 500ms (0.5초) 동안 타이핑이 없으면 검색 실행

    // cleanup 함수:
    // 0.5초가 지나기 전에 사용자가 다시 타이핑하면, 
    // 이전에 예약된 API 호출(setTimeout)을 취소합니다.
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // searchTerm이 바뀔 때만 이 hook을 다시 실행

  // 검색 결과에서 영화를 클릭했을 때
  const handleMovieSelect = (movie) => {
    // 1. 선택한 영화를 state에 저장
    setSelectedMovie(movie);
    // 2. 검색창에 선택한 영화 제목을 표시
    setSearchTerm(movie.title);
    // 3. 검색 결과(드롭다운)를 닫음
    setSearchResults([]);
  };

  // 포스터 이미지 URL을 완성해주는 헬퍼 함수
  const getPosterUrl = (posterPath) => {
    return posterPath 
      ? `https://image.tmdb.org/t/p/w200${posterPath}`
      : 'https://placehold.co/200x300?text=No+Image'; // 포스터 없을 시
  };

  return (
    <div className="container">
      <h1>🎬 영화 취향 분석기</h1>
      <p>가장 좋아하는 영화를 검색해 보세요.</p>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="예: 인셉션, 기생충..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* 검색 결과 드롭다운 */}
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map(movie => (
              <li 
                key={movie.id} 
                className="result-item"
                onClick={() => handleMovieSelect(movie)}
              >
                <img 
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title} 
                  className="result-poster"
                />
                <div className="result-info">
                  <strong>{movie.title}</strong>
                  <span>({movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 사용자가 영화를 선택하면 표시됨 */}
      {selectedMovie && (
        <div className="selected-movie">
          <h2>선택한 영화: {selectedMovie.title}</h2>
          <img 
            src={getPosterUrl(selectedMovie.poster_path)}
            alt={selectedMovie.title}
          />
          <p>(영화 ID: {selectedMovie.id})</p>
        </div>
      )}
    </div>
  );
}

export default App;