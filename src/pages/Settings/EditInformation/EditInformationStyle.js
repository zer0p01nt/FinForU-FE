import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.8125rem;
  padding: calc(3.5625rem + 1.875rem) 2.8125rem 0;
  margin-bottom: 12.5rem;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 1.125rem;
  grid-column-gap: 0.625rem;
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1.25rem 0.9375rem;
  background-color: ${({ $selected }) => ($selected ? "var(--color-secondary)" : "#fff")};
  border: ${({ $selected }) => ($selected ? "none" : "1px solid var(--color-input-gray)")};
  border-radius: 0.625rem;
  color: ${({ $selected }) => ($selected ? "#fff" : "#000")};
  font-size: 0.9375rem;
  font-weight: 400;
  height: 3.125rem;
  /* 클릭하면 배경 파래지는 거 수정 */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  transition: all 0.2s ease;
`;
