const LabelSelector = ({ labels, selectedLabels, onLabelSelect }) => (
    <div>
      <label className="block font-medium">Labels:</label>
      <div className="flex flex-wrap gap-2">
        {["All", ...labels].map((label) => (
          <button
            key={label}
            onClick={() => onLabelSelect(label)}
            className={`px-3 py-1 rounded ${selectedLabels.includes(label) ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
  
  export default LabelSelector;
  