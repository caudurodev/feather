type SelectProps = {
  options: string[];
  label: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Select = ({
  label = "Select",
  options,
  onSelectChange,
}: SelectProps) => (
  <div className="mx-2">
    <label>{label}</label>
    <select className="ml-4 p-3 rounded-xl" onChange={onSelectChange}>
      {options && options.map((o, i) => <option key={i}>{o}</option>)}
    </select>
  </div>
);

export default Select;
