import { useEffect, useState } from "react";

const useCurrentLocation = () => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    // 현재 위치 업데이트 함수
    const updateLocation = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
    };

    // 위치 추적 시작 (사용자가 이동하면 자동 업데이트)
    const watchId = navigator.geolocation.watchPosition(
      updateLocation,
      (error) => {
        console.error("Geolocation error:", error);
        setCurrentPosition(null);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 } // 옵션 추가
    );

    // 컴포넌트가 언마운트되면 위치 추적 중지
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return currentPosition;
};

export default useCurrentLocation;
