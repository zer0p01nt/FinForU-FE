import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  padding: calc(3.5625rem + 1.875rem) 1.875rem 0;
  margin-bottom: 12.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

export const Title = styled.div`
  color: #000;
  font-weight: 500;
  font-size: 1.125rem;
`;

export const TextBoxWrapper = styled.div`
  width: 100%;
  margin-top: 2.375rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.0625rem;
`;

export const TextBox = styled.div`
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgba(217, 217, 217, 0.33);
  border-radius: 0.625rem;
  color: #000;
  gap: 0.5rem;
`;

export const Text = styled.div`
  font-size: 1rem;
  font-family: 300;
  justify-self: flex-end;
  padding-left: 1.125rem;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  background-color: #fff;
  display: flex;
  gap: 2.75rem;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  right: max(calc(50vw - 393px / 2), 0px);
  left: auto;
  z-index: 100;
  padding: 1rem 0 2.5rem;

  & > button {
    width: 7.9375rem;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.875rem 2.8125rem;
    height: 3.125rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 0.625rem;
    white-space: nowrap;
    background-color: var(--color-primary);
  }
`;
