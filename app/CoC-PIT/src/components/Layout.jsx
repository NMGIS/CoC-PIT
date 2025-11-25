export default function Layout({ top, left, map }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",  // left | map
        gridTemplateRows: "15% 1fr",      // top filter bar | main area
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* TOP FILTER BAR */}
      <div
        style={{
          gridColumn: "1 / span 2",
          gridRow: "1",
          background: "#2b2b2b",
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          borderBottom: "1px solid #333",
        }}
      >
        {top}
      </div>

      {/* LEFT PANEL */}
      <div
        style={{
          gridColumn: "1",
          gridRow: "2",
          background: "#1f1f1f",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        {left}
      </div>

      {/* MAP PANEL */}
      <div
        style={{
          gridColumn: "2",
          gridRow: "2",
          overflow: "hidden",
        }}
      >
        {map}
      </div>
    </div>
  );
}
