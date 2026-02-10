import React, { useState, useMemo } from "react";
import PageContainer from "../../components/PageContainer";
import SearchBar from "../../components/Searchbar";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import HospitalsTable from "./components/HospitalsTable";
import { Button, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

import EditHospitalModal from "./components/EditHospitalModal";
import HospitalFilterModal from "./components/HospitalFilterModal";
import {
    useGetHospitalsQuery,
    useDeleteHospitalMutation,
    useToggleHospitalStatusMutation
} from "../../../core/services/api/hospitalsApi";

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

    // Server-Side Search Integration (For Filter Modal Only)
    // The backend uses a single `search` parameter.
    // We Map the Filter Modal (City > State > Country) to this API param.
    // The Main Search Bar is now LOCAL only.
    const apiSearchParam = useMemo(() => {
        if (filters.city) return filters.city;
        if (filters.state) return filters.state;
        if (filters.country) return filters.country;
        return "";
    }, [filters]);

    // API Hooks
    // We pass search param from filters only.
    const { data: hospitalsResponse, isLoading, isError, error, refetch } = useGetHospitalsQuery(
        { search: apiSearchParam },
        { refetchOnMountOrArgChange: true }
    );

    React.useEffect(() => {
        console.log("Hospitals Component Mounted/Updated");
        console.log("Current Filters:", filters);
        console.log("API Search Param (from Filters):", apiSearchParam);
        console.log("Query Status:", { data: hospitalsResponse, isLoading, isError, error });
    }, [filters, apiSearchParam, hospitalsResponse, isLoading, isError, error]);

    const [deleteHospital] = useDeleteHospitalMutation();
    const [toggleHospitalStatus] = useToggleHospitalStatusMutation();

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleEdit = (item) => {
        setSelectedHospital(item);
        setOpenEdit(true);
    };

    const handleModalClose = () => {
        setOpenEdit(false);
        setSelectedHospital(null);
    };

    const handleDelete = async (id) => {
        try {
            await deleteHospital(id).unwrap();
        } catch (error) {
            console.error("Failed to delete hospital:", error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleHospitalStatus({ id }).unwrap();
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    }

    const handleAddNew = () => {
        setSelectedHospital(null);
        setOpenEdit(true);
    };

    const handleApplyFilters = (newFilters) => {
        console.log("Applying filters from modal:", newFilters);
        setFilters(newFilters);
        setOpenFilter(false);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({ country: "", state: "", city: "" });
        setOpenFilter(false);
        setCurrentPage(1);
    };

    // Data Processing:
    const rawHospitalsList = hospitalsResponse?.data || [];
    const totalCount = hospitalsResponse?.total || 0;

    // Local Search (Main Search Bar)
    const filteredHospitals = useMemo(() => {
        if (!search) return rawHospitalsList;
        return rawHospitalsList.filter(hospital =>
            hospital.name?.toLowerCase().includes(search.toLowerCase()) ||
            hospital.city?.toLowerCase().includes(search.toLowerCase()) ||
            hospital.state?.toLowerCase().includes(search.toLowerCase()) ||
            hospital.country?.toLowerCase().includes(search.toLowerCase())
        );
    }, [rawHospitalsList, search]);

    // Local Pagination on the *Filtered* Data
    const totalItems = filteredHospitals.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handle case where currentPage > totalPages after filtering
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }

    const paginatedHospitals = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredHospitals.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredHospitals, currentPage, itemsPerPage]);


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
                                placeholder="Search..."
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
                totalSection={<TotalSection label="Total Hospitals:" count={totalItems} />}
                tableSection={
                    <div className="w-full h-full">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <CircularProgress />
                            </div>
                        ) : (
                            <HospitalsTable
                                items={paginatedHospitals}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        )}
                    </div>
                }
                paginationSection={
                    <div className="flex justify-end">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages || 1}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                }
            />
            <EditHospitalModal
                open={openEdit}
                onClose={handleModalClose}
                hospital={selectedHospital}
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
