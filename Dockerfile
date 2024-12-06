# 1. Node.js LTS 버전 사용
FROM node:18-bullseye

# 2. 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 관리 파일 복사
COPY package.json package-lock.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. 환경 변수 설정 (.env.local 복사)
COPY .env.local .env

# 7. Next.js 애플리케이션 빌드
RUN npm run build

# 8. Next.js가 사용할 포트 정의
EXPOSE 3000

# 9. 컨테이너 시작 명령 (로컬 next 실행)
CMD ["node", "/app/node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0"]
