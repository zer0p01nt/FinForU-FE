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
  width: 87vw;
  max-width: 342px;
  max-height: 300px;
  background-color: #fff;
  padding: 5rem 3rem 4rem;
  position: relative;
  color: #000;
  border-radius: 0.625rem;
`;

export const XBtn = styled.button`
  position: absolute;
  top: 1.875rem;
  right: 1.25rem;
  z-index: 10000;
`;

export const Box = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

export const Text = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:
    "Noto Sans SC", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", sans-serif;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  button {
    width: 7rem;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.875rem 2rem;
    height: 3.125rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 0.625rem;
    white-space: nowrap;
  }
`;

export const BlueBtn = styled.button`
  background-color: var(--color-primary);
`;

export const GrayBtn = styled.button`
  background-color: var(--color-tertiary-gray);
`;
