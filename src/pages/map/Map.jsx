import { useTranslation } from "react-i18next";
import Navigation from "../../components/Navigation/Navigation";
import { useHeaderStore } from "../../stores/headerStore";
import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "./MapStyle";
import ForeignBankIcon from "./icons/ForeignBank.svg?react";
import GeneralBankIcon from "./icons/GeneralBank.svg?react";
import ATMIcon from "./icons/ATMIcon.svg?react";
import HanaBankLogo from "./icons/HanaLogo.png";
import KookminBankLogo from "./icons/KookminLogo.png";
import ShinhanBankLogo from "./icons/ShinhanLogo.png";
import WooriBankLogo from "./icons/WooriLogo.png";
import CallIcon from "./icons/CallIcon.svg?react";
import GlobeIcon from "./icons/GlobeIcon.svg?react";
import LocationIcon from "./icons/LocationIcon.svg?react";
import TimeIcon from "./icons/TimeIcon.svg?react";
import PinIcon from "./icons/PinIcon.svg";
import { helmetTitle } from "../../constants/title";
import api from "../../api/api";

// 외국인 특화 점포 API
const getSpecializeBanks = async (bankName = null) => {
  try {
    const url = bankName ? `/api/specialize/${bankName}` : "/api/specialize";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // 404 에러는 빈 배열 반환 (데이터가 없음을 의미)
      return {
        isSuccess: false,
        data: [],
        code: error.response?.data?.code || "SPECIALIZE_NOT_FOUND_404",
        message: error.response?.data?.message || "외국인 특화 점포에 대한 정보를 찾을 수 없습니다.",
      };
    }
    throw error;
  }
};

// 카카오맵 API 키 (.env)
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;
const DEFAULT_POSITION = { lat: 37.5665, lng: 126.978, accuracy: 300 };
const FILTER_CONFIGS = {
  hanabank: { type: "keyword", query: "하나은행", apiName: "하나은행" },
  kookminbank: { type: "keyword", query: "국민은행", apiName: "KB국민은행" },
  shinhanbank: { type: "keyword", query: "신한은행", apiName: "신한은행" },
  wooribank: { type: "keyword", query: "우리은행", apiName: "우리은행" },
  foreign: { type: "api", query: "외국인특화지점" },
  general: { type: "keyword", query: "은행" },
  atm: { type: "keyword", query: "ATM" },
};

