

const setupMapListeners = (mapRef: any) => {
  if (!mapRef.current) return;

  window.naver.maps.Event.addListener(mapRef.current, "zoom_changed", (zoom: number) => {
    console.log(`현재 줌 레벨:, ${zoom}`);
    // 줌 레벨에 따라 추가 로직 적용 가능
    if (window.ReactNativeWebView) {
      const data = { type: "ZOOM_CHANGED", zoom: zoom };
      window.ReactNativeWebView.postMessage(JSON.stringify(data)); // 앱으로 데이터 전송
    }
  });

  window.naver.maps.Event.addListener(mapRef.current, "idle", () => {
    const center = mapRef.current.getCenter();
    if (window.ReactNativeWebView) {
      const data = { type: "REGION_CHANGE_COMPLETED", lat: center.lat(), lng: center.lng() };
      window.ReactNativeWebView.postMessage(JSON.stringify(data)); // 앱으로 데이터 전송
    }
  });

  window.naver.maps.Event.addListener(mapRef.current, "drag", () => {
    const center = mapRef.current.getCenter();
    if (window.ReactNativeWebView) {
      const data = { type: "REGION_CHANGE", lat: center.lat(), lng: center.lng() };
      window.ReactNativeWebView.postMessage(JSON.stringify(data)); // 앱으로 데이터 전송
    }
  });


};

export default setupMapListeners;
