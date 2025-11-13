import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 3.5625rem 1.25rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12.5rem;
  background-color: #fff;
`;

export const IndicatorWrapper = styled.div`
  position: fixed;
  width: 100%;
  max-width: calc(393px - 1.625rem);
  padding: 0.8125rem 1.25rem 0.5rem;
  background-color: #fff;
  z-index: 1000;
`;

export const Indicator = styled.div`
  width: 100%;
  height: 0.3125rem;
  background-color: #f2f2f2;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: var(--color-primary);
`;

export const Content = styled.div`
  width: 100%;
  padding: 3rem 1.5rem 0;
  padding: ${({ $step }) => ($step === 3 ? "3rem 1rem 0" : "3rem 1.5rem 0")};
`;
