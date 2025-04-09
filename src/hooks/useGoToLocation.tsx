
const useGoToLocation = (mapRef: React.RefObject<any>, currentPosition: { lat: number; lng: number } | null) => {
  const goToCurrentLocation = () => {
    if (currentPosition && mapRef.current) {
      console.log("Map reference updated:", mapRef.current);
      const currentLocation = new window.naver.maps.LatLng(currentPosition.lat, currentPosition.lng);
      // mapRef.current.setZoom(16); // 줌 레벨 설정
      // mapRef.current.panTo(currentLocation); // 현재 위치로 맵의 중심을 설정
      mapRef.current.morph(currentLocation, 16); // 부드럽게 줌과 위치 동시에 이동
    } else {
      console.log("현재 위치를 가져올 수 없습니다.");
    }
  };

  const goToTargetLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      const targetLocation = new window.naver.maps.LatLng(lat, lng);
      // mapRef.current.setZoom(16); // 줌 레벨 설정
      // mapRef.current.panTo(targetLocation); // 지정된 위치로 맵의 중심을 설정
      mapRef.current.morph(targetLocation, 16); // 부드럽게 줌과 위치 동시에 이동
    }
  };

  return { goToCurrentLocation, goToTargetLocation };
};

export default useGoToLocation;
