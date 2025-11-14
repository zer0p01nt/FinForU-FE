import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: calc(100vh - 3.5625rem - 5rem);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin: 0 auto;
  padding-top: 3.5625rem;
  overflow: hidden;
`;

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.25rem 0;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
`;

export const WelcomeMessage = styled.div`
  color: #000;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

export const UserMessage = styled.div`
  background-color: #D9F2FF;
  border-radius: 1rem;
  padding: 0.875rem 1rem;
  color: #000;
  font-size: 1rem;
  line-height: 1.5;
  align-self: flex-end;
  max-width: 80%;
  word-wrap: break-word;
  margin-left: auto;
`;

export const AIMessage = styled.div`
  color: #000;
  font-size: 1rem;
  line-height: 1.5;
  align-self: flex-start;
  max-width: 90%;
  word-wrap: break-word;
  white-space: pre-line;
  margin-right: auto;
`;

export const LoadingMessage = styled.div`
  color: #000;
  font-size: 1rem;
  line-height: 1.5;
  align-self: flex-start;
`;

export const FAQSection = styled.div`
  display: flex;
  gap: 0.625rem;
  padding: 0 1.25rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-shrink: 0;
  background-color: #fff;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FAQButton = styled.button`
  background-color: #D9F2FF;
  border-radius: 0.625rem;
  padding: 0.5rem 0.75rem;
  color: #009CEA;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: normal;
  word-wrap: break-word;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  max-width: 220px;
  line-height: 1.4;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InputSection = styled.div`
  display: flex;
  gap: 0.625rem;
  padding: 0 1.25rem;
  align-items: center;
  flex-shrink: 0;
  background-color: #fff;
`;

export const InputField = styled.input`
  flex: 1;
  background-color: #fff;
  border: 1px solid var(--color-secondary-gray);
  border-radius: 0.625rem;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: #000;

  &::placeholder {
    color: var(--color-primary-gray);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const SendButton = styled.button`
  width: 2.75rem;
  height: 2.75rem;
  background-color: #0093DD;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &:disabled {
    background-color: var(--color-secondary-gray);
    cursor: not-allowed;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
