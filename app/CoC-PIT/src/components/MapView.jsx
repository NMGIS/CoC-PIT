import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export default function MapViewComponent({ selectedState }) {
  const mapDiv = useRef(null);
  const layerRef = useRef(null);

  // ---- INITIALIZE MAP & LAYER ----
  useEffect(() => {
    const map = new Map({
      basemap: "gray-vector"
    });

    const cocLayer = new FeatureLayer({
      url: "https://services.arcgis.com/CkYmj4Spu6bZ7mge/arcgis/rest/services/COC_Boundaries/FeatureServer",
      id: "coc-boundaries",
      outFields: ["*"]
    });

    // store the layer for filtering later
    layerRef.current = cocLayer;

    map.add(cocLayer);

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39],
      zoom: 4
    });

    return () => view.destroy();
  }, []);

  // ---- APPLY FILTER WHEN selectedState CHANGES ----
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    if (!selectedState || selectedState === "") {
      layer.definitionExpression = null; // reset
    } else {
      layer.definitionExpression = `STATE_NAME = '${selectedState}'`;
    }
  }, [selectedState]);

  return <div ref={mapDiv} style={{ height: "100%", width: "100%" }} />;
}
