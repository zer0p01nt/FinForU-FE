import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  padding: 15% 2.5rem 25%;

  @media screen and (max-height: 768px) {
    height: 100%;
    gap: 3rem;
  }
`;

export const DescWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;

  div {
    /* 중국어 모드일 때 다른 나라 언어는 pretendard로 보이도록 */
    font-family:
      "Pretendard Variable",
      "Noto Sans SC",
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      "Helvetica Neue",
      "Segoe UI",
      "Apple SD Gothic Neo",
      "Malgun Gothic",
      sans-serif;
  }
`;

export const SelectMsg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.25rem;
  font-weight: 400;
`;

export const Chinese = styled.div`
  font-family: "Noto Sans SC", "Pretendard Variable", "PingFang SC", "Microsoft YaHei", sans-serif;
`;

export const SelectBtnWrapper = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.25rem;

  /* input은 안 보이게 */
  input[type="radio"] {
    display: none;
  }

  /* label이 input인 것처럼 */
  label {
    width: 100%;
    height: 3.75rem;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #fff;
    border: 2px solid rgba(0, 0, 0, 0.28);
    border-radius: 0.625rem;
    color: #000;
    font-size: 1.5625rem;
    font-weight: 400;

    /* 중국어 모드일 때 다른 나라 언어는 pretendard로 보이도록 */
    font-family:
      "Pretendard Variable",
      "Noto Sans SC",
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      "Helvetica Neue",
      "Segoe UI",
      "Apple SD Gothic Neo",
      "Malgun Gothic",
      sans-serif;
  }

  label:nth-child(4) {
    font-family:
      "Noto Sans SC", "Pretendard Variable", "PingFang SC", "Microsoft YaHei", sans-serif;
  }

  input[type="radio"]:checked + label {
    background-color: var(--color-secondary);
    color: #fff;
    border: none;
  }
`;

export const BtnBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.25rem;

  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};

  button {
    width: 100%;
    height: 3.0625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 0.625rem;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

export const LoginBtn = styled.button`
  background-color: var(--color-primary);
  color: #fff;
`;

export const GuestBtn = styled.button`
  background-color: var(--color-tertiary-gray);
  color: #484848;
`;
