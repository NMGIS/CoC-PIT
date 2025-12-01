import { useEffect, useRef } from "react";

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

  if (parts.length === 0) return null;     // remove filter
  return parts.join(" AND ");              // combine filters cleanly
}


export default function MapViewComponent({ selectedState, selectedCocnums = [] }) {
  const mapDiv = useRef(null);
  const layerRef = useRef(null);
  const viewRef = useRef(null);

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

    layerRef.current = cocLayer;
    map.add(cocLayer);

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98, 39],
      zoom: 4
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  // test connection

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

  // ---- APPLY FILTER + ZOOM WHEN selectedState CHANGES ----
  useEffect(() => {
  const layer = layerRef.current;
  const view = viewRef.current;
  if (!layer || !view) return;

  const expr = buildDefinitionExpression(selectedState, selectedCocnums);

  layer.definitionExpression = expr;

  // If nothing selected → reset view
  if (!expr) {
    view.goTo({ center: [-98, 39], zoom: 4 });
    return;
  }

  // Zoom to filtered features
  layer
    .queryExtent()
    .then((result) => {
      if (result.extent) {
        view.goTo(result.extent.expand(1.2));
      }
    })
    .catch((err) => console.error(err));

}, [selectedState, selectedCocnums]);


  return <div ref={mapDiv} style={{ height: "100%", width: "100%" }} />;
  
}
