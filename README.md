🎬 영화 취향 분석 및 추천 시스템

사용자가 좋아하는 영화를 입력하면, 해당 영화들의 줄거리와 키워드를 TF-IDF 알고리즘으로 분석하여 사용자의 취향 프로필을 생성합니다. 이 프로필을 기반으로 데이터베이스 내의 다른 영화들과 유사도를 비교하여 맞춤형 영화를 추천해주는 웹 애플리케이션입니다.

모든 서비스는 Docker Compose를 통해 컨테이너 환경에서 실행됩니다.

✨ 주요 기능

영화 검색: TMDb API와 연동하여 영화를 검색하고 자동완성 목록을 제공합니다.

취향 분석: (구현 예정) 사용자가 선택한 영화 목록을 기반으로 TF-IDF 벡터를 생성합니다.

영화 추천: (구현 예정) 생성된 취향 벡터와 pgvector에 저장된 영화 벡터 간의 코사인 유사도를 계산하여 영화를 추천합니다.

🛠️ 기술 스택 (Tech Stack)

Frontend: React (Vite), JavaScript

Backend: FastAPI (Python 3.10)

Database: PostgreSQL (with pgvector extension)

API: TMDb (The Movie Database)

DevOps: Docker, Docker Compose

🏛️ 시스템 아키텍처

이 프로젝트는 Docker Compose에 의해 관리되는 3개의 컨테이너로 구성됩니다.

web (React): 사용자가 접속하는 프론트엔드 UI 서버 (포트 5173)

api (FastAPI): 추천 로직 및 TMDb API 연동을 담당하는 백엔드 API 서버 (포트 8000)

db (PostgreSQL): 영화 메타데이터와 벡터를 저장하는 데이터베이스 (호스트 포트 8888)

🚀 로컬 환경에서 실행하기

1. 사전 요구 사항

Docker Desktop이 설치되어 있어야 합니다.

TMDb API Key가 필요합니다. (발급 방법은 .env.example 참조)

2. 프로젝트 클론

git clone [https://github.com/](https://github.com/)[Your-Username]/[Your-Repo-Name].git
cd [Your-Repo-Name]


3. 환경 변수 설정 (매우 중요!)

루트 디렉토리에 있는 .env.example 파일을 복사하여 .env 파일을 생성합니다.

cp .env.example .env


생성된 .env 파일을 열어, 발급받은 본인의 TMDb API 키를 입력합니다.

# .env
TMDB_API_KEY=여러분의_TMDb_API_키를_여기에_붙여넣으세요


4. Docker Compose 실행

터미널(zsh)에서 아래 명령어를 입력하여 모든 서비스를 빌드하고 실행합니다.

docker-compose up --build


최초 실행 시 이미지를 다운로드하고 의존성을 설치하느라 시간이 다소 걸릴 수 있습니다.

5. 서비스 접속

빌드가 완료되고 모든 컨테이너가 실행되면, 아래 주소로 접속하여 확인할 수 있습니다.

React 웹페이지: http://localhost:5173

FastAPI 서버 (루트): http://localhost:8000

FastAPI (검색 테스트): http://localhost:8000/search?query=인셉션

PostgreSQL DB (외부 접속 시): Host: localhost, Port: 8888

⚙️ Docker Compose 스크립트

서비스 시작: docker-compose up (백그라운드 실행: docker-compose up -d)

서비스 중지: docker-compose down

특정 서비스 로그 확인 (예: api): docker-compose logs -f api

강제 재빌드: docker-compose up --build

📄 라이센스

이 프로젝트는 MIT License를 따릅니다.