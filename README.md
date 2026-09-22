# VELTOWEB — Web Design Studio

VELTOWEB 공식 웹사이트용 포트폴리오 메인 페이지입니다. 별도의 빌드 도구나 설치 없이 HTML, CSS, JavaScript로 실행할 수 있습니다.

## 실행 방법

1. ZIP 압축을 해제합니다.
2. 압축 해제한 폴더에서 `index.html`을 브라우저로 엽니다.
3. VS Code에서는 `index.html`을 Live Server로 열어도 됩니다.

## 포함된 구성

- `index.html` — HERO, WORK, ABOUT, SERVICE, PROCESS, CONTACT, FOOTER
- `style.css` — 반응형 레이아웃, 색상, 타이포그래피, 인터랙션 스타일
- `script.js` — 인트로, 모바일 메뉴, 스크롤 리빌, 패럴랙스, 커스텀 커서
- `images/` — 기존 프로젝트 PNG 이미지
- `fonts/` — 현재 페이지에 사용되는 Noto Sans KR 로컬 글꼴 subset 및 라이선스

## 유지한 프로젝트 링크

기존 ZIP의 프로젝트 폴더와 연결 경로는 변경하지 않았습니다.

- CAFE DE LUNE — `https://veltoweb.github.io/cafe-de-lune/index.html`
- ATELIER NOVE — `https://veltoweb.github.io/atelier-nove/index.html`
- ONUEL — `https://veltoweb.github.io/onuel/`
- SEON MEDICAL CENTER — `https://veltoweb.github.io/seon-medical-center/`

문의 버튼과 Instagram 링크도 기존 계정 `@veltoweb_kr` 연결을 유지했습니다.

## 리디자인 포인트

- 스튜디오 브랜드 인상을 위한 대형 타이포그래피 HERO
- 대표 이미지가 포함된 짧은 인트로와 부드러운 텍스트 reveal
- WORK 영역의 고정 소개 컬럼과 프로젝트별 이미지 reveal
- 프로젝트 이미지 확대, 마우스 이동 반응, VIEW 커서
- 프로젝트 원본 비율을 보존해 좌우가 잘리지 않는 이미지 프레임
- ABOUT / SERVICE / PROCESS / CONTACT를 연결하는 명확한 문의 흐름
- 오렌지 PROCESS 배경 위 설명 글의 대비 강화
- 데스크톱 전체 화면 모바일 메뉴와 키보드 Escape·Tab 접근성
- 검정, 오프화이트, VELTOWEB 포인트 오렌지의 제한된 색상 시스템
- `prefers-reduced-motion` 대응 및 모바일 패럴랙스 비활성화

## 확인한 화면 폭

1920px, 1440px, 1280px, 768px, 430px, 390px, 375px에서 가로 넘침을 확인했습니다. 프로젝트 링크, 이미지 로딩, 모바일 메뉴 열기·닫기, JavaScript 콘솔 오류도 점검했습니다.

프로젝트 이미지는 기존 PNG 파일만 사용해 폴더에 같은 사진이 중복으로 표시되지 않도록 정리했습니다.
