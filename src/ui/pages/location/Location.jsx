import React, { useState, useRef, useEffect } from 'react';
import { Switch, CircularProgress, Pagination, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery, useToggleStatusMutation } from "../../../core/services/api/locationApi";

// ColumnSection moved OUTSIDE the Location component to prevent re-creation on each render
const ColumnSection = ({ title, items, selectedIds = [], isLoading, pagination, onRowClick, onToggle, onSearch, onPageChange, searchValue, customEmptyMessage }) => (
    <div className="flex flex-col w-full h-full min-w-0">

        {/* Search Bar */}
        <div className="mb-3">
            <TextField
                fullWidth
                placeholder={`Search ${title}`}
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon className="text-gray-400" />
                        </InputAdornment>
                    ),
                    className: "bg-white rounded-lg"
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                    }
                }}
            />
        </div>

        {/* Header */}
        <div className="bg-[#245FFF] text-white py-3 px-6 rounded-t-xl flex justify-between items-center text-lg font-medium shrink-0">
            <span>{title}</span>
            <span>Action</span>
        </div>

        {/* List */}
        <div className="bg-white border-x border-gray-100 flex-1 overflow-y-auto p-4 space-y-3 relative custom-scrollbar">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                    <CircularProgress size={24} />
                </div>
            )}
            {!isLoading && items.length === 0 && (
                <div className="text-center text-gray-400 mt-4">
                    {customEmptyMessage || (
                        title === 'State' && selectedIds.length === 0 ? "Select a Country" :
                            title === 'City' && selectedIds.length === 0 ? "Select a State" :
                                "No data found"
                    )}
                </div>
            )}
            {items.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                    <div
                        key={item.id || index}
                        onClick={() => onRowClick && onRowClick(item.id)}
                        className={`flex justify-between items-center border rounded-lg py-3 px-6 shadow-sm cursor-pointer transition-colors ${isSelected && title !== 'City'
                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                    >
                        <span className={`font-medium truncate mr-2 ${isSelected && title !== 'City' ? 'text-blue-700' : 'text-gray-700'}`}>
                            {item.name}
                        </span>
                        <Switch
                            checked={item.isActive}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => onToggle(item.id)}
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
                );
            })}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-b-xl border border-t-0 border-gray-100 p-3 flex justify-center shrink-0">
            <Pagination
                count={pagination?.pages || 1}
                page={(pagination?.page || 0) + 1}
                onChange={(e, value) => onPageChange(value - 1)}
                color="primary"
                size="small"
                shape="rounded"
                siblingCount={0}
                boundaryCount={1}
            />
        </div>
    </div>
);

const Location = () => {
    // Selection State (Changed to Arrays for Multi-Select)
    const [selectedCountryIds, setSelectedCountryIds] = useState([]);
    const [selectedStateIds, setSelectedStateIds] = useState([]);

    // Search Input State (for immediate UI display)
    const [countrySearch, setCountrySearch] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    // API Params State (debounced)
    const [countryParams, setCountryParams] = useState({ page: 0, search: '' });
    const [stateParams, setStateParams] = useState({ page: 0, search: '' });
    const [cityParams, setCityParams] = useState({ page: 0, search: '' });

    // Debounce timers
    const countryTimerRef = useRef(null);
    const stateTimerRef = useRef(null);
    const cityTimerRef = useRef(null);
    const DEBOUNCE_DELAY = 500;

    // Queries
    const { data: countriesData, isLoading: isCountriesLoading, refetch: refetchCountries } = useGetCountriesQuery(countryParams);

    // Data Accessors - API returns { data: [...], pagination: {...} } (Moved up to fix ReferenceError)
    const rawCountries = Array.isArray(countriesData?.data) ? countriesData.data : [];
    const countries = rawCountries.map(c => ({
        id: c.country_id,
        name: c.country_name,
        isActive: c.is_active === 1
    }));
    const countriesMeta = countriesData?.pagination || { pages: 1 };

    // Get IDs of all Active countries to load their states automatically
    const activeCountryIds = countries.filter(c => c.isActive).map(c => c.id);
    const countryIdsToFetch = selectedCountryIds.length > 0 
        ? selectedCountryIds.join(',') 
        : activeCountryIds.join(',');

    // Fetch States (Join IDs with comma for multi-select)
    const { data: statesData, isLoading: isStatesLoading, refetch: refetchStates } = useGetStatesQuery(
        { countryId: countryIdsToFetch, ...stateParams },
        { skip: !countryIdsToFetch }
    );

    const rawStates = Array.isArray(statesData?.data) ? statesData.data : [];
    const states = rawStates.map(s => ({
        id: s.state_id,
        name: s.state_name,
        isActive: s.is_active === 1
    }));
    const statesMeta = statesData?.pagination || { pages: 1 };

    // Get IDs of all Active states to load their cities automatically
    const activeStateIds = states.filter(s => s.isActive).map(s => s.id);
    const stateIdsToFetch = selectedStateIds.length > 0 
        ? selectedStateIds.join(',') 
        : activeStateIds.join(',');

    // Fetch Cities (Join IDs with comma for multi-select)
    const { data: citiesData, isLoading: isCitiesLoading, refetch: refetchCities } = useGetCitiesQuery(
        { stateId: stateIdsToFetch, ...cityParams },
        { skip: !stateIdsToFetch }
    );

    const rawCities = (stateIdsToFetch && Array.isArray(citiesData?.data)) ? citiesData.data : [];
    const cities = rawCities.map(c => ({
        id: c.city_id,
        name: c.city_name,
        isActive: c.is_active === 1
    }));
    const citiesMeta = citiesData?.pagination || { pages: 1 };

    // Auto-select first country on initial load (Optional - removed to allow "Show All Active" by default)
    /*
    useEffect(() => {
        if (countries.length > 0 && selectedCountryIds.length === 0) {
            setSelectedCountryIds([countries[0].id]);
        }
    }, [countries, selectedCountryIds]);
    */




    // Handlers (Updated for Multi-Select Toggling)
    const handleRowClick = (id, type) => {
        if (type === 'Country') {
            setSelectedCountryIds(prev => {
                const isSelected = prev.includes(id);
                const newSelection = isSelected 
                    ? prev.filter(item => item !== id) 
                    : [...prev, id];
                
                // If selection changed, reset state/city params
                setSelectedStateIds([]);
                setStateParams({ page: 0, search: '' });
                setStateSearch('');
                setCityParams({ page: 0, search: '' });
                setCitySearch('');
                
                return newSelection;
            });
        } else if (type === 'State') {
            setSelectedStateIds(prev => {
                const isSelected = prev.includes(id);
                const newSelection = isSelected 
                    ? prev.filter(item => item !== id) 
                    : [...prev, id];
                
                setCityParams({ page: 0, search: '' });
                setCitySearch('');
                
                return newSelection;
            });
        }
    };

    // Toggle Mutation
    const [toggleStatus] = useToggleStatusMutation();

    const handleToggle = async (id, type) => {
        let currentIsActive = false;
        let apiType = type.toLowerCase();

        if (type === 'Country') {
            const item = countries.find(c => c.id === id);
            currentIsActive = item?.isActive ?? false;
        } else if (type === 'State') {
            const item = states.find(s => s.id === id);
            currentIsActive = item?.isActive ?? false;
        } else if (type === 'City') {
            const item = cities.find(c => c.id === id);
            currentIsActive = item?.isActive ?? false;
        }

        try {
            await toggleStatus({ type: apiType, id, is_active: !currentIsActive }).unwrap();

            // Refetch data based on type to reflect changes
            if (type === 'Country') {
                refetchCountries();
            } else if (type === 'State') {
                refetchStates();
            } else if (type === 'City') {
                refetchCities();
            }
        } catch (error) {
            console.error(`Failed to toggle ${type}:`, error);
        }
    };

    const handleSearchChange = (type, value) => {
        if (type === 'Country') {
            setCountrySearch(value);
            if (countryTimerRef.current) clearTimeout(countryTimerRef.current);
            countryTimerRef.current = setTimeout(() => {
                setCountryParams(prev => ({ ...prev, search: value, page: 0 }));
            }, DEBOUNCE_DELAY);
        }
        if (type === 'State') {
            setStateSearch(value);
            if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
            stateTimerRef.current = setTimeout(() => {
                setStateParams(prev => ({ ...prev, search: value, page: 0 }));
            }, DEBOUNCE_DELAY);
        }
        if (type === 'City') {
            setCitySearch(value);
            if (cityTimerRef.current) clearTimeout(cityTimerRef.current);
            cityTimerRef.current = setTimeout(() => {
                setCityParams(prev => ({ ...prev, search: value, page: 0 }));
            }, DEBOUNCE_DELAY);
        }
    };

    const handlePageChange = (type, value) => {
        if (type === 'Country') setCountryParams(prev => ({ ...prev, page: value }));
        if (type === 'State') setStateParams(prev => ({ ...prev, page: value }));
        if (type === 'City') setCityParams(prev => ({ ...prev, page: value }));
    };

    // Layout Logic - Dynamic Columns (Strict Hierarchy)
    const showState = countryIdsToFetch.length > 0;
    const showCity = showState && stateIdsToFetch.length > 0;
    
    let gridClass = "grid-cols-1";
    if (showState && showCity) gridClass = "grid-cols-3";
    else if (showState) gridClass = "grid-cols-2";

    return (
        <div className="h-full flex flex-col gap-6 p-2">
            <div>
                {/* <h1 className="text-2xl font-bold text-gray-800">Location</h1> */}
            </div>

            <div className={`grid ${gridClass} gap-6 h-full overflow-hidden transition-all duration-300`}>
                <div className="h-full overflow-hidden">
                    <ColumnSection
                        title="Country"
                        items={countries}
                        selectedIds={selectedCountryIds}
                        pagination={{ ...countriesMeta, page: countryParams.page }}
                        isLoading={isCountriesLoading}
                        onRowClick={(id) => handleRowClick(id, 'Country')}
                        onToggle={(id) => handleToggle(id, 'Country')}
                        onSearch={(val) => handleSearchChange('Country', val)}
                        onPageChange={(val) => handlePageChange('Country', val)}
                        searchValue={countrySearch}
                    />
                </div>

                {showState && (
                    <div className="h-full overflow-hidden transition-all duration-300">
                        <ColumnSection
                            title="State"
                            items={states}
                            selectedIds={selectedStateIds}
                            pagination={{ ...statesMeta, page: stateParams.page }}
                            isLoading={isStatesLoading}
                            onRowClick={(id) => handleRowClick(id, 'State')}
                            onToggle={(id) => handleToggle(id, 'State')}
                            onSearch={(val) => handleSearchChange('State', val)}
                            onPageChange={(val) => handlePageChange('State', val)}
                            searchValue={stateSearch}
                            customEmptyMessage={selectedCountryIds.length > 0 && states.length === 0 ? "No state found" : null}
                        />
                    </div>
                )}

                {showCity && (
                    <div className="h-full overflow-hidden transition-all duration-300">
                        <ColumnSection
                            title="City"
                            items={cities}
                            selectedIds={[]} // Cities don't need selection highlight in this view
                            pagination={{ ...citiesMeta, page: cityParams.page }}
                            isLoading={isCitiesLoading}
                            onRowClick={(id) => handleRowClick(id, 'City')}
                            onToggle={(id) => handleToggle(id, 'City')}
                            onSearch={(val) => handleSearchChange('City', val)}
                            onPageChange={(val) => handlePageChange('City', val)}
                            searchValue={citySearch}
                            customEmptyMessage={selectedStateIds.length > 0 && cities.length === 0 ? "No city found" : null}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Location;
