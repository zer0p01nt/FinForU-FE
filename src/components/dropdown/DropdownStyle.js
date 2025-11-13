import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 0.625rem;
  border: 2px solid var(--color-input-gray);
  background-color: #fff;
  height: ${({ $isWallet }) => ($isWallet ? "2.5rem" : "3.125rem")};
  padding: 0.9375rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 400;
  color: ${({ $selected }) => ($selected ? "#000" : "var(--color-input-gray)")};
  cursor: pointer;
  &,
  & * {
    /* 클릭하면 배경 파래지는 거 수정 */
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const OptionBox = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  background: none;
  background-color: #fff;
  border-radius: 0 0 0.625rem 0.625rem;
  z-index: 9999;
`;

export const ItemWrapper = styled.div`
  width: 100%;
  padding: 0.3125rem 0.625rem;
  border-bottom: 1px solid var(--color-secondary-gray);

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemMain = styled.div`
  width: 100%;
  padding: 0.125rem 0.625rem;
  border-radius: 0.3125rem;
  font-size: 0.9375rem;
  color: #000;
  font-weight: 400;
  &:active {
    background-color: #a4dcf9;
  }
`;

export const ItemSub = styled.div`
  color: #000;
  font-size: 0.75rem;
  font-weight: 300;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`;
