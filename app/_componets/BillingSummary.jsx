const BillingSummary = ({ bill }) => (
    <div className="mt-6 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Billing Summary</h3>
      <div>Labels Cost: ₹{bill.labelCost}</div>
      <div>Day Cost: ₹{bill.dayCost}</div>
      <div className="font-bold">Total: ₹{bill.total}</div>
    </div>
  );
  
  export default BillingSummary;
  