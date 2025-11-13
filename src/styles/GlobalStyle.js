import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary-gray: #b1b1b1;
    --color-secondary-gray: #dadada;
    --color-tertiary-gray: #d6d6d6;
    --color-input-gray: #b3b3b3;
    --color-primary: #0093dd;
    --color-secondary: #009cea;
    --color-primary-sky-blue: #d9f2ff;
  }

  html, body {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: white;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;

    /* 현재 언어 중국어일 때만 중국어 지원 폰트 우선으로 */
    font-family: 
      ${({ currentLang }) =>
        currentLang === "zh"
          ? `
            "Noto Sans SC", 
            "Pretendard Variable",
            "PingFang SC",
            "Microsoft YaHei",
            sans-serif
            `
          : `
            "Pretendard Variable", 
            "Noto Sans SC",        
            -apple-system, 
            BlinkMacSystemFont, 
            system-ui, 
            Roboto, 
            "Helvetica Neue", 
            "Segoe UI", 
            "Apple SD Gothic Neo",
            "Malgun Gothic",
            sans-serif
            `};
  }

  ol, ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a, button {
    cursor: pointer;
  }

  input, button {
    margin: 0;
    padding: 0;
    border: none;
    background-color: transparent;
  }

  /* 드롭다운 / 모달 창 열려있을 때 스크롤 막는 클래스 */
  .no-scroll {
  overflow: hidden; 
}
`;
