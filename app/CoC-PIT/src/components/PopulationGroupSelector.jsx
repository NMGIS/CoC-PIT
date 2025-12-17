export default function PopulationGroupSelector({ value, onChange }) {
  const options = [
    { id: "all", label: "All People" },
    { id: "individuals", label: "Individuals" },
    { id: "families", label: "People in Families" },
    { id: "veterans", label: "Veterans" },
    { id: "unaccompanied_youth", label: "Unaccompanied Youth (<25)" },
    { id: "parenting_youth", label: "Parenting Youth (<25)" }
  ];

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.8 }}>
        Overall Homeless Group
      </div>

      {options.map(opt => (
        <label
          key={opt.id}
          style={{
            display: "block",
            cursor: "pointer",
            marginBottom: "4px"
          }}
        >
          <input
            type="radio"
            name="population"
            value={opt.id}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
            style={{ marginRight: "6px" }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
