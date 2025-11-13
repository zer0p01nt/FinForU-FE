import styled from "styled-components";

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
  padding: 0 2.25rem;
`;

export const Text = styled.div`
  color: #000;
  font-size: 1.25rem;
  font-weight: 500;
  text-align: center;
  width: 80%;
  margin: 2.8125rem 0 4.125rem;
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
  max-width: 321px;
  height: 3rem;
`;
