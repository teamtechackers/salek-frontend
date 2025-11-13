import { Route } from "react-router-dom";

export const vaccineFields = [
    { label: "Name", type: "text", key: "name" },
    { label: "Category", type: "select", key: "category", options: ["Birth", "Routine", "Adult"] },
    { label: "Sub-category", type: "select", key: "subCategory", options: ["Mandatory", "Optional", "High-risk"] },
    { label: "Type", type: "select", key: "type", options: ["Infant", "Adult", "High-risk"] },
    { label: "Minimum Age", type: "text", key: "minAge" },
    { label: "Maximum Age", type: "text", key: "maxAge" },
    { label: "Total Doses", type: "number", key: "totalDoses" },
    { label: "Frequency", type: "text", key: "frequency" },
    { label: "When to give", type: "text", key: "whenToGive" },
    { label: "Dose", type: "text", key: "dose" },
    { label: "Route", type: "select", key: "route", options: ["Intramuscular", "Oral", "Subcutaneous"] },
    { label: "Site", type: "select", key: "site", options: ["Deltoid", "Thigh", "Arm", "Upper Arm"] },
    { label: "Notes", type: "textarea", key: "notes" },
  ];