export default function Map() {
  const { t, i18n } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerOverlayRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const placeMarkersRef = useRef([]);
  const hasCenteredToCurrentRef = useRef(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_POSITION);
  const [selectedBankFilter, setSelectedBankFilter] = useState(null);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sheetPosition, setSheetPosition] = useState(0); // 드래그 위치 (0 = 닫힘, 1 = 열림)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const sheetRef = useRef(null);

  const buildUserMarkerContent = useCallback(() => {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "48px";
    container.style.height = "48px";
    container.style.pointerEvents = "none";

    const halo = document.createElement("div");
    halo.style.position = "absolute";
    halo.style.top = "0";
    halo.style.left = "0";
    halo.style.width = "48px";
    halo.style.height = "48px";
    halo.style.borderRadius = "50%";
    halo.style.background = "rgba(0, 156, 234, 0.2)";

    const inner = document.createElement("div");
    inner.style.position = "absolute";
    inner.style.top = "50%";
    inner.style.left = "50%";
    inner.style.transform = "translate(-50%, -50%)";
    inner.style.width = "22px";
    inner.style.height = "22px";
    inner.style.borderRadius = "50%";
    inner.style.background = "#009cea";
    inner.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

    const core = document.createElement("div");
    core.style.position = "absolute";
    core.style.top = "50%";
    core.style.left = "50%";
    core.style.transform = "translate(-50%, -50%)";
    core.style.width = "8px";
    core.style.height = "8px";
    core.style.borderRadius = "50%";
    core.style.background = "#ffffff";

    container.appendChild(halo);
    container.appendChild(inner);
    container.appendChild(core);

    return container;
  }, []);

  const clearPlaceMarkers = useCallback(() => {
    placeMarkersRef.current.forEach((marker) => {
      if (marker.overlay && marker.overlay.setMap) {
        marker.overlay.setMap(null);
      } else if (marker.setMap) {
        marker.setMap(null);
      }
    });
    placeMarkersRef.current = [];
  }, []);

  // 지도 레벨에 따른 마커 크기 계산 (레벨 1-14, 레벨이 높을수록 작게)
  const getMarkerSize = useCallback((level) => {
    // 레벨 1(가장 확대): 32px, 레벨 14(가장 축소): 16px
    const baseSize = 32;
    const minSize = 16;
    const size = baseSize - ((level - 1) / 13) * (baseSize - minSize);
    return Math.max(minSize, Math.min(baseSize, size));
  }, []);

  // PinIcon.svg를 사용한 마커 생성
  const buildPlaceMarkerContent = useCallback((size = 32) => {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = `${size}px`;
    container.style.height = `${size * 1.25}px`; // 핀 비율 유지
    container.style.cursor = "pointer";
    container.style.pointerEvents = "auto";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.className = "place-marker-container";

    // PinIcon.svg 이미지 사용
    const img = document.createElement("img");
    img.src = PinIcon;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.display = "block";
    img.className = "place-marker-image";

    container.appendChild(img);
    return container;
  }, []);

  // 두 지점 간의 거리를 계산하는 함수 (Haversine 공식)
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // 지구 반경 (미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 미터 단위
  }, []);

  // 외국인 특화 점포 API 응답을 카카오맵 형식으로 변환
  const convertSpecializeToPlace = useCallback((specializeData, position) => {
    return specializeData.map((item) => {
      const placeLat = Number(item.latitude);
      const placeLng = Number(item.longitude);
      
      // 거리 계산
      let distance = null;
      if (!Number.isNaN(placeLat) && !Number.isNaN(placeLng) && position) {
        distance = calculateDistance(
          position.lat,
          position.lng,
          placeLat,
          placeLng
        ).toString();
      }
      
      // bankName과 branchName을 자연스럽게 연결
      let placeName = "";
      if (item.bankName && item.branchName) {
        placeName = `${item.bankName} ${item.branchName}`;
      } else if (item.branchName) {
        placeName = item.branchName;
      } else if (item.bankName) {
        placeName = item.bankName;
      }
      
      return {
        id: item.id,
        place_name: placeName,
        road_address_name: item.roadAddress,
        address_name: item.roadAddress,
        phone: item.phoneNum,
        x: placeLng,
        y: placeLat,
        category_group_code: "BK9",
        isSpecialize: true, // 외국인 특화 점포 플래그
        bankName: item.bankName,
        branchName: item.branchName,
        zipCode: item.zipCode,
        weekClose: item.weekClose,
        weekendClose: item.weekendClose || item.sundayClose,
        distance: distance,
      };
    });
  }, [calculateDistance]);

  // 외국인 특화 점포 데이터 처리 및 마커 표시
  const handleSpecializeBanks = useCallback(
    async (bankFilter, position) => {
      setIsSearching(true);
      setSearchError(null);
      clearPlaceMarkers();
      setSelectedPlace(null);
      setIsDetailOpen(false);

      try {
        // 은행 필터가 있으면 해당 은행만 조회, 없으면 전체 조회
        const bankName = bankFilter ? FILTER_CONFIGS[bankFilter]?.apiName : null;
        const response = await getSpecializeBanks(bankName);
        
        setIsSearching(false);

        if (!response.isSuccess || !response.data || response.data.length === 0) {
          setPlaces([]);
          if (response.code === "SPECIALIZE_NOT_FOUND_404") {
            setSearchError(response.message || "외국인 특화 점포에 대한 정보를 찾을 수 없습니다.");
          } else {
            setSearchError("외국인 특화 점포 정보를 불러올 수 없습니다.");
          }
          return;
        }

        // API 응답을 카카오맵 형식으로 변환
        const convertedPlaces = convertSpecializeToPlace(response.data, position);
        
        // 거리순으로 정렬
        const sorted = convertedPlaces.sort((a, b) => {
          const distanceA = a.distance ? Number(a.distance) : Infinity;
          const distanceB = b.distance ? Number(b.distance) : Infinity;
          return distanceA - distanceB;
        });

        setPlaces(sorted);

        // 마커 표시 (카카오맵이 로드된 경우만)
        if (mapInstanceRef.current && window.kakao?.maps?.LatLng) {
          sorted.forEach((place) => {
            const lat = Number(place.y);
            const lng = Number(place.x);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return;
            if (!mapInstanceRef.current) return;

            try {
              const positionLatLng = new window.kakao.maps.LatLng(lat, lng);
              const currentLevel = mapInstanceRef.current?.getLevel() || 3;
              const markerSize = getMarkerSize(currentLevel);
              const markerContent = buildPlaceMarkerContent(markerSize);
              if (markerContent && markerContent instanceof Node && markerContent.parentNode === null) {
                const markerOverlay = new window.kakao.maps.CustomOverlay({
                  position: positionLatLng,
                  content: markerContent,
                  yAnchor: 1,
                  xAnchor: 0.5,
                  zIndex: 2,
                });
                markerOverlay.setMap(mapInstanceRef.current);
                
                // 클릭 이벤트 추가
                markerContent.addEventListener("click", (e) => {
                  e.stopPropagation();
                  setSelectedPlace(place);
                  setIsDetailOpen(true);
                  setSheetPosition(0);
                  
                  // 카드 선택 시 해당 위치로 지도 이동
                  if (mapInstanceRef.current && place.y && place.x && window.kakao?.maps?.LatLng) {
                    try {
                      const placeLat = Number(place.y);
                      const placeLng = Number(place.x);
                      
                      if (!Number.isNaN(placeLat) && !Number.isNaN(placeLng)) {
                        const moveLatLon = new window.kakao.maps.LatLng(placeLat, placeLng);
                        mapInstanceRef.current.panTo(moveLatLon);
                      }
                    } catch (error) {
                      console.error("지도 이동 오류:", error);
                    }
                  }
                  
                  setTimeout(() => {
                    setSheetPosition(1);
                  }, 10);
                });
                
                placeMarkersRef.current.push({ 
                  overlay: markerOverlay, 
                  content: markerContent,
                  place: place,
                  position: positionLatLng
                });
              }
            } catch (error) {
              console.error("마커 생성 오류:", error, place);
            }
          });
        }
      } catch (error) {
        console.error("외국인 특화 점포 API 오류:", error);
        setIsSearching(false);
        setPlaces([]);
        setSearchError("외국인 특화 점포 정보를 불러오는 중 오류가 발생했습니다.");
      }
    },
    [convertSpecializeToPlace, clearPlaceMarkers, getMarkerSize, buildPlaceMarkerContent]
  );

  const performSearch = useCallback(
    (bankFilter, serviceFilter, position) => {
      // 외국인 특화 필터가 선택된 경우 백엔드 API 호출
      if (serviceFilter === "foreign") {
        handleSpecializeBanks(bankFilter, position);
        return;
      }

      // 기존 카카오맵 API 호출 로직
      if (!mapInstanceRef.current || !window.kakao?.maps?.services) {
        return;
      }

      // 검색어 조합: 은행 필터와 서비스 필터를 조합
      let searchQuery = "";

      // 은행 필터가 있으면 은행 이름을 우선 사용
      if (bankFilter && FILTER_CONFIGS[bankFilter]) {
        const bankConfig = FILTER_CONFIGS[bankFilter];
        searchQuery = bankConfig.query;

        // 서비스 필터가 있으면 조합
        if (serviceFilter && FILTER_CONFIGS[serviceFilter]) {
          const serviceConfig = FILTER_CONFIGS[serviceFilter];

          // ATM은 명시적으로 추가 (예: "하나은행 ATM")
          if (serviceFilter === "atm") {
            searchQuery = `${searchQuery} ${serviceConfig.query}`;
          }
          // 일반은행이나 외국인특화지점은 은행 이름만으로 충분
          // (예: "하나은행" - 이미 은행이므로 일반은행 키워드 불필요)
        }
      } else if (serviceFilter && FILTER_CONFIGS[serviceFilter]) {
        // 은행 필터가 없고 서비스 필터만 있는 경우
        const serviceConfig = FILTER_CONFIGS[serviceFilter];
        searchQuery = serviceConfig.query;
      } else {
        // 둘 다 없으면 기본값 (일반은행)
        searchQuery = FILTER_CONFIGS.general.query;
      }

      // 카카오맵 API 서비스 확인
      if (!window.kakao?.maps?.services?.Places) {
        console.error("카카오맵 Places 서비스를 사용할 수 없습니다.");
        setSearchError("지도 서비스를 초기화할 수 없습니다.");
        return;
      }

      const service = new window.kakao.maps.services.Places();

      // 위치 정보 유효성 검사
      if (
        !position ||
        !position.lat ||
        !position.lng ||
        isNaN(position.lat) ||
        isNaN(position.lng)
      ) {
        console.error("유효하지 않은 위치 정보:", position);
        setSearchError("위치 정보를 가져올 수 없습니다.");
        return;
      }

      const center = new window.kakao.maps.LatLng(position.lat, position.lng);

      // 옵션 설정 - ATM 검색 시 반경을 더 넓게 설정 (ATM은 은행보다 적을 수 있음)
      // effectiveServiceFilter를 사용하여 필터링 로직과 일치시킴
      const effectiveServiceFilter = serviceFilter || (bankFilter ? "general" : "general");
      const defaultRadius = effectiveServiceFilter === "atm" ? 20000 : 10000; // ATM: 20km, 기타: 10km

      const options = {
        location: center,
        radius: defaultRadius,
      };

      setIsSearching(true);
      setSearchError(null);
      clearPlaceMarkers();
      setSelectedPlace(null);
      setIsDetailOpen(false);

      const callback = (data, status) => {
        // status 체크를 먼저 수행
        // 카카오맵 API는 콜백이 호출되지 않거나 네트워크 오류 시 status가 null이 될 수 있음
        if (status === null || status === undefined) {
          setIsSearching(false);
          console.error("카카오맵 검색 오류: status가 null입니다.", {
            bankFilter,
            serviceFilter,
            searchQuery,
            options,
            errorData: data,
            position,
            kakaoStatus: window.kakao?.maps?.services?.Status,
          });
          setPlaces([]);
          setSearchError("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        setIsSearching(false);

        // 에러 발생 시 상세 로그 출력
        if (
          status !== window.kakao.maps.services.Status.OK &&
          status !== window.kakao.maps.services.Status.ZERO_RESULT
        ) {
          console.error("카카오맵 검색 오류 상세:", {
            status,
            statusText: window.kakao.maps.services.Status[status] || "알 수 없는 오류",
            bankFilter,
            serviceFilter,
            searchQuery,
            options,
            errorData: data,
          });
        }

        if (status === window.kakao.maps.services.Status.OK) {
          // 필터에 따라 결과 필터링
          let filteredData = data;

          // 서비스 필터에 따른 필터링 (서비스 필터가 없으면 일반은행으로 처리)
          const effectiveServiceFilter = serviceFilter || (bankFilter ? "general" : "general");

          if (effectiveServiceFilter === "general") {
            // 일반은행 필터: ATM 제외
            filteredData = data.filter((place) => {
              const categoryCode = place.category_group_code;
              const placeName = (place.place_name || "").toLowerCase();
              const categoryName = (place.category_name || "").toLowerCase();

              // ATM 관련 카테고리 제외
              if (categoryCode === "AT4") {
                return false;
              }

              // 장소 이름에 "ATM"이 포함된 경우 제외
              if (placeName.includes("atm") || categoryName.includes("atm")) {
                return false;
              }

              // 은행 카테고리이거나 장소 이름에 "은행"이 포함된 경우만 포함
              if (categoryCode === "BK9") {
                return true;
              }

              // 장소 이름에 "은행"이 포함된 경우
              if (placeName.includes("은행")) {
                return true;
              }

              return false;
            });
          } else if (effectiveServiceFilter === "atm") {
            // ATM 필터: "ATM" 키워드로 검색했으므로 이미 ATM 관련 결과만 나옴
            // 추가 필터링 없이 모든 결과 사용
            filteredData = data;
          }
          // 외국인특화지점 필터는 추가 필터링 없음 (검색 키워드가 이미 필터링함)

          // 은행 필터가 있을 때는 해당 은행만 필터링
          if (bankFilter) {
            const bankName = FILTER_CONFIGS[bankFilter]?.query || "";
            filteredData = filteredData.filter((place) => {
              const placeName = (place.place_name || "").toLowerCase();
              // 은행 이름이 포함된 장소만 포함
              return placeName.includes(bankName.toLowerCase());
            });
          }

          // 각 장소에 거리 정보 추가 (API에서 제공하지 않는 경우 직접 계산)
          const placesWithDistance = filteredData.map((place) => {
            const placeLat = Number(place.y);
            const placeLng = Number(place.x);

            // API에서 distance를 제공하지 않는 경우 직접 계산
            if (!place.distance && !Number.isNaN(placeLat) && !Number.isNaN(placeLng)) {
              const calculatedDistance = calculateDistance(
                position.lat,
                position.lng,
                placeLat,
                placeLng
              );
              return { ...place, distance: calculatedDistance.toString() };
            }
            return place;
          });

          // 거리순으로 정렬 (distance 필드 기준 오름차순)
          const sorted = placesWithDistance.sort((a, b) => {
            const distanceA = a.distance ? Number(a.distance) : Infinity;
            const distanceB = b.distance ? Number(b.distance) : Infinity;
            return distanceA - distanceB;
          });

          // 개수 제한 없이 모든 결과 표시
          setPlaces(sorted);

          sorted.forEach((place) => {
            const lat = Number(place.y);
            const lng = Number(place.x);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return;
            if (!mapInstanceRef.current) return;

            try {
              const positionLatLng = new window.kakao.maps.LatLng(lat, lng);
              const currentLevel = mapInstanceRef.current?.getLevel() || 3;
              const markerSize = getMarkerSize(currentLevel);
              const markerContent = buildPlaceMarkerContent(markerSize);
              if (
                markerContent &&
                markerContent instanceof Node &&
                markerContent.parentNode === null
              ) {
                const markerOverlay = new window.kakao.maps.CustomOverlay({
                  position: positionLatLng,
                  content: markerContent,
                  yAnchor: 1, // 하단 기준
                  xAnchor: 0.5, // 중앙 기준
                  zIndex: 2,
                });
                markerOverlay.setMap(mapInstanceRef.current);

                // 클릭 이벤트 추가
                markerContent.addEventListener("click", (e) => {
                  e.stopPropagation();
                  handleCardClick(place);
                });

                placeMarkersRef.current.push({
                  overlay: markerOverlay,
                  content: markerContent,
                  place: place,
                  position: positionLatLng,
                });
              }
            } catch (error) {
              console.error("마커 생성 오류:", error, place);
            }
          });
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setPlaces([]);
          setSearchError(null);
        } else {
          setPlaces([]);
          // 에러 상태에 따른 구체적인 메시지 표시
          let errorMessage = "검색 중 오류가 발생했습니다.";
          if (status === window.kakao.maps.services.Status.ERROR) {
            errorMessage = "API 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          } else if (status === window.kakao.maps.services.Status.INVALID_REQUEST) {
            errorMessage = "잘못된 요청입니다. 검색 조건을 확인해주세요.";
          }
          console.error("카카오맵 검색 오류:", status, data);
          setSearchError(errorMessage);
        }
      };

      // 카카오맵 API는 location 옵션이 있으면 기본적으로 거리순 정렬을 하지만,
      // 명시적으로 정렬하여 확실하게 함
      try {
        // keywordSearch 사용 (모든 필터는 keyword 검색)
        // 검색어가 비어있지 않은지 확인
        if (!searchQuery || searchQuery.trim() === "") {
          console.error("검색어가 비어있습니다:", { bankFilter, serviceFilter, searchQuery });
          setSearchError("검색어가 올바르지 않습니다.");
          setIsSearching(false);
          return;
        }

        // 옵션 설정 - ATM 검색 시 반경을 더 넓게 설정
        // effectiveServiceFilter를 사용하여 필터링 로직과 일치시킴
        const effectiveServiceFilterForSearch =
          serviceFilter || (bankFilter ? "general" : "general");
        const searchRadius = effectiveServiceFilterForSearch === "atm" ? 20000 : 5000; // ATM: 20km, 기타: 5km

        const searchOptions = {
          location: center,
          radius: searchRadius,
        };

        // size 옵션 설정 (기본값 15개)
        try {
          searchOptions.size = 15;
        } catch (e) {
          // size 옵션 추가 실패 시 무시
        }

        // 타임아웃 설정 (10초 후 콜백이 호출되지 않으면 오류 처리)
        let timeoutTriggered = false;
        const timeoutId = setTimeout(() => {
          timeoutTriggered = true;
          console.error("카카오맵 검색 타임아웃:", {
            searchQuery,
            timeout: 10000,
          });
          setIsSearching(false);
          setSearchError("검색 시간이 초과되었습니다. 다시 시도해주세요.");
          setPlaces([]);
        }, 10000);

        // 원래 콜백을 래핑하여 타임아웃 취소
        const wrappedCallback = (data, status) => {
          if (timeoutTriggered) {
            // 타임아웃이 이미 발생했으면 무시
            return;
          }
          clearTimeout(timeoutId);
          callback(data, status);
        };

        try {
          service.keywordSearch(searchQuery, wrappedCallback, searchOptions);
        } catch (searchError) {
          clearTimeout(timeoutId);
          console.error("keywordSearch 호출 오류:", searchError);
          setIsSearching(false);
          setSearchError("검색 요청 중 오류가 발생했습니다.");
          setPlaces([]);
        }
      } catch (error) {
        console.error("카카오맵 API 호출 오류:", error);
        setIsSearching(false);
        setSearchError("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setPlaces([]);
      }
    },
    [clearPlaceMarkers, calculateDistance, getMarkerSize, buildPlaceMarkerContent]
  );

  useEffect(() => {
    return () => {
      clearPlaceMarkers();
      if (userMarkerOverlayRef.current) {
        userMarkerOverlayRef.current.setMap(null);
        userMarkerOverlayRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current.setMap(null);
        userAccuracyCircleRef.current = null;
      }
    };
  }, [clearPlaceMarkers, calculateDistance, buildPlaceMarkerContent]);

  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.map"),
      showBackBtn: false,
      showSettingBtn: true,
    });
  }, [setHeaderConfig, i18n.language]);

  // 사용자 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        hasCenteredToCurrentRef.current = false;
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy ?? 0,
        });
      },
      (error) => {
        console.error("현재 위치를 가져오지 못했습니다:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  // 카카오맵 스크립트 동적 로드
  useEffect(() => {
    if (!KAKAO_MAP_API_KEY) {
      console.error("카카오맵 API 키(VITE_KAKAO_MAP_API_KEY)가 설정되지 않았습니다.");
      return;
    }

    const scriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;

    const handleScriptLoad = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          setIsScriptLoaded(true);
        });
      } else {
        console.error("카카오맵 객체를 초기화할 수 없습니다.");
      }
    };

    if (window.kakao && window.kakao.maps) {
      handleScriptLoad();
      return;
    }

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", handleScriptLoad, { once: true });
      return () => existingScript.removeEventListener("load", handleScriptLoad);
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptUrl;
    script.async = true;
    script.addEventListener("load", handleScriptLoad, { once: true });
    const errorHandler = () => {
      console.error("카카오맵 스크립트 로드 실패");
    };
    script.addEventListener("error", errorHandler, { once: true });

    if (document.head) {
      document.head.appendChild(script);
    } else {
      console.error("document.head가 없습니다.");
      return;
    }

    return () => {
      if (script && script.parentNode) {
        script.removeEventListener("load", handleScriptLoad);
        script.removeEventListener("error", errorHandler);
      }
    };
  }, []);

  // 지도 초기화 및 현재 위치 반영 (지도는 이동 가능, 마커만 현재 위치 표시)
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    const mapCenter = new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);
    const accuracyRadius =
      currentPosition.accuracy && currentPosition.accuracy > 0
        ? Math.min(Math.max(currentPosition.accuracy, 50), 500)
        : 150;

    if (!mapInstanceRef.current) {
      const container = mapRef.current;
      if (!container) {
        console.error("지도 컨테이너를 찾을 수 없습니다.");
        return;
      }

      const options = {
        center: mapCenter,
        level: 3,
      };

      try {
        const kakaoMap = new window.kakao.maps.Map(container, options);
        kakaoMap.setDraggable(true);
        kakaoMap.setZoomable(true);

        mapInstanceRef.current = kakaoMap;
        hasCenteredToCurrentRef.current = false;

        window.kakao.maps.event.addListener(kakaoMap, "dragstart", () => {
          hasCenteredToCurrentRef.current = true;
        });

        // 지도 zoom 변경 시 마커 크기 업데이트
        window.kakao.maps.event.addListener(kakaoMap, "zoom_changed", () => {
          const currentLevel = kakaoMap.getLevel();
          const newSize = getMarkerSize(currentLevel);

          // 모든 마커의 크기 업데이트
          placeMarkersRef.current.forEach((markerData) => {
            if (markerData.content && markerData.overlay) {
              const container = markerData.content;
              const img = container.querySelector(".place-marker-image");

              if (container && img) {
                container.style.width = `${newSize}px`;
                container.style.height = `${newSize * 1.25}px`;
              }
            }
          });
        });
      } catch (error) {
        console.error("지도 초기화 오류:", error);
        return;
      }

      // 지도가 완전히 로드된 후 마커 추가
      window.kakao.maps.event.addListener(
        mapInstanceRef.current,
        "tilesloaded",
        () => {
          if (!userMarkerOverlayRef.current) {
            try {
              const markerContent = buildUserMarkerContent();
              if (
                markerContent &&
                markerContent instanceof Node &&
                markerContent.parentNode === null
              ) {
                const userMarkerOverlay = new window.kakao.maps.CustomOverlay({
                  position: mapCenter,
                  content: markerContent,
                  yAnchor: 0.5,
                  xAnchor: 0.5,
                  zIndex: 3,
                });
                userMarkerOverlay.setMap(mapInstanceRef.current);
                userMarkerOverlayRef.current = userMarkerOverlay;
              }
            } catch (error) {
              console.error("마커 오버레이 생성 오류:", error);
            }
          }

          if (!userAccuracyCircleRef.current && mapInstanceRef.current) {
            try {
              // 지도가 완전히 준비될 때까지 약간의 지연
              setTimeout(() => {
                if (!mapInstanceRef.current || userAccuracyCircleRef.current) return;

                try {
                  const accuracyCircle = new window.kakao.maps.Circle({
                    center: mapCenter,
                    radius: accuracyRadius,
                    strokeWeight: 0,
                    fillColor: "rgba(0, 156, 234, 0.2)",
                    fillOpacity: 1,
                  });

                  if (mapInstanceRef.current) {
                    accuracyCircle.setMap(mapInstanceRef.current);
                    userAccuracyCircleRef.current = accuracyCircle;
                  }
                } catch (error) {
                  console.error("정확도 원 생성 오류:", error);
                }
              }, 100);
            } catch (error) {
              console.error("정확도 원 생성 오류:", error);
            }
          }
        },
        { once: true }
      );
    } else {
      if (!hasCenteredToCurrentRef.current) {
        mapInstanceRef.current.panTo(mapCenter);
        hasCenteredToCurrentRef.current = true;
      }

      if (!userMarkerOverlayRef.current) {
        try {
          const markerContent = buildUserMarkerContent();
          if (markerContent && markerContent instanceof Node && markerContent.parentNode === null) {
            const userMarkerOverlay = new window.kakao.maps.CustomOverlay({
              position: mapCenter,
              content: markerContent,
              yAnchor: 0.5,
              xAnchor: 0.5,
              zIndex: 3,
            });
            userMarkerOverlay.setMap(mapInstanceRef.current);
            userMarkerOverlayRef.current = userMarkerOverlay;
          }
        } catch (error) {
          console.error("마커 오버레이 생성 오류:", error);
        }
      } else {
        try {
          userMarkerOverlayRef.current.setPosition(mapCenter);
        } catch (error) {
          console.error("마커 위치 업데이트 오류:", error);
        }
      }

      if (!userAccuracyCircleRef.current && mapInstanceRef.current) {
        try {
          const accuracyCircle = new window.kakao.maps.Circle({
            center: mapCenter,
            radius: accuracyRadius,
            strokeWeight: 0,
            fillColor: "rgba(0, 156, 234, 0.2)",
            fillOpacity: 1,
          });

          if (mapInstanceRef.current) {
            accuracyCircle.setMap(mapInstanceRef.current);
            userAccuracyCircleRef.current = accuracyCircle;
          }
        } catch (error) {
          console.error("정확도 원 생성 오류:", error);
        }
      } else if (userAccuracyCircleRef.current && mapInstanceRef.current) {
        try {
          userAccuracyCircleRef.current.setOptions({
            center: mapCenter,
            radius: accuracyRadius,
          });
        } catch (error) {
          console.error("정확도 원 업데이트 오류:", error);
        }
      }
    }
  }, [isScriptLoaded, currentPosition, buildUserMarkerContent]);

  // 검색 실행 (지도 초기화 후 및 필터/위치 변경 시)
  useEffect(() => {
    // 외국인 특화 필터는 카카오맵이 없어도 API 호출 가능
    if (selectedServiceFilter === "foreign") {
      performSearch(selectedBankFilter, selectedServiceFilter, currentPosition);
      return;
    }
    
    // 기타 필터는 카카오맵이 필요
    if (!isScriptLoaded || !mapInstanceRef.current) return;
    performSearch(selectedBankFilter, selectedServiceFilter, currentPosition);
  }, [isScriptLoaded, selectedBankFilter, selectedServiceFilter, currentPosition, performSearch]);

  // 필터 버튼 데이터
  const bankFilters = [
    { id: "hanabank", label: "Hana Bank" },
    { id: "kookminbank", label: "Kookmin Bank" },
    { id: "shinhanbank", label: "Shinhan Bank" },
    { id: "wooribank", label: "Woori Bank" },
  ];

  const serviceFilters = [
    { id: "foreign", label: t("map.foreignExclusiveBranch"), icon: "building" },
    { id: "general", label: t("map.generalBank"), icon: "globe" },
    { id: "atm", label: t("map.atm"), icon: "atm" },
  ];

  const handleBankFilterClick = (id) => {
    // 같은 은행 필터를 클릭하면 해제, 다른 은행을 클릭하면 변경
    setSelectedBankFilter(selectedBankFilter === id ? null : id);
    hasCenteredToCurrentRef.current = false;
  };

  const handleServiceFilterClick = (id) => {
    // 같은 서비스 필터를 클릭하면 해제, 다른 서비스 필터를 클릭하면 변경
    setSelectedServiceFilter(selectedServiceFilter === id ? null : id);
    hasCenteredToCurrentRef.current = false;
  };

  const handleCardClick = (place) => {
    setSelectedPlace(place);
    setIsDetailOpen(true);
    setSheetPosition(0); // 닫힌 상태에서 시작

    // 카드 선택 시 해당 위치로 지도 이동
    if (mapInstanceRef.current && place.y && place.x) {
      const placeLat = Number(place.y);
      const placeLng = Number(place.x);

      if (!Number.isNaN(placeLat) && !Number.isNaN(placeLng)) {
        const moveLatLon = new window.kakao.maps.LatLng(placeLat, placeLng);
        mapInstanceRef.current.panTo(moveLatLon);
      }
    }

    // 약간의 지연 후 카드를 올라가게 함 (애니메이션 효과)
    setTimeout(() => {
      setSheetPosition(1);
    }, 10);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSheetPosition(0);
  };

  // 드래그 이동 거리 추적
  const dragDistanceRef = useRef(0);
  const hasMovedRef = useRef(false);

  // 터치 시작
  const handleTouchStart = (e) => {
    if (!isDetailOpen) return;
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    setDragStartPosition(sheetPosition);
    dragDistanceRef.current = 0;
    hasMovedRef.current = false;
  };

  // 터치 이동
  const handleTouchMove = (e) => {
    if (!isDragging || !isDetailOpen) return;
    e.preventDefault();

    const currentY = e.touches[0].clientY;
    const deltaY = dragStartY - currentY; // 위로 드래그하면 양수
    dragDistanceRef.current = Math.abs(deltaY);
    hasMovedRef.current = true;

    const sheetHeight = sheetRef.current?.offsetHeight || 0;
    const maxDelta = sheetHeight * 0.8; // 최대 드래그 거리

    // 드래그 거리를 0-1 사이의 위치로 변환
    const newPosition = Math.max(0, Math.min(1, dragStartPosition + deltaY / maxDelta));
    setSheetPosition(newPosition);
  };

  // 터치 종료
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // 드래그가 거의 없으면 (10px 미만) 클릭으로 간주하여 닫기
    if (!hasMovedRef.current || dragDistanceRef.current < 10) {
      handleDetailClose();
      return;
    }

    // 드래그 속도나 위치에 따라 열림/닫힘 결정
    // 0.3 이하면 닫기, 그 이상이면 열기
    setSheetPosition((currentPosition) => {
      if (currentPosition < 0.3) {
        setIsDetailOpen(false);
        return 0;
      } else {
        return 1; // 완전히 열림
      }
    });
  };

  // 마우스 이벤트 (데스크톱 지원)
  const handleMouseDown = (e) => {
    if (!isDetailOpen) return;
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartPosition(sheetPosition);
    dragDistanceRef.current = 0;
    hasMovedRef.current = false;
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !isDetailOpen) return;
      e.preventDefault();

      const currentY = e.clientY;
      const deltaY = dragStartY - currentY;
      dragDistanceRef.current = Math.abs(deltaY);
      hasMovedRef.current = true;

      const sheetHeight = sheetRef.current?.offsetHeight || 0;
      const maxDelta = sheetHeight * 0.8;

      const newPosition = Math.max(0, Math.min(1, dragStartPosition + deltaY / maxDelta));
      setSheetPosition(newPosition);
    },
    [isDragging, isDetailOpen, dragStartY, dragStartPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // 드래그가 거의 없으면 (10px 미만) 클릭으로 간주하여 닫기
    if (!hasMovedRef.current || dragDistanceRef.current < 10) {
      handleDetailClose();
      return;
    }

    setSheetPosition((currentPosition) => {
      if (currentPosition < 0.3) {
        setIsDetailOpen(false);
        return 0;
      } else {
        return 1;
      }
    });
  }, [isDragging]);

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const formatDistance = (distance) => {
    if (!distance) return null;
    const num = Number(distance);
    if (Number.isNaN(num)) return null;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} km`;
    return `${Math.round(num)} m`;
  };

  const getBankLogo = useCallback((bankNameOrPlaceName) => {
    if (!bankNameOrPlaceName) return null;
    
    const name = bankNameOrPlaceName.toLowerCase();
    
    // 은행 이름 매칭 (우선순위: 정확한 매칭 > 부분 매칭)
    if (name.includes("하나은행") || name.includes("하나 은행") || name.includes("hana")) {
      return HanaBankLogo;
    }
    if (
      name.includes("국민은행") ||
      name.includes("국민 은행") ||
      name.includes("kookmin") ||
      name.includes("kb")
    ) {
      return KookminBankLogo;
    }
    if (name.includes("신한은행") || name.includes("신한 은행") || name.includes("shinhan")) {
      return ShinhanBankLogo;
    }
    if (name.includes("우리은행") || name.includes("우리 은행") || name.includes("woori")) {
      return WooriBankLogo;
    }

    return null;
  }, []);

  const getBankWebsite = useCallback((bankNameOrPlaceName) => {
    if (!bankNameOrPlaceName) return null;
    
    const name = bankNameOrPlaceName.toLowerCase();
    
    // 은행 이름 매칭하여 공식 웹사이트 URL 반환
    if (name.includes("하나은행") || name.includes("하나 은행") || name.includes("hana")) {
      return "https://www.kebhana.com/cont/util/util04/util0401/index.jsp";
    }
    if (
      name.includes("국민은행") ||
      name.includes("국민 은행") ||
      name.includes("kookmin") ||
      name.includes("kb")
    ) {
      return "https://omoney.kbstar.com/quics?page=C016505#loading";
    }
    if (name.includes("신한은행") || name.includes("신한 은행") || name.includes("shinhan")) {
      return "https://www.shinhan.com/webzine/index.jsp?w2xPath=/hpe/bank_introduce/BI07/internal01_type01.xml&OFFICEID=1364";
    }
    if (name.includes("우리은행") || name.includes("우리 은행") || name.includes("woori")) {
      return "https://spot.wooribank.com/pot/Dream?withyou=TCTPB0022";
    }

    return null;
  }, []);

  const selectedDistanceLabel = selectedPlace ? formatDistance(selectedPlace.distance) : null;

  return (
    <>
      <title>{`Map${helmetTitle}`}</title>
      <S.Container>
        <S.FilterSection>
          <S.FilterRow>
            {bankFilters.map((filter) => (
              <S.FilterButton
                key={filter.id}
                $isActive={selectedBankFilter === filter.id}
                onClick={() => handleBankFilterClick(filter.id)}
              >
                {filter.label}
              </S.FilterButton>
            ))}
          </S.FilterRow>
          <S.FilterRow>
            {serviceFilters.map((filter) => (
              <S.FilterButton
                key={filter.id}
                $isActive={selectedServiceFilter === filter.id}
                onClick={() => handleServiceFilterClick(filter.id)}
              >
                {filter.icon === "building" && <ForeignBankIcon />}
                {filter.icon === "globe" && <GeneralBankIcon />}
                {filter.icon === "atm" && <ATMIcon />}
                {filter.label}
              </S.FilterButton>
            ))}
          </S.FilterRow>
        </S.FilterSection>

        <S.MapWrapper
          onClick={(e) => {
            // DetailSheet가 열려있고, DetailSheet 내부가 아닌 지도 영역을 클릭했을 때만 닫기
            if (isDetailOpen && sheetRef.current && !sheetRef.current.contains(e.target)) {
              handleDetailClose();
            }
          }}
        >
          <S.MapCanvas ref={mapRef} />
        </S.MapWrapper>

        {!isDetailOpen && (
          <S.CardSection>
            <S.CardRow>
              {isSearching ? (
                <S.InfoCard $isInteractive={false}>
                  <S.CardInfo>주변 정보를 불러오는 중입니다...</S.CardInfo>
                </S.InfoCard>
              ) : searchError ? (
                <S.InfoCard $isInteractive={false}>
                  <S.CardInfo>{searchError}</S.CardInfo>
                </S.InfoCard>
              ) : places.length === 0 ? (
                <S.InfoCard $isInteractive={false}>
                  <S.CardInfo>주변에 표시할 지점이 없습니다.</S.CardInfo>
                </S.InfoCard>
              ) : (
                places.map((place) => {
                  const bankWebsite = getBankWebsite(place.place_name);
                  return (
                    <S.InfoCard
                      key={place.id}
                      $isActive={selectedPlace?.id === place.id}
                      $isInteractive
                      onClick={() => handleCardClick(place)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          handleCardClick(place);
                          event.preventDefault();
                        }
                      }}
                    >
                      <S.CardContent>
                        <S.CardTextContent>
                          <S.CardTitle>{place.place_name}</S.CardTitle>
                          <S.CardInfo
                            $hasDivider={
                              place.category_group_code === "AT4" ||
                              (place.place_name || "").toLowerCase().includes("atm") ||
                              place.phone ||
                              bankWebsite
                            }
                          >
                            {place.road_address_name || place.address_name}
                          </S.CardInfo>
                          {(place.category_group_code === "AT4" ||
                            (place.place_name || "").toLowerCase().includes("atm")) && (
                            <S.CardInfoWithIcon $hasDivider={place.phone || bankWebsite}>
                              <TimeIcon />
                              <S.CardHoursText>
                                <S.CardOpenStatus>Open</S.CardOpenStatus>
                              </S.CardHoursText>
                            </S.CardInfoWithIcon>
                          )}
                          {place.phone && (
                            <S.CardInfoWithIcon>
                              <CallIcon />
                              <span>{place.phone}</span>
                            </S.CardInfoWithIcon>
                          )}
                          {bankWebsite && (
                            <S.CardInfoWithIcon>
                              <GlobeIcon />
                              <S.CardLink
                                href={bankWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Find a branch
                              </S.CardLink>
                            </S.CardInfoWithIcon>
                          )}
                        </S.CardTextContent>
                      </S.CardContent>
                    </S.InfoCard>
                  );
                })
              )}
            </S.CardRow>
          </S.CardSection>
        )}
        {selectedPlace && (
          <S.DetailSheet
            ref={sheetRef}
            $isOpen={isDetailOpen}
            $position={sheetPosition}
            $isDragging={isDragging}
          >
            <S.DetailHeader
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
            >
              <S.DetailHandle
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
              />
              <S.DetailHeaderContent>
                {getBankLogo(selectedPlace.bankName || selectedPlace.place_name) && (
                  <S.DetailBankLogo
                    src={getBankLogo(selectedPlace.bankName || selectedPlace.place_name)} 
                    alt={selectedPlace.place_name}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div>
                  <S.DetailTitle>{selectedPlace.place_name}</S.DetailTitle>
                </div>
              </S.DetailHeaderContent>
            </S.DetailHeader>
            <S.DetailBody>
              <S.DetailRow>
                <S.DetailIcon aria-hidden>
                  <LocationIcon />
                </S.DetailIcon>
                <span>{selectedPlace.road_address_name || selectedPlace.address_name}</span>
              </S.DetailRow>
              {(() => {
                const isSpecialize = selectedPlace.isSpecialize;
                const hasHours = selectedPlace.category_group_code === "AT4" || 
                  (selectedPlace.place_name || "").toLowerCase().includes("atm") ||
                  (isSpecialize && (selectedPlace.weekClose || selectedPlace.weekendClose));
                
                if (!hasHours) return null;
                
                const formatTime = (time) => {
                  if (!time) return null;
                  const parts = time.split(':');
                  if (parts.length >= 2) {
                    return `${parts[0]}:${parts[1]}`;
                  }
                  return time;
                };
                
                return (
                  <S.DetailRow>
                    <S.DetailIcon aria-hidden>
                      <TimeIcon />
                    </S.DetailIcon>
                    <S.DetailHoursText>
                      {isSpecialize && (selectedPlace.weekClose || selectedPlace.weekendClose) ? (
                        <span>
                          {selectedPlace.weekClose && (
                            <span>평일 {formatTime(selectedPlace.weekClose)} 종료</span>
                          )}
                          {selectedPlace.weekClose && selectedPlace.weekendClose && <span> / </span>}
                          {selectedPlace.weekendClose && (
                            <span>주말 {formatTime(selectedPlace.weekendClose)} 종료</span>
                          )}
                        </span>
                      ) : (
                        <S.DetailOpenStatus>Open</S.DetailOpenStatus>
                      )}
                    </S.DetailHoursText>
                  </S.DetailRow>
                );
              })()}
              {selectedPlace.phone && (
                <S.DetailRow>
                  <S.DetailIcon aria-hidden>
                    <CallIcon />
                  </S.DetailIcon>
                  <span>{selectedPlace.phone}</span>
                </S.DetailRow>
              )}
              {getBankWebsite(selectedPlace.bankName || selectedPlace.place_name) && (
                <S.DetailRow>
                  <S.DetailIcon aria-hidden>
                    <GlobeIcon />
                  </S.DetailIcon>
                  <S.DetailLink
                    href={getBankWebsite(selectedPlace.bankName || selectedPlace.place_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find a branch
                  </S.DetailLink>
                </S.DetailRow>
              )}
            </S.DetailBody>
          </S.DetailSheet>
        )}
      </S.Container>
      <Navigation />
    </>
  );
}
