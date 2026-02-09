import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Switch,
    FormControlLabel
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
    useGetPublicCountriesQuery,
    useGetPublicStatesQuery,
    useGetPublicCitiesQuery
} from "../../../../core/services/api/publicLocationApi";

export default function EditHospitalModal({ open, onClose, hospital = {}, onSave }) {
    const [form, setForm] = useState({
        id: null,
        name: "",
        country: "",
        state: "",
        city: "",
        phone_number: "",
        is_active: false,
        image: ""
    });

    const [selectedCountryId, setSelectedCountryId] = useState(null);
    const [selectedStateId, setSelectedStateId] = useState(null);

    const { data: countriesData } = useGetPublicCountriesQuery();
    const { data: statesData } = useGetPublicStatesQuery(selectedCountryId, { skip: !selectedCountryId });
    const { data: citiesData } = useGetPublicCitiesQuery(selectedStateId, { skip: !selectedStateId });

    useEffect(() => {
        if (hospital) {
            setForm({
                id: hospital.id || null,
                name: hospital.name || "",
                country: hospital.country || "",
                state: hospital.state || "",
                city: hospital.city || "",
                phone_number: hospital.phone_number || "",
                is_active: hospital.is_active || false,
                image: hospital.image || ""
            });
        }
    }, [hospital, open]);

    // Effect to set selectedCountryId based on form.country name match
    useEffect(() => {
        if (form.country && countriesData?.data) {
            const country = countriesData.data.find(c => c.country_name === form.country);
            if (country) setSelectedCountryId(country.country_id);
        }
    }, [form.country, countriesData]);

    // Effect to set selectedStateId based on form.state name match
    useEffect(() => {
        if (form.state && statesData?.data) {
            const state = statesData.data.find(s => s.state_name === form.state);
            if (state) setSelectedStateId(state.state_id);
        }
    }, [form.state, statesData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === "country") {
            const country = countriesData?.data?.find(c => c.country_name === value);
            setSelectedCountryId(country ? country.country_id : null);
            setForm(prev => ({ ...prev, state: "", city: "" })); // Reset dependent fields
            setSelectedStateId(null);
        }

        if (name === "state") {
            const state = statesData?.data?.find(s => s.state_name === value);
            setSelectedStateId(state ? state.state_id : null);
            setForm(prev => ({ ...prev, city: "" })); // Reset dependent field
        }
    };

    const handleSwitchChange = (e) => {
        setForm(prev => ({ ...prev, is_active: e.target.checked }));
    };

    const handleSave = () => {
        onSave(form);
        onClose();
    };

    if (!open) return null;

    const isEditMode = !!hospital?.id;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-[500px] bg-white rounded-[20px] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#245FFF] px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-semibold">{isEditMode ? "Edit Hospital" : "Add Hospital"}</h2>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6">
                    {/* Image Section */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group">
                            <img
                                src={form.image || "https://via.placeholder.com/150"}
                                alt="Hospital"
                                className="w-48 h-32 object-cover rounded-xl shadow-sm border border-gray-200"
                            />
                            <div className="absolute bottom-[-14px] left-1/2 transform -translate-x-1/2">
                                <button className="bg-[#245FFF] text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md hover:bg-[#1a4cd2] transition whitespace-nowrap">
                                    <CameraAltIcon style={{ fontSize: 16 }} />
                                    Add Image
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 mt-8">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Hospital Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-gray-700 bg-white"
                                placeholder="Enter hospital name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Country</label>
                            <div className="relative">
                                <select
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-sm text-gray-700 appearance-none"
                                >
                                    <option value="">Select Country</option>
                                    {countriesData?.data?.map((country) => (
                                        <option key={country.country_id} value={country.country_name}>{country.country_name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">State</label>
                                <div className="relative">
                                    <select
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        disabled={!selectedCountryId}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-sm text-gray-700 appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="">Select State</option>
                                        {statesData?.data?.map((state) => (
                                            <option key={state.state_id} value={state.state_name}>{state.state_name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">City</label>
                                <div className="relative">
                                    <select
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        disabled={!selectedStateId}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-sm text-gray-700 appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="">Select City</option>
                                        {citiesData?.data?.map((city) => (
                                            <option key={city.city_id} value={city.city_name}>{city.city_name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-gray-700"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-2 ml-1">
                            <label className="text-sm font-semibold text-gray-700 flex flex-col">
                                Status
                                <span className={`text-xs mt-0.5 ${form.is_active ? 'text-[#245FFF]' : 'text-gray-400'}`}>({form.is_active ? "Active" : "Inactive"})</span>
                            </label>
                            <Switch
                                checked={form.is_active}
                                onChange={handleSwitchChange}
                                color="primary"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#245FFF',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#245FFF',
                                    },
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-8 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-[#444951] text-white py-3 rounded-xl uppercase font-semibold text-sm hover:bg-[#374151] transition shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-[#28BC39] text-white py-3 rounded-xl uppercase font-semibold text-sm hover:bg-[#46a84f] transition shadow-md"
                            >
                                {isEditMode ? "Save" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
