import styled from "styled-components";

export const Container = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg path {
    transition: fill 0.3s ease;
  }
`;
