import { useState, useEffect } from "react";
import { Table, Badge } from "react-bootstrap";
import { useAllPaymentsQuery } from "../slices/paymentApiSlice.js";
import { useSpecificUserQuery } from "../slices/usersApiSlice";
import { useAllBranchesQuery } from "../slices/branchApiSlice.js";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../components/Loader";
import ReactPaginate from 'react-paginate';
import formatDate from "../formatDate.js";
import Filters from "../components/Filters.jsx";

function Transactions() {
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: user } = useSpecificUserQuery();
  const { data: payments, isLoading: paymentsLoading, error: paymentsError, refetch } = useAllPaymentsQuery({ page: page + 1, limit, search, branch_id: selectedBranch, status: selectedStatus });
  const { data: branchData } = useAllBranchesQuery({ page: page + 1, limit: 10 });

  const isAdmin = user?.profile?.isAdmin;

  useEffect(() => {
    if (payments?.pageCount) {
      setPageCount(payments.pageCount);
    }
    refetch();
  }, [payments, search, selectedBranch, selectedStatus, refetch, page]);

  if (paymentsLoading) {
    return <Loader />;
  }

  if (paymentsError) {
    return <p>An error occurred while loading data</p>;
  }

  const handlePageClick = (e) => {
    setPage(e.selected);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Filters setPage={setPage} selectedStatus={selectedStatus} selectedBranch={selectedBranch} setSelectedStatus={setSelectedStatus} setSelectedBranch={setSelectedBranch} branchData={branchData} filterOptions={payments?.payments} setSearch={setSearch} setSearchInput={setSearchInput} refetch={refetch} searchInput={searchInput} isAdmin={isAdmin} />
      </div>
      <div className="table-container">
        <Table striped bordered hover className="mt-3 table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Consultant</th>
              <th>Branch</th>
              <th>Comment</th>
              <th>Amount</th>
              <th>Paid On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments?.payments?.length > 0 ? (
              payments?.payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1 + page * limit}</td>
                  <td>{payment.studentId?.name || "N/A"}</td>
                  <td>{payment.studentId?.consultant_id?.username || "N/A"}</td>
                  <td>{payment.studentId?.branch_id?.name || "N/A"}</td>
                  <td>{payment.comments}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.paidOn ? formatDate(payment.paidOn) : "N/A"}</td>
                  <td>
                    <Badge bg={payment.status === 'Completed' ? 'success' : 'warning'}>
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No payments found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        breakLabel=""
        nextLabel={<> next <FaArrowRight /></>}
        previousLabel={<><FaArrowLeft /> previous</>}
        onPageChange={handlePageClick}
        pageRangeDisplayed={0}
        marginPagesDisplayed={0}
        pageCount={pageCount}
        forcePage={page}
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
  );
}

export default Transactions;
