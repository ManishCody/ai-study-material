const FormInput = ({ label, name, value, onChange }) => (
    <div className="mb-4 w-full">
      <label className="block font-medium">{label}:</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
  
  export default FormInput;
  