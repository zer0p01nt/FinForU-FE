import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: calc(3.5625rem + 1.875rem) 1.875rem 0;
  background-color: #fff;
`;

export const Btn = styled.button`
  width: 100%;
  max-width: 333px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-primary-gray);
  background-color: #fff;

  div {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1.625rem;
  }
`;

export const Text = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
`;

export const LogoutBtn = styled.button`
  width: 100%;
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
  margin-top: 1rem;
`;
