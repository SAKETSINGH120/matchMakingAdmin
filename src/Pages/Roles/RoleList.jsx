

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { getAllRoles, RoleDelete } from "../../Services/RoleApi";
import toast from "react-hot-toast";
import ExportButton from "../../compoents/ExportButton";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import AddButton from "../../compoents/AddButton";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import RoleFilters from "./components/RoleFilters";
import { Modal } from "antd";
import { useAuth } from "../../auth/AuthContext";

export default function RoleList() {
  // const { hasPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [search, setSearch] = useState(searchQueryFromUrl);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        page: currentPage,
        rowsPerPage: limit,
        searchQueryFromUrl: searchQuery,
      } = getValFromSearchParams({ searchParams });
      const result = await getAllRoles({
        page: currentPage,
        rowsPerPage: limit,
        searchQuery,
      });

      if (result?.status || result?.success) {
        // toast.success("Role fetched successfully!");  // optional - many prefer not to toast on every list load
        const transformedData = (result.data || []).map((item, index) => ({
          ...item,
          serialNo: index + 1 + (currentPage - 1) * limit, // for correct S.No across pages
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || result.data?.length || 0);
      } else {
        toast.error(result?.message || "Failed to fetch roles.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error fetching roles.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const excelFileColumns = React.useMemo(() => {
    return [
      { label: "S.No", value: (row) => row?.serialNo || "" },
      { label: "Role Name", value: (row) => row?.name || "" },
      {
        label: "Created Date",
        value: (row) =>
          row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
      },
    ];
  }, []);

  const tableColumn = React.useMemo(() => {
    return [
      
      { label: "Role Name", key: "name" },
    ];
  }, []);

  const handleAddClick = () => {
    navigate("createrole");
  };

  const handleOnUpdate = (rowId) => {
    navigate(`updaterole/${rowId}`);
  };

  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete role",
      content: "Are you sure you want to delete this role? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          const result = await RoleDelete(id);
          if (result?.status || result?.success) {
            toast.success("Role deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete role.");
          }
        } catch (error) {
          console.error("Error deleting role:", error);
          toast.error("Error deleting role.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="theme-page p-6">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8">
        <RoleFilters
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          search={search}
          setSearch={setSearch}
        />
        <div className="flex gap-4">
         
            {/* <ExportButton
              ariaLabel="Role Export Button"
              dataToExport={data}
              columns={excelFileColumns}
            /> */}
          
          
            {/* <AddButton btnName="Add Role" onClick={handleAddClick} /> */}
          
        </div>
      </div>

      <GenericTable
        data={data}
        columns={tableColumn}
        hasAction={true}
        hasEdit={true}
        hasDelete={true}
        hasView={false}
        isLoading={loading}
        ariaLabel="Roles table"
        limit={rowsPerPage}
        page={page}
        onEdit={(row) => {
          handleOnUpdate(row._id);
        }}
        onDelete={(row) => {
          deleteHandler(row._id);
        }}
      />

      <PaginationManager
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        page={page}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
}
