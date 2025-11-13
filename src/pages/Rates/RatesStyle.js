import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  padding: calc(3.5625rem + 0.875rem) 1.875rem 7.75rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  /* 스크롤 안 보이게 */
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

export const TopBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Toast = styled.div`
  width: 100%;
  max-width: 333px;
  padding: 0.625rem 0.75rem;
  background-color: var(--color-primary-sky-blue);
  color: var(--color-primary);
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 0.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Title = styled.div`
  color: #000;
  font-size: 1.1875rem;
  font-weight: 500;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  input {
    display: none;
  }

  label {
    height: 2.0625rem;
    width: 100%;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.625rem;
    background-color: #fff;
    border: 1px solid var(--color-input-gray);
    color: #000;
    font-size: 0.8125rem;
    font-weight: 400;
  }

  input[type="radio"]:checked + label {
    background-color: var(--color-secondary);
    color: #fff;
    border: none;
  }
`;

export const GraphWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const MiniTitle = styled.div`
  font-size: 1.0625rem;
  color: #000;
  font-weight: 500;
`;

export const RateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Rate = styled.div`
  font-size: 2rem;
  color: #000;
  font-weight: 500;
`;

export const TodayBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
`;

export const Today = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #484848;
`;

export const TodayRate = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #ff6767;
`;

export const PeriodBtnWrapper = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  height: 1rem;

  button {
    position: absolute;
    top: 0;
    width: 4.5rem;
    height: 1rem;
    padding: 0 0 0.3125rem;
    background-color: #fff;
    font-size: 0.625rem;
    font-weight: 400;
  }
`;

/* 기본 버튼 스타일 */
export const BaseBtn = styled.button`
  color: ${({ $active }) => ($active ? "#000" : "#515151")};
  border-bottom: 1px solid ${({ $active }) => ($active ? "#282828" : "#d9d9d9")};
`;

export const OneWeekBtn = styled(BaseBtn)`
  left: 0;
`;

export const ThreeMonthsBtn = styled(BaseBtn)`
  left: 4.5rem;
`;

export const OneYearBtn = styled(BaseBtn)`
  left: 9rem;
`;

export const FeeBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9375rem;
`;

export const FeeItem = styled.div`
  display: flex;
  gap: 0.8125rem;
  align-items: center;

  img {
    width: 2.1875rem;
    height: 2.1875rem;
    border-radius: 0.3125rem;
  }
`;

export const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Bank = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #000;
`;

export const Fee = styled.div`
  font-size: 0.8125rem;
  color: #484848;
  font-weight: 400;
`;
