import { useState, useRef } from "react";

const useMarkers = () => {
  const [currentLocationMarker, setCurrentLocationMarker] = useState<any>(null);
  const markersRef = useRef<any[]>([]); // 즉시 업데이트를 위한 useRef
  const selectedMarkerRef = useRef<any>(null); // 기존 선택된 마커 저장
  const infoWindowRef = useRef<any>(""); // 인포윈도우 저장

  const defaultMarkerIconRef = useRef({
    content: `<div style="width: 12px; height: 12px; background-color: red; border-radius: 50%; border: 2px solid white;"></div>`,
    anchor: null
  });

  const selectedMarkerIconRef = useRef({
    content: `<div style="width: 16px; height: 16px; background-color: blue; border-radius: 50%; border: 2px solid white;"></div>`,
    anchor: null
  });

  // ✅ 기본 마커 스타일 변경 함수 (anchor 값 추가)
  const setDefaultMarkerStyle = (content: string, anchorX = 0, anchorY = 0) => {
    defaultMarkerIconRef.current = {
      content: content,
      anchor: new window.naver.maps.Point(anchorX, anchorY),
    };
  };

  // ✅ 선택된 마커 스타일 변경 함수 (anchor 값 추가)
  const setSelectedMarkerStyle = (content: string, anchorX = 0, anchorY = 0) => {
    selectedMarkerIconRef.current = {
      content: content,
      anchor: new window.naver.maps.Point(anchorX, anchorY),
    };
  };





  const addMarker = (mapRef: any, markerInfo: any) => {
    if (!mapRef.current) return;

    const selectedMarkerID = selectedMarkerRef.current?.get("markerInfo").id || null;

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(
        markerInfo.lat || markerInfo.latitude, // lat 또는 latitude 사용
        markerInfo.lng || markerInfo.longitude
      ),
      map: mapRef.current,
      icon: (markerInfo.id === selectedMarkerID)
        ? selectedMarkerIconRef.current
        : defaultMarkerIconRef.current,
    });

    marker.set("markerInfo", markerInfo); // 마커에 id 설정

    // 선택 마커였다면 selectedMarkerRef 갱신
    if (markerInfo.id === selectedMarkerID) {
      selectedMarkerRef.current = marker;
    }

    window.naver.maps.Event.addListener(marker, "click", () => {
      // 기존 선택된 마커 아이콘 복원
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.setIcon(defaultMarkerIconRef.current);
      }

      // 새 마커 선택 및 아이콘 변경
      marker.setIcon(selectedMarkerIconRef.current);
      selectedMarkerRef.current = marker;

      // 부드럽게 이동
      if (mapRef.current) {
        mapRef.current.panTo(marker.getPosition());
      }
      // 선택된 마커 ID값 앱으로 전달
      if (window.ReactNativeWebView) {
        const data = { type: "MARKER_SELECTED", marker: selectedMarkerRef.current?.get("markerInfo") };
        window.ReactNativeWebView.postMessage(JSON.stringify(data)); // 앱으로 데이터 전송
      }

      // 기존 InfoWindow 닫기
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      //새로운 InfoWindow 열기
      if (infoWindowRef.current.content !== "") {
        //기존 infoWindow 닫기
        infoWindowRef.current.close();
        infoWindowRef.current.open(mapRef.current, marker);
      }
    });

    markersRef.current.push(marker);
  };

  const addCurrentLocationMarker = (mapRef: any, position: { lat: number; lng: number }) => {
    if (!mapRef.current) return;

    // 기존 마커 삭제
    if (currentLocationMarker) {
      currentLocationMarker.setMap(null);
      setCurrentLocationMarker(null);
    }

    // 새로운 마커 추가
    const newCurrentLocationMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(position.lat, position.lng),
      map: mapRef.current,
      icon: {
        content: `<div style="width: 12px; height: 12px; background-color: blue; border-radius: 50%; border: 2px solid white;"></div>`,
        anchor: new window.naver.maps.Point(10, 10),
      },
    });

    setCurrentLocationMarker(newCurrentLocationMarker); // 마커 상태 업데이트
  };

  const removeMarker = (index: number) => {
    if (markersRef.current[index]) {
      markersRef.current[index].setMap(null);
      markersRef.current.splice(index, 1);
    }
  };

  const clearMarkers = () => {
    console.log("Clearing markers...");
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    console.log(`Markers cleared. Current markers: ${markersRef.current.length}`);
  };

  const setInfoWindowContent = (mapRef:any,content: string = "", anchorX = 0, anchorY = 0) => {
    // 기존 InfoWindow가 열려있다면 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // 새로운 InfoWindow 생성 및 설정
    infoWindowRef.current = new window.naver.maps.InfoWindow({
      content: content, // 새로운 content로 InfoWindow 설정
      disableAutoPan: false, // 클릭 시 자동으로 이동
      borderWidth: 0,
      backgroundColor: 'transparent',
      pixelOffset: new window.naver.maps.Point(anchorX, anchorY),
      disableAnchor: true,
    });

    // InfoWindow 열기
    if (selectedMarkerRef.current && mapRef.current) {
      infoWindowRef.current.open(mapRef.current, selectedMarkerRef.current);
    }
  }
  const clearSelection = () => {
    // 선택된 마커가 있으면 기본 아이콘으로 변경
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setIcon(defaultMarkerIconRef.current);
      selectedMarkerRef.current = null;
    }

    // 열린 인포윈도우가 있으면 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  const addMapMarkerListener = (mapRef: any) => {
    if (!mapRef.current) return;

    // 지도 클릭 시 실행
    window.naver.maps.Event.addListener(mapRef.current, "click", clearSelection);

    // 드래그 종료 시 실행
    window.naver.maps.Event.addListener(mapRef.current, "dragend", clearSelection);

    // 줌 변경 시 실행
    window.naver.maps.Event.addListener(mapRef.current, "zoom_changed", clearSelection);
  };

  return { addMarker, removeMarker, clearMarkers, addCurrentLocationMarker, setDefaultMarkerStyle, setSelectedMarkerStyle, setInfoWindowContent, addMapMarkerListener };
};

export default useMarkers;
