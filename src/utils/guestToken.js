/**
 * 게스트 토큰 생성 및 관리 유틸리티
 */

const GUEST_TOKEN_KEY = "guestToken";

/**
 * 게스트 토큰 생성
 * @returns {string} 생성된 게스트 토큰
 */
export const generateGuestToken = () => {
  // UUID v4 형식으로 토큰 생성
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}-${randomPart2}`;
};

/**
 * localStorage에서 게스트 토큰 가져오기 (없으면 생성)
 * @returns {string} 게스트 토큰
 */
export const getOrCreateGuestToken = () => {
  let token = localStorage.getItem(GUEST_TOKEN_KEY);
  if (!token) {
    token = generateGuestToken();
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  }
  return token;
};

/**
 * 게스트 토큰 가져오기 (생성하지 않음)
 * @returns {string|null} 게스트 토큰 또는 null
 */
export const getGuestToken = () => {
  return localStorage.getItem(GUEST_TOKEN_KEY);
};

/**
 * 게스트 토큰 삭제
 */
export const clearGuestToken = () => {
  localStorage.removeItem(GUEST_TOKEN_KEY);
};

