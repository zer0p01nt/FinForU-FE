import { create } from "zustand";

// 헤더 기본 설정
const DEFAULT_HEADER_CONFIG = {
  title: "",
  showBackBtn: false,
  showSettingBtn: false,
};

// 사용할 땐 아래와 같이
// const { i18n } = useTranslation();
// const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
// useEffect(() => {
//   setHeaderConfig({
//     title: "헤더 텍스트",
//     showBackBtn: false, // 뒤로가기 버튼 여부
//     showSettingBtn: false, // 환경설정 버튼 여부
//   });
// }, [setHeaderConfig, i18n.language]);
export const useHeaderStore = create((set) => ({
  headerConfig: DEFAULT_HEADER_CONFIG,
  setHeaderConfig: (newConfig) =>
    set((state) => ({
      headerConfig: {
        ...state.headerConfig,
        ...newConfig,
      },
    })),
}));
