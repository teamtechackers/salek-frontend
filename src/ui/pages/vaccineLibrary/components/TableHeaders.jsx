import { dashboardlabels } from "../../../constants/pages/Labels";

export default function TableHeader() {
    return (
      <thead className="bg-blue-600 text-white text-sm">
        <tr>
          <th className="px-4 py-2">{dashboardlabels.Vaccine}</th>
          <th className="px-4 py-2">{dashboardlabels.category}</th>
          <th className="px-4 py-2">{dashboardlabels.Age}</th>
          <th className="px-4 py-2">{dashboardlabels.type}</th>
          <th className="px-4 py-2">{dashboardlabels.dose}</th>
          <th className="px-4 py-2">{dashboardlabels.route}</th>
          <th className="px-4 py-2">{dashboardlabels.site}</th>
          <th className="px-4 py-2">{dashboardlabels.action}</th>
        </tr>
      </thead>
    );
  }
  