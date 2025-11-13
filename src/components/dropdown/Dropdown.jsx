import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "./DropdownStyle";
import { useTranslation } from "react-i18next";

/**
 * 커스텀 드롭다운 컴포넌트 - 두 줄짜리 항목 및 좌/우측 상단 Radius도 대응
 * @param {object} props
 * @param {{ value: string, label: string }} props.name - 숨겨진 input의 name 속성
 * * value는 실제 input의 id, name으로 들어가며 label은 다국어 처리를 한 텍스트
 * @param {({ value: string, main: string, sub: string } | { value: string, label: string })[]} props.itemArray - 항목 배열
 * * 실제 서버에서 전송할 값을 value, 다국어 처리를 한 텍스트를 label에 넘깁니다.
 * * 한 줄 항목은 { value: string, label: string } 객체로 넘겨야 합니다.
 * * 두 줄 항목은 { value: string, main: string, sub: string } 형태로 넘깁니다.
 * @param {function(string, string): void} props.onSelect - 항목 선택 시 호출될 콜백 함수 (name.value, item.value)
 * @param {string} props.selectedValue - 부모 컴포넌트에서 전달된 현재 선택된 값
 * @param {boolean} props.isWallet - 월렛 페이지의 모달에서 쓰이는지 아닌지 (height 조절) - 기본값 false이므로 월렛 페이지 모달이 아니면 따로 설정할 필요 없음
 */
export default function Dropdown({ name, itemArray, onSelect, selectedValue, isWallet = false }) {
  const { t, i18n } = useTranslation();

  // 자동 스크롤 구현
  const containerRef = useRef(null);
  const optionBoxRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(t("pleaseSelect")); // ui에 보여질 값 = label
  // ui 수정하는 코드 -> label만 관리
  useEffect(() => {
    const selectedItem = itemArray.find((item) => item.value === selectedValue);
    let newLabel;

    if (selectedItem) {
      if (selectedItem.main) {
        newLabel = selectedItem.main;
      } else {
        newLabel = selectedItem.label;
      }
    } else {
      newLabel = t("pleaseSelect");
    }
    if (selectedLabel !== newLabel) {
      setSelectedLabel(newLabel);
    }
  }, [selectedValue, itemArray, i18n.language, selectedLabel, t]);

  const handleSelect = useCallback(
    (item) => {
      const newInputValue = item.value;

      // 부모 컴포넌트로 값 전달
      onSelect(name.value, newInputValue);
      setIsVisible(false);
    },
    [onSelect, name.value]
  );

  // 드롭다운 열릴 때 자동 스크롤
  useEffect(() => {
    if (isVisible && containerRef.current && optionBoxRef.current) {
      const dropdownContainer = containerRef.current;
      const optionBox = optionBoxRef.current;
      const timer = setTimeout(() => {
        const optionRect = optionBox.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const isOffScreen = optionRect.bottom > viewportHeight || optionRect.top < 0;

        if (isOffScreen) {
          dropdownContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // 드롭다운 열려있는 동안 스크롤 막기
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isVisible]);

  return (
    <S.Container
      ref={containerRef}
      onClick={() => setIsVisible(!isVisible)}
      $selected={selectedValue && selectedValue !== ""}
      $isWallet={isWallet}
    >
      <S.Content>
        <div>{selectedLabel}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="11"
          viewBox="0 0 21 11"
          fill="none"
        >
          <path
            d="M1.68725 0.282423C1.59178 0.192204 1.47947 0.121675 1.35674 0.0748596C1.23401 0.0280437 1.10327 0.00585938 0.971965 0.00957394C0.840663 0.0132885 0.711378 0.0428286 0.591492 0.0965071C0.471606 0.150186 0.363467 0.226952 0.273249 0.322423C0.183031 0.417894 0.112501 0.530201 0.0656852 0.652929C0.0188697 0.775658 -0.00331434 0.906405 0.000400002 1.03771C0.00411435 1.16901 0.0336542 1.2983 0.0873329 1.41818C0.141012 1.53807 0.217778 1.6462 0.313249 1.73642L9.31325 10.2364C9.49892 10.412 9.74474 10.5098 10.0002 10.5098C10.2558 10.5098 10.5016 10.412 10.6872 10.2364L19.6882 1.73642C19.7858 1.6468 19.8646 1.53869 19.92 1.41836C19.9754 1.29803 20.0064 1.16789 20.0111 1.0355C20.0158 0.903103 19.9942 0.771093 19.9474 0.647137C19.9007 0.52318 19.8298 0.409746 19.7388 0.313426C19.6479 0.217106 19.5387 0.139817 19.4176 0.086051C19.2965 0.0322847 19.166 0.00311279 19.0335 0.000227928C18.9011 -0.00265694 18.7694 0.0208044 18.6461 0.0692482C18.5228 0.117692 18.4103 0.190153 18.3153 0.282423L10.0002 8.13442L1.68725 0.282423Z"
            fill="black"
          />
        </svg>
      </S.Content>
      {isVisible && (
        <>
          <S.Overlay onClick={() => setIsVisible(false)} />
          <S.OptionBox ref={optionBoxRef}>
            {itemArray.map((item, index) => {
              // 두 줄일 경우 main/sub 키를 사용하고, 한 줄일 경우 전체를 label로 사용
              const mainText = item.main ? item.main : item.label;
              const subText = item.main ? item.sub : null;
              // subText가 존재할 때만 두 줄 렌더링
              const isTwoLines = !!subText;
              return (
                <S.ItemWrapper
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  <S.ItemMain>
                    {mainText}
                    {isTwoLines && <S.ItemSub>{subText}</S.ItemSub>}
                  </S.ItemMain>
                </S.ItemWrapper>
              );
            })}
          </S.OptionBox>
        </>
      )}
    </S.Container>
  );
}
