import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export default function PitMapView() {
  const mapDiv = useRef(null);

  useEffect(() => {
    const map = new Map({
      basemap: "gray-vector"
    });

    const cocLayer = new FeatureLayer({
      url: "https://services.arcgis.com/CkYmj4Spu6bZ7mge/arcgis/rest/services/COC_Boundaries/FeatureServer",
      id: "coc-boundaries",
      outFields: ["*"]
    });

    map.add(cocLayer);

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39],
      zoom: 4
    });

    return () => view.destroy();
  }, []);

  return <div ref={mapDiv} style={{ height: "100%", width: "100%" }} />;
}
