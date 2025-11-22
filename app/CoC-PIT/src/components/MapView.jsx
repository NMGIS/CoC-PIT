import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export default function PitMapView() {
  const mapDiv = useRef(null);

  useEffect(() => {
    const layerUrl = import.meta.env.VITE_ARCGIS_LAYER_URL;

    const layer = new FeatureLayer({
      url: layerUrl,
      outFields: ["*"],
      opacity: 0.8,
    });

    const map = new Map({
      basemap: "gray-vector",
      layers: [layer],
    });

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39], // US center for now
      zoom: 4,
    });

    return () => view.destroy();
  }, []);

  return <div ref={mapDiv} style={{ height: "100vh", width: "100vw" }} />;
}
