# Extra Project

TypeScript 프로젝트입니다.

## 실행 방법

### 방법 1: npx tsx 직접 사용 (가장 권장 ⭐)

```bash
# 어떤 파일이든 바로 실행 가능 (가장 빠르고 간단!)
npx tsx src/index.ts
npx tsx src/refactoring.ts
npx tsx src/새파일.ts
```

### 방법 2: npm 스크립트 사용

```bash
# 기본 실행 (index.ts)
npm run dev
# 또는
npm run index

# 등록된 파일 실행
npm run refactoring

# 새로운 파일은 방법 1 사용 (npx tsx)
```

### 방법 3: tsx 글로벌 설치 후 사용

```bash
npm install -g tsx
tsx src/index.ts
tsx src/refactoring.ts
```

## 💡 추천 사용법

**새로운 파일을 만들 때마다:**

```bash
# 1. src/ 폴더에 새 파일 생성 (예: src/test.ts)
# 2. 바로 실행
npx tsx src/test.ts
```

**자주 사용하는 파일:**

- `package.json`의 `scripts`에 별칭 추가
- 예: `"test": "tsx src/test.ts"` 추가 후 `npm run test`로 실행

## 프로젝트 구조

```
src/
  ├── index.ts          # 메인 파일
  ├── refactoring.ts    # 리팩토링 예제
  └── ...               # 추가 파일들
```

## 팁

- 새로운 `.ts` 파일을 `src/` 폴더에 추가하면 바로 실행할 수 있습니다
- `npx tsx src/<파일명>` 형태로 언제든지 실행 가능합니다
