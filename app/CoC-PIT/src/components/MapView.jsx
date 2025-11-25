import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export default function PitMapView() {
  const mapDiv = useRef(null);

  useEffect(() => {
    const vtUrl = import.meta.env.VITE_VT_LAYER_URL;

    const map = new Map({
      basemap: null
    });

    // --- Your custom vector tile layer ---
    const vtLayer = new VectorTileLayer({
      url: vtUrl,
      id: "coc-boundaries"
    });

    // --- USA States with invisible symbology + labels ---
const statesLayer = new FeatureLayer({
  url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized_Boundaries/FeatureServer/0",
  id: "usa-states",

  // Transparent fill + 1 px black outline
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [0, 0, 0, 0],   // transparent fill
      outline: {
        color: [0, 0, 0, 1], // solid black outline
        width: 1
      }
    }
  },

  // State name labels
  labelingInfo: [
    {
      symbol: {
        type: "text",
        color: "black",
        haloSize: 1.5,
        haloColor: "white",
        font: {
          family: "Arial",
          size: 12,
          weight: "bold"
        }
      },
      labelPlacement: "center-center",
      labelExpressionInfo: {
        expression: "$feature.STATE_NAME"
      }
    }
  ]
});

    // Add VTL first, then labels layer above it
    map.addMany([vtLayer, statesLayer]);

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39],
      zoom: 4,
      constraints: {
        snapToZoom: false
      }
    });

    return () => view.destroy();
  }, []);

  return <div ref={mapDiv} style={{ height: "100%", width: "100%" }} />;
}
