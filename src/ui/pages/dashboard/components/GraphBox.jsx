import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GraphBox = ({ graphData }) => {
  const processedGraphData = graphData.map(item => ({
    month: new Date(item.month).toLocaleString('en-us', { month: 'short' }),
    Active: item.completed,
    Inactive: 0, // Set Inactive to 0 to maintain chart structure but only show 'completed'
  }));

  const maxLoggedMonth = processedGraphData.reduce((max, item) => (item.Active > max.Active ? item : max), { Active: 0 }).month;

  return (
    <div className="flex-1 max-h-[50%] bg-[#EDF5FF] rounded-2xl shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-sm font-bold">Vaccine Logged Trend</h2>
          <p className="text-xs text-gray-500">
            Maximum Logged : <span className="font-semibold">{maxLoggedMonth}</span>
          </p>
        </div>

        <select className="bg-white rounded-md text-sm p-2">
          <option>Month</option>
          <option>Week</option>
          <option>Year</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 mb-2 pr-2">
        <div className="flex items-center gap-1 text-xs">
          <span className="w-3 h-3 bg-[#4C6FFF]"></span> Completed
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={processedGraphData} className="p-3 rounded-xl bg-white">
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar
            dataKey="Active"
            stackId="a"
            fill="#4C6FFF"
            barSize={20}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default GraphBox;
