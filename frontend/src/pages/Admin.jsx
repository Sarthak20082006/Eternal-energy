import { useEffect, useState } from "react";

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch("http://127.0.0.1:8000/leads");
    const data = await res.json();

    setLeads(data.data);

    const revenue = data.data.reduce(
      (sum, lead) => sum + lead.total_price,
      0
    );

    setTotalRevenue(revenue);
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="mb-6 text-green-400 text-lg">
        Total Leads: {leads.length} | Potential Revenue: ₹ {totalRevenue}
      </div>

      <div className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 bg-white/10 p-4 font-semibold">
          <div>Name</div>
          <div>City</div>
          <div>Phone</div>
          <div>System Size</div>
          <div>Total Price</div>
        </div>

        {leads.map((lead) => (
          <div
            key={lead.id}
            className="grid grid-cols-5 p-4 border-t border-gray-800"
          >
            <div>{lead.name}</div>
            <div>{lead.city}</div>
            <div>{lead.phone}</div>
            <div>{lead.system_size} kW</div>
            <div className="text-green-400">
              ₹ {lead.total_price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
