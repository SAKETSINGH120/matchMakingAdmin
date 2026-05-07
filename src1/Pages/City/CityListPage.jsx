import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { convertUTCToLocalDateString } from "../../utils/convertUTCtoLocalDate";
import PaginationManager from "../../compoents/PaginationManager";
import { deleteCity, getAllCitiesList } from "../../Services/CityApi";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import ExportButton from "../../compoents/ExportButton";
import AddButton from "../../compoents/AddButton";
import GenericTable from "../../compoents/Table";


const CityListPage = () => {
  const { hasPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });
  const { auth, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [search, setSearch] = useState(searchQueryFromUrl);
  const navigate = useNavigate();
  const [isFilterApply, setIsFilterApply] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        page: currentPage,
        rowsPerPage: limit,
        searchQueryFromUrl: searchQuery,
      } = getValFromSearchParams({ searchParams });
      const result = await getAllCitiesList({
        page: currentPage,
        rowsPerPage: limit,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Cities fetched successfully!");
        const cities = result.data?.cities ?? [];
        const transformedData = cities.map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.data?.totalPages || 0);
        setTotalRecord(result.data?.total || 0);
        if (searchQuery.trim() && !isFilterApply) setIsFilterApply(true);
        else if (!searchQuery.trim() && isFilterApply) setIsFilterApply(false);
      } else {
        toast.error(result?.message || "Failed to fetch Cities");
      }
    } catch (error) {
      console.error("Error fetching Cities", error);
      toast.error("Error fetching Cities");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading.profile && auth.user) {
      fetchData();
    }
  }, [fetchData, authLoading.profile, auth.user]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete City",
      content:
        "Are you sure you want to delete this city? This action cannot be undone.",
      okText: loading ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: loading },
      onOk: async () => {
        try {
          setLoading(true);
          const result = await deleteCity(id);
          if (result?.status) {
            toast.success("City deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete city.");
          }
        } catch (error) {
          console.error("Error deleting city.", error);
          toast.error("Error deleting city.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAddClick = () => {
    setTimeout(() => {
      navigate("add");
    }, 300);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() !== searchQueryFromUrl) {
        const sp = new URLSearchParams(searchParams);

        if (search) {
          sp.set("search", search);
        } else {
          sp.delete("search");
        }

        sp.set("page", "1");
        setSearchParams(sp, { replace: true });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search, searchParams, setSearchParams]);

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      const sp = new URLSearchParams(searchParams);
      if (search) sp.set("search", search);
      else sp.delete("search");
      sp.set("page", "1");
      setSearchParams(sp, { replace: true });
    }
  };

  const handleClearFilter = () => {
    setSearch("");
    setIsFilterApply(false);
  };

  const excelColumns = [
    { label: "ID", value: (row) => row?._id || "" },
    { label: "City", value: (row) => row?.name || "" },
    {
      label: "Created Date",
      value: (row) => convertUTCToLocalDateString(row?.createdAt) ?? "",
    },
  ];

  const tableColumns = [{ label: "Name", key: "name" }];

  const handleOnUpdate = (rowId) => {
    navigate(`update/${rowId}`);
  };

  const handleOnView = (rowId) => {
    navigate(`view/${rowId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by city name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            aria-label="Search city by name"
            onKeyDown={handleOnKeyDown}
          />
          {isFilterApply && <ClearBtn handleClear={handleClearFilter} />}
        </div>
        <div className="flex gap-4">
          {hasPermission("city", "exportExcel") && (
            <ExportButton ariaLabel="Export colleges to Excel" excelName="City" dataToExport={data} columns={excelColumns} />)}
          {hasPermission("city", "exportExcel") && (
            <AddButton btnName="Add City" onClick={handleAddClick} />
          )}
        </div>
      </div>

      <GenericTable limit={rowsPerPage} page={page} data={data} hasAction={true}
        hasEdit={hasPermission("city", "edit")}
        hasDelete={hasPermission("city", "delete")}
        hasView={false}
        columns={tableColumns} isLoading={loading} ariaLabel="City"
        onEdit={(row) => {
          handleOnUpdate(row._id);
        }}
        onDelete={(row) => {
          deleteHandler(row._id);
        }}
        onView={(row) => handleOnView(row._id)} />

      <PaginationManager
        page={page}
        totalPages={totalPages}
        totalRecord={totalRecord}
        rowsPerPage={rowsPerPage}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};

export default CityListPage;
