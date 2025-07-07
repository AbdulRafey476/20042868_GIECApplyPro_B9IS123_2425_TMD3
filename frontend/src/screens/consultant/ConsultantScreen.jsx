import { useDeleteUserMutation, usePaginatedUserQuery } from "../../slices/usersApiSlice.js";
import { Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Table from "react-bootstrap/Table";
import { BiSolidEdit } from "react-icons/bi";
import { HiUserAdd } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { LinkContainer } from "react-router-bootstrap";
import ReactPaginate from 'react-paginate';
import { CiSearch } from "react-icons/ci";
import { Outlet, useLocation } from "react-router-dom";

function ConsultantScreen() {
    const [consultants, setConsultants] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [limit] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const location = useLocation();

    const [deleteUser] = useDeleteUserMutation();
    const { data: paginatedUsers, isLoading, refetch: refetchUsers } = usePaginatedUserQuery({
        currentPage: currentPage + 1, limit, search
    });

    useEffect(() => {
        const fetchConsultants = async () => {
            try {
                setConsultants(paginatedUsers?.result.filter(user => user.role === "consultant"));
                setPageCount(paginatedUsers?.pageCount);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
                setError(err);
            }
        };
        fetchConsultants();
    }, [currentPage, paginatedUsers, refetchUsers, search, limit]);

    const handleDeleteConsultant = async (id) => {
        if (window.confirm("Are you sure you want to delete this consultant?")) {
            try {
                await deleteUser(id).unwrap();
                toast.success("Consultant deleted successfully");
                setConsultants(consultants.filter((consultant) => consultant._id !== id));
                setCurrentPage(0);
                refetchUsers();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const isEditing = location.pathname.startsWith('/dashboard/consultants/update');
    const isAdding = location.pathname.startsWith('/dashboard/consultants/add');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        if (value.length > 3) {
            setSearch(value);
        } else {
            setSearch('');
        }
    };

    const handleSearch = () => {
        setSearch(searchInput);
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
                            <LinkContainer to="/dashboard/consultants/add"
                                style={{
                                    fontSize: "2.5rem",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                    float: "right",
                                }}
                            >
                                <HiUserAdd />
                            </LinkContainer>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h1>Consultants</h1>
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
                                <Table striped bordered hover className="mt-3 table">
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
                                        {consultants?.length > 0 ? (
                                            consultants.map((consultant, index) => (
                                                <tr key={consultant._id}>
                                                    <td>{index + 1 + currentPage * limit}</td>
                                                    <td>{consultant.username}</td>
                                                    <td>{consultant.branch_id?.name || "N/A"}</td>
                                                    <td>{consultant.role}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <LinkContainer to={`/dashboard/consultants/update/${consultant._id}`} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'black', marginLeft: '10px' }}>
                                                            <BiSolidEdit />
                                                        </LinkContainer>
                                                        <MdOutlineDeleteOutline
                                                            style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                                                            onClick={() => handleDeleteConsultant(consultant._id)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">No consultants found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            <ReactPaginate
                                breakLabel=""
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={0}
                                marginPagesDisplayed={0}
                                pageCount={pageCount}
                                previousLabel="< previous"
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
            <Outlet context={{ refetchUsers }} />
        </>
    );
}

export default ConsultantScreen;
