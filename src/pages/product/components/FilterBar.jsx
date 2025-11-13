import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "../ProductStyle";

export default function FilterBar({
  filterConfig,
  filterOrder,
  filters,
  getFilterLabel,
  onFilterSelect,
  onFilterReset,
}) {
  const [openFilterKey, setOpenFilterKey] = useState(null);
  const [dropdownMetrics, setDropdownMetrics] = useState(null);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const activeChipRef = useRef(null);
  const alignRightRef = useRef(false);

  const calculateDropdownMetrics = useCallback((chipElement, alignRight = false) => {
    if (!containerRef.current || !chipElement) return null;

    const chipRect = chipElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeLeft = chipRect.left - containerRect.left;
    const top = chipRect.bottom - containerRect.top + 8;
    const minWidth = Math.max(chipRect.width, 200);

    if (!alignRight) {
      return { left: relativeLeft, top, minWidth };
    }

    const containerWidth = containerRect.width;
    const gapToRight = containerRect.right - chipRect.right;
    const left = Math.max(0, containerWidth - minWidth - gapToRight);

    return { left, top, minWidth };
  }, []);

  const syncDropdownMetrics = useCallback(() => {
    if (!activeChipRef.current) return;
    setDropdownMetrics(calculateDropdownMetrics(activeChipRef.current, alignRightRef.current));
  }, [calculateDropdownMetrics]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpenFilterKey(null);
        setDropdownMetrics(null);
        activeChipRef.current = null;
        alignRightRef.current = false;
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!openFilterKey) return;

    syncDropdownMetrics();

    const handleResize = () => syncDropdownMetrics();
    const scrollElement = scrollRef.current;
    const handleScroll = () => syncDropdownMetrics();

    window.addEventListener("resize", handleResize);
    scrollElement?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      scrollElement?.removeEventListener("scroll", handleScroll);
    };
  }, [openFilterKey, syncDropdownMetrics]);

  const handleChipToggle = (key, event) => {
    if (openFilterKey === key) {
      setOpenFilterKey(null);
      setDropdownMetrics(null);
      activeChipRef.current = null;
      alignRightRef.current = false;
      return;
    }

    const chipElement = event.currentTarget;
    const alignRight = key === "period";
    alignRightRef.current = alignRight;
    activeChipRef.current = chipElement;
    setDropdownMetrics(calculateDropdownMetrics(chipElement, alignRight));
    setOpenFilterKey(key);
  };

  const handleOptionClick = (key, optionId) => {
    if (filters[key] === optionId) {
      onFilterReset(key);
    } else {
      onFilterSelect(key, optionId);
    }

    setOpenFilterKey(null);
    setDropdownMetrics(null);
    activeChipRef.current = null;
    alignRightRef.current = false;
  };

  const orderedKeys = filterOrder ?? Object.keys(filters);
  const activeOptions = openFilterKey ? filterConfig[openFilterKey]?.options ?? [] : [];

  return (
    <S.ActionBar ref={containerRef}>
      <S.FilterScroll ref={scrollRef}>
        {orderedKeys.map((key) => {
          const config = filterConfig[key];
          if (!config) return null;
          const isOpen = openFilterKey === key;

          return (
            <div key={key} style={{ position: "relative" }}>
              <S.FilterChip $active={!!filters[key]} onClick={(event) => handleChipToggle(key, event)}>
                <S.FilterLabel>
                  {getFilterLabel(key)}
                  <S.FilterArrow $open={isOpen}>
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4.66699 5.66699L8.00033 9.00033L11.3337 5.66699"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </S.FilterArrow>
                </S.FilterLabel>
              </S.FilterChip>
            </div>
          );
        })}
      </S.FilterScroll>

      {openFilterKey && dropdownMetrics && (
        <S.FilterDropdown
          $left={dropdownMetrics.left}
          $top={dropdownMetrics.top}
          $minWidth={dropdownMetrics.minWidth}
        >
          <S.FilterDropdownList>
            {activeOptions.map((option) => (
              <S.DropdownOption
                key={option.id}
                $active={filters[openFilterKey] === option.id}
                onClick={() => handleOptionClick(openFilterKey, option.id)}
              >
                <span>{option.label}</span>
              </S.DropdownOption>
            ))}
          </S.FilterDropdownList>
        </S.FilterDropdown>
      )}
    </S.ActionBar>
  );
}
