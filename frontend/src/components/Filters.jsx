/* eslint-disable react/prop-types */
import { Form, InputGroup, Dropdown } from "react-bootstrap";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { useLocation } from "react-router-dom";

function Filters({
  setPage,
  selectedStatus,
  selectedBranch,
  setSelectedStatus,
  setSelectedBranch,
  selectedRole,
  setSelectedRole,
  setIsSearchLoading,
  branchData,
  filterOptions,
  setSearch,
  setSearchInput,
  refetch,
  refetchStudents,
  refetchPayments,
  refetchEarnings,
  refetchUsers,
  searchInput,
  isAdmin,
}) {
  const location = useLocation();
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 3) {
      setSearch(value);
      setPage(0);
    } else {
      setSearch("");
    }
  };

  const handleSearch = () => {
    setIsSearchLoading(true);
    setSearch(searchInput);
    setPage(0);
    refetch();
    refetchStudents();
    refetchEarnings();
    refetchPayments();
    refetchUsers();
    setIsSearchLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleBranchSelect = (key) => {
    setSelectedBranch(key);
    refetchStudents();
    refetchEarnings();
  };

  const handleStatusSelect = (key) => {
    setSelectedStatus(key);
    refetchStudents();
    setPage(0)
    refetchEarnings();
  };

  const handleRoleSelect = (key) => {
    setSelectedRole(key);
    setPage(0);
    refetchUsers();
  };

  return (
    <>
      {location.pathname === '/dashboard/cases' ? <h1>Students</h1> : location.pathname === '/dashboard/users' ? <h1>All Users</h1> : <h1>Transactions History</h1>}
      <InputGroup className="mb-3 searchBar">
        <Form.Control
          aria-label="Search"
          placeholder="Search..."
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />

        <InputGroup.Text style={{ height: "2.375rem", cursor: "pointer" }}>
          <Dropdown>
            <Dropdown.Toggle
              as="span"
              className="d-flex justify-content-around align-items-center no-arrow"
              style={{ cursor: "pointer" }}
            >
              <IoFilter size={20} title="Filters" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {isAdmin && (
                <>
                  <Dropdown.ItemText>Branch</Dropdown.ItemText>
                  <Dropdown.Divider />
                  {branchData?.branches?.map((branch) => (
                    <Dropdown.Item
                      key={branch._id}
                      eventKey={branch._id}
                      onClick={() => handleBranchSelect(branch._id)}
                    >
                      {selectedBranch === branch._id && (
                        <FaCheckCircle className="mx-1" />
                      )}
                      {branch.name}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Item
                    id="clear-dropdown-btn"
                    eventKey=""
                    onClick={() => handleBranchSelect("")}
                  >
                    <FaTimes /> clear
                  </Dropdown.Item>
                  <Dropdown.Divider />
                </>
              )}
              {location.pathname === '/dashboard/users' ? (
                <>
                  <Dropdown.ItemText>Role</Dropdown.ItemText>
                  <Dropdown.Divider />
                  {filterOptions &&
                    [...new Set(filterOptions.filter(Boolean).map((user) => user.role))].map(
                      (uniqueRole) => (
                        <Dropdown.Item
                          key={uniqueRole}
                          eventKey={uniqueRole}
                          onClick={() => handleRoleSelect(uniqueRole)}
                        >
                          {selectedRole === uniqueRole && <FaCheckCircle className="mx-1" />}
                          {uniqueRole === 'branch_admin' ? 'Branch Admins' : 'Consultants'}
                        </Dropdown.Item>
                      )
                    )}
                  <Dropdown.Item
                    id="clear-dropdown-btn"
                    eventKey=""
                    onClick={() => handleRoleSelect("")}
                  >
                    <FaTimes /> clear
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.ItemText>Status</Dropdown.ItemText>
                  <Dropdown.Divider />
                  {filterOptions &&
                    [
                      ...new Set(
                        filterOptions
                          .filter(Boolean)
                          .map((status) => status.status)
                      ),
                    ].map((uniqueStatus) => (
                      <Dropdown.Item
                        key={uniqueStatus}
                        eventKey={uniqueStatus}
                        onClick={() => handleStatusSelect(uniqueStatus)}
                      >
                        {selectedStatus === uniqueStatus && (
                          <FaCheckCircle className="mx-1" />
                        )}
                        {uniqueStatus}
                      </Dropdown.Item>
                    ))}
                  <Dropdown.Item
                    id="clear-dropdown-btn"
                    eventKey=""
                    onClick={() => handleStatusSelect("")}
                  >
                    <FaTimes /> clear
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup.Text>

        <InputGroup.Text style={{ height: "2.375rem", cursor: "pointer" }}>
          <CiSearch size={20} onClick={handleSearch} />
        </InputGroup.Text>
      </InputGroup>
    </>
  );
}

export default Filters;
