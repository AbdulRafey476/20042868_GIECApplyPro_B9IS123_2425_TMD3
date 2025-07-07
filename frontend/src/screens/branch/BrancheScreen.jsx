import { LinkContainer } from "react-router-bootstrap";
import { Form, InputGroup } from "react-bootstrap";
import { useAllBranchesQuery, useDeleteBranchMutation } from "../../slices/branchApiSlice";
import { useAllUsersMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Table from "react-bootstrap/Table";
import { BiSolidEdit } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa"
import { CiSearch } from "react-icons/ci";
import { MdAddBusiness } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ReactPaginate from 'react-paginate';
import { Outlet, useLocation } from "react-router-dom";

function BrancheScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data: branchesData, isLoading: branchesLoading, error: branchesError, refetch } = useAllBranchesQuery({ page: currentPage + 1, limit: 10, search });
  const [allUsers, { data: branchUsersData }] = useAllUsersMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const branches = branchesData ? branchesData.branches : [];
  const pageCount = branchesData ? branchesData.pageCount : 0;
  const branchUsers = branchUsersData || [];

  const location = useLocation();

  const handleDeleteBranch = async (id) => {
    try {
      await deleteBranch(id).unwrap();
      toast.success("Branch deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await allUsers().unwrap();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };

    fetchUsers();
  }, [allUsers, currentPage]);

  if (branchesLoading) {
    return <Loader />;
  }

  if (branchesError) {
    return <div>Error: {branchesError.message}</div>;
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const isAdding = location.pathname.startsWith('/dashboard/branches/add');
  const isEditing = location.pathname.startsWith('/dashboard/branches/update');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 3) {
      setSearch(value);
      setCurrentPage(0);
    } else {
      setSearch("");
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(0);
    refetch();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {!isEditing && (
        <>
          {!isAdding && (
            <>
              <LinkContainer
                to="/dashboard/branches/add"
                style={{
                  fontSize: "2.5rem",
                  cursor: "pointer",
                  marginLeft: "10px",
                  float: "right",
                }}
              >
                <MdAddBusiness />
              </LinkContainer>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Branches</h1>
                <InputGroup className="mb-3 searchBar">
                  <Form.Control
                    aria-label="Search"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                  />
                  <InputGroup.Text style={{ height: '2.375rem', cursor: 'pointer' }}>
                    <CiSearch size={20} onClick={handleSearch} />
                  </InputGroup.Text>
                </InputGroup>
              </div>
              <div className="table-container">
                <Table striped bordered hover className="mt-3 table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Branch Name</th>
                      <th>Branch Admin</th>
                      <th>Branch Number</th>
                      <th>Location</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.length > 0 ? (
                      branches.map((branch, index) => {
                        const branchAdmin = branchUsers.find(user => user.branch_id?._id === branch._id);
                        return (
                          <tr key={branch._id}>
                            <td>{index + 1}</td>
                            <td>{branch.name}</td>
                            <td>{branchAdmin ? branchAdmin.username : "N/A"}</td>
                            <td>{branch.phoneNumber || "N/A"}</td>
                            <td style={{
                              maxWidth: '480px',
                              wordWrap: 'break-word',
                              whiteSpace: 'normal'
                            }}>{branch.location}</td>
                            <td style={{ textAlign: 'center' }}>
                              <LinkContainer to={`/dashboard/branches/update/${branch._id}`} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'black', marginLeft: '10px' }}>
                                <BiSolidEdit />
                              </LinkContainer>
                              <MdOutlineDeleteOutline
                                style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                                onClick={() => handleDeleteBranch(branch._id)}
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6">No branch found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel={<> next <FaArrowRight /></>}
                previousLabel={<><FaArrowLeft /> previous</>}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
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
            </>
          )}
        </>
      )}
      <Outlet />
    </>
  );
}

export default BrancheScreen;
