import styled from "styled-components";

const SAFE_TOP = "env(safe-area-inset-top, 0px)";
const SAFE_BOTTOM = "env(safe-area-inset-bottom, 0px)";
const HEADER_HEIGHT = "3.5625rem";
const NAV_HEIGHT = "5rem";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 100vh;
  position: relative;
  margin: 0 auto;
  padding-top: calc(${HEADER_HEIGHT} + ${SAFE_TOP});
  padding-bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM});
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MapWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  background-color: #e5e5e5;
  z-index: 1;
`;

export const MapCanvas = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const FilterSection = styled.div`
  position: absolute;
  top: calc(${HEADER_HEIGHT} + ${SAFE_TOP} + 0.75rem);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1.25rem;
  z-index: 2;
  pointer-events: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
export const FilterRow = styled.div`
  display: flex;
  gap: 0.625rem;
  overflow-x: auto;
  margin: 0 -1.25rem;
  padding: 0 1.25rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  pointer-events: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FilterButton = styled.button`
  background-color: ${({ $isActive }) => ($isActive ? "#009CEA" : "#fff")};
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#000")};
  border: 1px solid ${({ $isActive }) => ($isActive ? "#009CEA" : "var(--color-secondary-gray)")};
  border-radius: 0.625rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s;
  outline: none; // 횡스크롤 시 테두리 검은 선 안 생기도록

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? "#009CEA" : "#f5f5f5")};
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;

    path {
      fill: currentColor;
    }
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

export const InfoCard = styled.div`
  background-color: #fff;
  border: 1px solid var(--color-secondary-gray);
  border-radius: 0.625rem;
  padding: 1rem;
  min-width: 280px;
  flex-shrink: 0;
  pointer-events: auto;
  cursor: ${({ $isInteractive }) => ($isInteractive ? "pointer" : "default")};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  ${({ $isInteractive }) =>
    $isInteractive &&
    `
  &:active {
    transform: scale(0.98);
  }

  `}

  ${({ $isActive }) =>
    $isActive &&
    `
      box-shadow: 0 8px 24px rgba(0, 156, 234, 0.25);
    `}
`;

export const CardSection = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 2.5rem);
  padding: 0 1.25rem;
  z-index: 2;
  pointer-events: auto;
`;

export const CardContent = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

export const CardLogo = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const CardTextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CardTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export const CardInfo = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.375rem;
  line-height: 1.5;
  padding-bottom: ${({ $hasDivider }) => ($hasDivider ? "0.75rem" : "0")};
  border-bottom: ${({ $hasDivider }) => ($hasDivider ? "1px solid #f0f0f0" : "none")};
`;

export const CardInfoWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.375rem;
  line-height: 1.5;
  padding-bottom: ${({ $hasDivider }) => ($hasDivider ? "0.75rem" : "0")};
  border-bottom: ${({ $hasDivider }) => ($hasDivider ? "1px solid #f0f0f0" : "none")};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  span {
    word-break: break-all;
  }
`;

export const CardHoursText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
`;

export const CardOpenStatus = styled.span`
  color: #009cea;
  font-weight: 600;
`;

export const CardRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  margin: 0 -1.25rem;
  padding: 0 1.25rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  pointer-events: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CardLink = styled.a`
  color: #666;
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
    color: #009cea;
  }
`;

export const DetailSheet = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 1.5rem);
  padding: 0;
  z-index: 3;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  transform: translateY(
    ${({ $isOpen, $position }) => {
      if (!$isOpen) return "110%";
      // $position: 0 = 닫힘, 1 = 열림
      // 110%에서 시작해서 0%까지 이동
      return `${110 - $position * 110}%`;
    }}
  );
  transition: ${({ $isDragging }) => ($isDragging ? "none" : "transform 0.3s ease")};
  width: 100%;
  max-width: 100%;
`;

export const DetailHeader = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 1.5rem 1.5rem 0 0;
  background-color: #ffffff;
  position: relative;
  cursor: grab;
  touch-action: none;
  user-select: none;
  width: 100%;
  padding-top: 0.75rem;

  &:active {
    cursor: grabbing;
  }
`;

export const DetailHandle = styled.div`
  width: 52px;
  height: 6px;
  margin: 0 auto 0.75rem;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: grab;
  touch-action: none;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }
`;

export const DetailHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0 1.5rem 1rem;
  width: 100%;
`;

export const DetailBankLogo = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
  margin-bottom: 0.25rem;
  align-self: center;
`;

export const DetailAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #009cea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  text-transform: uppercase;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    background: #009cea;
  }
`;

export const DetailTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 500;
  color: #000;
  margin: 0;
  text-align: left;
  width: 100%;
`;

export const DetailBody = styled.div`
  background-color: #ffffff;
  border-radius: 0;
  padding: 0 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: calc(100vh - ${HEADER_HEIGHT} - ${NAV_HEIGHT} - ${SAFE_TOP} - ${SAFE_BOTTOM} - 8rem);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: #000;
  line-height: 1.5;
  padding: 0.35rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailHoursText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
`;

export const DetailOpenStatus = styled.span`
  color: #009cea;
  font-weight: 600;
`;

export const DetailIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b4b4b;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;

    path {
      fill: currentColor;
    }
    display: block;
  }
`;

export const DetailLink = styled.a`
  color: #000;
  font-weight: 400;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
