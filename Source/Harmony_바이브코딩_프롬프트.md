# 🎼 Harmony 악보 웹앱 — 단계별 바이브코딩 프롬프트북

> 세 개의 개발 계획서(Harmony / OpusWeb / Score Webapp Plan)를 통합·정제하여, AI 코딩 도구(Cursor, Claude Code, Windsurf 등)에 그대로 복사해 넣을 수 있도록 만든 **실행용 프롬프트 모음집**입니다.

**문서 버전:** v1.0
**작성일:** 2026-05-21
**대상 도구:** Cursor / Claude Code / Windsurf / GitHub Copilot Chat
**프로젝트 코드네임:** **Harmony**
**예상 총 작업 기간:** 1인 기준 약 12~16주 (MVP까지)

---

## 📖 이 문서를 쓰는 법

1. **각 단계는 하나의 "AI 세션 단위"입니다.** 한 번에 한 단계씩만 AI에게 시키세요. 욕심내면 망합니다.
2. **각 단계 안의 `📋 AI 프롬프트` 블록을 그대로 복사**해서 Cursor/Claude Code 등에 붙여넣으세요.
3. **`✅ 완료 검증` 항목을 직접 손으로 확인**한 뒤에만 다음 단계로 넘어가세요.
4. **`⚠️ 자주 발생하는 함정`을 먼저 읽고** 시작하면 1~2시간 절약됩니다.
5. **0단계와 시스템 프롬프트(아래 §A)는 반드시 먼저 읽고** 새 AI 세션마다 시스템 프롬프트를 다시 주입하세요.

---

## 🗂️ 목차

