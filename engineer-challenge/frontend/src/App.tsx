import Navbar from "./Navbar";
import Header from "./Header";
import { useEffect, useState, useCallback, useRef } from "react";
import Table from "./Table";
import Select from "./Select";

import type { TableRow } from "./types/Table";

import "./index.css";

type TableFilters = {
  status: string;
  insuranceType: string;
  provider: string;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  // TODO: derive all options from API results dynamically instead of adding manually
  const [tableSelectFilters, setTableSelectFilters] = useState<TableFilters>({
    status: "ALL",
    insuranceType: "ALL",
    provider: "ALL",
  });
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const timeoutID = useRef(0);

  const editTableFilters = useCallback(
    (type: "status" | "insuranceType" | "provider", value: string) => {
      // TODO: derive all options from API results dynamically instead of adding manually
      setTableSelectFilters({ ...tableSelectFilters, [type]: value });
    },
    [tableSelectFilters]
  );

  const getPolicies = useCallback(async () => {
    setIsLoading(true);
    // TODO:
    // - use .env variable for URL here
    // - Pass additional select filters when API supports this
    const search = `http://localhost:4000/policies?search=${encodeURIComponent(
      searchFilter
    )}`;
    try {
      const policies = await fetch(search).then((r) => r.json());
      setTableData(policies);
      setIsLoading(false);
    } catch (e) {
      // TODO: display server errors in UI
      console.error(e);
      setIsLoading(false);
    }
  }, [searchFilter]);

  const getPoliciesDebounced = useCallback(async () => {
    timeoutID.current && clearTimeout(timeoutID.current);
    timeoutID.current = window.setTimeout(async () => {
      getPolicies();
    }, 500);
  }, [getPolicies]);

  useEffect(() => {
    // TODO: implement fuzzy search
    setFilteredData(
      tableData.filter(
        (r: TableRow) =>
          // Always (could be filtered in API request instead if supported)
          ["ACTIVE", "PENDING"].includes(r.status) &&
          // Select filters
          // TODO: derive and group select options from API response to make dynamic
          (tableSelectFilters.status === "ALL" ||
            r.status === tableSelectFilters.status) &&
          (tableSelectFilters.insuranceType === "ALL" ||
            r.insuranceType === tableSelectFilters.insuranceType) &&
          (tableSelectFilters.provider === "ALL" ||
            r.provider === tableSelectFilters.provider) &&
          // text search filter
          (r.customer.firstName
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) ||
            r.customer.lastName
              .toLowerCase()
              .includes(searchFilter.toLowerCase()) ||
            r.provider.toLowerCase().includes(searchFilter.toLowerCase()))
      )
    );
  }, [tableData, searchFilter, tableSelectFilters]);

  useEffect(() => {
    getPoliciesDebounced();
  }, [getPoliciesDebounced, searchFilter]);

  useEffect(() => {
    getPolicies();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="w-full p-8">
        <Header />
        {filteredData && (
          <>
            <div className="flex">
              {/* TODO: create Selects dynamically from API response (depends on design preferences) */}
              <Select
                label={"Provider:"}
                options={["ALL", "AOK", "BARMER", "DAK"]}
                onSelectChange={(e) => {
                  editTableFilters("provider", e.target.value);
                }}
              />
              <Select
                label={"Type:"}
                options={["ALL", "HOUSEHOLD", "HEALTH", "LIABILITY"]}
                onSelectChange={(e) => {
                  editTableFilters("insuranceType", e.target.value);
                }}
              />
              <Select
                label={"Type:"}
                options={["ALL", "ACTIVE", "PENDING"]}
                onSelectChange={(e) => {
                  editTableFilters("status", e.target.value);
                }}
              />
            </div>
            <Table
              isLoading={isLoading}
              onFilterChange={(e) => setSearchFilter(e.target.value)}
              rowsPerPage={3}
              showSearchFilter={true}
              tableData={filteredData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
