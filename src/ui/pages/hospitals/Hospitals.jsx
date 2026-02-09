import React, { useState } from "react";
import PageContainer from "../../components/PageContainer";
import SearchBar from "../../components/Searchbar";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import HospitalsTable from "./components/HospitalsTable";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';



import EditHospitalModal from "./components/EditHospitalModal";
import HospitalFilterModal from "./components/HospitalFilterModal";

const Hospitals = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [openEdit, setOpenEdit] = useState(false);

    const [selectedHospital, setSelectedHospital] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState({
        country: "",
        state: "",
        city: ""
    });

    // Dummy Data
    const [hospitals, setHospitals] = useState([
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1587351021759-3e566b9af9ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            name: "Los Angeles General Hospital",
            country: "USA",
            state: "California",
            city: "Los Angeles",
            phone_number: "+1 213-555-0101",
            is_active: true
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            name: "Manhattan Medical Center",
            country: "USA",
            state: "New York",
            city: "New York",
            phone_number: "+1 212-555-0202",
            is_active: false
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            name: "London Central Hospital",
            country: "UK",
            state: "England",
            city: "London",
            phone_number: "+44 20 7946 0300",
            is_active: true
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1587351021759-3e566b9af9ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            name: "Los Angeles General Hospital",
            country: "USA",
            state: "California",
            city: "Los Angeles",
            phone_number: "+1 213-555-0101",
            is_active: true
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            name: "Manhattan Medical Center",
            country: "USA",
            state: "New York",
            city: "New York",
            phone_number: "+1 212-555-0202",
            is_active: false
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            name: "London Central Hospital",
            country: "UK",
            state: "England",
            city: "London",
            phone_number: "+44 20 7946 0300",
            is_active: true
        },
    ]);

    const handleSearchChange = (val) => {
        setSearch(val);
    };

    const handleEdit = (item) => {
        setSelectedHospital(item);
        setOpenEdit(true);
    };

    const handleSaveEdit = (hospitalData) => {
        if (hospitalData.id) {
            // Edit existing
            setHospitals(prev => prev.map(h => h.id === hospitalData.id ? hospitalData : h));
        } else {
            // Add new
            const newHospital = {
                ...hospitalData,
                id: Date.now(), // Simple ID generation
            };
            setHospitals(prev => [newHospital, ...prev]);
        }
        setOpenEdit(false);
    };

    const handleDelete = (id) => {
        console.log("Delete item:", id);
        setHospitals(prev => prev.filter(h => h.id !== id));
    };

    const handleToggleStatus = (id) => {
        setHospitals(prev => prev.map(h =>
            h.id === id ? { ...h, is_active: !h.is_active } : h
        ));
    }

    const handleAddNew = () => {
        setSelectedHospital(null); // Clear selection for "Add" mode
        setOpenEdit(true);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setOpenFilter(false);
    };

    const handleClearFilters = () => {
        setFilters({ country: "", state: "", city: "" });
        setOpenFilter(false);
    };

    const filteredHospitals = hospitals.filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(search.toLowerCase());
        const matchesCountry = filters.country ? hospital.country === filters.country : true;
        const matchesState = filters.state ? hospital.state === filters.state : true;
        const matchesCity = filters.city ? hospital.city === filters.city : true;
        return matchesSearch && matchesCountry && matchesState && matchesCity;
    });


    return (
        <>
            <PageContainer
                topSection={
                    <div className="flex w-full mt-4 items-center justify-between">
                        <div className="w-1/2 flex items-center justify-start gap-3">
                            <SearchBar
                                value={search}
                                onChange={handleSearchChange}
                                onSearch={() => { }}
                                placeholder="Search..." // Added placeholder if SearchBar supports it
                            />
                        </div>
                        <div className="w-1/2 flex items-center justify-end gap-3">
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddNew}
                                sx={{
                                    backgroundColor: '#245FFF',
                                    textTransform: 'none',
                                    borderRadius: '10px',
                                    padding: '8px 16px',
                                    '&:hover': {
                                        backgroundColor: '#1a4cd2',
                                    }
                                }}
                            >
                                Add New
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setOpenFilter(true)}
                                sx={{
                                    borderColor: '#ccc',
                                    color: '#555',
                                    minWidth: '40px',
                                    padding: '8px',
                                    borderRadius: '10px',
                                    marginLeft: '10px',
                                    '&:hover': {
                                        borderColor: '#aaa',
                                        backgroundColor: '#f5f5f5',
                                    }
                                }}
                            >
                                <FilterListIcon />
                            </Button>
                        </div>
                    </div>
                }
                totalSection={<TotalSection label="Total Hospitals:" count={filteredHospitals.length} />}
                tableSection={
                    <div className="w-full h-full">
                        <HospitalsTable
                            items={filteredHospitals}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    </div>
                }
                paginationSection={
                    <div className="flex justify-end">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={5} // Dummy total pages
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                }
            />
            <EditHospitalModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                hospital={selectedHospital}
                onSave={handleSaveEdit}
            />
            <HospitalFilterModal
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                initialFilters={filters}
            />
        </>
    );
};

export default Hospitals;
