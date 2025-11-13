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
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

export const Spinner = styled.div`
  animation: ${spin} 2.5s linear infinite;
`;
