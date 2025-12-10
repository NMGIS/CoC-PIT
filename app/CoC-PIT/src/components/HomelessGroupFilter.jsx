export default function HomelessGroupFilter({ value, onChange }) {

  const groups = [
    "Overall Homeless",
    "Sheltered ES Homeless",
    "Sheltered SH Homeless",
    "Sheltered TH Homeless",
    "Sheltered Total Homeless",
    "Unsheltered Homeless"
  ];

  return (
    <select
      className="dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "220px" }}
    >
      <option value="">Select Group</option>
      {groups.map(g => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  );
}
