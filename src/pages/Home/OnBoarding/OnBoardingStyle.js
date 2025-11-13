import styled, { css, keyframes } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  opacity: 1;

  /* fade-out 상태일 때만 애니메이션 적용 */
  ${({ $isfading }) =>
    $isfading &&
    css`
      animation: ${fadeOut} 0.5s ease-in-out forwards;
      pointer-events: none;
    `}
`;

export const ImgBox = styled.div`
  margin-bottom: 6.25rem;
  position: relative;
  width: 301px;
  height: 301px;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  color: #fff;
  position: absolute;
  text-align: center;
  top: 16.6875rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`;

export const Title = styled.div`
  font-size: 3.75rem;
  font-weight: 800;
`;

export const Desc = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;
