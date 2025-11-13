import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 3.5625rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.0313rem 1.25rem;
  border-bottom: 1px solid var(--color-secondary-gray);
  background: #fff;
  position: fixed;
  top: 0;
  right: max(calc(50vw - 393px / 2), 0px);
  left: auto;
  z-index: 100;
`;

export const Title = styled.div`
  color: #000;
  font-size: 1.25rem;
  font-weight: 800;
`;

export const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 1.875rem;
  height: 1.875rem;

  & > button {
    width: ${({ $isBack }) => ($isBack ? "1.875rem" : "1.25rem")};
    height: ${({ $isBack }) => ($isBack ? "1.875rem" : "1.25rem")};
  }
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;
