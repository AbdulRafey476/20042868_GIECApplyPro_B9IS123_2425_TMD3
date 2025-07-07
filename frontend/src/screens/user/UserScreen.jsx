import { useDeleteUserMutation, usePaginatedUserQuery, useSpecificUserQuery } from "../../slices/usersApiSlice.js";
import { useAllBranchesQuery } from "../../slices/branchApiSlice.js";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader.jsx";
import Table from "react-bootstrap/Table";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { LinkContainer } from "react-router-bootstrap";
import { HiUserAdd } from "react-icons/hi";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Outlet, useLocation } from "react-router-dom";
import Filters from "../../components/Filters.jsx";

function UserScreen() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [deleteUser] = useDeleteUserMutation();
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const location = useLocation();
  const { data: user } = useSpecificUserQuery();


  const isAdmin = user?.profile?.isAdmin;
  const { data: branchData } = useAllBranchesQuery({
    page: currentPage + 1,
    limit,
    search,
  });

  const { data: paginatedUsers, isLoading, refetch: refetchUsers, error } = usePaginatedUserQuery({
    currentPage: currentPage + 1,
    limit,
    search,
    role: selectedRole,
    branch_id: selectedBranch,
  });

  useEffect(() => {
    if (paginatedUsers) {
      setPageCount(paginatedUsers?.pageCount || 1);
      setUsers(paginatedUsers?.result || []);
    }
  }, [paginatedUsers]);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id).unwrap();
      refetchUsers();
      toast.success("User deleted successfully");
      setCurrentPage(0);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const filteredUsers = users?.filter((user) => user.role !== "admin");
  const isAdding = location.pathname.startsWith("/dashboard/users/add");
  const isEditing = location.pathname.startsWith("/dashboard/users/update");

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {!isEditing && (
        <>
          {!isAdding && (
            <>
              <LinkContainer to="/dashboard/users/add" style={{ fontSize: "2.5rem", cursor: "pointer", marginLeft: "10px", float: "right" }}>
                <HiUserAdd />
              </LinkContainer>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Filters setPage={setCurrentPage} selectedRole={selectedRole} selectedBranch={selectedBranch} setSelectedRole={setSelectedRole} setSelectedBranch={setSelectedBranch} branchData={branchData} filterOptions={filteredUsers} setSearch={setSearch} setSearchInput={setSearchInput} refetchUsers={refetchUsers} searchInput={searchInput} setIsSearchLoading={setIsSearchLoading} isAdmin={isAdmin} />
              </div>
              <div className="table-container">
                {isSearchLoading || isLoading ? (
                  <Loader />
                ) : (
                  <Table striped bordered hover className="mt-3 table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Branch Name</th>
                        <th>Role</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers?.length > 0 ? (
                        filteredUsers.map((user, index) => (
                          <tr key={user._id}>
                            <td>{index + 1 + currentPage * limit}</td>
                            <td>{user.username}</td>
                            <td>{user.branch_id?.name || "N/A"}</td>
                            <td>{user.role}</td>
                            <td style={{ textAlign: 'center' }}>
                              <LinkContainer to={`/dashboard/users/update/${user._id}`} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'black', marginLeft: '10px' }}>
                                <BiSolidEdit />
                              </LinkContainer>
                              <MdOutlineDeleteOutline
                                style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                                onClick={() => handleDeleteUser(user._id)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </div>
              <div className="pagination-container">
                <ReactPaginate
                  breakLabel=""
                  nextLabel={<> next <FaArrowRight /></>}
                  previousLabel={<><FaArrowLeft /> previous</>}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={0}
                  marginPagesDisplayed={0}
                  pageCount={pageCount}
                  forcePage={currentPage}
                  containerClassName="pagination justify-content-center"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  activeClassName="active"
                />
              </div>
            </>
          )}
        </>
      )}
      <Outlet context={{ refetchUsers }} />
    </>
  );
}

export default UserScreen;
