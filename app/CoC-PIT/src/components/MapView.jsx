import { useEffect, useRef, useState } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { supabase } from "../supabaseClient";

function buildDefinitionExpression(state, cocnums) {
  let parts = [];

  if (state && state !== "") {
    parts.push(`STATE_NAME = '${state}'`);
  }

  if (cocnums && cocnums.length > 0) {
    const list = cocnums.map(c => `'${c}'`).join(",");
    parts.push(`COCNUM IN (${list})`);
  }

  if (parts.length === 0) return null; // remove filter
  return parts.join(" AND ");
}

export default function MapViewComponent({ selectedState, selectedCocnums = [] }) {
  const mapDiv = useRef(null);
  const layerRef = useRef(null);
  const viewRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const layerViewRef = useRef(null);

  // ---- INITIALIZE MAP & LAYER ----
  useEffect(() => {
    const map = new Map({
      basemap: "gray-vector"
    });

    const cocLayer = new FeatureLayer({
      url: "https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/CoC_Geo_Type/FeatureServer",
      id: "coc-boundaries",
      outFields: ["*"],
      featureReduction: { type: "selection" },

      // ---- SYMBOLIZE ----
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [217, 200, 161, 0.65], 
          outline: {
            color: "#7A766F",
            width: 0.8
          }
        }
      },

      // ---- LABELS ----
      labelingInfo: [
        {
          labelExpressionInfo: { expression: "$feature.COCNUM" }, 
          minScale: 4636162,
          symbol: {
            type: "text",
            color: "black",
            haloColor: "white",
            haloSize: 1,
            font: {
              family: "Roboto",
              size: 10,
              weight: "bold"
            }
          }
        }
      ]
    });

    layerRef.current = cocLayer;
    map.add(cocLayer);


    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39],
      zoom: 4
    });

    viewRef.current = view;

    // 👇 Hook into layerView.updating for loading indicator
    view.whenLayerView(cocLayer).then((layerView) => {
      layerViewRef.current = layerView;

      // Watch the "updating" property
      layerView.watch("updating", (val) => {
        setIsLoading(val);
      });
    });

    return () => view.destroy();
  }, []);

  // ---- TEST SUPABASE CONNECTION ----
  useEffect(() => {
    const testSupabase = async () => {
      const { data, error } = await supabase
        .from("sheltered_sh_homeless")
        .select("*")
        .limit(5);

      console.log("Supabase test data:", data);
      if (error) console.error("Supabase error:", error);
    };

    testSupabase();
  }, []);

  // ---- APPLY FILTERS + ZOOM ----
  useEffect(() => {
    const layer = layerRef.current;
    const view = viewRef.current;
    if (!layer || !view) return;

    const expr = buildDefinitionExpression(selectedState, selectedCocnums);

    // Debounce filtering for smoother UX
    const handle = setTimeout(() => {
      layer.definitionExpression = expr;

      if (!expr) {
        view.goTo({ center: [-98, 39], zoom: 4 });
        return;
      }

      // Query extent of filtered features
      layer.queryExtent().then((result) => {
        if (result.extent) {
          view.goTo(result.extent.expand(1.2));
        }
      });
    }, 250);

    return () => clearTimeout(handle);
  }, [selectedState, selectedCocnums]);

  // ---- RENDER MAP + LOADING INDICATOR ----
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.6)",
            padding: "6px 12px",
            borderRadius: "4px",
            color: "white",
            zIndex: 999
          }}
        >
          Loading…
        </div>
      )}

      <div ref={mapDiv} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
