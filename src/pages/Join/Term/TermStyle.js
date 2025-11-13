import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  background-color: #fff;
  width: 80vw;
  max-width: 314px;
  padding: 1.875rem 1.25rem 1.5625rem;
  position: relative;
  color: #000;
  overflow-y: auto;
  /* 스크롤 안 보이게 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-radius: 0.625rem;
  max-height: 80vh;
`;

export const XBtn = styled.button`
  position: absolute;
  top: 1.875rem;
  right: 1.25rem;
  z-index: 10000;
`;

export const Title = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
`;

export const Content = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  ul,
  ol {
    padding-left: 1.25rem;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }
`;
