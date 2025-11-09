import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os  # 환경 변수를 사용하기 위해 추가

# --- FastAPI 앱 생성 ---
app = FastAPI()

# --- 설정 (TMDb API 키) ---
# docker-compose.yml의 env_file을 통해 .env 파일에서 주입됩니다.
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie"

# --- CORS 미들웨어 설정 ---
# React 앱이 실행될 주소
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite 기본 포트
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API 엔드포인트 ---

@app.get("/")
def read_root():
    """ 서버가 살아있는지 확인하는 루트 엔드포인트 """
    # .env 파일에서 TMDB_API_KEY를 읽었는지 확인
    if not TMDB_API_KEY:
        return {"status": "error", "message": "TMDB_API_KEY is not set in .env file."}
    
    return {"status": "success", "message": "Movie recommendation API server is running"}


@app.get("/search")
async def search_movies(query: str):
    """
    영화 제목 자동완성을 위한 검색 엔드포인트
    React에서 /search?query=... 로 호출합니다.
    """
    if not query:
        return []
    
    # API 키가 설정되지 않았다면 에러 반환
    if not TMDB_API_KEY:
        return {"error": "TMDb API key is missing or not set up on the server."}

    params = {
        "api_key": TMDB_API_KEY,
        "query": query,
        "language": "ko-KR",  # 한국어 결과 우선
        "page": 1
    }

    # TMDb API에 비동기로 요청
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(TMDB_SEARCH_URL, params=params)
            response.raise_for_status()  # 200 OK가 아니면 예외 발생
        
        except httpx.HTTPStatusError as e:
            # API 키가 잘못되었거나(401) 요청이 잘못된 경우(404 등)
            if e.response.status_code == 401:
                return {"error": "Invalid TMDb API key. Please check your .env file."}
            return {"error": f"TMDb API error: {e.response.status_code} - {e.response.text}"}
        except Exception as e:
            return {"error": f"An unexpected error occurred: {e}"}

    # 결과 처리 (try 블록 밖으로 이동)
    search_results = response.json().get("results", [])
    
    # React에 필요한 최소한의 정보만 가공하여 반환
    simplified_results = [
        {
            "id": movie.get("id"),
            "title": movie.get("title"),
            "release_date": movie.get("release_date", "N/A"),
            "poster_path": movie.get("poster_path")
        }
        for movie in search_results[:10]  # 상위 10개 결과만 반환
    ]
    return simplified_results