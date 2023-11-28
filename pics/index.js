// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: 33.21534827294601, lng: -97.1332057490393 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 13,
    center: position,
    mapId: "Denton, TX",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });
}

initMap();