import { useState } from "react";

export default function MobileLayout({
  top,
  map,
  left,
  onInfoClick,
  onResetFilters
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

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
          onClick={() => setFiltersOpen(true)}
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
      <div style={{ flex: "0 0 55%" }}>
        {map}
      </div>

      {/* DATA / FILTER PANEL */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem",
          background: "#1f1f1f",
          borderTop: "1px solid #333"
        }}
      >
        {filtersOpen ? (
          <>
            {/* FILTER PANEL HEADER */}
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

            {/* FILTER CONTENT */}
            {top}
          </>
        ) : (
          left
        )}
      </div>

    </div>
  );
}
