import styled from "styled-components";

/* steps 공통 스타일 */
export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
`;

export const Label = styled.label`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.625rem;
  font-size: 1.125rem;
  font-weight: 400;
  color: #000;
`;

export const Input = styled.input`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 0.625rem;
  border: 2px solid var(--color-input-gray);
  height: 3.125rem;
  background-color: #fff;
  padding: 0.9375rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #000;
  outline: none;

  &::placeholder {
    color: var(--color-input-gray);
  }
`;

export const ValidText = styled.div`
  color: red;
  font-size: 0.75rem;
  font-weight: 200;
`;

/* step1 스타일 */
export const PWInput = styled(Input)`
  border-radius: 0.625rem 0.625rem 0 0;
  border: 2px solid var(--color-input-gray);
  border-bottom: 1px solid var(--color-input-gray);
`;

export const PWAgainInput = styled(Input)`
  border-radius: 0 0 0.625rem 0.625rem;
  border: 2px solid var(--color-input-gray);
  border-top: 1px solid var(--color-input-gray);
`;

/* step2 스타일 */
export const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 289px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5%;
`;

export const Button = styled.button`
  background-color: ${({ $selected }) => ($selected ? "var(--color-secondary)" : "#fff")};
  border: ${({ $selected }) => ($selected ? "none" : "1px solid var(--color-input-gray)")};
  border-radius: 0.625rem;
  color: ${({ $selected }) => ($selected ? "#fff" : "#000")};
  font-size: 0.9375rem;
  font-weight: 400;
  height: 3.6875rem;
  /* 클릭하면 배경 파래지는 거 수정 */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;

export const ToggleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9375rem 1.25rem;
  background-color: #fff;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #000;
  border: 1px solid var(--color-input-gray);
  border-radius: 0.625rem;
  /* 클릭하면 배경 파래지는 거 수정 */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;

/* step3 스타일 */
export const Title = styled.div`
  color: #000;
  font-size: 1.4375rem;
  font-weight: 500;
  width: 100%;
`;

export const AllCheckWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  display: flex;
  font-size: 1.1875rem;
  color: #000;
  font-weight: 400;
  gap: 0.5rem;
  line-height: normal;
  /* 클릭하면 배경 파래지는 거 수정 */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  cursor: pointer;
`;

export const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
`;

export const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem;
`;

export const ListTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;

  div {
    color: #000;
    font-size: 1rem;
    font-weight: 400;
  }
`;

export const CheckBtn = styled.button`
  /* 클릭하면 배경 파래지는 거 수정 */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  svg path {
    fill: ${({ $checked }) => ($checked ? "var(--color-primary)" : "var(--color-input-gray)")};
  }
`;

export const ViewBtn = styled.button`
  color: var(--color-input-gray);
  font-size: 0.9375rem;
  font-weight: 400;
  text-decoration-line: underline;
  white-space: nowrap;
  /* 클릭하면 배경 파래지는 거 수정 */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;
