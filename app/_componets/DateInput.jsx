const DateInput = ({ name, value, onChange, error }) => (
    <div className="mb-4">
      <label className="block font-medium">Display Until:</label>
      <input type="date" name={name} value={value} onChange={onChange} className="w-full p-2 border rounded" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
  
  export default DateInput;
  