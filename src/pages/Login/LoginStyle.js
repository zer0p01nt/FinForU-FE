import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 2.125rem;
`;

export const Title = styled.div`
  font-size: 1.875rem;
  color: #000;
  font-weight: 800;
  text-align: center;
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  flex-shrink: 0;
  flex-grow: 0;
  @media screen and (max-height: 645px) {
    position: relative;
    top: unset;
    left: unset;
    transform: unset;
    margin: 1.25rem 0;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 1.375rem;
  flex-shrink: 0;
  flex-grow: 0;
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 1.9375rem;

  input {
    height: 3.125rem;
    background-color: #fff;
    width: 100%;
    padding: 0.9375rem 1.25rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #000;
    outline: none;

    &::placeholder {
      color: var(--color-input-gray);
    }
  }
`;

export const EmailInput = styled.input`
  border-radius: 0.625rem 0.625rem 0 0;
  border: 2px solid var(--color-input-gray);
  border-bottom: 1px solid var(--color-input-gray);
`;

export const PWInput = styled.input`
  border-radius: 0 0 0.625rem 0.625rem;
  border: 2px solid var(--color-input-gray);
  border-top: 1px solid var(--color-input-gray);
`;

export const Btn = styled.button`
  width: 100%;
  height: 3rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.625rem;
  background-color: ${({ $isLogin }) => ($isLogin ? "var(--color-primary)" : "#fff")};
  color: ${({ $isLogin }) => ($isLogin ? "#fff" : "rgba(0, 0, 0, 0.70)")};
  border: ${({ $isLogin }) => ($isLogin ? "none" : "2px solid var(--color-primary)")};
`;

export const Div = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.31);
  width: 100%;
`;
