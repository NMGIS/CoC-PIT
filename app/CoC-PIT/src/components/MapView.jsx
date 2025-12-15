import { useEffect, useRef, useState } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { supabase } from "../supabaseClient";


export default function MapViewComponent({ selectedState, selectedCurrent = [], selectedLegacy = [] }) {
  const mapDiv = useRef(null);
  const layerRef = useRef(null);
  const viewRef = useRef(null);
  const legacyLayerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const layerViewRef = useRef(null);

function buildCurrentExpr(state, currentCocnums, legacyCocnums) {
  // If legacy selected and no current selected → show NOTHING
  if (
    legacyCocnums.length > 0 &&
    !legacyCocnums.includes("NONE") &&
    currentCocnums.length === 0
  ) {
    return "1=0";
  }

  let parts = [];
  if (state) parts.push(`STATE_NAME = '${state}'`);
  if (currentCocnums.length > 0) {
    parts.push(`COCNUM IN (${currentCocnums.map(c => `'${c}'`).join(",")})`);
  }

  return parts.length ? parts.join(" AND ") : null;
}


  function buildLegacyExpr(state, cocnums) {
    if (cocnums.includes("NONE")) {
      return "1=0";  // returns nothing
    }

    let parts = [];
    if (state) parts.push(`STATE_NAME = '${state}'`);
    if (cocnums.length > 0) {
      parts.push(`COCNUM IN (${cocnums.map(c => `'${c}'`).join(",")})`);
    }

    return parts.length ? parts.join(" AND ") : null;
  }

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

    // ---- LEGACY COC POLYGONS LAYER ----
    const legacyCocLayer = new FeatureLayer({
      url: "https://services.arcgis.com/CkYmj4Spu6bZ7mge/arcgis/rest/services/COC_Boundaries_Legacy/FeatureServer",
      id: "legacy-coc-boundaries",
      outFields: ["*"],

      labelingInfo: [
        {
          labelExpressionInfo: { expression: "$feature.COCNUM" },  // adjust if needed
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

    map.add(legacyCocLayer);
    legacyLayerRef.current = legacyCocLayer;



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
    const currentLayer = layerRef.current;
    const legacyLayer = legacyLayerRef.current;
    const view = viewRef.current;

    if (!currentLayer || !legacyLayer || !view) return;

    const currExpr = buildCurrentExpr(
      selectedState,
      selectedCurrent,
      selectedLegacy
    );
    const legExpr = buildLegacyExpr(selectedState, selectedLegacy);

    currentLayer.definitionExpression = currExpr;
    legacyLayer.definitionExpression = legExpr;

    // ZOOM — use the layer with the most restrictive filter
    const hasCurrent = selectedCurrent.length > 0;
    const hasLegacy = selectedLegacy.length > 0 && !selectedLegacy.includes("NONE");

    const zoomLayer = hasCurrent
      ? currentLayer
      : hasLegacy
        ? legacyLayer
        : currentLayer;


    const expr = zoomLayer.definitionExpression;

    if (!expr) {
      view.goTo({ center: [-98, 39], zoom: 4 });
      return;
    }

    zoomLayer.queryExtent().then((result) => {
      if (result.extent) view.goTo(result.extent.expand(1.2));
    });

  }, [selectedState, selectedCurrent, selectedLegacy]);


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
