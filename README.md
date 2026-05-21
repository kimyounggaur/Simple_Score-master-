# Harmony

웹 기반 악보 편집기 Harmony의 pnpm 모노레포입니다.

1. `pnpm install`
2. `cp apps/web/.env.local.example apps/web/.env.local`
3. `pnpm dev`

## GitHub Pages

`main` 브랜치에 push하면 `.github/workflows/pages.yml`이 `apps/web`을 정적 export로 빌드하고 GitHub Pages에 배포합니다.
