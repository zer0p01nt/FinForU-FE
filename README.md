# <div align="center"> Bridging the World to Korean Finance, FinForU </div>

> ### 4호선톤 10팀 프론트엔드 레포지토리
> 개발 기간 : 2025.10.30. ~ 2025.11.14.

<br/>

 ## <div align="center">🙋‍♀️ 프론트엔드 팀원 🙋‍♀️</div>

<table align="center">
  <thead>
    <tr>
      <th>
        <a href="https://github.com/zer0p01nt">
          <img src="https://avatars.githubusercontent.com/u/189887138?v=4" width="200" />
        </a>
      </th>
      <th>
        <a href="https://github.com/sunhaaaaa">
          <img src="https://avatars.githubusercontent.com/u/128135882?v=4" width="200" />
        </a>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">백민영</td>
      <td align="center">황선하</td>
    </tr>
    <tr>
      <td align="center">
        <div>3개 국어(영어, 중국어, 베트남어) 다국어 처리</div>
        <div>온보딩(언어 선택), 로그인, 회원가입</div>
        <div>정보 수정, 계정 삭제</div>
        <div>환율 열람 기능, 지갑 기능</div>
        <div>푸시 알림</div>
      </td>
      <td align="center">
        <div>구현한 기능</div>
      </td>
    </tr>
  </tbody>
</table>

<br />

 ## <div align="center">🔧 기술 스택 🔧</div>

<table align="center">
  <thead>
    <tr>
      <th>
        용도
      </th>
      <th>
        사용한 스택
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">사용 언어</td>
      <td align="center">
        <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
      </td>
    </tr>
    <tr>
      <td align="center">라이브러리</td>
      <td align="center">
        <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
      </td>
    </tr>
    <tr>
      <td align="center">라우팅</td>
      <td align="center">
        <img src="https://img.shields.io/badge/reactrouter-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white">
      </td>
    </tr>
    <tr>
      <td align="center">데이터 페칭</td>
      <td align="center">
        <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td align="center">전역 상태 관리</td>
      <td align="center">
        <img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white">
      </td>
    </tr>
    <tr>
      <td align="center">스타일링</td>
      <td align="center">
        <img src="https://img.shields.io/badge/StyledComponents-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td align="center">다국어 처리</td>
      <td align="center">
        <img src="https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white"/> 
      </td>
    </tr>
    <tr>
      <td align="center">번들러</td>
      <td align="center">
        <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td align="center">배포</td>
      <td align="center">
        <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
      </td>
    </tr>
    <tr>
      <td align="center">CI/CD</td>
      <td align="center">
        <img src="https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white">
      </td>
    </tr>
    <tr>
      <td align="center">푸시 알림</td>
      <td align="center">
        <img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white">
      </td>
    </tr>
    <tr>
      <td align="center">협업 도구</td>
      <td align="center">
        <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
        <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
        <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
        <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white">
      </td>
    </tr>
  </tbody>
</table>

<br/>

 ## <div align="center">📁 폴더 구조 📁</div>
```
FinForU-FE/
├─ .github/ (이슈 템플릿, PR 템플릿)
│  ├─ ISSUE_TEMPLATE/
│  │  ├─ config.yml
│  │  └─ issue_template.md
│  │
│  ├─ workflows
│  │  └─ deploy.yml (CI/CD 배포 파일)
│  │
│  └─ pull_request_template.md
│                
├─ public/
│  ├─ favicons (favicon, 웹앱 아이콘 등 관리)
│  │      
│  ├─ fonts/ (정적 경로에서 폰트 관리)
│  │  ├─ fonts.css
│  │  ├─ NotoSansSC-VariableFont_wght.ttf (중국어 환경 메인 폰트)
│  │  └─ PretendardVariable.woff2
│  │
│  ├─ favicon.png
│  ├─ firebase-messaging-sw.js (FCM 푸시알림을 위한 서비스워커)                  
│  ├─ logo.png
│  └─ manifest.json             
│
├─ src/
│  ├─ api/ (데이터 페칭에 사용하는 axiosInstance 파일)       
│  │
│  ├─ components/ (전역에서 재사용되는 컴포넌트 파일)        
│  │
│  ├─ constants/ (전역에서 재사용되는 정적 상수 파일)
│  │
│  ├─ hooks/ (FCM 토큰 관리에 사용되는 커스텀 훅 파일)               
│  │
│  ├─ layouts/ (전역 기본 레이아웃 파일 및 각 상황별 레이아웃 파일)               
│  │
│  ├─ locales/ (i18next 다국어 처리를 위한 정적 파일)               
│  │
│  ├─ pages/ (홈 화면 등 페이지 파일)             
│  │
│  ├─ stores/ (zustand 전역 상태 관리 파일)         
│  │
│  ├─ styles/ (css 관련 파일)
│  │  └─ GlobalStyle.jsx (전역 스타일 관리)           
│  │
│  ├─ App.jsx
│  ├─ firebase.js (Firebase 프로젝트 초기화 및 토큰 가져오는 로직 파일)
│  ├─ i18next.js (i18next 세팅 파일)
│  └─ main.jsx          
│
├─ .gitignore
├─ .prettierrc
├─ build.sh (CI/CD 배포 관련 파일)
├─ eslint.config.js
├─ index.html
├─ package-lock.json                  
├─ package.json
├─ README.md
└─ vite.config.js
```

<br/>

 ## <div align="center">💻 개발 시작하기 💻</div>

```
git clone https://github.com/line4thon-team10/FinForU-FE.git
cd FinForU-FE
npm install
npm run dev
```

<br />

 ## <div align="center">📃 커밋 컨벤션, 브랜치 전략 📃</div>


> ### 커밋 메세지 컨벤션
- 커밋의 시작은 아래의 목록을 참고하여 gitmoji & 커밋이름 삽입
- 커밋의 끝맺음은 "~ 기능 추가", "~ 작업", "~ 개발" 과 같이 명사로 통일
```
🎉 Init: 프로젝트 세팅
✨ Feat: 새로운 기능 추가
🐛 Fix: 버그 수정
🎨 Design: UI 스타일/디자인 수정
♻️ Refactor: 코드 리팩토링
✏️ Typo: 오타 수정,타입 수정
🚚 Rename: 폴더 구조 이동, 파일명 변경
🍱 Assets: 이미지, 폰트 등 리소스 추가/삭제
🔥 Del: 파일 삭제
📝 Docs: 문서 수정, 목데이터 작업 등
🔧 Chore: 설정파일 보완, 환경 설정
➕ Deps: 새로운 라이브러리 설치
➖ Deps: 불필요한 라이브러리 삭제
🔙 : 커밋 내용 복구
```
예시
```
✨ Feat: 메인페이지 개발
♻️ Refactor: 등록 플로우 - 글 작성 페이지 로직 정리
```


> ### 브랜치 전략
|태그이름|설명|
|--------|-------|
|main|실제 배포용 브랜치|
|develop|개발용 브랜치(기능 통합용)|
|feat/이슈번호/기능이름|새로운 기능 개발 시|
|refactor/이슈번호/기능이름|코드 리팩토링|
|fix/이슈번호/버그이름|버그 수정|
|design/이슈번호/요소|디자인 및 스타일 변경|
|chore/이슈번호/내용|설정, 의존성 등 기타 작업|

예시
```
feat/12/login-page  // 로그인 기능 개발
refactor/34/reduce-duplicated-code  // 코드 리팩토링
chore/56/update-eslint  // eslint 설정 수정
```
