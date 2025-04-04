
const useGoToLocation = (mapRef: React.RefObject<any>, currentPosition: { lat: number; lng: number } | null) => {
  const goToCurrentLocation = () => {
    if (currentPosition && mapRef.current) {
      console.log("Map reference updated:", mapRef.current);
      const currentLocation = new window.naver.maps.LatLng(currentPosition.lat, currentPosition.lng);
      mapRef.current.panTo(currentLocation); // 현재 위치로 맵의 중심을 설정
      mapRef.current.setZoom(16); // 줌 레벨 설정
    } else {
      console.log("현재 위치를 가져올 수 없습니다.");
    }
  };

  const goToTargetLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      const targetLocation = new window.naver.maps.LatLng(lat, lng);
      mapRef.current.panTo(targetLocation); // 지정된 위치로 맵의 중심을 설정
      mapRef.current.setZoom(16); // 줌 레벨 설정
    }
  };

  return { goToCurrentLocation, goToTargetLocation };
};

export default useGoToLocation;