- [§A. 모든 AI 세션에 공통으로 주입할 시스템 프롬프트](#a-모든-ai-세션에-공통으로-주입할-시스템-프롬프트)
- [§B. 프로젝트 헌법 — 절대 깨면 안 되는 규칙 12가지](#b-프로젝트-헌법--절대-깨면-안-되는-규칙-12가지)
- [§C. 기술 스택 고정 (확정안)](#c-기술-스택-고정-확정안)
- [§D. 폴더 구조 (모노레포 전제)](#d-폴더-구조-모노레포-전제)
- **[Phase 0 — 기반 다지기](#phase-0--기반-다지기)**
  - [0단계: 프로젝트 부트스트랩](#0단계-프로젝트-부트스트랩)
- **[Phase 1 — 코어 엔진](#phase-1--코어-엔진)**
  - [1단계: Semantic Score Model 정의](#1단계-semantic-score-model-정의)
  - [2단계: VexFlow 렌더링 어댑터 구축](#2단계-vexflow-렌더링-어댑터-구축)
  - [3단계: Zustand 스토어 + Operation 로그](#3단계-zustand-스토어--operation-로그)
- **[Phase 2 — 입력과 편집](#phase-2--입력과-편집)**
  - [4단계: 마우스 클릭 음표 입력](#4단계-마우스-클릭-음표-입력)
  - [5단계: 키보드 음표 입력 (A-G, 1-8)](#5단계-키보드-음표-입력-a-g-1-8)
  - [6단계: 선택 시스템과 하단 상태바](#6단계-선택-시스템과-하단-상태바)
  - [7단계: Undo/Redo 무결성 보장](#7단계-undoredo-무결성-보장)
- **[Phase 3 — 직관성의 핵심 UX](#phase-3--직관성의-핵심-ux)**
  - [8단계: 미니 플로팅 툴바 (Notion 스타일)](#8단계-미니-플로팅-툴바-notion-스타일)
  - [9단계: 명령 팔레트 Cmd+K](#9단계-명령-팔레트-cmdk)
  - [10단계: 상황형 슬래시 메뉴](#10단계-상황형-슬래시-메뉴)
- **[Phase 4 — 음악 요소 확장](#phase-4--음악-요소-확장)**
  - [11단계: 임시표·조표·박자표·다이내믹](#11단계-임시표조표박자표다이내믹)
  - [12단계: 슬러·타이·아티큘레이션](#12단계-슬러타이아티큘레이션)
  - [13단계: 한글 가사 입력 최적화](#13단계-한글-가사-입력-최적화)
  - [14단계: 코드 심볼 입력](#14단계-코드-심볼-입력)
- **[Phase 5 — 들리는 악보](#phase-5--들리는-악보)**
  - [15단계: Tone.js 재생 엔진](#15단계-tonejs-재생-엔진)
  - [16단계: 재생 커서 & 메트로놈](#16단계-재생-커서--메트로놈)
  - [17단계: WebMIDI 입력](#17단계-webmidi-입력)
- **[Phase 6 — 호환성과 출력](#phase-6--호환성과-출력)**
  - [18단계: MusicXML Import](#18단계-musicxml-import)
  - [19단계: MusicXML Export](#19단계-musicxml-export)
  - [20단계: PDF / SVG / MIDI 내보내기](#20단계-pdf--svg--midi-내보내기)
- **[Phase 7 — 저장과 공유](#phase-7--저장과-공유)**
  - [21단계: IndexedDB 오프라인 자동저장](#21단계-indexeddb-오프라인-자동저장)
  - [22단계: Supabase 클라우드 동기화](#22단계-supabase-클라우드-동기화)
  - [23단계: 공유 링크 & 권한](#23단계-공유-링크--권한)
- **[Phase 8 — 다중 파트와 모바일](#phase-8--다중-파트와-모바일)**
  - [24단계: 다중 악기·다중 보표](#24단계-다중-악기다중-보표)
  - [25단계: 모바일·태블릿 반응형](#25단계-모바일태블릿-반응형)
- **[Phase 9 — v1.0 이후 확장 (요약)](#phase-9--v10-이후-확장-요약)**
- **[부록 — 자주 쓰는 미니 프롬프트 스니펫](#부록--자주-쓰는-미니-프롬프트-스니펫)**

---

## §A. 모든 AI 세션에 공통으로 주입할 시스템 프롬프트

> **사용법:** 새 AI 세션을 시작할 때마다(또는 Cursor의 `.cursorrules` / Claude Code의 `CLAUDE.md`에) 아래 블록 전체를 붙여넣으세요. 그래야 AI가 매번 우리 프로젝트 컨벤션을 까먹지 않습니다.

```
당신은 "Harmony"라는 웹 기반 악보 편집기를 만드는 시니어 풀스택 엔지니어입니다.
저는 이 프로젝트의 단독 개발자이며, 단계별로 기능을 쌓아가고 있습니다.

[제품 한 줄]
"3초 안에 작곡을 시작할 수 있고, 학생도 작곡가도 똑같이 행복한 웹 기반 악보 편집기."

[기술 스택 — 절대 임의로 바꾸지 마세요]
- 프레임워크: Next.js 15 (App Router) + React 19 + TypeScript (strict)
- 스타일: Tailwind CSS + shadcn/ui
- 상태관리: Zustand (협업 단계에서 Yjs 추가)
- 악보 렌더링: VexFlow 5 (메인) + OpenSheetMusicDisplay (MusicXML 파싱용)
- 오디오: Tone.js + Web Audio API + WebMIDI API
- 백엔드/DB: Supabase (PostgreSQL + Auth + Storage)
- 오프라인: IndexedDB (Dexie.js 권장)
- 패키지 매니저: pnpm (모노레포는 pnpm workspaces)
- 테스트: Vitest (단위) + Playwright (E2E)

[코드 컨벤션]
1. 모든 새 파일은 TypeScript. `any`는 절대 쓰지 말고, 모르면 `unknown` + 타입가드.
2. React 컴포넌트는 함수형 + named export. default export 금지.
3. 상태는 Zustand 스토어 또는 React Hook으로만. props drilling 3단계 초과 금지.
4. 악보 데이터는 절대로 화면 좌표(x, y)와 섞지 말 것 — 의미 데이터(Semantic Model)와 레이아웃(Layout)을 반드시 분리.
5. MusicXML은 "교환 포맷"으로만. 내부 저장 포맷이 아님.
6. 모든 편집은 ScoreOperation 객체로 표현되어 operation log에 기록될 것.
7. UI 문자열은 i18n 키로 (한국어/영어 dual). 하드코딩 금지.
8. 파일·폴더명: kebab-case, 컴포넌트명: PascalCase, 함수/변수: camelCase.
9. 한 파일은 300줄 이내 권장. 넘으면 분리 제안.
10. 외부 라이브러리 추가 전에 반드시 저에게 물어볼 것.

[작업 원칙]
- 한 번에 한 가지 일만. 단계가 끝나면 멈춰서 검증을 기다릴 것.
- 코드 작성 전에 "이 단계에서 변경할 파일 목록"을 먼저 보여줄 것.
- 새 기능을 만들 때 기존 코드가 깨질 가능성이 있으면 먼저 경고할 것.
- 임의로 다른 단계의 기능을 미리 만들지 말 것 — 단계 순서가 중요.
- 추측이 아닌 근거 기반으로 답변. 모르면 "확인이 필요합니다"라고 솔직히 말할 것.

[금지 사항]
- localStorage/sessionStorage 사용 금지 (IndexedDB 또는 서버 사용).
- VexFlow API를 컴포넌트 안에서 직접 호출 금지 — 반드시 어댑터 레이어 경유.
- 음표 좌표를 데이터 모델에 저장 금지.
- "any" 타입, "as any" 캐스팅, "@ts-ignore" 사용 금지.
- 무거운 라이브러리 즉흥 도입 금지 (lodash 전체 import 등).

[지금 단계]
(여기에 현재 진행 중인 단계 번호와 제목을 채워서 시작하세요. 예: "지금은 5단계: 키보드 음표 입력입니다.")
```

---

## §B. 프로젝트 헌법 — 절대 깨면 안 되는 규칙 12가지

이 12가지를 어기는 순간 나중에 무조건 다시 만들게 됩니다. 단계 진행 중 AI가 어기려 하면 즉시 멈추고 다시 시키세요.

1. **데이터와 레이아웃을 섞지 않는다.** `Note` 객체에 `x: 120` 같은 픽셀 좌표가 들어가면 즉시 잘못된 것.
2. **모든 편집은 `ScoreOperation`을 거친다.** 컴포넌트가 스토어를 직접 mutate 하지 않는다.
3. **모든 음표/마디/이벤트는 안정적인 `id`를 갖는다.** 인덱스 기반 참조 금지.
4. **MusicXML은 import/export에만 쓴다.** 내부 모델은 자체 JSON.
5. **첫 화면은 빈 보표.** 로그인 화면, 스플래시, 광고, 튜토리얼 모달 모두 금지.
6. **모든 기능은 키보드만으로 조작 가능해야 한다.**
7. **자동 저장은 신성하다.** 사용자가 작업 손실을 한 번이라도 겪으면 신뢰는 끝.
8. **Undo는 50회 이상, 어떤 경우에도 깨지지 않는다.**
9. **렌더링 성능: 50마디 4파트 악보가 60fps로 스크롤되어야 한다.**
10. **에러는 친절하게.** "Error: Invalid pitch" 대신 "이 음은 첼로 음역 밖이에요. 한 옥타브 내릴까요?"
11. **모바일에서 최소한 보기/재생/댓글은 가능해야 한다.** 데스크톱 전용 기능은 명시.
12. **AI 기능은 핵심 편집기가 안정된 뒤에 붙인다.** 광이 나기 전에 광택제부터 사면 안 됨.

---

## §C. 기술 스택 고정 (확정안)

세 계획서를 교차 비교한 결과 다음 스택이 가장 합리적입니다.

| 레이어 | 선택 | 대안(검토했으나 제외) | 선택 이유 |
|---|---|---|---|
| 프레임워크 | **Next.js 15** (App Router) | SvelteKit, Remix | React 생태계, SSR, Vercel 배포 매끄러움 |
| 언어 | **TypeScript 5.x** (strict) | — | 협업·유지보수 필수 |
| 스타일 | **Tailwind CSS 4** + **shadcn/ui** | Mantine, MUI | 디자인 자유도 + 빠른 프로토타이핑 |
| 상태관리 | **Zustand** | Redux, Jotai | 가볍고 React 18+ 친화 |
| 협업 | **Yjs** (v1 단계) | Automerge, OT | CRDT 가장 검증됨, Liveblocks 호환 |
| 악보 렌더링 | **VexFlow 5** + **OpenSheetMusicDisplay** | abcjs, alphaTab | TS 친화, MusicXML 지원 |
| 오디오 합성 | **Tone.js** | Howler, native Web Audio raw | 음악적 추상화 풍부 |
| MIDI | **WebMIDI API** + **webmidi.js** 래퍼 | — | 표준 |
| 인증/DB/스토리지 | **Supabase** | Firebase, 자체 호스팅 | PostgreSQL, RLS, 한국에서 사용 가능 |
| 오프라인 저장소 | **Dexie.js** (IndexedDB 래퍼) | localForage | 쿼리 강력함 |
| 폼/검증 | **react-hook-form** + **zod** | Formik | 가벼움 |
| PDF 생성 | **jsPDF** + 자체 SVG 변환 (1차) → **서버사이드 Puppeteer** (2차) | pdfmake | 클라이언트 우선, 대형 악보는 서버 |
| 테스트 | **Vitest** + **Playwright** | Jest, Cypress | 빠름 |
| 패키지 매니저 | **pnpm** + workspaces | npm, yarn | 모노레포 효율 |
| 배포 | **Vercel** (프론트) + **Supabase** (백) | Fly.io, AWS | 초기 단계 최적 |
| 모니터링 | **Sentry** + **PostHog** | Datadog | 가성비 |

---

## §D. 폴더 구조 (모노레포 전제)

```
harmony/
├── apps/
│   └── web/                          # Next.js 15 메인 앱
│       ├── app/                      # App Router
│       │   ├── (marketing)/          # 랜딩 페이지
│       │   ├── (editor)/             # 에디터 (로그인 불필요)
│       │   │   └── score/[id]/
│       │   ├── api/                  # Route Handlers
│       │   └── layout.tsx
│       ├── components/
│       │   ├── editor/               # 에디터 UI 컴포넌트
│       │   ├── ui/                   # shadcn/ui 컴포넌트
│       │   └── shared/
│       ├── lib/
│       │   ├── supabase/
│       │   └── utils/
│       └── public/
├── packages/
│   ├── notation-engine/              # 🎯 핵심: 의미 기반 악보 모델 + 명령 엔진
│   │   ├── src/
│   │   │   ├── model/                # Score, Player, Flow, Measure, Voice, NotationEvent
│   │   │   ├── operations/           # ScoreOperation 정의와 적용 로직
│   │   │   ├── selection/            # 선택 모델
│   │   │   ├── undo/                 # 무한 undo/redo 스택
│   │   │   └── index.ts
│   │   └── tests/
│   ├── renderer/                     # VexFlow 어댑터
│   │   ├── src/
│   │   │   ├── adapter.ts            # Model → VexFlow 변환
│   │   │   ├── layout.ts             # 페이지/시스템 레이아웃
│   │   │   └── overrides.ts          # 수동 조정 레이어
│   │   └── tests/
│   ├── audio/                        # 재생 엔진
│   │   ├── src/
│   │   │   ├── scheduler.ts          # Tone.Transport 기반
│   │   │   ├── synth.ts              # 악기별 합성
│   │   │   └── midi.ts               # WebMIDI 입력
│   │   └── tests/
│   ├── musicxml/                     # MusicXML 변환기
│   │   ├── src/
│   │   │   ├── import.ts
│   │   │   └── export.ts
│   │   └── tests/
│   ├── shared-types/                 # 공유 타입 정의
│   └── ui/                           # 공통 UI 컴포넌트
├── .cursorrules                      # Cursor용 시스템 프롬프트
├── CLAUDE.md                         # Claude Code용 시스템 프롬프트
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── README.md
```

**왜 이렇게 나누나?**
- `notation-engine`: 향후 모바일 앱이나 서버 사이드 변환에서도 그대로 재사용.
- `renderer` 분리: VexFlow를 나중에 자체 엔진으로 교체할 때 이 패키지만 갈아끼우면 됨.
- `audio`, `musicxml`: 각자 독립적으로 테스트 가능.

---


# Phase 0 — 기반 다지기

## 0단계: 프로젝트 부트스트랩

**🎯 목표:** pnpm 모노레포 + Next.js 15 + Tailwind + shadcn/ui + Supabase 클라이언트 세팅이 완료된 상태. `pnpm dev`로 빈 페이지가 뜨면 성공.

**📦 의존성:** 없음 (가장 처음)
**⏱️ 예상 시간:** 1~2시간

### 사전 준비 (사람이 직접)
1. Node.js 20 LTS 이상 설치 확인: `node -v`
2. pnpm 설치: `npm i -g pnpm`
3. GitHub 빈 리포 생성 (`harmony`)
4. Supabase 프로젝트 생성 → `Project URL`과 `anon key`를 메모장에 복사

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 0단계: 프로젝트 부트스트랩입니다.

다음 폴더 구조로 pnpm 모노레포를 만들어주세요:

harmony/
├── apps/web/                  # Next.js 15 App Router
├── packages/notation-engine/  # 빈 TS 패키지
├── packages/renderer/         # 빈 TS 패키지
├── packages/audio/            # 빈 TS 패키지
├── packages/musicxml/         # 빈 TS 패키지
├── packages/shared-types/     # 빈 TS 패키지
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── README.md

요구사항:
1. apps/web은 `pnpm create next-app@latest`로 만들되 아래 옵션:
   - TypeScript: Yes
   - ESLint: Yes
   - Tailwind CSS: Yes
   - src/ directory: No
   - App Router: Yes
   - Turbopack: Yes
   - import alias: @/*
2. packages/* 는 각각 package.json, tsconfig.json, src/index.ts(빈 export)만 있는 최소 구조.
3. 각 패키지의 package.json은 `"name": "@harmony/<name>"` 형식. 모두 `"private": true`.
4. apps/web에 다음 의존성 추가:
   - shadcn/ui 초기 세팅 (`npx shadcn@latest init` — Slate 컬러, CSS variables)
   - shadcn 컴포넌트 미리 설치: button, dialog, command, popover, tooltip, sonner, dropdown-menu
   - @supabase/supabase-js, @supabase/ssr
   - zustand, immer
   - zod
   - dexie, dexie-react-hooks
   - lucide-react
5. tsconfig.base.json은 strict 모드, paths에 `@harmony/*` 매핑.
6. apps/web의 tsconfig.json은 base를 extends하고 @harmony/* paths 상속.
7. 루트 package.json에 스크립트:
   - "dev": "pnpm --filter @harmony/web dev"
   - "build": "pnpm -r build"
   - "lint": "pnpm -r lint"
   - "typecheck": "pnpm -r typecheck"
8. .gitignore에 node_modules, .next, .env*.local 추가.
9. apps/web/.env.local.example 파일에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 자리 만들기.
10. apps/web/lib/supabase/client.ts와 server.ts 작성 (Next.js 15 App Router용 표준 패턴).
11. apps/web/app/page.tsx는 임시로 "Harmony" 큰 글자만 표시.
12. README.md에 setup 가이드 (3줄 정도면 충분).

작업 시작 전에 "만들 파일 목록"부터 먼저 보여주고 제가 OK 하면 진행해주세요.
```

### ✅ 완료 검증
- [ ] `pnpm install`이 에러 없이 끝남
- [ ] `pnpm dev`로 http://localhost:3000 에서 "Harmony" 글자가 보임
- [ ] `pnpm typecheck`가 통과
- [ ] `pnpm lint`가 통과
- [ ] 각 packages/* 폴더 안에서 `import { ... } from "@harmony/notation-engine"`이 IDE에서 자동완성 됨
- [ ] `apps/web/.env.local`에 Supabase 키를 넣고 `lib/supabase/client.ts`에서 createClient가 동작

### ⚠️ 자주 발생하는 함정
- **shadcn/ui가 src/ 디렉토리를 기대하는 경우:** Next.js 생성 시 src/ 옵션을 No로 했다면 shadcn config의 alias 경로를 직접 수정해야 함. `components.json`의 `aliases` 확인.
- **pnpm workspace 인식 실패:** `pnpm-workspace.yaml`에서 들여쓰기가 깨지면 모든 게 무너짐. YAML 스펙 엄격함.
- **Tailwind v4와 shadcn 호환성:** 2026년 5월 시점에서 shadcn이 Tailwind v4를 정식 지원하는지 확인. 안 되면 v3 고정.
- **Supabase ssr 패키지 신버전 마이그레이션:** `@supabase/auth-helpers-nextjs`는 deprecated. 반드시 `@supabase/ssr` 사용.

---

# Phase 1 — 코어 엔진

## 1단계: Semantic Score Model 정의

**🎯 목표:** 모든 향후 작업의 토대가 될 자체 데이터 모델을 TypeScript 타입으로 완전히 정의. **이 단계가 잘못되면 6개월 뒤에 전체 리팩토링.** 시간을 충분히 쓰세요.

**📦 의존성:** 0단계 완료
**⏱️ 예상 시간:** 4~6시간 (절대 서두르지 말 것)

### 핵심 원칙
- **모든 객체는 안정적 `id`를 가진다** (협업 시 CRDT 동기화의 기반)
- **데이터(Model)와 표현(Layout)을 분리한다**
- **MusicXML과 무손실 왕복 가능한 구조**

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 1단계: Semantic Score Model 정의입니다.

packages/notation-engine/src/model/ 안에 악보의 의미 데이터 구조를
TypeScript 타입으로 정의해주세요. 다음 계층 구조를 따릅니다:

Score
  ├─ metadata (제목, 작곡가, 작사가, 저작권 등)
  ├─ style (조판 스타일 프로필 참조)
  ├─ players[]            ← 연주자(논리적 단위)
  │    └─ instruments[]   ← 한 연주자가 여러 악기 가능
  ├─ flows[]              ← Dorico식 '악장' 또는 '곡' 단위
  │    └─ measures[]
  │         ├─ timeSignature
  │         ├─ keySignature
  │         ├─ barline
  │         └─ eventsByStaff: Record<StaffId, Voice[]>
  │              └─ Voice
  │                   └─ events: NotationEvent[]
  └─ layouts[]            ← 전체 악보, 파트보, 리드시트 등의 출력 layout

요구사항:
1. 모든 객체에 `id: string` 필드 (nanoid 사용, 별도 install 필요).
2. NotationEvent는 discriminated union:
   - NoteEvent (pitch, duration, dots, tied, voice)
   - RestEvent (duration, dots)
   - ChordSymbolEvent (root, quality, bass, position)
   - LyricEvent (verse, text, syllabic: 'single'|'begin'|'middle'|'end')
   - DynamicEvent (marking: 'pp'|'p'|'mp'|'mf'|'f'|'ff' 등, position)
   - ArticulationEvent (type, position)
   - DirectionEvent (text, placement)
   - RepeatEvent (kind: 'start'|'end'|'volta')
   - 각각 `kind` 필드로 구분
3. Pitch는 SPN(Scientific Pitch Notation) 객체로:
   { step: 'C'|'D'|'E'|'F'|'G'|'A'|'B', octave: number, alter?: -2|-1|0|1|2 }
4. Duration은 단순 enum이 아니라 객체:
   { base: 'whole'|'half'|'quarter'|'eighth'|'16th'|'32nd'|'64th', dots: 0|1|2, tuplet?: TupletInfo }
5. Instrument는 다음을 포함:
   - id, name, programChange (MIDI #)
   - transposition?: { diatonic: number, chromatic: number, octave: number }
   - clefs: Clef[]  ← 보표마다 음자리표 다를 수 있음
   - range?: { lowest: Pitch, highest: Pitch }
   - notationType: 'standard'|'tab'|'percussion'|'slash'|'grand-staff'
6. Layout은 '어떤 player를 포함하는지' + 'pageSettings'(A4, 마진, 페이지 크기) + 'overrides'(수동 조정 레이어).
7. **절대 금지**: x, y, width, height 등 픽셀 좌표는 이 모델에 들어가지 않습니다. 그건 renderer 패키지의 책임.
8. 모든 타입을 src/model/ 안에 적절히 파일 분리:
   - score.ts (Score, ScoreMetadata)
   - player.ts (Player, Instrument, Transposition)
   - flow.ts (Flow, Measure, Voice, Barline)
   - event.ts (NotationEvent와 모든 sub-types, Pitch, Duration, TupletInfo)
   - layout.ts (Layout, PageSettings, LayoutOverride, StyleProfile)
   - index.ts (모든 타입 re-export)
9. JSDoc 주석으로 각 필드의 의미를 한국어로 설명.
10. 마지막에 `createEmptyScore(): Score`라는 팩토리 함수 작성:
    - 4/4박자, C장조, 4마디, 1 player, 1 instrument(피아노), 양손 보표(treble + bass).
11. Vitest로 createEmptyScore의 모든 id가 unique한지 검증하는 테스트 1개 작성.

먼저 "만들 파일 목록과 각 파일의 주요 타입 이름"을 보여주고, 제가 OK 하면 구현해주세요.
파일 하나당 너무 길어지면(300줄 초과) 분리해주세요.
```

### ✅ 완료 검증
- [ ] `pnpm --filter @harmony/notation-engine test` 통과
- [ ] `import { Score, NotationEvent, createEmptyScore } from "@harmony/notation-engine"`이 apps/web에서 작동
- [ ] 모든 타입에 `id` 필드 존재
- [ ] 어디에도 `x`, `y` 같은 좌표 필드 없음 (`grep -r "x:" packages/notation-engine/src` 로 확인)
- [ ] `createEmptyScore()` 결과를 `JSON.stringify` 했을 때 깨지지 않음
- [ ] 모든 NotationEvent가 `kind` 필드로 구분되는 discriminated union

### ⚠️ 자주 발생하는 함정
- **AI가 좌표를 슬쩍 넣음:** 자동 생성에서 `position: { x, y }`가 들어가기 쉽습니다. position이 필요하면 'above'|'below'|'auto' 같은 의미값으로.
- **Duration을 number로 표현:** 0.25 (4분음표) 같은 식은 점음표·잇단음표를 표현 못함. 반드시 객체.
- **Voice를 무시:** 한 staff에 여러 voice가 가능해야 합니다 (예: 피아노 오른손에 멜로디+화음). voice id로 구분.
- **transposition을 단순 숫자로:** Bb 클라리넷은 long whole tone down이 아니라 diatonic/chromatic/octave 셋 다 필요.

---

## 2단계: VexFlow 렌더링 어댑터 구축

**🎯 목표:** Semantic Score Model을 입력으로 받아 화면에 SVG로 악보를 그려주는 어댑터 완성. `<ScoreView score={score} />` React 컴포넌트로 빈 보표 + 음표 몇 개가 표시되면 성공.

**📦 의존성:** 1단계 완료
**⏱️ 예상 시간:** 6~10시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 2단계: VexFlow 렌더링 어댑터 구축입니다.

packages/renderer/ 에 다음을 구현해주세요:

목적:
- @harmony/notation-engine의 Score 객체를 받아 SVG로 렌더링
- VexFlow를 React 컴포넌트가 직접 호출하지 않게 어댑터 레이어 제공
- 추후 VexFlow를 자체 엔진으로 교체할 수 있도록 격리

요구사항:

1. 의존성 추가:
   - vexflow@^5 (최신 5.x)
   - opensheetmusicdisplay (1단계에선 아직 안 씀, 18단계용으로 미리 install)

2. packages/renderer/src/ 구조:
   - adapter.ts: Score → VexFlow ScoreStaves 변환
   - layout.ts: 페이지 폭에 따른 시스템 분할 (1차는 단순: 한 페이지에 모든 마디 균등 분배)
   - render.ts: 메인 진입점. renderScore(score: Score, container: HTMLElement, options): RenderResult
   - types.ts: RenderOptions, RenderResult 타입
   - hit-test.ts: 마우스 좌표 → 어떤 음표/마디인지 알아내는 함수 (4단계에서 사용)

3. RenderOptions:
   - width: number (mm 또는 px)
   - zoom: number (1.0이 기본)
   - showMeasureNumbers: boolean
   - layoutId?: string (어떤 layout으로 렌더할지)

4. RenderResult:
   - svg: SVGElement
   - hitMap: Array<{ eventId, measureId, voiceId, bbox: DOMRect }>
     → 4단계에서 클릭 → 어떤 음표인지 알아낼 때 사용
   - dispose(): void

5. apps/web/components/editor/ScoreView.tsx 작성:
   - "use client"
   - props: score (Score)
   - useEffect로 renderer 호출, ref로 div에 SVG 삽입
   - score가 바뀌면 dispose하고 재렌더
   - resize observer로 컨테이너 폭 변하면 재렌더 (debounce 100ms)

6. apps/web/app/(editor)/score/[id]/page.tsx 작성:
   - id가 "new"면 createEmptyScore()로 새 악보
   - id가 그 외면 일단 createEmptyScore() (실제 로드는 22단계에서)
   - <ScoreView /> 렌더링

7. 1단계의 createEmptyScore에 첫 마디에 4분음표 4개(C4, D4, E4, F4)를 추가하는 헬퍼 함수
   addSampleNotes(score: Score): Score 를 notation-engine에 추가.
   page.tsx에서 createEmptyScore() → addSampleNotes 적용 후 ScoreView로 전달.

8. 화면에 빈 보표가 아니라 실제 음표가 있는 4마디 악보가 보여야 함.

9. VexFlow 5의 ES module import 방식 정확히 사용:
   import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';
   (vexflow의 default export는 더 이상 권장되지 않음)

10. SSR 문제: VexFlow는 DOM을 필요로 하므로 ScoreView는 반드시 client component.
    Next.js에서 다음과 같이 dynamic import:
    const ScoreView = dynamic(() => import('@/components/editor/ScoreView'), { ssr: false });

11. 절대 금지:
    - components 안에서 VexFlow API 직접 호출
    - score 객체에 SVG 관련 필드 추가
    - innerHTML로 SVG 삽입 (반드시 appendChild로 DOM 노드 삽입)

작업 시작 전에 어댑터의 핵심 흐름(Score → VexFlow 변환 단계)을 의사코드로 보여주고 OK 하면 구현해주세요.
```

### ✅ 완료 검증
- [ ] http://localhost:3000/score/new 에서 4마디 악보 + C4, D4, E4, F4 음표가 보임
- [ ] 브라우저 창 크기를 바꾸면 악보가 다시 그려짐
- [ ] DevTools에서 `<svg>` 요소를 확인 가능 (canvas 아님)
- [ ] components/editor/ 어디에도 `vexflow` import가 없음 (renderer 패키지를 통해서만)
- [ ] hitMap이 콘솔에 출력되어 각 음표의 위치를 확인 가능

### ⚠️ 자주 발생하는 함정
- **VexFlow 4 vs 5 API 차이:** 5에서 많은 게 깨졌습니다. AI가 4 코드 줄 가능성 큼. 반드시 v5 문법.
- **Next.js의 SSR 시 window undefined:** ScoreView는 반드시 dynamic import + ssr:false.
- **useEffect 두 번 호출(React Strict Mode):** dispose를 안 해두면 같은 SVG가 두 번 그려짐. cleanup 필수.
- **Hit map 좌표:** SVG의 viewBox와 화면 픽셀 좌표가 다릅니다. `getCTM()` 또는 `getBoundingClientRect`로 보정.

---

## 3단계: Zustand 스토어 + Operation 로그

**🎯 목표:** 모든 편집을 ScoreOperation 객체로 표현하고, 이를 적용·되돌릴 수 있는 중앙 스토어 구축. 컴포넌트는 절대 스토어를 직접 mutate하지 않고 dispatch만 한다.

**📦 의존성:** 1, 2단계 완료
**⏱️ 예상 시간:** 4~6시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 3단계: Zustand 스토어 + Operation 로그입니다.

packages/notation-engine/src/operations/ 와 src/undo/ 를 구현하고,
apps/web/lib/store/scoreStore.ts 에 Zustand 스토어를 만들어주세요.

요구사항:

1. ScoreOperation 타입 (operations/types.ts):

   type ScoreOperation =
     | { kind: 'insert-event'; target: EventPath; event: NotationEvent }
     | { kind: 'delete-event'; target: EventPath; previous: NotationEvent }
     | { kind: 'update-pitch'; target: EventPath; pitch: Pitch; previous: Pitch }
     | { kind: 'update-duration'; target: EventPath; duration: Duration; previous: Duration }
     | { kind: 'add-lyric'; target: EventPath; lyric: LyricEvent; previous?: LyricEvent }
     | { kind: 'add-chord-symbol'; target: MeasurePath; chord: ChordSymbolEvent }
     | { kind: 'transpose-selection'; targets: EventPath[]; semitones: number; previous: Pitch[] }
     | { kind: 'insert-measure'; target: FlowPath; index: number; measure: Measure }
     | { kind: 'delete-measure'; target: FlowPath; index: number; previous: Measure }
     | { kind: 'set-time-signature'; target: MeasurePath; ts: TimeSignature; previous: TimeSignature }
     | { kind: 'set-key-signature'; target: MeasurePath; ks: KeySignature; previous: KeySignature };

   ⚠️ 핵심: 모든 operation은 inverse(되돌리기)에 필요한 'previous' 정보를 함께 가집니다.
   이게 undo의 핵심입니다.

2. Path 타입 (어떤 객체를 가리키는지):

   type FlowPath = { flowId: string };
   type MeasurePath = { flowId: string; measureId: string };
   type EventPath = { flowId: string; measureId: string; staffId: string; voiceId: string; eventId: string };

3. operations/apply.ts:

   function applyOperation(score: Score, op: ScoreOperation): Score
   - immer를 사용해서 score를 immutably 업데이트
   - id로 객체를 찾고 변경
   - 찾지 못하면 throw

4. operations/invert.ts:

   function invertOperation(op: ScoreOperation): ScoreOperation
   - 모든 op의 inverse를 계산
   - 'insert-event'의 inverse는 'delete-event' 등

5. undo/stack.ts:

   class UndoStack {
     push(op: ScoreOperation): void
     undo(): ScoreOperation | null  // inverse를 반환 (호출자가 apply)
     redo(): ScoreOperation | null
     canUndo: boolean
     canRedo: boolean
     clear(): void
   }
   
   - push 하면 redo 스택이 비워짐
   - 무제한 길이지만 메모리 절약 위해 1000개 초과 시 오래된 것부터 제거

6. apps/web/lib/store/scoreStore.ts (Zustand):

   type ScoreState = {
     score: Score;
     selection: Selection;
     undoStack: UndoStack;
     
     // actions (모든 변경은 여기서만!)
     dispatch: (op: ScoreOperation) => void;
     undo: () => void;
     redo: () => void;
     setSelection: (sel: Selection) => void;
     loadScore: (score: Score) => void;
   };
   
   - dispatch는 내부적으로 applyOperation 호출 + undoStack에 push
   - undo는 stack.undo() → invertOperation → applyOperation
   - selection은 단순 { eventIds: string[]; measureIds: string[]; }로 시작

7. apps/web/components/editor/ScoreView.tsx 수정:
   - useScoreStore에서 score를 구독
   - score가 바뀌면 자동 재렌더 (이미 useEffect로 처리)

8. apps/web/components/editor/DebugPanel.tsx 작성:
   - 화면 하단에 작은 디버그 패널 (개발 중에만)
   - 현재 selection, undo stack 길이, 최근 5개 operation 표시
   - "Undo" / "Redo" 버튼 (3단계 검증용)

9. apps/web/app/(editor)/score/[id]/page.tsx 수정:
   - mount 시 loadScore(createEmptyScore())
   - DebugPanel 추가

10. 절대 금지:
    - 컴포넌트에서 set 함수로 직접 score 변경 (반드시 dispatch 경유)
    - operation 적용 시 push를 빼먹는 것 (그러면 undo 못 함)
    - immer의 draft를 함수 밖으로 반환

11. Vitest 테스트:
    - "100번 insert 후 100번 undo 하면 원래 score와 deep equal"
    - "undo 후 redo 하면 정확히 같은 상태로"
    - "invert(invert(op))는 op와 동등"

만들 파일 목록 먼저 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] 모든 테스트 통과
- [ ] DebugPanel에서 Undo/Redo 버튼을 50번 눌러도 안 깨짐
- [ ] 컴포넌트 어디에서도 `set(state => state.score = ...)` 같은 직접 변경이 없음 (grep으로 확인)
- [ ] AI나 외부 명령으로 dispatch를 시뮬레이션해도 동일하게 작동
- [ ] React DevTools에서 Zustand 스토어가 보임

### ⚠️ 자주 발생하는 함정
- **immer 함정:** Map/Set은 immer에서 별도 설정 필요. 가능하면 plain object 사용.
- **selection이 score 변경 후 stale:** id 기반이라 보통 괜찮지만, 삭제된 event를 가리키면 즉시 제거하는 방어 로직 필요.
- **빈 previous로 invert 불가능:** previous를 못 저장하는 op는 설계 결함. dispatch 단계에서 미리 채워야 함.
- **너무 큰 score 객체:** 1000마디짜리 악보면 immer 성능 저하. 향후 structural sharing 최적화 필요(지금은 무시).

---

# Phase 2 — 입력과 편집

## 4단계: 마우스 클릭 음표 입력

**🎯 목표:** 빈 마디 안의 빈 자리를 클릭하면 그 위치에 4분음표가 입력됨. 음표 길이는 하단 툴바에서 선택 가능. 가장 직관적이고 가장 자주 쓰일 입력 방식.

**📦 의존성:** 1, 2, 3단계 완료
**⏱️ 예상 시간:** 6~8시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 4단계: 마우스 클릭 음표 입력입니다.

기능 명세:
1. 화면 하단에 음표 길이 선택 툴바 (DurationToolbar):
   - 전음표, 2분, 4분, 8분, 16분, 32분 + 점음표 토글 + 쉼표 토글
   - 단축키 표시 (1=온음표, 2=2분, ... 6=32분, .=점음표 토글, 0=쉼표 토글)
   - 현재 선택된 duration이 highlight
2. 악보 위에 마우스를 올리면 그 위치의 미리보기 음표가 회색으로 표시 (ghost note).
3. 클릭하면 그 위치에 실제 음표 삽입:
   - 클릭한 staff와 y좌표로부터 pitch 계산 (오선 위치 → step + octave)
   - 현재 선택된 duration 사용
   - 클릭한 marker가 어느 voice에 들어갈지: 일단 voice 1 고정 (다성 처리는 나중)
   - 이 마디의 박자 합계를 넘으면 다음 마디로 자동 이월 (또는 경고)
4. 클릭 후 다음 박자 위치로 자동 advance (입력 커서가 옆으로 이동).
5. 빈 마디에 처음 클릭하면 정확히 첫 박자 위치에서 시작.

구현 요구사항:

A. apps/web/lib/store/inputStore.ts (별도 Zustand 스토어):
   - currentDuration: Duration (기본 4분음표)
   - isRestMode: boolean
   - inputCursor: EventPath | null  ← 다음 입력 위치
   - setDuration, toggleDot, toggleRest, advanceCursor

B. packages/renderer/src/hit-test.ts 확장:
   - pickStaffPosition(svg, x, y): { staffId, line: number, octave: number, step } | null
   - line은 오선 5선을 -10 ~ +10 정도로 모델링 (가운데 선이 0)
   - measureId와 그 안의 시간 위치(quarter 단위)도 반환

C. apps/web/components/editor/DurationToolbar.tsx:
   - shadcn/ui button group
   - 키보드 1~6, "." (dot), "0" (rest) 단축키 처리는 useEffect로 window.addEventListener('keydown')

D. apps/web/components/editor/ScoreView.tsx 수정:
   - onMouseMove: hit-test로 위치 알아내서 ghost note 표시
     → ghost는 별도 SVG layer로 그리기 (renderer 패키지에 drawGhost(svg, pitch, duration) 함수 추가)
   - onClick: hit-test 결과로 ScoreOperation 'insert-event' dispatch
   - 입력 후 inputCursor를 다음 박자로 이동

E. 마디 박자 합계 검증:
   - notation-engine에 measureFillRatio(measure): number 함수 (0.0~1.0+ 비율)
   - 1.0 초과 시: 화면 우상단에 토스트 "이 마디는 박자가 초과되었어요. ([sonner] 사용)"
   - 자동 분할(tie)은 v1으로 미루고 일단 경고만

F. 절대 금지:
   - inputStore에서 score를 직접 변경
   - hit-test 좌표 변환을 컴포넌트에서 직접
   - duration을 number로 표현

G. 테스트:
   - inputStore.setDuration이 정확히 동작하는지
   - measureFillRatio 계산이 정확한지 (3/4박자 + 4분음표 4개 = 1.333)

작업 시작 전에 ghost note 표시 방식과 hit-test 좌표 계산 로직의 의사코드를 보여주고 OK 하면 구현.
```

### ✅ 완료 검증
- [ ] 빈 마디를 클릭하면 정확한 음표가 삽입됨
- [ ] 음표 길이 토글이 키보드 1~6으로 작동
- [ ] 점음표 토글이 "." 키로 작동
- [ ] 음표를 입력해도 Undo로 정확히 되돌아감
- [ ] 한 마디를 박자 초과해서 입력하면 토스트 경고
- [ ] ghost note가 마우스 따라다님

### ⚠️ 자주 발생하는 함정
- **오선 위치 ↔ pitch 계산 실수:** 한 칸 차이가 한 음 차이. treble clef의 가운데 선(3번째)은 B4. 자주 off-by-one.
- **클릭 좌표를 SVG 내부 좌표로 변환:** `elem.getBoundingClientRect()` 만으로는 스크롤·zoom이 있으면 틀림. `getCTM().inverse()` 사용.
- **ghost note 재렌더링 폭풍:** mousemove마다 전체 재렌더하면 60fps 못 나옴. ghost는 별도 SVG 레이어에 그려 본 악보 SVG는 안 건드림.
- **dispatch 안에서 hit-test:** 비동기 race condition 가능. hit-test는 동기적으로 이벤트 핸들러 안에서 끝낼 것.

---

## 5단계: 키보드 음표 입력 (A-G, 1-8)

**🎯 목표:** 키보드만으로 음표를 빠르게 입력. A-G 키로 pitch, 1-7 키로 duration. Dorico/Sibelius 사용자가 즉시 친숙하게 느낄 수준.

**📦 의존성:** 4단계 완료
**⏱️ 예상 시간:** 4~5시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 5단계: 키보드 음표 입력입니다.

기능 명세:
1. 빈 보표를 클릭하면 "입력 모드(input mode)" 진입. 입력 커서가 화면에 표시 (작은 세로선).
2. 입력 모드에서:
   - A-G 키: 그 step의 음표를 현재 duration으로 입력. octave는 직전 음에서 가장 가까운 옥타브 자동 선택 (Dorico 규칙).
   - Shift + 화살표 위/아래: 직전 음을 한 옥타브 위/아래로
   - 화살표 위/아래(Shift 없이): 직전 음을 반음 위/아래
   - 1-7: duration 변경 (1=온음표, 2=2분, ... 7=64분)
   - .(점): 점음표 토글
   - R: 다음 입력을 쉼표로
   - Backspace: 직전 음 삭제
   - Esc: 입력 모드 종료
   - Space: 다음 박자로 advance (아무것도 입력 안 하고 건너뛰기)
3. 입력 모드 진입 시 화면에 작은 도움말 오버레이 (3초 후 페이드 아웃, "?" 키로 재표시).
4. Caps Lock과 무관 (대소문자 모두 같은 동작).

구현 요구사항:

A. apps/web/lib/input/keyboard.ts:
   - 키보드 이벤트를 ScoreOperation으로 변환하는 함수 모음
   - handleKeyDown(e, state): ScoreOperation | { type: 'cursor-move', ... } | null
   - state는 { score, selection, currentDuration, lastPitch }
   - lastPitch는 inputStore에 보관 (octave 추론용)

B. octave 자동 선택 알고리즘 (Dorico 규칙):
   - 직전 음과 가장 가까운 옥타브의 같은 step 선택
   - 정확히 4도 이내(perfect fourth)면 같은 방향 유지
   - 직전 음이 없으면 treble = octave 4, bass = octave 3

C. apps/web/components/editor/InputCursor.tsx:
   - SVG에 오버레이로 작은 깜빡이는 세로선
   - inputStore.inputCursor 위치에 따라 이동
   - CSS animation으로 깜빡임 (transform 사용, repaint 비싸지 않게)

D. apps/web/components/editor/EditorKeyboardHandler.tsx:
   - 화면 전체에 useEffect로 window.addEventListener('keydown')
   - input/textarea에 포커스 있을 땐 무시 (e.target instanceof HTMLInputElement 확인)
   - 4단계 DurationToolbar의 단축키와 충돌하지 않게: 5단계에선 1~7 충돌. Toolbar 단축키는 입력 모드 OUT일 때만 작동하도록 변경.

E. apps/web/components/editor/InputModeHint.tsx:
   - 입력 모드 진입 시 화면 우상단에 작은 카드
   - "A-G: 음표 / 1-7: 길이 / Esc: 나가기"
   - 3초 후 opacity 0으로 fade
   - "?" 키로 다시 표시

F. inputStore 확장:
   - isInputMode: boolean
   - lastPitch: Pitch | null
   - lastOctaveByStaff: Record<StaffId, number>

G. 절대 금지:
   - keydown 핸들러에서 score를 직접 변경 (반드시 dispatch)
   - 같은 키에 두 가지 동작 (모드별로 충돌 없게)
   - keyboard shortcut을 component마다 따로 등록 (5단계에서는 한 곳에서 처리)

H. 테스트:
   - "A 키를 누르면 직전 음에서 가장 가까운 옥타브의 A가 입력된다"
   - "1-7 키가 duration을 변경한다"
   - "Backspace가 직전 음을 정확히 삭제한다 (insert-event의 inverse)"

작업 시작 전에 octave 자동 선택 알고리즘의 의사코드와 keydown 핸들러 우선순위 순서를 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] 빈 악보에 A 키를 7번 누르면 7개 음표가 박자에 맞게 들어감
- [ ] 5초 동안 키보드로 8마디 멜로디 입력 가능 (속도 테스트)
- [ ] 화살표 위/아래로 반음 이동
- [ ] Backspace로 정확히 직전 음만 삭제
- [ ] 입력 모드 진입/종료가 깔끔 (Esc 동작)

### ⚠️ 자주 발생하는 함정
- **Caps Lock 영향:** `e.key`는 대소문자 반영. `e.key.toLowerCase()` 또는 `e.code` 사용.
- **input 요소 안에서 단축키 작동:** 항상 `e.target` 검사. 안 그러면 가사 입력 중에 음표가 추가됨.
- **브라우저 기본 동작 충돌:** Cmd+S, Cmd+R 등은 `e.preventDefault()`. 단 Tab은 접근성상 막지 않음.
- **연타 시 race:** 빠르게 두드리면 inputCursor가 비동기적으로 업데이트되어 두 음이 같은 자리에. Zustand의 set은 동기적이라 보통 괜찮지만, dispatch 안에서 다시 dispatch는 피할 것.

---

## 6단계: 선택 시스템과 하단 상태바

**🎯 목표:** 음표를 클릭/드래그/Shift+클릭으로 다중 선택 가능. 선택된 항목은 시각적으로 highlight. 화면 하단에 "3개 음표 선택됨, 평균 음높이 C5, 총 길이 1.5박" 같은 상태바.

**📦 의존성:** 5단계 완료
**⏱️ 예상 시간:** 4~6시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 6단계: 선택 시스템과 하단 상태바입니다.

기능 명세:
1. 클릭: 단일 음표 선택 (기존 선택 해제)
2. Shift+클릭: 추가 선택
3. Cmd/Ctrl+클릭: 토글 (선택 ↔ 해제)
4. 드래그(rubber band): 사각형 영역 안의 모든 음표 선택
5. Cmd/Ctrl+A: 현재 마디 안 모든 음표 선택 → 다시 누르면 현재 staff 전체 → 다시 누르면 전체
6. 선택된 음표는 파란색 outline + 약간 굵게 표시
7. Esc: 선택 해제 + 입력 모드 종료
8. 화면 하단 상태바:
   - 선택 없음: 마우스가 있는 마디 정보 (마디 번호, 박자, 조)
   - 선택 있음: 개수, 평균 음높이, 음높이 범위, 총 길이
   - 우측에 작은 박자/조표/템포 아이콘들

구현 요구사항:

A. notation-engine/src/selection/types.ts:
   - type Selection = {
       eventIds: Set<string>;
       measureIds: Set<string>;  ← 마디 통째 선택용
       anchor?: EventPath;        ← Shift+click의 기준점
     }
   - JSON 직렬화를 위해 toJSON은 array로 변환하는 헬퍼 제공

B. notation-engine/src/selection/queries.ts:
   - getSelectedEvents(score, selection): NotationEvent[]
   - getSelectionStats(score, selection): { count, totalDuration, pitchRange, avgPitch }
   - expandSelectionToMeasure(score, selection): Selection
   - expandSelectionToStaff(score, selection): Selection
   - expandSelectionToAll(score): Selection

C. renderer/src/render.ts 수정:
   - renderScore의 옵션에 selection: Selection 추가
   - 선택된 이벤트의 SVG element에 `data-selected="true"` 속성 추가
   - CSS로 selected 스타일 (apps/web/app/globals.css):
     [data-selected="true"] .vf-notehead { fill: #2563eb; ... }
   - 재렌더 비용을 줄이기 위해, selection 변경만 발생했을 땐 setAttribute로만 토글 (renderer에 updateSelection(hitMap, selection) 함수 추가)

D. apps/web/components/editor/ScoreView.tsx 수정:
   - selection을 useScoreStore에서 구독
   - selection만 변경되면 updateSelection 호출 (전체 재렌더 안 함)
   - mousedown으로 드래그 시작, mousemove로 rubber band 사각형 그리기 (SVG overlay), mouseup으로 선택 확정

E. apps/web/components/editor/StatusBar.tsx:
   - 화면 하단 고정 (h-10, border-t)
   - 좌측: 선택 정보 또는 마우스 위치 마디 정보
   - 우측: 박자, 조, 템포 (작은 chip 컴포넌트)
   - shadcn/ui의 Badge 사용

F. 키보드 단축키 추가 (keyboard.ts):
   - Cmd/Ctrl+A: 점진적 확장
   - Esc: clearSelection + exitInputMode

G. 절대 금지:
   - 선택 변경 시 전체 score를 재렌더
   - Set을 직접 mutate (Zustand의 set은 새 Set 생성해서 교체)
   - rubber band 사각형을 별도 React 컴포넌트로 (성능 이슈)

H. 테스트:
   - "Shift+클릭으로 누적 선택"
   - "Cmd+A 3번 누르면 전체 선택"
   - "선택 해제 후 키보드 단축키가 다시 입력 모드로"
   - getSelectionStats가 정확한 통계 반환

작업 전에 selection 상태 변화 시 재렌더 최적화 전략을 의사코드로 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] 음표 하나 클릭 → 파란색 highlight
- [ ] Shift+클릭으로 여러 개 선택
- [ ] 드래그로 사각형 영역 선택
- [ ] 하단 상태바에 정확한 통계 표시
- [ ] 선택 변경 시 화면 깜빡임 없음 (DevTools Performance 탭으로 확인)

### ⚠️ 자주 발생하는 함정
- **Set의 reference equality:** Zustand는 reference 비교로 리렌더. Set을 직접 add/delete하면 컴포넌트가 갱신 안 됨. 항상 새 Set으로 교체.
- **드래그 중 mouseleave:** 마우스가 윈도우 밖으로 나가면 mouseup 이벤트 안 옴. document에 핸들러 등록 + cleanup.
- **선택된 음표가 삭제됐을 때:** dispatch의 delete-event 후 selection에서도 제거해야 함. 미들웨어로 자동 처리.

---

## 7단계: Undo/Redo 무결성 보장

**🎯 목표:** Cmd+Z / Cmd+Shift+Z로 안정적인 undo/redo. 100회 연속 undo/redo 후에도 깨지지 않음. 자동 저장과 충돌 안 함.

**📦 의존성:** 3, 6단계 완료
**⏱️ 예상 시간:** 3~4시간 (이미 3단계에서 기반은 만들어져 있음. 여기서는 UX와 검증)

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 7단계: Undo/Redo 무결성 보장입니다.
3단계에서 만든 UndoStack이 실제 편집 상황에서 완전히 견고하도록 다듬습니다.

기능 명세:
1. Cmd+Z (Ctrl+Z): undo
2. Cmd+Shift+Z (Ctrl+Shift+Z 또는 Ctrl+Y): redo
3. 메뉴/툴바에도 undo/redo 버튼 (shadcn/ui의 dropdown 또는 sonner)
4. undo 시 selection도 적절히 복원:
   - delete-event를 undo하면 그 event를 다시 선택
   - insert-event를 undo하면 selection은 그 event의 이전 selection으로
5. 일부 op는 자동 그룹화(compound):
   - 100ms 이내에 발생한 같은 종류의 op는 하나의 undo step
   - 예: 빠르게 5개 음표 입력 → 한 번의 undo로 5개 모두 사라짐
   - 그러나 명확히 분리된 동작(키 입력 → 마우스 클릭)은 분리
6. 화면에 작은 toast: undo/redo 시 "✓ Undone" 또는 직전 op의 설명 표시

구현 요구사항:

A. notation-engine/src/undo/grouping.ts:
   - canMergeOperations(a, b): boolean
   - mergeOperations(a, b): ScoreOperation
   - 룰:
     * 같은 kind인 insert-event끼리는 합쳐짐 (insert-events-batch로 변환)
     * 100ms 초과 시 분리
     * update-pitch가 같은 event에 연속 → 마지막 값으로 통합

B. UndoStack에 시간 정보 추가:
   - push(op, timestamp = Date.now())
   - 직전 push와 100ms 이내 + canMergeOperations true면 합치기

C. apps/web/lib/store/scoreStore.ts의 dispatch 수정:
   - dispatch(op, { mergeable = false } = {}) 시그니처
   - selection 변경도 함께 기록 (undo 시 selection 복원)

D. apps/web/components/editor/EditorKeyboardHandler.tsx 수정:
   - Cmd+Z, Cmd+Shift+Z 처리
   - Mac과 Windows 모두 대응 (navigator.userAgent로 분기 또는 metaKey/ctrlKey 모두 처리)

E. apps/web/components/editor/UndoToast.tsx:
   - sonner 사용
   - undo 발생 시 짧은 메시지 표시 (1초 정도)
   - "↶ 음표 삭제 취소됨" 같은 사람 친화적 문구
   - operation kind를 한국어 라벨로 매핑하는 함수 (operations/labels.ts)

F. 회귀 테스트 (Vitest):
   "fuzz test"라고 부르는 무작위 시퀀스 테스트:
   - 100개의 무작위 op를 생성 (insert, delete, update-pitch, transpose 등)
   - 모두 dispatch
   - 모두 undo → 빈 score(또는 초기 score)와 deep equal
   - 모두 redo → 마지막 상태와 deep equal
   - 이걸 10번 반복 (시드 다르게)

G. 절대 금지:
   - selection 복원을 까먹고 score만 복원 (UX가 어색해짐)
   - keydown에서 Cmd+Z를 가로채지 않고 input element에서 발생하면 안 됨 (가사 입력 중인데 악보 undo 되면 황당)
   - 너무 공격적인 grouping (사용자가 의도한 단계가 사라짐)

H. 자동 저장과의 충돌 방지 메모:
   - 자동 저장은 21단계에서 구현. 미리 고려: dispatch 후 500ms debounce로 IndexedDB에 저장 예정.
   - undo도 같은 흐름을 거치므로 별도 처리 불필요.

작업 시작 전에 grouping 규칙을 표로 보여주고 OK 하면 구현.
```

### ✅ 완료 검증
- [ ] 빠르게 5개 음표 입력 후 Cmd+Z 한 번에 모두 사라짐
- [ ] 천천히(200ms 간격) 5개 입력 후 Cmd+Z는 하나씩 사라짐
- [ ] 100회 fuzz test 통과
- [ ] 가사 입력 textarea에서 Cmd+Z가 textarea의 undo (악보 undo가 아님)
- [ ] 토스트가 시끄럽지 않음 (1초 이내 fade)

### ⚠️ 자주 발생하는 함정
- **너무 적극적인 grouping:** 사용자가 음 하나 입력 → 다른 음 옮김 → 다시 음 입력. 이걸 다 합치면 의도와 다름. kind와 target도 확인.
- **clear 후 redo 안 됨:** loadScore 시 undoStack을 clear해야 깔끔하지만, redo가 사라지는 게 의도된 것인지 명시.
- **메모리 누수:** 1000개 op에 deep copy된 previous가 있으면 메모리 부담. 큰 객체(measure 전체)는 reference만 잡는 게 안전 (immer가 frozen 보장하므로 OK).

---


# Phase 3 — 직관성의 핵심 UX

이 단계가 "또 하나의 MuseScore"가 아니라 "정말 새로운 악보 앱"이 되는 분기점입니다. 세 계획서 모두 가장 강조하는 부분입니다.

## 8단계: 미니 플로팅 툴바 (Notion 스타일)

**🎯 목표:** 음표 하나를 선택하면 그 위에 작은 플로팅 메뉴가 즉시 나타남. 길이 변경, 임시표, 슬러, 다이내믹, 가사 등을 마우스로 빠르게 조작 가능. 텍스트 에디터의 "bold/italic 미니 툴바"와 동일한 감각.

**📦 의존성:** 6, 7단계 완료
**⏱️ 예상 시간:** 5~7시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 8단계: 미니 플로팅 툴바입니다.

기능 명세:
1. 음표가 1개 이상 선택되면 200ms 후 선택 영역 위에 작은 툴바가 페이드 인.
2. 툴바 내용:
   [♩∙] [길이 ▾] [♯♭♮] [↑ ↓] [⌒ slur] [— tie] [p/f] [⋅ 가사] [⋮ 더보기]
3. 각 버튼은 아이콘 + 호버 시 한글 라벨 툴팁 + 단축키 표시.
4. 다중 선택 시: 적용 가능한 버튼만 활성, 나머지 dimmed.
5. 마우스가 툴바와 선택 영역에서 모두 벗어나면 300ms 후 fade out.
6. 키보드로 툴바 조작 가능: Tab으로 포커스 이동, Enter로 실행, Esc로 닫기.
7. 더보기(⋮) 클릭 시 popover로 전체 기능 노출 (셈여림 표 전체, 아티큘레이션 전체 등).

구현 요구사항:

A. apps/web/components/editor/FloatingToolbar.tsx:
   - "use client"
   - props: selection (Selection), score
   - position 계산: getSelectionBounds(hitMap, selection) → { x, y, width }
   - Floating UI 라이브러리 사용 (@floating-ui/react)
     → 화면 가장자리 자동 회피 (flip), 화살표(arrow) 옵션
   - shadcn/ui의 Popover와 별개. 우리만의 floating UI.

B. renderer/src/queries.ts 추가:
   - getSelectionBounds(hitMap, selection): DOMRect | null
   - 선택된 모든 항목을 감싸는 bounding box

C. 툴바 액션 모음 (apps/web/lib/editor/quick-actions.ts):
   - 각 액션은 dispatch 가능한 ScoreOperation을 생성:
     * changeDuration(selection, duration) → update-duration ops 배열
     * raiseOctave / lowerOctave / raisePitch (반음) / lowerPitch
     * toggleAccidental(selection, type: 'sharp'|'flat'|'natural')
     * addSlur / addTie
     * addDynamic(marking)
     * addLyric → 14단계의 LyricInput 모드 진입 (지금은 일단 placeholder)
   - 각 함수는 selection이 적용 가능한지 검증

D. apps/web/components/editor/FloatingToolbar.tsx의 버튼:
   - shadcn/ui의 Button + Tooltip
   - lucide-react 아이콘
   - 다중 선택 + 액션 적용 시 dispatch는 단일 batch op (insert-batch 같은 식)

E. 애니메이션:
   - tailwindcss의 transition + opacity로 fade
   - framer-motion 도입 ❌ (가벼움 유지)

F. 절대 금지:
   - 툴바를 portal로 띄울 때 transform이 부모와 충돌
   - 툴바가 선택 영역 위를 가려서 음표가 안 보이는 일 (자동으로 위/아래 flip)
   - 단일 음표에 다중 선택 액션이 동작 (선택 0이면 툴바 자체를 안 띄움)

G. 접근성:
   - 툴바는 role="toolbar" aria-label="Note actions"
   - 각 버튼 aria-label

H. 테스트(Playwright):
   - "음표 선택하면 0.5초 이내에 툴바 등장"
   - "툴바의 ↑ 버튼 클릭하면 음표가 한 옥타브 올라감"

먼저 툴바 레이아웃을 ASCII 와이어프레임으로 그려서 보여주고 OK 하면 구현.
```

### ✅ 완료 검증
- [ ] 음표 클릭 → 0.5초 내 툴바 표시
- [ ] 툴바의 ♯ 버튼이 그 음표에 정확히 적용됨
- [ ] 화면 상단 가까이 선택해도 툴바가 아래로 자동 flip
- [ ] 다중 선택 시 일괄 적용
- [ ] Esc로 닫힘

### ⚠️ 자주 발생하는 함정
- **선택과 클릭의 충돌:** 툴바 버튼 클릭이 ScoreView의 mouseup으로도 전파되면 선택이 풀림. `e.stopPropagation()`.
- **부모 transform과 floating-ui:** Next.js의 `transform` CSS가 적용된 div 안에 있으면 좌표 계산이 어긋남. `strategy: 'fixed'` 사용.
- **다중 선택 op가 한 번에 무거움:** 100개 음표에 update-duration이면 100개 op? batch op 하나로.

---

## 9단계: 명령 팔레트 Cmd+K

**🎯 목표:** Cmd+K를 누르면 어디서나 모든 기능을 검색해서 실행 가능. Dorico의 Jump Bar, Notion의 명령 팔레트와 같은 경험. 단축키를 모르는 사용자도 모든 기능에 도달 가능.

**📦 의존성:** 8단계 완료 (가장 강력한 차별화 기능)
**⏱️ 예상 시간:** 5~7시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 9단계: 명령 팔레트 Cmd+K입니다.

기능 명세:
1. Cmd+K (또는 Ctrl+K)로 화면 중앙에 팔레트 모달.
2. 검색창에 입력하면 가능한 명령들이 fuzzy match로 정렬.
3. 명령 검색은 다음 모두 지원:
   - 영문 이름: "crescendo"
   - 한국어 이름: "크레셴도"
   - 약어: "cresc"
   - 카테고리: "다이내믹"
4. 각 명령 옆에 단축키 표시 (있다면).
5. 현재 선택에 따라 가능한 명령이 우선 표시:
   - 음표 선택 중 → "옥타브 올리기", "이조하기", "한 마디 반복", "슬러 추가" 등 상위
   - 마디 선택 중 → "박자 변경", "조 변경", "마디 복제" 등 상위
   - 선택 없음 → "새 악보", "MusicXML 가져오기", "파트보 만들기" 등
6. Recent / Frequent 명령은 자동 학습되어 우선 노출.
7. 명령 선택 시 미리보기 (예: "한 옥타브 올리기"에 hover하면 화면의 선택된 음표가 임시로 한 옥타브 위에 표시).
8. Enter 또는 클릭으로 실행.
9. Esc로 닫힘 + 검색어 보존(다음 열 때 동일 검색어 또는 비움 옵션).

구현 요구사항:

A. shadcn/ui의 Command 컴포넌트 사용 (cmdk 기반):
   npx shadcn@latest add command  (이미 0단계에서 설치됨)

B. apps/web/lib/commands/registry.ts:
   - Command 타입:
     {
       id: string;
       label: { ko: string; en: string };
       aliases: string[];  ← fuzzy match 후보들
       category: 'edit'|'view'|'transform'|'insert'|'file'|'help';
       shortcut?: string;
       icon?: LucideIcon;
       enabled: (ctx) => boolean;
       preview?: (ctx) => PreviewState;  ← 호버 시 임시 적용용
       execute: (ctx) => void;
     }
   - registerCommand(cmd) 함수
   - 모든 명령은 한 곳에서 등록 (commands/index.ts에서 모듈 import 시 등록)

C. 초기 명령 목록 (MVP 단계):
   - "새 악보" (new)
   - "한 옥타브 올리기/내리기"
   - "반음 올리기/내리기"
   - "이조하기" → 입력 모달
   - "박자 변경" → 입력 모달
   - "조 변경" → 입력 모달
   - "이 마디 복제"
   - "이 마디 삭제"
   - "Undo" / "Redo"
   - "전체 선택"
   - "재생/정지"
   - "Composer 모드 / Learner 모드 전환" (모드는 향후)
   - "도움말 열기"
   - "MusicXML 가져오기/내보내기" (18, 19단계에서 실제 동작 연결)

D. apps/web/components/editor/CommandPalette.tsx:
   - Cmd+K로 토글 (전역 keydown)
   - cmdk의 Command, CommandInput, CommandList, CommandItem 사용
   - currentSelection을 context로 전달
   - 미리보기는 hover된 명령의 preview() 호출하여 임시 selection style 변경
   - 클릭/Enter 시 execute(ctx) + 닫힘
   - 사용 빈도 저장: IndexedDB의 'command-usage' 테이블에 카운트

E. fuzzy match:
   - cmdk가 기본 제공. label + aliases를 합쳐 검색 대상으로.
   - 한국어/영어 모두 후보에 포함.

F. apps/web/components/editor/CommandPaletteProvider.tsx:
   - 앱 전체를 감싸는 context (or simple zustand)
   - 모든 commandRegistry는 mount 시 한 번 로드

G. 접근성:
   - 키보드만으로 모든 명령 실행 가능 (이미 cmdk가 잘 처리)
   - aria-label 적절히

H. 절대 금지:
   - 명령을 컴포넌트마다 hardcode (반드시 registry 경유)
   - 명령 실행 후 팔레트가 열린 채로 (실행되면 자동 close)
   - 비활성 명령을 검색 결과에서 제외 (보여주되 dimmed로)

I. 테스트:
   - "Cmd+K로 팔레트 열림"
   - "'크레' 입력 시 '크레셴도' 표시"
   - "Enter로 명령 실행 후 팔레트 닫힘"
   - "사용 후 다음 번에 상위 노출"

먼저 명령 5~10개 정도의 의사 등록 예시를 보여주고 OK 하면 구현.
```

### ✅ 완료 검증
- [ ] Cmd+K로 즉시 팔레트 열림 (< 100ms)
- [ ] "옥타브" 검색하면 관련 명령 표시
- [ ] 영어/한국어/약어 모두 동작
- [ ] hover로 미리보기 동작
- [ ] 자주 쓴 명령이 다음번에 위에

### ⚠️ 자주 발생하는 함정
- **명령 실행 → 그 명령 실행 중 dispatch가 cmdk를 다시 열게:** 실행 함수 안에서 다른 명령을 부르려면 직접 함수 호출, palette를 다시 열지 말 것.
- **preview의 잔존:** hover 후 다른 명령으로 옮기면 직전 preview를 깨끗이 cleanup 해야 함.
- **command id 중복:** 새로 추가할 때 dev 환경에서 throw하는 검증을 추가.

---

## 10단계: 상황형 슬래시 메뉴

**🎯 목표:** Notion처럼 빈 마디나 빈 자리에서 `/` 키를 누르면 작은 메뉴가 떠서 "이 위치에 추가 가능한 것들"을 보여줌. 음자리표 변경, 조표 변경, 도돌이표, 빈 마디 삽입 등.

**📦 의존성:** 9단계 완료
**⏱️ 예상 시간:** 3~4시간 (9단계 인프라 재사용)

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 10단계: 상황형 슬래시 메뉴입니다.
9단계의 명령 팔레트 인프라를 재사용해서 "위치 기반 미니 명령 메뉴"를 만듭니다.

기능 명세:
1. 입력 모드에서 빈 마디(또는 입력 커서 위치)에 `/`를 누르면 인라인 메뉴 등장.
2. 메뉴 항목 (위치 종속):
   - 마디 시작: "음자리표 변경", "조표 변경", "박자표 변경", "리허설 마크", "도돌이표 시작"
   - 마디 끝: "도돌이표 끝", "마침줄", "1번/2번 괄호"
   - 음표 위치: "리듬 빈칸 (쉼표)", "글리산도", "임시표 강제 표시"
3. 메뉴는 입력 커서 바로 옆에 inline으로 (모달 X).
4. 화살표 키/Enter로 선택, Esc로 닫힘.
5. 메뉴 항목에 호버하면 5~7단계의 미리보기 (가능한 경우).

구현 요구사항:

A. apps/web/components/editor/SlashMenu.tsx:
   - Cmd+K Palette와 별개의 작고 가벼운 인라인 popover
   - position은 inputCursor 위치 + 약간 아래
   - shadcn/ui의 Popover + Command 결합 또는 직접 작은 컴포넌트

B. lib/commands/registry.ts에 "위치 메타데이터" 추가:
   - Command에 `contextScope?: 'measure-start'|'measure-end'|'note-position'|'global'` 추가
   - getCommandsForSlashMenu(score, cursorPosition) 함수 → 적용 가능한 명령만 필터

C. EditorKeyboardHandler에서 `/` 키 캡처:
   - 입력 모드이고 inputCursor 위치가 빈 박자면 SlashMenu 열림
   - 텍스트 input/textarea 안이면 무시 (가사 입력 중에 / 키는 그대로 입력)

D. 음자리표 변경 등 새 명령 구현:
   - operation 추가: 'set-clef' { target: StaffPath; measureIndex; clef: 'treble'|'bass'|'alto'|'tenor' }
   - 'set-key-signature'는 이미 있음
   - 'set-time-signature'도 이미 있음
   - 'insert-measure', 'add-repeat-start', 'add-repeat-end' 추가

E. 절대 금지:
   - `/`를 입력 영역(가사) 안에서 가로채기 (가사에 / 못 씀)
   - 메뉴가 무거워서 등장이 느림 (50ms 이내 표시)
   - 메뉴와 Cmd+K가 동시에 열림

F. 테스트:
   - "빈 마디에서 /를 누르면 SlashMenu가 등장"
   - "음자리표 항목 선택 시 set-clef op이 dispatch"
   - "Esc로 닫힘"

작업 전에 위치별 메뉴 항목 목록을 표로 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] 빈 마디 안에서 `/` 입력 → 메뉴 등장
- [ ] 음자리표 변경 항목 선택 → 그 마디부터 음자리표 바뀜
- [ ] 가사 입력 textarea 안에서 `/`는 그대로 입력
- [ ] Esc로 닫힘

### ⚠️ 자주 발생하는 함정
- **slash가 검색 첫 글자로 들어감:** 메뉴 안의 검색창에서 자동으로 / 제거.
- **메뉴 위치 계산:** inputCursor의 SVG 좌표 → 화면 좌표 변환 필요.

---


# Phase 4 — 음악 요소 확장

이 페이즈부터는 6단계까지 구축한 인프라 위에 음악적 요소를 하나씩 쌓는 단계입니다. 각 단계는 같은 패턴을 따르므로 다소 간결하게 적되 핵심은 빠뜨리지 않습니다.

## 11단계: 임시표·조표·박자표·다이내믹

**🎯 목표:** 선택한 음표에 ♯/♭/♮ 적용, 마디에 조표/박자표 변경, 음표에 셈여림 부착. 모두 미니 툴바와 명령 팔레트에 통합.

**📦 의존성:** 8, 9, 10단계 완료
**⏱️ 예상 시간:** 4~5시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 11단계: 임시표·조표·박자표·다이내믹입니다.

기능 명세:
1. 임시표: 선택한 음표에 ♯ ♭ ♮ ♯♯ ♭♭ 토글 가능. 단축키 = ↑/↓ 화살표는 반음(이미 있음), ` (backtick)로 임시표 강제 표시.
2. 조표 변경: 마디 선택 또는 SlashMenu에서 "조표 변경" → 모달에서 C/G/D/A/.../Cb 선택. 그 마디부터 이후 모든 마디에 적용.
3. 박자표 변경: 같은 방식. 4/4, 3/4, 6/8 등.
4. 다이내믹: 음표 선택 → 미니 툴바의 [p/f] → pp, p, mp, mf, f, ff, fff, sf, fp 선택. 음표 아래에 표시.
5. 크레셴도/디미누엔도: 다중 음표 선택 → 미니 툴바의 < 또는 > → hairpin 표시.

구현 요구사항:

A. notation-engine에 operation 추가:
   - 'set-key-signature' (이미 있음, target: MeasurePath, ks 변경, 다음 다른 ks 나올 때까지 적용)
   - 'set-time-signature' (이미 있음)
   - 'attach-accidental' { target: EventPath; alter: -2|-1|0|1|2; cautionary?: boolean }
   - 'attach-dynamic' { target: EventPath; marking: string }
   - 'attach-hairpin' { startTarget: EventPath; endTarget: EventPath; type: 'cresc'|'dim' }

B. renderer는 이미 dynamic/hairpin/accidental을 그릴 수 있어야 함 (VexFlow 5 지원).
   - 어댑터에 부착 마크 변환 로직 추가
   - hairpin은 VexFlow의 StaveHairpin 사용

C. 조표/박자표 변경 모달:
   - shadcn/ui의 Dialog
   - 모든 표준 조표 + 박자표 12종 정도
   - 입력 검증

D. 다이내믹 마크 enum (lib/music/dynamics.ts):
   - 'pppp'|'ppp'|'pp'|'p'|'mp'|'mf'|'f'|'ff'|'fff'|'ffff'|'sf'|'sfz'|'fp'|'fz'|'rfz'
   - displayName 매핑

E. 미니 툴바의 [p/f] 버튼 → popover로 마크 선택

F. 명령 팔레트에 추가:
   - "♯ 올림표 부착", "♭ 내림표 부착", "♮ 제자리표"
   - "크레셴도", "디미누엔도", "ff (포르티시모)" 등

G. 절대 금지:
   - 조표 변경 시 음표의 pitch를 자동 변경 (사용자가 명시적 이조 명령을 안 했으면 pitch는 유지)
   - 다이내믹을 음표가 아닌 마디에 부착 (현재 모델은 event 단위 부착이 표준)

H. 테스트:
   - 임시표 부착/제거가 visual snapshot으로 확인
   - 조표 변경 op이 정확히 다음 ks 나올 때까지 적용 범위
```

### ✅ 완료 검증
- [ ] 음표에 ♯ 부착이 visual로 보임
- [ ] 마디에 조표 변경 시 그 후부터 표시
- [ ] 셈여림 표시 + 재생 시 영향(15단계 이후)
- [ ] hairpin이 두 음표 사이에 그려짐

---

## 12단계: 슬러·타이·아티큘레이션

**🎯 목표:** 음표 잇기(타이), 슬러, 스타카토/액센트 등 아티큘레이션 부착.

**📦 의존성:** 11단계 완료
**⏱️ 예상 시간:** 3~4시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 12단계: 슬러·타이·아티큘레이션입니다.

기능 명세:
1. 타이(tie): 같은 음높이의 인접 두 음표 → T 키 또는 미니 툴바 — 버튼.
2. 슬러(slur): 임의 두 음표(또는 다중) 선택 → S 키 또는 미니 툴바 ⌒ 버튼.
3. 아티큘레이션:
   - 스타카토 (.)
   - 액센트 (>)
   - 테누토 (—)
   - 마르카토 (^)
   - 페르마타 (𝄐)
4. 명령 팔레트에서 검색해서 부착 가능.
5. 슬러는 endpoint 두 개를 가지며 자동 위치 (음표 위 또는 아래, 충돌 회피).

구현 요구사항:

A. operation 추가:
   - 'attach-tie' { fromTarget: EventPath; toTarget: EventPath }
   - 'attach-slur' { fromTarget: EventPath; toTarget: EventPath }
   - 'attach-articulation' { target: EventPath; type: ArticulationType }

B. 검증 로직:
   - tie는 같은 pitch끼리만 (다르면 toast 경고 "타이는 같은 음끼리만 가능해요. 슬러를 만들까요?")
   - slur는 voice 안에서 연속한 음표끼리 (cross-voice는 v1+)

C. VexFlow는 StaveTie / Curve 클래스로 그림.

D. 단축키:
   - T: tie
   - S: slur
   - .: staccato (단, duration mode가 아닐 때)
   - 단축키 모드 충돌 조심: input mode에서 .은 점음표, 선택 모드에서 .은 staccato. 모드 분기 필요.

E. 테스트:
   - tie 부착 후 재생 시(15단계 이후) 두 음이 한 소리로
   - slur 부착 visual 확인
```

### ✅ 완료 검증
- [ ] 같은 pitch 인접 두 음에 T → tie 표시
- [ ] 다른 pitch 인접 두 음에 T → "타이 불가" 토스트 + 슬러 제안
- [ ] 슬러가 5개 음표 위로 곡선 표시
- [ ] 스타카토 점이 음표 위/아래에 자동 위치

---

## 13단계: 한글 가사 입력 최적화

**🎯 목표:** 한글 음절 단위로 가사 자동 분리, 음표마다 정확히 매핑. 영어/한글 혼합 가사 지원. 여러 절 가사. 한국 음악교육 시장의 핵심 차별점.

**📦 의존성:** 7단계 완료 (다른 단계와 독립적이라 일찍 해도 됨)
**⏱️ 예상 시간:** 5~7시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 13단계: 한글 가사 입력 최적화입니다. 이건 한국 시장에서 결정적 차별점이므로
신중하게 만들어야 합니다.

기능 명세:
1. 음표를 선택하고 L 키 또는 미니 툴바의 [가사] 버튼 → 음표 아래에 inline input 등장.
2. 한글 입력 시 1글자(자모 조합 완성)마다 다음 음표로 자동 이동.
   예: "사" 입력 → 다음 음표로 이동 → "랑" 입력 → 다음.
3. 영문도 지원하되 syllable 분리:
   - 영문은 하이픈으로 명시: "love-ly" → "love" + "ly"
   - 또는 공백으로 단어 분리.
4. 멜리스마(한 음절에 여러 음표): 음표에서 underscore (_) 입력 → 그 음절을 슬러 형태로 다음 음표까지 연장.
5. 여러 절(verse): 가사 입력 모달에 verse 1, 2, 3 탭. 각 음표 아래에 verse마다 한 줄.
6. 가사 일괄 붙여넣기: 가사 전체를 별도 textarea에 붙여넣으면 음표 수만큼 자동 분배 (한글은 자모 완성 단위로 분배).
7. 한글 분리 알고리즘:
   - "사랑해" → ['사', '랑', '해']
   - "사랑해요" → ['사', '랑', '해', '요']
   - 받침 처리: "꽃잎" → ['꽃', '잎']
   - 공백/구두점 무시.

구현 요구사항:

A. apps/web/lib/lyrics/korean.ts:
   - splitKoreanSyllables(text: string): string[]
   - 한 글자 = 한 음절 원칙 (한글은 음절 문자라서 자연스러움)
   - 영문은 별도 분리 (lib/lyrics/english.ts):
     * splitEnglishSyllables: 하이픈/공백 우선, 그 다음 음운 규칙 (단순화)
   - splitMixedLyrics(text): mixed 입력을 자동 분기

B. operation: 'add-lyric' (이미 있음, verse 추가)
   - 모든 lyric에 verse number와 syllabic ('single'|'begin'|'middle'|'end') 포함

C. 인라인 입력 컴포넌트 (apps/web/components/editor/LyricInput.tsx):
   - 음표 위치에 absolute positioned input
   - 한글 IME compositionend 이벤트 감지:
     * compositionupdate: 아직 조합 중
     * compositionend: 완성됐을 때 dispatch + 다음 음표로 이동
   - 영문은 keypress의 ' ', '-' 또는 Enter로 분리.
   - Backspace: 직전 음표 가사로 이동 + 해당 음절 삭제.
   - Tab: 다음 verse로 이동.
   - Esc: lyric 입력 모드 종료.

D. 가사 일괄 입력 모달 (Cmd+K → "가사 붙여넣기"):
   - 전체 가사 textarea
   - 시작 음표 지정 (현재 선택 또는 클릭으로 지정)
   - 미리보기: 음표 N개에 음절 N개 분배되었음을 표시
   - 음표 수와 음절 수가 다르면 경고 + 빈 음표는 underscore로 채울지, 마지막 음절을 멜리스마로 늘릴지 선택지 제공

E. 렌더링:
   - VexFlow의 StaveNote에 lyrics 추가 (V5에서는 Annotation 클래스)
   - verse 1, 2, 3은 각각 다른 y offset으로

F. 한글 폰트:
   - apps/web/app/layout.tsx에 Pretendard import (next/font)
   - 가사 표시에 명시적으로 Pretendard 적용

G. 절대 금지:
   - 한글을 자모 단위로 쪼개기 (예: '사' → ㅅ + ㅏ). 음절 통째로 한 음표에.
   - compositionend 없이 keydown으로 한글 처리 (조합 중인 글자가 두 번 들어감)
   - 영문 단어를 임의 알고리즘으로 음절 분리 (오류 많음 → 사용자가 하이픈으로 명시)

H. 테스트:
   - splitKoreanSyllables("아리랑 아리랑 아라리요") → ['아','리','랑','아','리','랑','아','라','리','요']
   - "사랑해" 가사를 6개 음표에 붙여넣기 시 처음 3개에 분배, 나머지는 빈 칸 또는 멜리스마

먼저 한글 IME 처리 흐름을 의사코드로 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] "아리랑" 3음절을 3개 음표에 정확히 매핑
- [ ] IME 조합 중에는 dispatch 안 일어남
- [ ] 받침 있는 글자도 정확히 한 음절
- [ ] 영문 "Hello world" → 2음절 또는 명시적 하이픈
- [ ] verse 2, 3 추가 시 같은 음표 아래에 누적

### ⚠️ 자주 발생하는 함정
- **IME 조합 중 키 이벤트:** `e.isComposing` 또는 `e.keyCode === 229`. compositionend 이후에만 dispatch.
- **한글 분리 라이브러리 충동:** hangul-js 같은 라이브러리는 자모 분리에 강하지만 음절 분리는 단순히 `[...string]`이면 충분.
- **lyric을 score 어디에 저장?:** event(NoteEvent)에 부착? 아니면 별도 lyrics 컬렉션? → event에 부착(현재 모델)이 가장 단순. verse는 array.

---

## 14단계: 코드 심볼 입력

**🎯 목표:** 마디 위에 코드 심볼(C, Am7, F#dim, G/B 등) 입력. 텍스트로 빠르게 입력하면 자동으로 모양 좋은 코드 글자로 변환. 한국 교회음악·예배팀·밴드·재즈 시장에서 핵심.

**📦 의존성:** 11단계 완료
**⏱️ 예상 시간:** 4~6시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 14단계: 코드 심볼 입력입니다.

기능 명세:
1. 마디 위 빈 공간 클릭 또는 K 키(또는 명령 팔레트 "코드 입력") → 코드 입력 모드.
2. 입력: 'C', 'Cm', 'C7', 'Cmaj7', 'Cm7b5', 'F#dim', 'G/B', 'Bb13(#11)' 등 표준 코드 표기 인식.
3. 입력 후 Tab 또는 공백 → 다음 박자/마디로 이동.
4. 한 마디에 여러 코드 (예: "C  Am  F G") 가능.
5. 코드 진행 일괄 입력: 전체 progression을 한 줄로 "Cmaj7 | Am7 D7 | G - - -" 형식으로.
6. 키 변경 시 코드 자동 이조 옵션 (transpose dialog에서 체크박스).
7. 표시: 코드는 영문이지만 폰트는 sans-serif (보통 헬베티카 굵게), 음표 위에 정렬.

구현 요구사항:

A. apps/web/lib/music/chord-parser.ts:
   - parseChord(input: string): ChordSymbol | { error: string }
   - 정규식 + 파서 조합:
     * root: A-G + (#|b)?
     * quality: maj/min/m/dim/aug/sus2/sus4 등
     * extension: 7, 9, 11, 13, maj7, m7 등
     * alterations: (#11), (b5), (b9) 등
     * bass: /B 같은 슬래시 표기
   - 모르는 형태는 raw 그대로 저장 + warning

B. ChordSymbol 타입 (event.ts에 이미 정의 있음, 확장):
   {
     kind: 'chord-symbol';
     id: string;
     root: { step, alter };
     quality: 'maj'|'min'|'dim'|'aug'|'sus2'|'sus4'|'dom7'|'maj7'|'min7'|...;
     extensions: number[];  ← [9, 11, 13]
     alterations: Array<{ degree, alter }>;
     bass?: { step, alter };
     position: { measureId: string; beat: number };  ← 마디 내 박자 위치
   }

C. operation: 'add-chord-symbol' (이미 있음)
   - position에 정확한 박자 위치 포함

D. 인라인 입력 컴포넌트 (apps/web/components/editor/ChordInput.tsx):
   - 마디 위 floating input
   - 입력 중 실시간 parse → 유효하면 녹색, 모호하면 노란색, 에러는 빨간색
   - 자동완성: 직전 코드에서 자주 이어지는 다음 코드 제안 (단순 룰: I→IV→V→I, ii→V→I 등)

E. 일괄 입력 모달 (명령 팔레트 → "코드 진행 붙여넣기"):
   - textarea + 시작 마디 지정
   - 파이프 |로 마디 구분, 공백으로 박자 구분, '-' 또는 빈 칸은 그 박자 유지

F. 렌더링:
   - VexFlow에는 ChordSymbol 클래스가 있음 (V5)
   - 또는 직접 SVG text element로 마디 위에 표시 (위치 제어 더 자유로움)

G. 이조 옵션:
   - transpose dialog에 "코드도 함께 이조" 체크박스
   - 체크되면 모든 chord symbol의 root와 bass를 함께 이조

H. 명령 팔레트 명령 추가:
   - "코드 입력 모드", "코드 진행 일괄 입력", "Nashville Number System으로 변환" (v1 이상으로 미룸 표시)

I. 절대 금지:
   - 코드를 단순 텍스트로 저장 (반드시 parsed 구조로 — 이조와 검색이 가능해야)
   - 한국식 "도/레/미" 코드 표기 강제 (옵션은 제공하되 기본은 영문)

J. 테스트:
   - parseChord("Cmaj7") = { root: C, quality: maj7 }
   - parseChord("F#dim7") = { root: F#, quality: dim7 }
   - parseChord("Bb13(#11)") = { ... alterations: [{ degree: 11, alter: 1 }] }
   - parseChord("Garbage") = { error: '...' }

먼저 코드 표기 정규식과 5~10개의 테스트 케이스 매핑을 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] 마디 위 클릭 후 "Cmaj7" 입력 → 깔끔히 표시
- [ ] 잘못된 코드는 빨간 표시 + 그대로 저장 (사용자 의도 존중)
- [ ] 이조 다이얼로그에서 코드도 함께 이조
- [ ] 일괄 입력으로 8마디 코드 진행 한 번에 입력

---


# Phase 5 — 들리는 악보

## 15단계: Tone.js 재생 엔진

**🎯 목표:** Space 키 또는 ▶ 버튼으로 재생. 음표·다이내믹·아티큘레이션이 실제 소리에 반영. 첫 단계는 기본 합성음으로 충분.

**📦 의존성:** 11, 12단계 완료
**⏱️ 예상 시간:** 5~7시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 15단계: Tone.js 재생 엔진입니다.

기능 명세:
1. Space 키 또는 ▶ 버튼으로 재생/정지 토글.
2. 현재 selection이 있으면 그 구간만, 없으면 처음부터.
3. 템포 슬라이더 (60~240 BPM, 기본 120) + 메트로놈 on/off.
4. 파트별 mute/solo (24단계 다중 악기 후 본격적).
5. 다이내믹 → velocity 매핑 (pp=20, p=40, mp=60, mf=80, f=100, ff=120).
6. 아티큘레이션 → 음 길이/세기 조절:
   - 스타카토: duration의 50%로 짧게
   - 액센트: velocity +20
   - 테누토: duration 95% (거의 다)
7. 슬러/타이: 이어붙임 (legato).
8. 모든 음원은 기본 sine/triangle wave (Tone.Synth) 또는 SF2/SFZ 샘플 (선택 사항).

구현 요구사항:

A. packages/audio/src/scheduler.ts:
   - Score → Tone.Part 변환
   - Tone.Transport의 BPM 사용
   - 각 NotationEvent를 미리 schedule
   - 다이내믹/아티큘레이션 효과 적용
   - 재생 위치 콜백 (현재 재생 중인 event id) → renderer로 전달하여 highlight

B. packages/audio/src/synth.ts:
   - 기본은 Tone.PolySynth (전역 1개 또는 instrument별)
   - 24단계에서 다중 악기 도입 시 instrument별 synth 다르게

C. apps/web/lib/store/playbackStore.ts (Zustand):
   - isPlaying, currentBeat, tempo, isMetronomeOn, mutedParts
   - play(), pause(), stop(), seek(beat)

D. apps/web/components/editor/PlaybackBar.tsx:
   - 화면 상단 또는 우측에 작은 바
   - ▶/⏸ 버튼 (shadcn/ui Button + lucide-react Play/Pause)
   - 템포 슬라이더 (shadcn/ui Slider) + 입력 가능한 BPM 숫자
   - 메트로놈 토글 (clock 아이콘)

E. renderer에 재생 커서:
   - playbackStore.currentBeat 구독
   - 재생 중인 음표에 data-playing="true" 추가 (CSS로 노랗게 highlight)
   - 재생 위치(시간선)에 세로선 표시

F. 첫 재생 시 Tone.start() 호출 필요 (브라우저 정책):
   - 첫 Space 키 누름 시 자동으로 Tone.context.resume()

G. 절대 금지:
   - 재생을 동기적으로 시작 (반드시 await Tone.start)
   - score 변경 중에 재생 (재생 중에는 dispatch 막거나 자동 stop)
   - Web Audio context를 여러 개 만들기

H. 테스트:
   - "4분음표 4개를 120 BPM에 재생하면 2초 안에 끝남" (수동 또는 jest fake timers)
   - PlaybackBar의 BPM 변경이 즉시 반영
   - 셈여림이 velocity로 정확히 매핑

먼저 score → Tone schedule 변환 로직의 의사코드를 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] Space로 재생/정지
- [ ] 재생 중 현재 음표가 노랗게 highlight
- [ ] 템포 변경이 즉시 적용
- [ ] 메트로놈 클릭 소리
- [ ] f/p가 실제로 소리 크기 차이

### ⚠️ 자주 발생하는 함정
- **AudioContext suspended:** 첫 사용자 제스처 전에는 재생 불가. UX 토스트로 "재생을 시작하려면 ▶ 한 번 더 눌러주세요" 같은 안내.
- **Tone.Transport의 stop과 pause 혼동:** stop은 처음으로, pause는 현재 위치 유지.
- **score 변경 시 schedule이 stale:** 변경 즉시 reschedule하거나 재생 중에는 변경 금지.

---

## 16단계: 재생 커서 & 메트로놈

**🎯 목표:** 재생 중 악보 위에 부드럽게 움직이는 세로선 커서. 클릭으로 그 위치에서 시작. 메트로놈 시각화. 이미 15단계에서 일부 구현됐으면 여기는 다듬기.

**📦 의존성:** 15단계 완료
**⏱️ 예상 시간:** 2~3시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 16단계: 재생 커서와 메트로놈 다듬기입니다.

기능 명세:
1. 재생 중 가는 세로선이 모든 staff를 가로질러 부드럽게 이동.
2. 60fps 부드러움 (requestAnimationFrame, transform: translateX).
3. 악보의 임의 위치 클릭 시 그 위치부터 재생 (입력 모드가 아닐 때만).
4. 메트로놈 활성화 시:
   - 강박(downbeat)에서 다른 소리 또는 화면 깜빡임
   - 우측 상단에 작은 점멸 인디케이터
5. 재생 중 자동 스크롤: 커서가 화면 가운데 근처로 오도록 부드러운 scroll.
   - 단, 사용자가 수동 스크롤하면 5초간 자동 스크롤 중단.

구현 요구사항:

A. renderer에 PlaybackCursor 컴포넌트 (SVG overlay):
   - <line> element를 absolute로 SVG에 추가
   - requestAnimationFrame loop으로 위치 업데이트
   - 위치 = 시작 박자 + (현재 시간 / 박자 길이)
   - 박자 → x 좌표 매핑은 hitMap에 의해 알 수 있음 (각 박자의 x 좌표를 미리 계산)

B. 클릭으로 seek:
   - ScoreView의 onClick에서 (input mode가 아니고 어떤 음표도 정확히 안 맞으면) 그 x 좌표를 박자로 변환 → playbackStore.seek
   - 입력 모드에선 클릭이 음표 입력이므로 충돌 안 남

C. 자동 스크롤:
   - 재생 중 cursor 위치가 viewport의 60% 위치를 지나면 스크롤
   - smooth scrollIntoView 또는 scrollBy
   - 사용자 wheel/touchmove 감지 시 일시 중단 플래그

D. 메트로놈 강박:
   - 첫 박자에 더 큰 클릭 소리 (Tone.Player 또는 다른 wave)
   - 박자 표시는 PlaybackBar 옆에 작은 LED 아이콘

E. 절대 금지:
   - 매 프레임마다 React 재렌더 (transform만 직접 변경, state 변경 X)
   - 자동 스크롤이 너무 공격적이라 사용자가 멀미 (smooth, 5초 grace)

F. 테스트(Playwright):
   - "Space 누르면 cursor가 시간에 따라 이동"
   - "악보 중간 클릭하면 그 위치에서 재생 시작"
```

### ✅ 완료 검증
- [ ] 60 BPM에서 cursor가 1초에 정확히 1박자 이동
- [ ] 클릭 seek 정확
- [ ] 강박 메트로놈 소리 다름
- [ ] 자동 스크롤이 부드러움

---

## 17단계: WebMIDI 입력

**🎯 목표:** USB MIDI 키보드 연결 시 자동 인식. step-time 입력(한 번에 한 음씩) + 추후 real-time 녹음 모드.

**📦 의존성:** 5단계 완료 (입력 시스템 위에 얹음)
**⏱️ 예상 시간:** 3~5시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 17단계: WebMIDI 입력입니다.

기능 명세:
1. MIDI 키보드 연결 자동 감지. PlaybackBar에 작은 MIDI 아이콘 (회색→녹색).
2. 입력 모드에서 MIDI 키 누름 → 현재 duration으로 그 pitch 음표 삽입.
3. 화음 입력: 동시에 여러 키 누름 → 한 박자에 화음 (같은 voice 안에 동시 발음).
4. velocity는 일단 무시 (다이내믹은 별도 명령).
5. real-time 녹음 모드 (메트로놈 동기): v2로 미룸. 일단 step-time만.

구현 요구사항:

A. packages/audio/src/midi.ts:
   - WebMIDI API 또는 webmidi.js (가벼우면 직접 API 권장)
   - navigator.requestMIDIAccess() (sysex: false)
   - onMIDIMessage 핸들러
   - MIDI note number (0~127) → Pitch 변환:
     midi → octave, step, alter (예: 60 → C4)

B. 브라우저 호환:
   - Chrome/Edge/Opera 지원. Safari/Firefox 일부 제한.
   - 미지원 브라우저: PlaybackBar에 "Chrome에서 MIDI 지원" 툴팁

C. apps/web/lib/midi/midiStore.ts:
   - devices: MIDIInput[]
   - isEnabled: boolean
   - lastEvent: { note, velocity, timestamp } | null

D. 입력 처리:
   - inputStore.isInputMode가 true일 때만 noteOn → dispatch insert-event
   - 동시 noteOn(50ms 이내)은 화음으로 묶음
     * timeout으로 50ms 안에 들어온 모든 noteOn을 모아 하나의 ScoreOperation으로
   - noteOff는 일단 무시 (sustain은 v1)

E. UI:
   - PlaybackBar에 MIDI 아이콘 + 상태 (연결됨/연결 안 됨)
   - 클릭 시 디바이스 선택 모달 (여러 MIDI 장치 연결 시)

F. 절대 금지:
   - sysex: true (보안)
   - real-time 모드를 step-time과 같은 핸들러로 (혼란)
   - MIDI 입력 중 keyboard 입력도 함께 들어가는 race

G. 테스트:
   - 가능하면 mocked MIDIInput으로 단위 테스트
   - 수동: 진짜 MIDI 키보드 연결 후 검증
```

### ✅ 완료 검증
- [ ] MIDI 키보드 연결 시 아이콘 녹색
- [ ] 입력 모드에서 키 누름 시 음표 입력
- [ ] C major 화음 동시 누름 → 화음(3음 동시)으로 입력
- [ ] 같은 키 두 번 누름 → 별도 음표 두 개

---


# Phase 6 — 호환성과 출력

## 18단계: MusicXML Import

**🎯 목표:** Finale/MuseScore/Dorico/Sibelius에서 export한 MusicXML 또는 압축본(.mxl)을 import. 음표/박자/조표/가사/코드까지 의미 보존. Import 보고서로 누락/불확실한 부분 명시.

**📦 의존성:** 1, 11, 13, 14단계 완료
**⏱️ 예상 시간:** 8~12시간 (난이도 높음, 충분한 시간)

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 18단계: MusicXML Import입니다. 이 단계는 시장 진입의 핵심입니다.
기존 사용자가 자기 악보를 가져올 수 없으면 신제품을 안 씁니다.

기능 명세:
1. 파일 드래그앤드롭 또는 명령 팔레트 "MusicXML 가져오기".
2. .xml, .musicxml, .mxl(zip 형태) 지원.
3. import 후 결과:
   - 성공: 새 score로 로드, score id 부여.
   - 부분 실패: 가능한 부분은 로드 + 실패 보고서 모달 ("이 부분의 트레몰로 표기는 지원하지 않아 누락되었습니다").
4. 완전 실패: 명확한 에러 + 원인.
5. import 보고서:
   - 누락된 요소 list
   - 변환된 요소 통계 (음표 N개, 가사 N음절, 마디 N개)

구현 요구사항:

A. packages/musicxml/src/import.ts:
   - parseMusicXML(xmlString: string): { score: Score; report: ImportReport }
   - OpenSheetMusicDisplay 사용을 검토하되, OSMD는 렌더링 라이브러리라 데이터 추출에 적합하지 않을 수 있음
   - 대안: 직접 DOMParser로 XML 파싱 (가볍고 제어 가능)
   - .mxl 압축 해제: JSZip 사용 (의존성 추가)

B. 변환 매핑 (MusicXML → Semantic Score Model):
   - <score-partwise> 또는 <score-timewise> 모두 지원 (timewise는 거의 안 쓰이지만)
   - <part-list>의 <score-part> → Player + Instrument
   - <part>의 <measure> → Measure
   - <measure>의 <attributes> → timeSignature, keySignature, clef
   - <note>:
     * <pitch>, <unpitched>, <rest>
     * <duration>, <type>, <dot>
     * <voice>
     * <stem>, <beam> (렌더링은 무시, 의미는 보존)
     * <tied>, <slur>
     * <articulations>
     * <dynamics>
     * <lyric>
   - <harmony> → ChordSymbolEvent

C. 시간 단위 변환:
   - MusicXML의 <divisions>: 4분음표당 ticks 수
   - Semantic 모델의 Duration object로 매핑

D. ImportReport 타입:
   {
     scoreId: string;
     totalMeasures: number;
     totalNotes: number;
     totalLyrics: number;
     warnings: Array<{
       level: 'info'|'warning'|'error';
       location?: string;  ← "measure 12, part 2"
       message: string;
       musicXmlElement?: string;
     }>;
   }

E. 처리 못 하는 요소:
   - 그라피 노트(grace note): 일단 무시 + warning
   - 트레몰로, 트릴, 모든 ornament: 일단 무시 + warning
   - figured bass: 일단 무시
   - midi-instrument의 비표준 매핑: warning
   - 인쇄/레이아웃 hint (<print>, <layout>): 무시 (의도된 동작)

F. 안전성:
   - XML 파싱 실패 시 명확한 에러
   - 매우 큰 파일(>10MB): 진행 표시 + Web Worker로 변환
   - XSS 위험 방지: 텍스트 필드(가사, 제목 등)를 escape

G. UI:
   - apps/web/components/editor/ImportDialog.tsx
   - 드래그앤드롭 영역 (react-dropzone)
   - 진행 표시 (Progress)
   - 결과 모달: 통계 + warnings list

H. 절대 금지:
   - MusicXML을 내부 저장 포맷으로 (반드시 즉시 변환 후 우리 모델만)
   - 모든 요소를 100% 보존하려고 욕심 (지원하지 않는 건 솔직히 warning)

I. 테스트:
   - 5~10개 샘플 MusicXML 파일 준비 (다양한 출처)
     * MuseScore에서 export한 합창
     * Finale에서 export한 피아노
     * Dorico에서 export한 현악 4중주
     * Sibelius 리드시트
   - import 후 round-trip 검증 (19단계 후): export → re-import → 같은 score
   - 각 파일의 import report 검토하여 warning이 합리적인지

먼저 MusicXML의 주요 element와 우리 모델의 매핑 표를 보여주고 OK 하면 진행.
```

### ✅ 완료 검증
- [ ] MuseScore에서 export한 4파트 합창 import 성공
- [ ] 가사가 정확히 음표마다 매핑
- [ ] 임시표/조표/박자표 정확
- [ ] Warning은 있되 치명적 손실 없음
- [ ] 10MB 파일도 5초 이내 처리

### ⚠️ 자주 발생하는 함정
- **divisions 단위 오해:** 어떤 파일은 480, 어떤 건 1024. 항상 measure별로 다를 수도 (절대 가정 금지).
- **voice 번호:** part 안에서 voice는 1부터, 같은 voice 안의 음표는 시간순. 다중 voice 처리 신중.
- **MXL의 META-INF:** zip 안에 container.xml로 메인 XML 위치를 가리킴. 직접 가지 말고 META-INF 참조.
- **encoding:** 일부 파일은 UTF-8 BOM 또는 ISO-8859-1. DOMParser는 헤더 따라 다름.

---

## 19단계: MusicXML Export

**🎯 목표:** 내부 score를 표준 MusicXML 4.0으로 export. 다른 프로그램에서 열어도 의미 보존.

**📦 의존성:** 18단계 완료
**⏱️ 예상 시간:** 5~8시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 19단계: MusicXML Export입니다.

기능 명세:
1. 명령 팔레트 "MusicXML 내보내기" → 파일 다운로드 (.musicxml).
2. .mxl 압축본 옵션도 제공.
3. 18단계 import의 정확한 역방향:
   - 우리 모델의 모든 의미가 표준 MusicXML로 변환
   - Round-trip 가능: export → import → 결과가 원본과 의미 동등.

구현 요구사항:

A. packages/musicxml/src/export.ts:
   - exportMusicXML(score: Score): string  ← XML 문자열
   - exportMusicXMLCompressed(score: Score): Blob  ← .mxl

B. XML 생성:
   - 직접 string 빌더 또는 fast-xml-parser
   - DocType은 PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN"
   - <score-partwise version="4.0"> 형식

C. 매핑은 18단계 매핑의 역방향:
   - Player + Instrument → <part-list>의 <score-part>
   - Measure → <measure>
   - 첫 measure에는 <attributes> (key/time/clef)
   - 각 NotationEvent → <note>
   - ChordSymbol → <harmony>
   - Lyric → <lyric>

D. divisions:
   - 전 score의 최소 duration을 기준으로 결정 (보통 4분음표를 480이나 1024로)
   - 모든 duration을 그 단위로 변환

E. xml escape:
   - 텍스트 필드(title, lyric text 등) 모두 escape
   - DOMPurify 또는 직접 함수

F. UI:
   - 명령 팔레트 → Blob 생성 → URL.createObjectURL → 자동 다운로드
   - 파일명: `${score.metadata.title || 'score'}.musicxml`

G. 절대 금지:
   - 내부 id를 그대로 노출 (id는 우리만의 것, MusicXML에는 의미 없는 노이즈)
   - 우리 모델에 없는 정보를 임의 fabrication

H. Round-trip 테스트:
   - 18단계의 모든 샘플 import
   - 즉시 export
   - 다시 import
   - 두 score를 의미 동등성 검사 (id는 다를 수 있음, 구조는 같아야)

I. 검증:
   - Verovio, MuseScore, Dorico에서 export 결과 파일이 열리는지 직접 확인 (수동)
```

### ✅ 완료 검증
- [ ] Round-trip 테스트 통과 (10개 샘플)
- [ ] MuseScore 4에서 우리 export 파일 열기 → 시각적 동일
- [ ] 가사/코드/다이내믹 보존

---

## 20단계: PDF / SVG / MIDI 내보내기

**🎯 목표:** PDF (인쇄/공유), SVG (웹 임베드), MIDI (DAW 호환), PNG (썸네일) export.

**📦 의존성:** 2, 15단계 완료
**⏱️ 예상 시간:** 4~6시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 20단계: PDF / SVG / MIDI / PNG 내보내기입니다.

기능 명세:
1. PDF: A4 또는 Letter, 단일 또는 여러 페이지. 벡터 기반(SVG → PDF).
2. SVG: 페이지마다 별도 파일 또는 합쳐서.
3. PNG: 미리보기/썸네일용. 페이지마다 하나.
4. MIDI: 표준 .mid 파일 (DAW에서 열림).
5. 모든 출력에 score.metadata.title, composer 포함.

구현 요구사항:

A. PDF (packages/musicxml 와 별개로 apps/web/lib/export/pdf.ts):
   - 1차: jsPDF + svg2pdf.js (클라이언트 렌더링)
   - renderer의 SVG를 페이지 단위로 잘라서 PDF 페이지에 삽입
   - 페이지 크기: A4 (210x297mm), Letter, A5 옵션
   - 메타데이터(작성자, 제목) 삽입

B. PDF 페이지 분할:
   - renderer에 paginate(score, pageSize): SVGElement[] 추가
   - 한 페이지에 들어갈 시스템 수 계산
   - 시스템(보표 그룹) 단위로 절대 잘리지 않게 (한 시스템은 항상 한 페이지에)

C. SVG export:
   - renderer의 각 페이지 SVG를 그대로 다운로드
   - 글꼴 임베드 (Bravura, Pretendard): @font-face로 base64 embed → 다른 환경에서도 깨지지 않음

D. PNG export:
   - SVG → Canvas → PNG (html2canvas 또는 직접 canvas 그리기)
   - DPI 옵션 (72/150/300)

E. MIDI (packages/audio/src/midi-export.ts):
   - tonejs-midi 라이브러리 사용 (Tone.js 생태계)
   - score → MIDI Type 1 (multi-track)
   - 각 instrument는 별도 track
   - 다이내믹 → velocity, 아티큘레이션 → 길이 조정

F. UI:
   - 명령 팔레트: "PDF 내보내기", "SVG 내보내기", "MIDI 내보내기", "PNG 내보내기"
   - 또는 통합 "내보내기" 모달에 포맷 선택 + 옵션

G. 절대 금지:
   - 클라이언트 PDF가 100마디 넘으면 메모리 부족. 50마디 초과 시 서버 사이드 옵션 안내 (구현은 v1+).
   - innerHTML 기반 SVG 직렬화 (네임스페이스 문제). XMLSerializer 사용.

H. 테스트:
   - 16마디 리드시트 → PDF 1페이지 출력 확인
   - MIDI 파일을 GarageBand에서 열어 재생 확인 (수동)
```

### ✅ 완료 검증
- [ ] PDF 다운로드, A4에 깔끔히 표시
- [ ] PDF의 폰트가 다른 컴퓨터에서도 깨지지 않음 (embed 확인)
- [ ] MIDI를 DAW에서 열 수 있음
- [ ] PNG 썸네일 200x200 해상도 사용 가능

---


# Phase 7 — 저장과 공유

## 21단계: IndexedDB 오프라인 자동저장

**🎯 목표:** 모든 편집을 1초 이내에 로컬에 자동 저장. 인터넷 끊겨도 작업 가능. 새로고침 후 상태 복원.

**📦 의존성:** 3단계 완료
**⏱️ 예상 시간:** 3~4시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 21단계: IndexedDB 오프라인 자동저장입니다.

기능 명세:
1. dispatch 후 500ms debounce → IndexedDB에 저장.
2. 저장 상태 표시 (PlaybackBar 옆에): "저장됨" / "저장 중..." / "오프라인 — 로컬에만 저장됨".
3. 새 탭에서 같은 URL 열면 IndexedDB에서 자동 복원.
4. 페이지 닫기 직전 미저장 변경 있으면 beforeunload 경고.
5. score id별로 별도 저장 (여러 악보 동시 작업).
6. operation log 동시 저장 (협업/디버깅용).

구현 요구사항:

A. Dexie schema (apps/web/lib/db/dexie.ts):
   - DB: HarmonyDB
   - Table: scores (key: id, value: { id, score, lastModified, syncStatus })
   - Table: operations (key: ++id, value: { scoreId, op, timestamp })
   - Table: commandUsage (이미 9단계에서 사용)

B. apps/web/lib/store/scoreStore.ts에 미들웨어 추가:
   - dispatch 후 자동 호출: await db.scores.put(...)
   - debounce 500ms

C. apps/web/lib/sync/autosave.ts:
   - debouncedSave 함수
   - 저장 성공/실패 콜백 → UI 표시
   - 실패 시 retry (지수 백오프)

D. apps/web/components/editor/SaveStatusIndicator.tsx:
   - PlaybackBar 옆에 작은 텍스트
   - 상태: idle | saving | saved | offline | error
   - 색상으로 구분

E. 페이지 로드 시 복원:
   - app/(editor)/score/[id]/page.tsx에서 useEffect로:
     * id에 해당하는 score를 DB에서 fetch
     * 없으면 createEmptyScore + 즉시 저장
     * 있으면 loadScore(savedScore)

F. beforeunload:
   - 미저장 변경 있으면 e.returnValue = '...' (브라우저가 기본 메시지 표시)

G. 절대 금지:
   - 매 dispatch마다 즉시 저장 (성능 저하)
   - localStorage 사용 (5MB 제한, 동기 API라 메인 스레드 차단)

H. 테스트:
   - 음표 입력 → 1초 후 DB에 저장됐는지 확인
   - 페이지 새로고침 → 같은 상태로 복원
   - 오프라인(DevTools network: offline) 모드에서도 저장 작동
```

### ✅ 완료 검증
- [ ] 음표 입력 후 1초 내 "저장됨" 표시
- [ ] 새로고침해도 작업 내용 유지
- [ ] 오프라인 모드에서 모든 기능 정상
- [ ] 미저장 변경 있으면 닫기 시 경고

---

## 22단계: Supabase 클라우드 동기화

**🎯 목표:** 로그인 사용자의 score를 Supabase에 자동 sync. 다른 기기에서 같은 계정 로그인 시 동일한 score 목록.

**📦 의존성:** 21단계 완료
**⏱️ 예상 시간:** 5~7시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 22단계: Supabase 클라우드 동기화입니다.

기능 명세:
1. 비로그인: IndexedDB만 사용 (21단계 그대로).
2. 로그인 후: IndexedDB → Supabase 양방향 sync.
3. 갈등 해결: 단순 last-write-wins (실시간 협업은 v1).
4. 로그인 화면:
   - 이메일/비밀번호
   - Google OAuth
   - 카카오 OAuth (한국 사용자 필수)
5. 비로그인 사용자가 로그인하면 IndexedDB의 score를 클라우드로 이전 옵션 제공.

구현 요구사항:

A. Supabase 스키마 (마이그레이션):
   create table scores (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     title text,
     data jsonb not null,          ← 전체 Score 객체
     last_modified timestamptz default now(),
     created_at timestamptz default now()
   );
   
   create table score_collaborators (
     score_id uuid references scores on delete cascade,
     user_id uuid references auth.users,
     role text check (role in ('owner','editor','commenter','viewer')),
     primary key (score_id, user_id)
   );
   
   create table comments (
     id uuid primary key default gen_random_uuid(),
     score_id uuid references scores on delete cascade,
     user_id uuid references auth.users,
     anchor jsonb not null,         ← { measureId, eventId? }
     content text not null,
     created_at timestamptz default now(),
     resolved boolean default false
   );

B. RLS 정책:
   - scores: user_id가 자기 자신이거나, score_collaborators에 포함된 경우 SELECT
   - INSERT/UPDATE는 owner만 (또는 editor 권한)
   - DELETE는 owner만

C. 인증 페이지 (apps/web/app/login/page.tsx):
   - Supabase Auth UI 또는 직접 구현
   - 이메일 비번 + OAuth 버튼

D. apps/web/lib/sync/cloudsync.ts:
   - syncScoreUp(scoreId): IndexedDB → Supabase
   - syncScoreDown(scoreId): Supabase → IndexedDB
   - 양방향 sync: lastModified 비교
   - 로그인 시 자동 sync down 전체 목록

E. apps/web/app/(dashboard)/page.tsx:
   - 내 악보 목록 (썸네일 + 제목 + 수정일)
   - 새 악보 + 가져오기 버튼
   - 검색

F. 카카오 OAuth:
   - Supabase의 OAuth provider 설정 (Kakao)
   - redirect URL 설정

G. 절대 금지:
   - 비로그인 score를 강제 업로드 (사용자 동의 필수)
   - 동기화 중 lock 없이 두 클라이언트가 동시 수정 (마지막 write 이김)
   - service_role 키를 클라이언트에 노출

H. 테스트:
   - 로그인 → IndexedDB 비어있을 때 클라우드 목록 가져오기
   - 두 번째 기기에서 로그인 → 같은 목록 + 같은 데이터
```

### ✅ 완료 검증
- [ ] 카카오 로그인 정상
- [ ] 한 기기에서 작업 → 다른 기기 로그인 시 sync
- [ ] 오프라인 작업 → 온라인 복귀 시 자동 push
- [ ] RLS 검증: 다른 사용자의 score 접근 불가

---

## 23단계: 공유 링크 & 권한

**🎯 목표:** 한 줄 링크로 악보 공유. 권한 레벨 선택 (보기/댓글/편집). 비로그인자도 보기 가능.

**📦 의존성:** 22단계 완료
**⏱️ 예상 시간:** 3~4시간

### 📋 AI 프롬프트 (복사해서 사용)

```
지금은 23단계: 공유 링크 & 권한입니다.

기능 명세:
1. 명령 팔레트 "공유" → 모달:
   - 토글: 링크 공유 활성화
   - 권한: 보기 / 댓글 / 편집
   - 만료: 없음 / 7일 / 30일 / 사용자 지정
   - 비밀번호 (옵션)
2. 링크 복사 버튼 → 클립보드.
3. 권한 추가: 이메일 입력 → 그 사용자에게 권한 (역할 + 자동 알림).
4. 공유된 사용자 목록 + 권한 변경/제거.
5. 공유 링크로 접속:
   - 비로그인: 보기/댓글까지 가능. 편집은 로그인 요구.
   - 로그인: 권한대로.

구현 요구사항:

A. Supabase 스키마 추가:
   create table share_links (
     id uuid primary key default gen_random_uuid(),
     score_id uuid references scores on delete cascade,
     token text unique not null,    ← URL에 들어갈 짧은 코드
     role text not null,
     password_hash text,
     expires_at timestamptz,
     created_at timestamptz default now()
   );

B. RLS:
   - SELECT는 누구나 (token으로 검증)
   - INSERT/DELETE는 score owner

C. token 생성: nanoid 또는 secure random 8자

D. apps/web/app/share/[token]/page.tsx:
   - Server Component
   - token으로 share_link fetch → score_id + role 알아냄
   - 만료/비밀번호 검증
   - role 컨텍스트로 ScoreView 렌더 (편집 가능 여부에 따라 input mode 차단)

E. ShareDialog 컴포넌트:
   - shadcn/ui Dialog
   - 권한 선택 (RadioGroup)
   - 링크 복사 (clipboard API)
   - 활성 share_link 목록 + 만료 표시

F. 권한별 차단:
   - viewer: 모든 dispatch 차단 (Zustand 미들웨어로)
   - commenter: dispatch는 차단, comment 추가만 허용
   - editor: 자유

G. UX 디테일:
   - 권한 없는 사용자가 편집 시도 시 부드러운 안내 "이 악보는 보기 권한입니다. 사본을 만들까요?"
   - "사본 만들기" 버튼 → 로그인 후 자신의 score로 복제

H. 절대 금지:
   - share_link의 token이 추측 가능하게 (반드시 64-bit 이상 random)
   - 비번 평문 저장 (bcrypt 또는 supabase pgcrypto)
   - viewer에게 score 전체 JSON 노출 + 검사 차단 (편집은 어차피 RLS로 차단)

I. 테스트:
   - share 링크로 접속 → 보기 가능
   - viewer 권한에서 편집 시도 → 차단 + 안내
```

### ✅ 완료 검증
- [ ] 링크 한 줄로 공유 가능
- [ ] 비로그인 사용자도 보기/재생 가능
- [ ] 권한별 동작 정확
- [ ] 만료 링크는 명확한 메시지

---

# Phase 8 — 다중 파트와 모바일

이제 단일 파트(피아노 솔로) 위주에서 **여러 악기/성부가 함께 보이는 총보**와 **태블릿·모바일 환경**으로 확장한다. 여기까지가 v1.0의 마지노선이다.

---

## Step 24. 다중 악기/파트 지원

### 🎯 목표
하나의 Score에 여러 Part(악기)를 추가하고, 각 Part마다 고유한 staff·음역·이조(transposition)·연주 음색이 적용되어야 한다.

### 📦 의존성
Step 1~23 전체. 특히 Step 1의 SemanticScore, Step 2의 VexFlow renderer, Step 15의 Tone.js engine을 손봐야 한다.

### ⏱️ 예상 시간
8~12시간 (모델/렌더/재생 세 군데를 동시에 만지므로 가장 큰 작업)

### 📋 AI 프롬프트 (복사-붙여넣기)

```
지금은 24단계: 다중 악기/파트 지원입니다.

목표: Score에 여러 Part(피아노, 바이올린, 기타, 드럼…)를 추가하고, 각각 독립된 보표·이조·음색으로 동작.

요구사항:

A. SemanticScore 모델 확장 (packages/notation-engine/src/types.ts):
   ```ts
   export type Instrument = {
     id: string;                  // 'piano', 'violin', 'acoustic_grand', …
     name: string;                // 사용자 표시명 ("Piano 1")
     family: 'keyboard' | 'strings' | 'brass' | 'woodwind' | 'percussion' | 'voice' | 'guitar';
     clefDefault: ClefType;       // 기본 음자리표
     transposition: number;       // semitones (Bb 클라리넷 = -2)
     range: { min: number; max: number };  // MIDI note 범위
     midiProgram: number;         // General MIDI program number
     staffCount: 1 | 2;           // 피아노/오르간은 2
   };

   export type Part = {
     id: string;
     instrument: Instrument;
     staves: Staff[];             // staffCount만큼
     visible: boolean;
     muted: boolean;
     solo: boolean;
     volume: number;              // 0~1
     pan: number;                 // -1~1
   };

   // Score는 parts: Part[]를 가진다 (기존 staves는 part.staves로 이동)
   ```

B. 마이그레이션:
   - 기존 단일-파트 Score는 자동으로 parts=[{ instrument: defaultPiano, staves: [...] }] 형태로 변환
   - migrateScoreV1ToV2 함수 작성 + Step 21 IndexedDB autosave도 처리

C. ScoreOperation 확장:
   - AddPart, RemovePart, ReorderParts, ChangeInstrument, ToggleMute, ToggleSolo
   - ChangePartVolume, ChangePartPan
   - 기존 모든 operation의 노트 좌표(staff index)에 partId가 추가됨 (NotePosition에 partId 필드)

D. 악기 라이브러리:
   - packages/notation-engine/src/instruments.ts
   - 표준 GM 악기 약 30종 사전 정의 (피아노, 바이올린, 첼로, 기타, 클라리넷, 트럼펫, 드럼셋 등)
   - 한글 이름 매핑 ("피아노", "바이올린", "어쿠스틱 기타"…)

E. VexFlow renderer (packages/renderer):
   - 각 Part는 별도 System으로 렌더
   - System 좌측에 악기 이름 라벨 (첫 시스템: 풀네임, 이후: 약어)
   - 같은 System 안의 Part들은 좌측에 그룹 브래킷(Brace=피아노류, Bracket=현악/관악 그룹)
   - 마디 번호는 최상단 Part에만 표시

F. UI - 악기 추가 다이얼로그:
   - 좌측 사이드바 "악기" 섹션에 "+ 악기 추가" 버튼
   - shadcn/ui Dialog로 악기 선택 UI
   - 카테고리별 그리드 (피아노/현악/관악/타악/기타)
   - 검색 input
   - 선택 시 dispatch(AddPart) → 빈 마디로 추가

G. UI - 파트 사이드바:
   - 좌측에 Parts 리스트
   - 각 파트: [악기 아이콘] [이름 인라인 편집] [눈 토글 visible] [M mute] [S solo] [볼륨 슬라이더] [드래그 핸들로 순서 변경]
   - 우클릭 → 삭제, 이조 변경, 음자리표 변경

H. Step 15 Tone.js engine 업데이트:
   - 각 Part마다 별도 Tone.Sampler 또는 Synth
   - 악기별 SoundFont (https://github.com/gleitz/midi-js-soundfonts 사용 권장)
   - mute/solo 로직 (solo가 하나라도 있으면 그 외는 모두 mute)
   - volume/pan은 Tone.Channel 노드로

I. MusicXML I/O (Step 18, 19) 업데이트:
   - <part-list>의 <score-part>를 정확히 매핑
   - <transpose> 요소 처리 (Bb 클라리넷 등)
   - 라운드트립 테스트: 4성부(SATB) 합창 악보, 피아노+바이올린 듀오

J. 절대 금지:
   - 파트 추가 시 기존 마디 수를 무시 (반드시 동기화 - 새 파트는 기존 마디 수만큼 빈 마디로 채움)
   - 마디 추가/삭제가 한 파트에만 적용 (반드시 모든 파트에 동시 적용)
   - 이조 악기의 sounding pitch와 written pitch를 혼동
   - solo 상태일 때 새 노트 추가 시 들리지 않는 버그

K. 테스트:
   - 새 악보에 피아노 + 바이올린 + 첼로 추가
   - 각각에 음표 입력 → 재생 시 세 악기 동시에 들림
   - 바이올린 파트 mute → 들리지 않음
   - 첼로 solo → 첼로만 들림
   - 클라리넷(Bb) 추가 → C 입력 시 화면은 D, 재생은 C (sounding)
   - MusicXML export → 다른 프로그램(MuseScore)에서 열어 동일하게 보임
```

### ✅ 완료 검증
- [ ] 최대 16개 파트까지 추가해도 렌더링 지장 없음
- [ ] 마이그레이션으로 기존 악보가 깨지지 않음
- [ ] 이조 악기 정확
- [ ] mute/solo 정확
- [ ] 그룹 브래킷 자동
- [ ] MusicXML 라운드트립 OK

### ⚠️ 자주 발생하는 함정
- **마디 길이 불일치**: 한 파트만 마디를 추가하면 그래도 다른 파트는 같이 늘려야 한다. AddBar는 항상 score 전체 수준에서 동작
- **드럼셋 5선보**: 일반 5선이 아닌 percussion clef와 특수 노트헤드 필요 → 별도 처리
- **이조 표시 모드**: "Concert pitch" 토글이 일반적. 켜면 모든 이조 악기가 sounding pitch로 표시. UI에서 토글 제공
- **파트 순서**: 표준 오케스트라 순서(목관 → 금관 → 타악 → 현)가 있다. 자동 정렬 옵션 제공

---

## Step 25. 모바일/태블릿 반응형 + Zen Mode

### 🎯 목표
태블릿(iPad)에서 핀치 줌·스와이프로 자연스럽게 악보를 보고, 휴대폰에서도 최소한 "보기"는 가능해야 한다.

### 📦 의존성
Step 1~24의 모든 UI

### ⏱️ 예상 시간
6~8시간

### 📋 AI 프롬프트 (복사-붙여넣기)

```
지금은 25단계: 모바일/태블릿 반응형입니다.

요구사항:

A. 브레이크포인트 (Tailwind):
   - mobile: < 768px (phone)
   - tablet: 768~1279px
   - desktop: ≥ 1280px

B. 디바이스별 동작:
   - mobile: 보기 전용 (편집 비활성). 재생/줌/스크롤만
   - tablet: 편집 가능. 단, 사이드바는 슬라이드인 드로어로
   - desktop: 풀 기능

C. 터치 제스처 (apps/web/components/score/touch-handler.tsx):
   - 핀치 줌: 2지 핀치로 ScoreView 확대/축소 (0.5x ~ 3x)
   - 패닝: 1지 드래그 (선택 모드일 때는 selection rect)
   - 더블탭: 줌 토글 (현재 줌 ↔ 1x)
   - 길게 누르기: 컨텍스트 메뉴 (마우스 우클릭 대체)
   - 두 손가락 탭: undo

D. 가상 키보드 대응:
   - 입력 컴포넌트에 포커스 시 ScoreView가 가려지지 않도록 자동 스크롤
   - VisualViewport API 사용

E. Zen Mode (모든 디바이스 공통):
   - 단축키: F11 또는 Esc 길게 / 모바일: 화면 상단 슬라이드 다운
   - 모든 UI 숨김, 악보만 화면 가득
   - 종료: 동일 단축키 또는 화면 가장자리 탭
   - 재생 컨트롤만 화면 하단 페이드인 (3초 후 자동 페이드아웃)

F. 모바일 전용 UI:
   - 상단: 곡명 + 햄버거 메뉴
   - 햄버거 메뉴: 파일/공유/재생 설정/Zen Mode/PC 버전으로 보기
   - 하단: 재생 컨트롤 바 (재생/일시정지/마디 점프/볼륨)
   - 사이드바 없음

G. 태블릿 전용 UI:
   - 좌측 사이드바는 기본 숨김, 좌측 가장자리 스와이프로 노출
   - 미니 툴바(Step 8)는 그대로 작동, 단 터치에 더 큰 hit area
   - 명령 팔레트는 단축키 대신 우상단 검색 아이콘으로 트리거

H. 성능:
   - 모바일에서는 VexFlow 렌더링을 throttle (입력 후 300ms 대기)
   - 화면 밖 시스템은 가상화 (virtualization) — 보이는 마디만 그리기
   - IntersectionObserver로 시스템 단위 lazy render

I. 절대 금지:
   - hover 의존 UI를 모바일에서 그대로 보여줘 사용 불가하게 만들기
   - 핀치 줌이 브라우저 기본 줌과 충돌 (touch-action: none 명시)
   - Zen Mode 진입 후 빠져나오는 방법이 불명확

J. 테스트:
   - Chrome DevTools의 iPad/iPhone 에뮬레이션
   - 가능하면 실제 디바이스 (BrowserStack 또는 ngrok으로 로컬 테스트)
   - 가로/세로 모드 둘 다 OK
   - 핀치 줌 부드러움 (16ms 이내 프레임)
```

### ✅ 완료 검증
- [ ] iPad에서 편집 가능, 핀치 줌 부드러움
- [ ] iPhone에서 악보 보기 + 재생 가능
- [ ] Zen Mode 진입/이탈 자연스러움
- [ ] 키보드 단축키 없이도 핵심 기능 도달 가능
- [ ] 100마디 악보가 모바일에서 60fps 스크롤

### ⚠️ 자주 발생하는 함정
- **double-tap zoom**: iOS Safari는 더블탭에 기본 줌이 있음. `touch-action: manipulation` 필수
- **VisualViewport**: 모바일 키보드 올라올 때 layout viewport와 visual viewport가 어긋남
- **passive event listener**: touchmove를 가로채려면 `{ passive: false }`로 등록
- **iOS bounce**: 스크롤 끝에서 튀는 효과는 의도적이라면 OK, 아니라면 `overscroll-behavior: contain`

---

# Phase 9 — v1.0 이후 확장 (요약)

여기서부터는 v1.0이 안정화된 후 0.5년~2년에 걸쳐 점진 도입한다. 각 항목은 별도의 큰 프로젝트이므로 본 문서에서는 방향만 제시한다.

---

## Step 26. Yjs 기반 실시간 동시 편집

- **기술**: Yjs CRDT + y-supabase 또는 자체 WebSocket relay
- **모델 매핑**: SemanticScore를 Y.Doc로 표현 (parts → Y.Array, measures → Y.Array, notes → Y.Map)
- **충돌 해결**: 같은 노트의 pitch를 두 사용자가 동시 변경 → Yjs가 lamport 타임스탬프로 자동 해결
- **awareness**: 다른 사용자 커서 색상별 표시, 현재 선택 영역 형광펜처럼 표시
- **권한**: Step 23의 role을 그대로 사용
- **주의**: 모든 ScoreOperation을 Y.Doc transaction으로 감싸야 함. Zustand store는 Y.Doc의 view가 됨 (단방향)

## Step 27. Soundslice 스타일 연습 모드

- **오디오 ↔ 악보 동기화**: 사용자가 업로드한 mp3/유튜브와 마디별 타임스탬프 매핑
- **Loop**: 임의의 마디 구간 반복
- **Slow down**: 피치 보존 템포 변경 (Tone.js의 `playbackRate` + pitch shifter)
- **메트로놈 카운트인**: 4비트 → 시작
- **연습 통계**: 어느 구간을 몇 번 반복했는지 기록

## Step 28. AI 도우미

- **AI 채보 (Audio → Score)**: Spotify Basic Pitch 또는 자체 모델 → MusicXML
- **AI 화성 분석**: 코드 진행 분석 후 로마 숫자 분석 표시
- **AI 작곡 보조**: "이 멜로디에 어울리는 베이스라인 생성" — Magenta.js 또는 자체 모델
- **AI 운지법 추천**: 기타/피아노 운지법 자동 생성

## Step 29. OMR (Optical Music Recognition)

- **이미지/PDF → 악보**: Audiveris (Java) 서버 또는 Oemer (Python) 사용
- **사용자 확인 단계**: AI 인식 결과를 사용자가 한 마디씩 검수
- **반자동 흐름**: 어려운 부분은 수동 수정 가능

## Step 30. 손글씨/펜 입력

- **Apple Pencil 지원**: PointerEvents API
- **인식**: 손으로 그린 음표를 인식 (TensorFlow.js)
- **모드**: 펜 모드 ↔ 키보드 모드 전환

## Step 31. 음성 명령

- **"4분음표 도"** → 음표 추가
- **"마디 추가"** → AddBar
- **Web Speech API** + 음악 도메인 NLU

## Step 32. 악보 마켓플레이스

- **공개 악보 공유**
- **무료/유료 모델**
- **저작권 검증** (필수)
- **MuseScore.com 스타일** 커뮤니티

---

# 부록 A. 자주 쓰는 미니 프롬프트 템플릿

개발 중 반복적으로 필요한 작업을 위한 짧은 프롬프트 모음. 그대로 복사해서 빈칸만 채우면 된다.

---

## A-1. 새로운 ScoreOperation 추가

```
새 ScoreOperation을 추가해줘.

이름: __________________ (예: ChangeNoteStem)
목적: __________________
파라미터: __________________
영향받는 상태: __________________

다음을 모두 처리해줘:
1. packages/notation-engine/src/operations.ts에 타입 추가
2. apply 함수에 reducer case 추가 (immer 사용)
3. invert 함수에 역연산 추가 (반드시 previous state 보존)
4. Zustand store의 dispatch는 자동으로 처리됨
5. 단위 테스트: apply → invert(apply) 했을 때 원본 score와 동일한지
6. 절대 금지: 직접 state mutation, partial undo

기존 패턴은 AddNote operation을 참고해.
```

---

## A-2. 새 shadcn/ui 컴포넌트 추가

```
shadcn/ui 컴포넌트를 추가해줘.

컴포넌트: __________________ (예: dialog, tooltip, popover)

다음 명령으로 설치:
cd apps/web && pnpm dlx shadcn@latest add __________________

설치 후:
1. components/ui/__________________.tsx 가 생성됐는지 확인
2. 다음 위치에서 사용: __________________
3. 한국어 라벨/플레이스홀더 적용
4. 다크모드 대응 확인 (tailwind class)

절대 금지: shadcn 컴포넌트의 내부 스타일을 직접 수정 (className 추가만)
```

---

## A-3. VexFlow 렌더링 이슈 디버그

```
VexFlow 렌더링이 이상해. 다음을 점검해줘.

증상: __________________ (예: 점음표가 두 번 찍힘, 빔이 어긋남, 임시표가 누락)

확인할 것:
1. SemanticScore → VexFlow 변환 코드 (packages/renderer/src/vexflow-adapter.ts)
2. 해당 음표의 SemanticNote 객체를 console.log로 출력 → 데이터 자체가 정확한지
3. VexFlow에 전달된 StaveNote 객체 출력 → 변환에서 손실됐는지
4. VexFlow 5.x 공식 예제 (https://vexflow.com/docs/) 와 비교
5. 동일 입력에 대한 OSMD 렌더 결과와 비교

해결 후:
- 회귀 방지용 visual regression test 추가 (Playwright screenshot)
- 동일 패턴이 다른 곳에 더 있는지 grep
```

---

## A-4. Zustand 상태 디버그

```
Zustand 상태가 이상해. 다음을 점검해줘.

증상: __________________ (예: undo했더니 다른 마디가 사라짐, 입력 후 화면이 안 바뀜)

확인할 것:
1. store devtools 확인 (zustand/middleware의 devtools 미들웨어 사용 중인가)
2. 마지막 dispatch된 operation의 payload 출력
3. apply 전후 score의 JSON.stringify diff
4. selector가 정확한 부분만 구독하는가 (over-subscription으로 인한 stale closure)
5. immer producer가 새 object를 반환하는가 (직접 반환하면 안 됨, mutation만)

해결 후:
- 재현 케이스를 unit test로 박제
```

---

## A-5. 새 입력 단축키 추가

```
키보드 단축키를 추가해줘.

조합: __________________ (예: Cmd+Shift+R)
동작: __________________
조건: __________________ (예: 노트 선택된 상태에서만)

다음을 처리해줘:
1. apps/web/hooks/use-keyboard.ts에 등록
2. 이미 존재하는 단축키와 충돌하지 않는지 grep으로 확인
3. macOS와 Windows 모두에서 동작 (Cmd ↔ Ctrl)
4. 명령 팔레트 (Step 9)에도 동일 명령 등록 → 시너지
5. 입력 필드(input, textarea, contenteditable)에 포커스 있을 때는 무시
6. 단축키 표 (apps/web/app/settings/shortcuts) 자동 업데이트

절대 금지: 브라우저 기본 단축키 차단 (Cmd+R 새로고침, Cmd+T 새탭 등)
```

---

## A-6. 새 MusicXML 요소 지원

```
MusicXML의 __________________ 요소 지원을 추가해줘.

이 요소가 표현하는 음악적 의미: __________________

처리:
1. packages/musicxml/src/import.ts: parse 케이스 추가 → SemanticScore의 어떤 필드로 매핑할지
2. packages/musicxml/src/export.ts: SemanticScore → MusicXML 출력 추가
3. SemanticScore 타입 (packages/notation-engine/src/types.ts) 필드 추가 (필요 시)
4. 라운드트립 테스트: 해당 요소가 포함된 .musicxml 파일 → import → export → 원본과 의미적으로 동일
5. VexFlow renderer가 이 요소를 시각적으로 표현할 수 있는지 확인 (불가능하면 일단 데이터만 보존)

테스트 파일은 MusicXML 공식 sample (https://www.musicxml.com/music-in-musicxml/example-set/)에서 찾기
```

---

## A-7. 성능 최적화

```
__________________ 부분이 느려. 최적화해줘.

증상: __________________ (예: 100마디 악보 입력 시 매번 200ms 끊김)
측정: Chrome DevTools Performance 탭에서 long task 식별

체크리스트:
1. React 렌더 횟수 (React DevTools Profiler)
2. Zustand selector가 너무 큰 범위 구독하는가
3. VexFlow 전체 다시 그리는가 (해당 시스템만 그릴 수 있나)
4. useMemo / useCallback 누락
5. 큰 list는 virtualization (react-window 또는 tanstack-virtual)
6. heavy 연산은 useDeferredValue 또는 startTransition
7. Web Worker로 옮길 수 있는가 (MusicXML parse, AI 추론 등)

절대 금지: 마이크로 최적화로 코드 가독성 희생 (실측 우선)
```

---

## A-8. 새 테스트 추가

```
다음 시나리오의 테스트를 추가해줘.

시나리오: __________________
어느 레이어: ☐ unit (Vitest) ☐ integration ☐ E2E (Playwright)

unit이면:
- packages/__________________/src/__tests__/ 에 __________________.test.ts
- AAA 패턴 (Arrange-Act-Assert)
- mock은 최소화, 실제 SemanticScore 객체 사용

E2E면:
- apps/web/e2e/__________________.spec.ts
- page.goto('/') → 실제 UI 조작 → 결과 검증
- 스크린샷 비교 필요 시 toHaveScreenshot 사용

CI에 자동으로 포함되는지 확인 (.github/workflows/ci.yml)
```

---

## A-9. 한국어 UX 검수

```
다음 UI 텍스트를 한국어 음악 사용자 관점에서 검수해줘.

대상 파일: __________________

검수 기준:
1. 음악 전문 용어가 정확한가 (예: "조표"가 맞고 "키 시그니쳐"는 X)
2. 명사형/동사형 일관성 (버튼은 동사 "추가", 라벨은 명사 "음표")
3. 존댓말/평어 일관성 (Harmony는 평어 통일 — "추가", "삭제")
4. 약어 풀어쓰기 (BPM은 그대로, "Acc."는 "임시표")
5. 어색한 직역 제거 ("Are you sure you want to delete?" → "삭제할까요?" ✓, "정말로 삭제하시겠습니까?" 너무 무거움)

참고: 국립국어원 음악용어, 한국음악교육학회 용어집
```

---

## A-10. 막혔을 때 (디버깅 라스트 리조트)

```
지금 __________________ 문제로 막혔어. 다음 순서로 진단해줘.

1. 에러 메시지 전문을 보여주고 stack trace 분석
2. 최근 git diff (최근 5개 커밋) 출력 → 어디서 회귀했는지
3. 관련 파일을 모두 열어 의심 라인 표시
4. 가설 3개를 세우고 각각을 검증할 minimum reproducible example 작성
5. 가설 검증 결과로 범위 좁히기
6. 해결책 구현 + 동일 함정 방지용 테스트

절대 금지:
- 추측만으로 try-catch 두르기
- "어떤 환경에서는 되더라"로 결론
- 근본 원인 없이 우회 코드 추가
```

---

# 부록 B. 검수 체크리스트 (v1.0 출시 전)

각 항목을 직접 손으로 확인하기 전에는 출시하지 않는다.

## 기능 완성도
- [ ] 빈 악보 생성 → 노트 입력 → 저장 → 재로드 → 동일
- [ ] 한 시간 분량 작업 후 브라우저 강제 종료 → 95% 이상 복구
- [ ] 100마디 4성부 SATB 악보 정상 입력/재생
- [ ] MuseScore에서 만든 MusicXML 가져오기 → 95% 이상 동일하게 보임
- [ ] Harmony에서 export한 MusicXML을 MuseScore에서 열기 → 동일
- [ ] PDF 출력이 인쇄 품질 (300dpi 상당)
- [ ] 한글 가사 입력이 자모 분리 없이 정확
- [ ] 코드 심볼 입력 후 재생 (Step 14 + 15)

## UX 품질
- [ ] 첫 사용자가 5분 안에 첫 음표 입력 가능 (사용성 테스트)
- [ ] 단축키 없이도 모든 기능 도달 가능
- [ ] 명령 팔레트로 모든 기능 1초 이내 도달
- [ ] 오류 메시지가 사용자 언어 (스택 트레이스 노출 금지)
- [ ] 다크모드에서 가독성 OK
- [ ] 접근성: 스크린리더로 핵심 기능 사용 가능 (lighthouse 90+)

## 성능
- [ ] 첫 페이지 로드 LCP < 2.5초 (Lighthouse)
- [ ] 노트 입력 후 화면 반영 < 50ms
- [ ] 100마디 악보에서 재생 시작 < 200ms
- [ ] 메모리 누수 없음 (1시간 사용 후 메모리 사용량 안정)

## 안정성
- [ ] 모든 critical path에 E2E 테스트
- [ ] 핵심 비즈니스 로직 unit test coverage 80%+
- [ ] Sentry 등 에러 트래킹 연동
- [ ] 백업 정책 (Supabase point-in-time recovery)

## 보안
- [ ] RLS 정책 누락 점검 (각 테이블)
- [ ] XSS 방어 (사용자 입력 sanitize)
- [ ] CSRF 토큰
- [ ] 공유 링크 token 추측 불가
- [ ] 의존성 취약점 (`pnpm audit`)

## 법적
- [ ] 오픈소스 라이선스 표기 (VexFlow MIT, OSMD BSD, Tone.js MIT 등)
- [ ] 사용자 콘텐츠 저작권 정책
- [ ] 개인정보 처리방침
- [ ] 서비스 이용약관

---

# 부록 C. 개발 워크플로 권장사항

## 매일의 루틴
1. **시작 시**: `git pull` → `pnpm install` → 어제 작업 PR 머지 확인
2. **작업 시작**: 이번 step 번호를 명확히 → AI에게 "지금은 N단계입니다" 컨텍스트 주입
3. **2시간마다**: 작은 단위로 커밋 (`feat:`, `fix:`, `refactor:` 등 conventional commits)
4. **종료 전**: 모든 테스트 실행 (`pnpm test`) → 통과해야 push
5. **금요일**: 그 주의 step별 회고 (어떤 함정에 빠졌는가, 무엇을 배웠는가)

## AI 활용 원칙
1. **컨텍스트 우선**: 매 세션 처음에 §A의 system prompt 주입
2. **작은 task 우선**: "전체 Step 5 다 해줘" 보다 "Step 5의 Part A만"
3. **검증 우선**: AI가 작성한 코드는 반드시 직접 한 줄씩 읽고 이해
4. **테스트 우선**: 새 기능에 테스트 없으면 머지 금지
5. **거부 우선**: AI 제안이 §B 원칙(12 헌법)을 위반하면 거부하고 다시 요청

## 막혔을 때
1. **5분 룰**: 5분 안에 해결 안 되면 멈추고 §부록 A-10 프롬프트 사용
2. **고무 오리 디버깅**: AI에게 문제를 처음부터 설명 → 설명 도중 보통 답이 나옴
3. **검색 우선**: 동일 에러 메시지로 GitHub Issues, Stack Overflow 검색
4. **시간 박싱**: 1시간 넘게 막히면 일단 우회 + TODO 남기고 다음 step

## 코드 리뷰 (혼자라도)
1. PR 만든 다음 본인이 다시 한 시간 후 리뷰
2. 다음 항목 점검:
   - 이 코드를 6개월 후의 내가 이해할 수 있나
   - 테스트가 진짜 의미 있는 케이스를 검증하나
   - 함수 하나가 한 가지 일만 하나
   - 변수명이 의도를 드러내나
   - 주석은 "왜"를 설명하나 (어떻게는 코드가 설명)

---

# 마무리: Harmony를 만드는 이유

> **"악보 프로그램의 본질은 사용자가 음악을 만드는 시간을 더 길게, 도구와 싸우는 시간을 더 짧게 만드는 것이다."**

이 문서의 모든 step과 원칙은 그 단 한 줄을 향한다.

- 헌법 12조는 **기술 부채를 막기 위한** 룰
- §A System Prompt는 **AI를 일관된 동료로 만들기 위한** 룰
- Phase 0~8의 step 분해는 **막히지 않고 진도를 빼기 위한** 룰
- 부록의 미니 프롬프트는 **반복 작업을 자동화하기 위한** 룰

순서대로 따라가되, 각 step의 ✅ 완료 검증을 통과하지 못하면 **절대 다음 step으로 넘어가지 말 것**. 작은 부채가 쌓이면 결국 v1.0이 출시되지 않는다.

좋은 도구를 만들자. 사용자가 도구를 잊고 음악만 생각하도록.

---

**문서 끝.**

