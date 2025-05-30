# JWonder 운동 앱

Next.js로 구축된 개인 운동 관리 애플리케이션입니다.

## 기능

- 운동 기록 관리
- 진행상황 추적
- 개인 맞춤형 운동 계획

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 시작하기

### 필수 조건

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

1. 리포지토리 클론

```bash
git clone https://github.com/jwonder83/jwonder.git
cd jwonder
```

1. 의존성 설치

```bash
npm install
```

1. 개발 서버 실행

```bash
npm run dev
```

1. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

## 배포

이 프로젝트는 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)에 쉽게 배포할 수 있습니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/deployment)를 참조하세요.

## 라이센스

ISC

## 🤖 AI 챗봇 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 추가하세요:

```bash
# OpenAI API 키
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. API 키 발급 방법

#### Option 1: OpenAI (추천)

1. [OpenAI Platform](https://platform.openai.com/) 회원가입
2. [API Keys](https://platform.openai.com/api-keys) 페이지에서 새 키 생성
3. 생성된 키를 `.env.local`에 추가

#### Option 2: Google Gemini (무료 할당량 많음)

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 방문
2. API 키 생성
3. `.env.local`에 `GEMINI_API_KEY=your_key` 추가
4. `app/api/chat/route.ts`를 Gemini용으로 변경

#### Option 3: 로컬 AI (완전 무료)

1. [Ollama](https://ollama.ai/) 설치
2. `ollama run llama2` 실행
3. API 엔드포인트를 localhost:11434로 변경

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 챗봇 테스트

- 브라우저에서 `http://localhost:3000` 접속
- 우하단 노란색 챗봇 버튼 클릭
- 실제 AI와 대화 시작! 🎪

## 💡 추가 기능 구현 아이디어

- **음성 인식**: Web Speech API
- **이미지 분석**: OpenAI Vision API
- **대화 기록**: localStorage 또는 데이터베이스
- **다국어 지원**: i18n
- **테마 변경**: 다크모드, 다른 캐릭터 스타일

## 🚀 배포

### Vercel (추천)

```bash
npm install -g vercel
vercel
```

환경 변수를 Vercel 대시보드에서 설정하세요.

---

## 기존 내용

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
