import { useState, useRef, useEffect } from "react";
import "../App.css";

export default function CocnumFilter({
  label = "COCNUM",
  value = [],
  onChange,
  cocnums = [],
  labelMap = {}
}) {

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (c) => {
    let newValues = value.includes(c)
      ? value.filter((v) => v !== c)
      : [...value, c];

    onChange(newValues);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* BUTTON */}
      <button
        className="dropdown"
        style={{
          width: "180px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value.length === 0 ? label : `${value.length} selected`}
        <span style={{ fontSize: "16px", opacity: 0.8 }}>˅</span>
      </button>

      {/* DROPDOWN PANEL */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "0",
            background: "#2b2b2b",
            border: "1px solid #555",
            borderRadius: "4px",
            padding: "8px",
            zIndex: 50,
            width: "200px",
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {cocnums.map((c) => {
            const displayLabel = labelMap[c] ?? c;  // use labelMap if available

            return (
              <label
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 0",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={value.includes(c)}
                  onChange={() => toggleValue(c)}
                />
                {displayLabel}
              </label>
            );
          })}

        </div>
      )}
    </div>
  );
}
