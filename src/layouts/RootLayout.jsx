import styled from "styled-components";

const MainWrapper = styled.div`
  width: 100%;
  max-width: 393px;
  margin: 0 auto;
`;

export default function RootLayout({ children }) {
  return <MainWrapper>{children}</MainWrapper>;
}
