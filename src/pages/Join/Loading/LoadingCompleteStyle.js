import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  gap: 2.8125rem;
  padding: 0 1rem;
`;

export const Spinner = styled.div`
  animation: ${spin} 2.5s linear infinite;
`;

export const Text = styled.div`
  color: #000;
  font-size: 1.25rem;
  font-weight: 500;
`;

export const Button = styled.button`
  color: #fff;
  background-color: var(--color-primary);
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 323px;
  height: 3rem;
  margin-top: 100px;
`;
