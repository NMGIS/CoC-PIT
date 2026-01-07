import { useState, useRef } from "react";

export default function MobileLayout({
  top,
  map,
  left,
  onInfoClick,
  onResetFilters
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // % height of map panel
  const [mapHeight, setMapHeight] = useState(55);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const MIN_MAP = 25;
  const MAX_MAP = 75;

  const startDrag = () => {
    draggingRef.current = true;
  };

  const stopDrag = () => {
    draggingRef.current = false;
  };

  const onDrag = (e) => {
    if (!draggingRef.current || !containerRef.current) return;

    const touchY = e.touches?.[0]?.clientY ?? e.clientY;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((touchY - rect.top) / rect.height) * 100;

    const clamped = Math.max(MIN_MAP, Math.min(MAX_MAP, percent));
    setMapHeight(clamped);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        touchAction: "none"
      }}
      onTouchMove={onDrag}
      onTouchEnd={stopDrag}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
    >
      {/* TOP BAR */}
      <div
        style={{
          background: "#2b2b2b",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderBottom: "1px solid #333"
        }}
      >
        <button
          onClick={() => setFiltersOpen(prev => !prev)}
          className="dropdown"
        >
          Filters
        </button>

        <button
          onClick={onResetFilters}
          className="dropdown"
        >
          Reset Filters
        </button>

        <button
          onClick={onInfoClick}
          id="info-button"
          style={{ marginLeft: "auto" }}
        >
          ⓘ
        </button>
      </div>

      {/* MAP */}
      <div style={{ height: `${mapHeight}%`, overflow: "hidden" }}>
        {map}
      </div>

      {/* DRAG HANDLE */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{
          height: "14px",
          background: "#2b2b2b",
          borderTop: "1px solid #333",
          borderBottom: "1px solid #333",
          cursor: "row-resize",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "4px",
            borderRadius: "2px",
            background: "#888"
          }}
        />
      </div>

      {/* DATA / FILTER PANEL */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem",
          background: "#1f1f1f"
        }}
      >
        {filtersOpen ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem"
              }}
            >
              <strong>Filters</strong>
              <button
                onClick={() => setFiltersOpen(false)}
                className="dropdown"
              >
                Close
              </button>
            </div>

            {top}
          </>
        ) : (
          left
        )}
      </div>
    </div>
  );
}
