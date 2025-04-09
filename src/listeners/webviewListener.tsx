
export const webviewListener = (event: any, mapRef: any, mapActions: any) => {
    try {
        console.log(`webviewListener 호출됨 ${mapRef.current}`);
        if (mapRef.current == null) return; // 맵이 초기화되지 않은 경우 리턴

        const { updateMarkers, addMarker, removeMarker, clearMarkers, goToTargetLocation, setDefaultMarkerStyle, setSelectedMarkerStyle, setInfoWindowContent } = mapActions;

        const message = JSON.parse(event.data);
        console.log("[RECEIVED MESSAGE]:", message);

        // 메시지 타입에 따라 다른 함수 호출

        // MARKER 관련 메시지 처리
        if (message.type === "addMarker") {
            console.log(`🔴 AddMarker 호출됨: ${message.lat}, ${message.lon}`);
            addMarker(mapRef, { lat: message.lat, lng: message.lng });
        }

        if (message.type === "removeMarker") {
            removeMarker(message.index);
        }

        if (message.type === "clearMarkers") {
            clearMarkers();
        }

        if (message.type === "updateMarkers") {
            console.log(`🔴 updateMarkers 호출됨`);
            updateMarkers(mapRef, message.markers); // 마커 업데이트 함수 호출
            // clearMarkers(); // 기존 마커 삭제
            // message.markers.forEach((marker: any) => {
            //     addMarker(mapRef, marker);
            // });
        }
        if (message.type === "setDefaultMarkerStyle") {
            console.log(`🔴 setDefaultMarkerStyle 호출됨: ${message.style}`);
            setDefaultMarkerStyle(message.style, message.anchor.x, message.anchor.y); // 스타일 설정 함수 호출
        }
        if (message.type === "setSelectedMarkerStyle") {
            console.log(`🔴 setSelectedMarkerStyle 호출됨: ${message.style}`);
            setSelectedMarkerStyle(message.style, message.anchor.x, message.anchor.y); // 스타일 설정 함수 호출
        }

        if (message.type === "setInfoWindowContent") {
            console.log(`🔴 setInfoWindowContent 호출됨: ${message.content} // ${message.anchor}`);
            setInfoWindowContent(mapRef,message.content,message.anchor.x,message.anchor.y); // 스타일 설정 함수 호출
        }

        // 위치 관련 메시지 처리
        if (message.type === "goToLocation") {
            console.log(`🔴 goToLocation 호출됨: ${message.lat}, ${message.lon}`);
            goToTargetLocation(message.lat, message.lon);
        }

        if(message.type === "setMaxZoom"){
            console.log(`🔴 setMaxZoom 호출됨: ${message.zoom}`);
            mapRef.current.setOptions({
                maxZoom: message.zoom
            })
        }   

        if(message.type === "setMinZoom"){
            console.log(`🔴 setMinZoom 호출됨: ${message.zoom}`);
            mapRef.current.setOptions({
                minZoom: message.zoom
            })
        }


    } catch (error) {
        console.error(`[MESSAGE PARSE ERROR]: ${event.data}`);
    }
};
