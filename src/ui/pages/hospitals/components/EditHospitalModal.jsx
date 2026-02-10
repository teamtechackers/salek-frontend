import React, { useState, useEffect, useRef } from "react";
import {
    Switch,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
    useGetPublicCountriesQuery,
    useGetPublicStatesQuery,
    useGetPublicCitiesQuery
} from "../../../../core/services/api/publicLocationApi";
import {
    useAddHospitalMutation,
    useUpdateHospitalMutation
} from "../../../../core/services/api/hospitalsApi";

export default function EditHospitalModal({ open, onClose, hospital = {} }) {
    const fileInputRef = useRef(null);
    const [addHospital, { isLoading: isAdding }] = useAddHospitalMutation();
    const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation();

    const [form, setForm] = useState({
        id: null,
        name: "",
        country: "",
        state: "",
        city: "",
        phone_number: "",
        is_active: false,
        image: "",
        email: "" // Added email as per Postman screenshot
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const [selectedCountryId, setSelectedCountryId] = useState(null);
    const [selectedStateId, setSelectedStateId] = useState(null);
    const [selectedCityId, setSelectedCityId] = useState(null);

    const { data: countriesData } = useGetPublicCountriesQuery();
    const { data: statesData } = useGetPublicStatesQuery(selectedCountryId, { skip: !selectedCountryId });
    const { data: citiesData } = useGetPublicCitiesQuery(selectedStateId, { skip: !selectedStateId });

    useEffect(() => {
        if (hospital?.id) {
            setForm({
                id: hospital.id,
                name: hospital.name || "",
                country: hospital.country || "",
                state: hospital.state || "",
                city: hospital.city || "",
                phone_number: hospital.phone_number || "",
                is_active: hospital.is_active || false,
                image: hospital.image || "",
                email: hospital.email || ""
            });
            setPreviewImage(hospital.image || "");
        } else {
            // Reset form for add mode
            setForm({
                id: null,
                name: "",
                country: "",
                state: "",
                city: "",
                phone_number: "",
                is_active: false, // Default to true or false? Postman shows true usually for new items
                image: "",
                email: ""
            });
            setPreviewImage("");
        }
        setSelectedFile(null);
    }, [hospital, open]);

    // Effect to match country name to ID for fetching states
    useEffect(() => {
        if (form.country && countriesData?.data) {
            const country = countriesData.data.find(c => c.country_name === form.country);
            if (country) setSelectedCountryId(country.country_id);
        }
    }, [form.country, countriesData]);

    // Effect to match state name to ID for fetching cities
    useEffect(() => {
        if (form.state && statesData?.data) {
            const state = statesData.data.find(s => s.state_name === form.state);
            if (state) setSelectedStateId(state.state_id);
        }
    }, [form.state, statesData]);

    // Effect to match city name to ID
    useEffect(() => {
        if (form.city && citiesData?.data) {
            const city = citiesData.data.find(c => c.city_name === form.city);
            if (city) setSelectedCityId(city.city_id);
        }
    }, [form.city, citiesData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === "country") {
            const country = countriesData?.data?.find(c => c.country_name === value);
            setSelectedCountryId(country ? country.country_id : null);
            setForm(prev => ({ ...prev, state: "", city: "" }));
            setSelectedStateId(null);
            setSelectedCityId(null);
        }

        if (name === "state") {
            const state = statesData?.data?.find(s => s.state_name === value);
            setSelectedStateId(state ? state.state_id : null);
            setForm(prev => ({ ...prev, city: "" }));
            setSelectedCityId(null);
        }

        if (name === "city") {
            const city = citiesData?.data?.find(c => c.city_name === value);
            setSelectedCityId(city ? city.city_id : null);
        }
    };

    const handleSwitchChange = (e) => {
        setForm(prev => ({ ...prev, is_active: e.target.checked }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', form.name);
        // Postman screenshot shows IDs being sent, not names. 
        // We should send IDs if available. If `form.country` is name, we use `selectedCountryId`.
        // However, if we are in Edit mode and didn't touch the dropdowns, we need to ensure we have the IDs.
        // For now, assuming the backend might accept names or we need to find IDs.
        // The previous implementation stored names in state. 
        // Based on Postman screenshot: country_id, state_id, city_id are sent.

        formData.append('country_id', selectedCountryId || '');
        formData.append('state_id', selectedStateId || '');
        formData.append('city_id', selectedCityId || '');

        formData.append('address', form.address || 'N/A'); // Added simple address or modify form to include it
        formData.append('phone', form.phone_number); // Postman uses 'phone'
        formData.append('email', form.email);
        formData.append('is_active', form.is_active);

        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            if (form.id) {
                // Edit
                // Using updateHospital endpoint
                // Postman: api/hospitals/update/1
                await updateHospital({ id: form.id, formData }).unwrap();
            } else {
                // Add
                // Postman: api/hospitals/add
                await addHospital(formData).unwrap();
            }
            onClose();
        } catch (error) {
            console.error("Failed to save hospital:", error);
            // You might want to show an error notification here
        }
    };

    // Trigger file input click
    const handleAddImageClick = () => {
        fileInputRef.current?.click();
    };

    if (!open) return null;

    const isEditMode = !!hospital?.id;
    const isLoading = isAdding || isUpdating;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-[500px] bg-white rounded-[20px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-[#245FFF] px-6 py-4 flex justify-between items-center text-white sticky top-0 z-10">
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
                                src={previewImage || "https://via.placeholder.com/150"}
                                alt="Hospital"
                                className="w-48 h-32 object-cover rounded-xl shadow-sm border border-gray-200"
                            />
                            <div className="absolute bottom-[-14px] left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={handleAddImageClick}
                                    className="bg-[#245FFF] text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md hover:bg-[#1a4cd2] transition whitespace-nowrap"
                                >
                                    <CameraAltIcon style={{ fontSize: 16 }} />
                                    {isEditMode ? "Change Image" : "Add Image"}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
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
                            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-gray-700 bg-white"
                                placeholder="Enter hospital email"
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
                                disabled={isLoading}
                                className="flex-1 bg-[#444951] text-white py-3 rounded-xl uppercase font-semibold text-sm hover:bg-[#374151] transition shadow-md disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex-1 bg-[#28BC39] text-white py-3 rounded-xl uppercase font-semibold text-sm hover:bg-[#46a84f] transition shadow-md disabled:opacity-50 flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    isEditMode ? "Save" : "Save"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
