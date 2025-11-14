import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  padding: calc(3.5625rem + 1.25rem) 1.6875rem calc(6.75rem + 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.5625rem;
  justify-content: center;
  align-items: center;
`;

export const Box = styled.div`
  width: 100%;
  max-width: 339px;
  padding: 1.0625rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.625rem;
`;

export const CheckingBox = styled(Box)`
  background-color: #d8f2ff;
`;

export const SavingsBox = styled(Box)`
  background-color: #e8fff1;
`;

export const CardBox = styled(Box)`
  background-color: #ffe8d0;
`;

export const TextBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  color: #000;
  font-size: 1.125rem;
  font-weight: 600;
`;

export const AddBtn = styled.button`
  background: transparent;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.8125rem;
  color: var(--color-primary);
  font-weight: 400;
`;

export const ProductBox = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 297px;
  border-radius: 0.625rem;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8125rem 1rem 0.8125rem 0.8125rem;
  gap: 0.9375rem;

  & > svg,
  & > svg path {
    width: 2.1875rem;
    height: 2.1875rem;
    flex-shrink: 0;
  }
`;

export const Placeholder = styled.div`
  font-size: 0.9375rem;
  color: var(--color-input-gray);
  font-weight: 500;
  width: 100%;
  justify-self: flex-start;
`;

export const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
`;

export const CardCircle = styled.div`
  width: 2.1875rem;
  height: 2.1875rem;
  flex-shrink: 0;
  background-color: rgba(255, 232, 208, 0.4);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CheckingAccount = styled.div`
  font-size: 0.9375rem;
  color: #000;
  font-weight: 500;
  width: 100%;
  justify-self: flex-start;
`;

export const CheckName = styled.div`
  font-size: 0.9375rem;
  color: #000;
  font-weight: 500;
  width: 100%;
  justify-self: flex-start;
`;

export const SavingsNCardBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  justify-self: flex-start;
  color: #000;
`;

export const AccountName = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
`;

export const AccountDesc = styled.div`
  font-size: 0.625rem;
  font-weight: 300;
`;
