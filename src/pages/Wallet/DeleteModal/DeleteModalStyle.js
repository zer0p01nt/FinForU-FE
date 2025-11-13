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
  width: 90vw;
  max-height: 80vh;
  max-width: 353px;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  align-items: center;
  border-radius: 0.625rem;
  padding-bottom: 1.875rem;
`;

export const Title = styled.div`
  width: 100%;
  padding: 1.5625rem 0 1.25rem;
  border-bottom: 1px solid var(--color-secondary-gray);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  color: #000;
  font-weight: 600;
`;

export const Msg = styled.div`
  width: 100%;
  font-size: 1.125rem;
  color: #000;
  font-weight: 400;
  text-align: center;
`;

export const BtnWrapper = styled.div`
  width: 100%;
  padding: 0 1.5rem;
  max-width: 345px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background-color: white;

  button {
    width: 7.9375rem;
    height: 3.125rem;
    padding: 0 0.8125rem;
    color: #fff;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 0.625rem;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
`;

export const GrayBtn = styled.button`
  background-color: var(--color-tertiary-gray);
`;

export const BlueBtn = styled.button`
  background-color: var(--color-primary);
`;
