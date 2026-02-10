import React, { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    useGetPublicCountriesQuery,
    useGetPublicStatesQuery,
    useGetPublicCitiesQuery
} from "../../../../core/services/api/publicLocationApi";

export default function HospitalFilterModal({ open, onClose, onApply, onClear, initialFilters }) {
    const [filters, setFilters] = useState({
        country: "",
        state: "",
        city: ""
    });

    useEffect(() => {
        if (open && initialFilters) {
            setFilters(initialFilters);
        }
    }, [open, initialFilters]);

    const [selectedCountryId, setSelectedCountryId] = useState(null);
    const [selectedStateId, setSelectedStateId] = useState(null);
    const [selectedCityId, setSelectedCityId] = useState(null);

    const { data: countriesData } = useGetPublicCountriesQuery();
    const { data: statesData } = useGetPublicStatesQuery(selectedCountryId, { skip: !selectedCountryId });
    const { data: citiesData } = useGetPublicCitiesQuery(selectedStateId, { skip: !selectedStateId });

    // Effect to set selectedCountryId based on filters.country name match
    useEffect(() => {
        if (filters.country && countriesData?.data) {
            const country = countriesData.data.find(c => c.country_name === filters.country);
            if (country) setSelectedCountryId(country.country_id);
        } else {
            setSelectedCountryId(null);
        }
    }, [filters.country, countriesData]);

    // Effect to set selectedStateId based on filters.state name match
    useEffect(() => {
        if (filters.state && statesData?.data) {
            const state = statesData.data.find(s => s.state_name === filters.state);
            if (state) setSelectedStateId(state.state_id);
        } else {
            setSelectedStateId(null);
        }
    }, [filters.state, statesData]);

    // Effect to set selectedCityId based on filters.city name match
    useEffect(() => {
        if (filters.city && citiesData?.data) {
            const city = citiesData.data.find(c => c.city_name === filters.city);
            if (city) setSelectedCityId(city.city_id);
        } else {
            setSelectedCityId(null);
        }
    }, [filters.city, citiesData]);

    // Sync IDs if filters are pre-filled (e.g. if kept in parent, though here they reset on close unless parent passes them in. 
    // But this component has local state `filters`. If it mounts fresh every time, this effect might not be needed for initial load unless props passed in.
    // However, if the modal stays mounted but hidden/shown (it returns null if !open), looking at the code:
    // `if (!open) return null;`
    // So it unmounts. `filters` state resets.
    // Wait, `filters` state is initialized to empty strings.
    // Usually standard `Filter` modals might want to PERSIST filters.
    // In `Hospitals.jsx`, `onApply` updates `filters` state in `Hospitals`.
    // But `HospitalFilterModal` has its OWN `filters` state initialized to empty.
    // This means every time I open the filter modal, it starts EMPTY.
    // This is a bit annoying UX. It should probably accept `initialFilters` prop.
    // The implementation plan didn't strictly specify this, but "Integreate `HospitalFilterModal`" implied making it work.
    // If I open the modal, select "USA", search. The list filters.
    // If I open the modal again, it's empty. I select "UK". Search. List filters by UK.
    // This is simpler. I will stick to this.
    // HOWEVER, I still need the `useEffect` to handle the `onChange` cascading correctly if I just rely on `handleChange`.
    // Actually, `handleChange` sets the ID immediately.
    // BUT, if I want to persist filters, I should probably accept them as props.
    // For now, I'll stick to the current scope: just make the dropdowns work.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));

        if (name === "country") {
            const country = countriesData?.data?.find(c => c.country_name === value);
            setSelectedCountryId(country ? country.country_id : null);
            setFilters(prev => ({ ...prev, state: "", city: "" }));
            setSelectedStateId(null);
        }

        if (name === "state") {
            const state = statesData?.data?.find(s => s.state_name === value);
            setSelectedStateId(state ? state.state_id : null);
            setFilters(prev => ({ ...prev, city: "" }));
            setSelectedCityId(null);
        }

        if (name === "city") {
            const city = citiesData?.data?.find(c => c.city_name === value);
            setSelectedCityId(city ? city.city_id : null);
        }
    };

    const handleApply = () => {
        console.log("Search button clicked in modal. Filters:", filters);
        // If we need to send IDs, we might need to change this. 
        // For now, let's see what is being sent.
        // We might want to send { country_id: ..., state_id: ..., city_id: ... }
        // But the local state `filters` only has names found in `value`.
        // The derived IDs are in `selectedCountryId`, etc.

        const filtersToApply = {
            ...filters,
            // If backend needs IDs, we can pass them here if they are set.
            // But if they are null (e.g. initial load with name pre-filled but no ID derived yet?), 
            // the useEffects should have set them.
            country_id: selectedCountryId,
            state_id: selectedStateId,
            city_id: selectedCityId // We don't have selectedCityId state matching city name yet in this file?
            // Actually this file handles cascading. 
            // It has `selectedCountryId` and `selectedStateId`.
            // But it does `city` as just text? No, it has `citiesData`.
            // Let's add `selectedCityId` state to be complete.
        };
        console.log("Applying Filters:", filtersToApply);

        onApply(filtersToApply);
        onClose();
    };

    const handleClear = () => {
        setFilters({ country: "", state: "", city: "" });
        onClear(); // Optional: Immediately clear or just reset form and user must click Search. 
        // Given typical UX, "Clear" resets form. "Search" applies. 
        // But often "Clear" also resets the list. Let's make it reset form and call onClear to reset list.
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-[400px] bg-white rounded-[20px] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#245FFF] px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-semibold">Filter</h2>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Below</label>

                        {/* Country Dropdown */}
                        <div className="relative">
                            <select
                                name="country"
                                value={filters.country}
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

                        {/* State Dropdown */}
                        <div className="relative">
                            <select
                                name="state"
                                value={filters.state}
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

                        {/* City Dropdown */}
                        <div className="relative">
                            <select
                                name="city"
                                value={filters.city}
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

                        {/* Buttons */}
                        <div className="flex gap-3 mt-8 pt-2">
                            <button
                                onClick={handleClear}
                                className="px-6 py-2 bg-[#333333] text-white rounded-lg flex items-center gap-2 hover:bg-black transition-colors text-sm font-medium"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 bg-[#245FFF] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1a4cd2] transition-colors text-sm font-medium"
                            >
                                <SearchIcon sx={{ fontSize: 20 }} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
