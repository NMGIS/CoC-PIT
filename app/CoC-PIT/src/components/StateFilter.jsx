export default function StateFilter({ value, onChange }) {
  const states = [
    "Alabama","Alaska","American Samoa","Arizona","Arkansas","California",
    "Colorado","Connecticut","Delaware","District of Columbia","Florida",
    "Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas",
    "Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
    "North Dakota","Northern Marianas","Ohio","Oklahoma","Oregon",
    "Pennsylvania","Puerto Rico","Rhode Island","South Carolina",
    "South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
  ];

  return (
    <select className="dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All States</option>
      {states.map((st) => (
        <option key={st} value={st}>{st}</option>
      ))}
    </select>
  );
}
