import styled from "styled-components";
import * as J from "../../Join/Steps/StepsStyle";

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
  position: relative;
  width: 90vw;
  max-height: 80vh;
  max-width: 353px;
  background-color: #fff;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 5px 3px rgba(0, 0, 0, 0.1);
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

export const Main = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.0625rem;
  padding-bottom: 9rem;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const Content = styled.div`
  width: 100%;
  padding: 1.25rem 2.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const WalletLabel = styled(J.Label)`
  font-weight: 500;
`;

export const WalletInput = styled(J.Input)`
  height: 2.5rem;
`;

export const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  align-items: center;
  width: 100%;
`;

export const TypeBtn = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ $selected }) => ($selected ? "var(--color-primary)" : "#fff")};
  border-radius: 0.625rem;
  border: 1px solid var(--color-input-gray);
  color: ${({ $selected }) => ($selected ? "#fff" : "#000")};
  font-size: 0.9375rem;
  font-weight: 500;
  height: 2.5rem;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  transition: all 0.2s ease;
`;

export const PeriodWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`;

export const PeriodBar = styled.div`
  background-color: #000;
  width: 1.0625rem;
  height: 2px;
`;

export const PeriodInput = styled(WalletInput)`
  justify-content: center;
  text-align: center;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const MonthlyInput = styled(WalletInput)`
  padding-left: 2.5rem;
  direction: rtl;
`;

export const MonthlyMark = styled.div`
  position: absolute;
  top: 0.625rem;
  left: 0.9375rem;
`;

export const UpcomingLabel = styled(WalletLabel)`
  gap: 0;
`;

export const UpcomingDesc = styled.div`
  color: #000;
  font-size: 0.625rem;
  font-weight: 100;
  margin-bottom: 0.625rem;
`;

export const UpcomingInput = styled(WalletInput)`
  padding-left: 2.5rem;
  padding-right: 3rem;
  direction: rtl;
`;

export const DDMark = styled.div`
  position: absolute;
  color: var(--color-input-gray);
  font-size: 0.9375rem;
  font-weight: 400;
  top: 0.75rem;
  left: 0.9375rem;
`;

export const DayMark = styled.div`
  position: absolute;
  color: #6c6c6c;
  font-size: 0.9375rem;
  font-weight: 400;
  top: 0.75rem;
  right: 1.25rem;
`;

export const AddBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: var(--color-primary);
  font-size: 0.9375rem;
  font-weight: 500;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`;

export const BtnWrapper = styled.div`
  width: 100%;
  padding: 0 1.5rem calc(2.5rem - 0.625rem);
  max-width: 345px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  position: absolute;
  bottom: 0.625rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding-top: 1rem;

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
