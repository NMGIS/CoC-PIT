import { useEffect, useRef } from "react";

import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

export default function PitMapView() {
  const mapDiv = useRef(null);

  useEffect(() => {
    const vtUrl = import.meta.env.VITE_VT_LAYER_URL;
    esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;

    const vtLayer = new VectorTileLayer({
      url: vtUrl,
      opacity: 1
    });

    const map = new Map({
      basemap: "gray-vector"
    });

    map.layers.add(vtLayer); 

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39],
      zoom: 4,
    });

    return () => view.destroy();
  }, []);

  return <div ref={mapDiv} style={{ height: "100%", width: "100%" }} />;
}
