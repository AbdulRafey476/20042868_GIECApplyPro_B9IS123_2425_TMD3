import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import {
  Badge,
  Dropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { MdOutlineDeleteOutline, MdOutlineCurrencyExchange } from "react-icons/md";
import { FaArrowRight, FaArrowLeft, FaUserEdit } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { BiSolidEdit } from "react-icons/bi";
import { IoMdAddCircleOutline, IoIosCheckbox } from "react-icons/io";
import { CgArrowsExchange } from "react-icons/cg";
import Loader from "../../components/Loader";
import {
  useAllStudentsQuery,
  useDeleteStudentMutation,
} from "../../slices/studentApiSlice";
import {
  useAllStatusesQuery,
  useAddStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
} from "../../slices/statusApiSlice";
import { useSpecificUserQuery } from "../../slices/usersApiSlice";
import { useAllPaymentsQuery } from "../../slices/paymentApiSlice";
import { useAllEarningsQuery, useDeleteEarningsMutation } from "../../slices/earningApiSlice.js";
import { useAllBranchesQuery } from "../../slices/branchApiSlice.js";
import ReactPaginate from "react-paginate";
import { Outlet, useLocation } from "react-router-dom";
import AddEarningsModal from "../Earnings/AddEarningsModal.jsx";
import UpdateEarningsModal from "../Earnings/UpdateEarningsModal.jsx";
import formatDate from "../../formatDate.js";
import UpdateStudentScreen from "./UpdateStudentScreen.jsx";
import { useConvertAmountQuery } from "../../slices/currencyExchangeSlice.js";
import Spinner from 'react-bootstrap/Spinner';
import Filters from "../../components/Filters.jsx";
import StudentInfoModal from "./StudentInfoModal.jsx";
import StatusEditModal from "../status/StatusEditModal.jsx";

function StudentScreen() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAddEarningsModal, setShowAddEarningsModal] = useState(false);
  const [showUpdateEarningsModal, setShowUpdateEarningsModal] = useState(false);
  const [showStudentEditModal, setShowStudentEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentStudentDetails, setCurrentStudentDetails] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [loadingConversions, setLoadingConversions] = useState({});
  const [currencies] = useState(["USD", "EUR", "AUD"]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [targetCurrency,] = useState("PKR");

  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const location = useLocation();

  const { data: user } = useSpecificUserQuery();
  const { data: students, refetch: refetchStudents } = useAllStudentsQuery({
    page: page + 1,
    limit,
    search,
    branch_id: selectedBranch,
    status: selectedStatus,
  });
  const {
    data: payments,
    error,
    isLoading,
    refetch: refetchPayments
  } = useAllPaymentsQuery({ page: page + 1, limit, search });
  const { data: earnings, refetch: refetchEarnings } = useAllEarningsQuery({
    page: page + 1,
    limit,
    search,
    studentIds: students && students.students ? students.students.map(student => student._id) : [],
  },
    { skip: user?.profile?.role !== "admin" });
  const { data: branchData } = useAllBranchesQuery({
    page: page + 1,
    limit: 10,
  });
  const { refetch: refetchConversion } = useConvertAmountQuery({ currency, targetCurrency, amount },
    { skip: user?.profile?.role !== "admin" });
  const { data: statuses, refetch } = useAllStatusesQuery();
  const [deleteStudent] = useDeleteStudentMutation();
  const [deleteEarnings] = useDeleteEarningsMutation();

  const isAdmin = user?.profile?.isAdmin;

  useEffect(() => {
    refetch();
    refetchStudents();
    if (isAdmin) {
      refetchEarnings();
    }
  }, [refetch, refetchStudents, isAdmin, page, refetchEarnings, selectedStatus, selectedBranch]);

  useEffect(() => {
    if (students?.students && students.students.length > 0) {
      const studentIds = students.students.map(student => student._id);

      if (isAdmin) {
        refetchEarnings({
          studentIds,
          branch_id: selectedBranch || "",
          limit: limit,
          page: page + 1,
        });
      }
    }
  }, [students, isAdmin, page, limit, selectedBranch, refetchEarnings]);


  const [statusDetails, setStatusDetails] = useState({
    studentId: "",
    comments: "",
    status: "Query Received",
    processedOn: "",
    admissionReceivedOn: "",
    visaFiledOn: "",
    visaDecisionOn: "",
    internationalContactNumber: "",
  });

  const [editingStatusId, setEditingStatusId] = useState(null);

  const [addStatus] = useAddStatusMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteStatus] = useDeleteStatusMutation();

  const handleShowStudentModal = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  const handleShowStatusModal = (student) => {
    const studentStatus = statuses.find(
      (status) => status.studentId?._id === student._id
    );

    if (studentStatus) {
      setEditingStatusId(studentStatus._id);
      setStatusDetails({
        studentId: student._id,
        comments: studentStatus.comments,
        status: studentStatus.status,
        processedOn: studentStatus.processedOn
          ? new Date(studentStatus.processedOn).toISOString().split("T")[0]
          : "",
        admissionReceivedOn: studentStatus.admissionReceivedOn
          ? new Date(studentStatus.admissionReceivedOn)
            .toISOString()
            .split("T")[0]
          : "",
        visaFiledOn: studentStatus.visaFiledOn
          ? new Date(studentStatus.visaFiledOn).toISOString().split("T")[0]
          : "",
        visaDecisionOn: studentStatus.visaDecisionOn
          ? new Date(studentStatus.visaDecisionOn).toISOString().split("T")[0]
          : "",
        internationalContactNumber: studentStatus.internationalContactNumber,
      });
    } else {
      setEditingStatusId(null);
      setStatusDetails({
        studentId: student._id,
        comments: "",
        status: "Query Received",
        processedOn: "",
        admissionReceivedOn: "",
        visaFiledOn: "",
        visaDecisionOn: "",
        internationalContactNumber: "",
      });
    }

    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setEditingStatusId(null);
    setStatusDetails({
      studentId: "",
      comments: "",
      status: "Query Received",
      processedOn: "",
      admissionReceivedOn: "",
      visaFiledOn: "",
      visaDecisionOn: "",
      internationalContactNumber: "",
    });
  };

  const handleDeleteStudent = async (id) => {
    if (isAdmin) {
      if (window.confirm("Are you sure you want to delete this Student?")) {
        try {
          await deleteStudent(id).unwrap();
          await deleteEarnings(id).unwrap();
          toast.success("Student deleted successfully");
          refetchStudents();
        } catch (err) {
          toast.error(err?.data?.message || "An error occurred");
        }
      }
    } else {
      toast.error("Access Denied: only admin can delete students");
    }
  };

  useEffect(() => {
    if (students?.pageCount) {
      setPageCount(students.pageCount);
    } else if (payments?.pageCount) {
      setPageCount(payments.pageCount);
    } else if (earnings?.pageCount) {
      setPageCount(earnings.pageCount)
    }
  }, [students, payments, earnings]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStatusId) {
        await updateStatus({ id: editingStatusId, ...statusDetails }).unwrap();
        toast.success("Status updated successfully");
        refetchStudents();
      } else {
        await addStatus(statusDetails).unwrap();
        toast.success("Status added successfully");
      }

      handleCloseStatusModal();
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  const handleStatusDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      try {
        await deleteStatus(id).unwrap();
        toast.success("Status deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "An error occurred");
      }
    }
  };

  const handlePageClick = (e) => {
    setPage(e.selected);
    refetchStudents();
    refetchEarnings();
  };

  const handleAddEarningsModal = (student) => {
    setCurrentStudent(student);
    setShowAddEarningsModal(true);
  };

  const closeAddEarningsModal = () => {
    setShowAddEarningsModal(false);
  };

  const handleUpdateEarningsModal = (studentEarnings) => {
    setCurrentStudent(studentEarnings);
    setShowUpdateEarningsModal(true);
  };

  const closeUpdateEarningsModal = () => {
    setShowUpdateEarningsModal(false);
  };

  const handleUpdateStudentDetails = (studentDetails) => {
    setCurrentStudentDetails(studentDetails);
    setShowStudentEditModal(true);
  };

  const closeStudentEditModal = () => {
    setShowStudentEditModal(false);
  };

  const handleCurrencySelect = (studentId, key) => {
    const studentEarnings = earnings?.earnings?.find(
      (earning) => earning.studentId?._id === studentId
    );

    if (studentEarnings) {
      const amountToConvert = studentEarnings.splitAmount;

      setCurrency(key);
      setAmount(amountToConvert);

      setLoadingConversions((prev) => ({ ...prev, [studentId]: true }));

      setTimeout(() => {
        refetchConversion({ targetCurrency: key, amount: amountToConvert })
          .then((res) => {
            const convertedAmount = res?.data?.conversion_result || "N/A";

            setConvertedAmounts((prev) => ({
              ...prev,
              [studentId]: {
                amount: Math.round(convertedAmount) || "N/A",
                currency: key,
              },
            }));

            setLoadingConversions((prev) => ({ ...prev, [studentId]: false }));
          })
          .catch((err) => {
            console.error("Conversion Error:", err);
            setConvertedAmounts((prev) => ({
              ...prev,
              [studentId]: {
                amount: "N/A",
                currency: key,
              },
            }));

            setLoadingConversions((prev) => ({ ...prev, [studentId]: false }));
          });
      }, 0);
    } else {
      console.warn(`No earnings found for student ID: ${studentId}`);
    }
  };



  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {location.pathname === "/dashboard/cases/add" ? (
        <Outlet context={{ refetchStudents }} />
      ) : (
        <>
          {!isAdmin && (
            <LinkContainer
              to="/dashboard/cases/add"
              className="addUser-icon"
            >
              <HiUserAdd />
            </LinkContainer>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Filters setPage={setPage} selectedStatus={selectedStatus} selectedBranch={selectedBranch} setSelectedStatus={setSelectedStatus} setSelectedBranch={setSelectedBranch} branchData={branchData} filterOptions={statuses} setSearch={setSearch} setSearchInput={setSearchInput} refetchStudents={refetchStudents} refetchPayments={refetchPayments} refetchEarnings={refetchEarnings} searchInput={searchInput} isAdmin={isAdmin} />
          </div>

          <div className="table-container">
            <Table striped bordered hover className="mt-3 table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Student Name</th>
                  {isAdmin && <th>Branch</th>}
                  <th>Consultant</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Comments</th>
                  <th>Processed On</th>
                  <th>Admission Received On</th>
                  <th>Deposit</th>
                  <th>Payment</th>
                  <th>Visa Filed On</th>
                  <th>Visa Decision On</th>
                  <th>Status </th>
                  <th>International Contact Number</th>
                  {isAdmin && (
                    <>
                      <th>Fee Paid $</th>
                      <th>Commission %</th>
                      <th>Commission Amount $</th>
                      <th>Split %</th>
                      <th>Split Amount $</th>
                      <th>Due Date</th>
                      <th>Invoice Filed</th>
                      <th>Invoice Received On</th>
                    </>
                  )}
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students?.students?.length > 0 ? (
                  students?.students?.map((student, index) => {
                    const studentStatus = statuses?.find(
                      (status) => status.studentId?._id === student._id
                    );
                    const studentPayment = payments.payments.find(
                      (payment) => payment.studentId?._id === student._id
                    );
                    const studentEarnings = earnings?.earnings?.find(
                      (earning) => earning.studentId?._id === student._id
                    );

                    return (
                      <tr
                        key={student._id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleShowStudentModal(student)}
                      >
                        <td>{index + 1 + page * limit}</td>
                        <td>
                          {student.createdAt
                            ? formatDate(student.createdAt)
                            : "N/A"}
                        </td>
                        <td>{student.name}</td>
                        {isAdmin && <td>{student.branch_id?.name || "N/A"}</td>}
                        <td>{student.consultant_id?.username || "N/A"}</td>
                        <td>{student.email || "N/A"}</td>
                        <td>
                          {student.phone ? `(+92) ${student.phone}` : "N/A"}
                        </td>
                        <td>
                          {studentStatus?.comments
                            ? studentStatus.comments
                            : "N/A"}
                        </td>
                        <td>
                          {studentStatus?.processedOn
                            ? formatDate(studentStatus.processedOn)
                            : "N/A"}
                        </td>
                        <td>
                          {studentStatus?.admissionReceivedOn
                            ? formatDate(studentStatus.admissionReceivedOn)
                            : "N/A"}
                        </td>
                        <td>
                          {studentPayment?.paidOn
                            ? formatDate(studentPayment?.paidOn)
                            : "N/A"}
                        </td>
                        <td>{studentPayment?.comments}</td>
                        <td>
                          {studentStatus?.visaFiledOn
                            ? formatDate(studentStatus.visaFiledOn)
                            : "N/A"}
                        </td>
                        <td>
                          {studentStatus?.visaDecisionOn
                            ? formatDate(studentStatus.visaDecisionOn)
                            : "N/A"}
                        </td>
                        <td>
                          <Badge
                            bg={
                              studentStatus?.status === "Visa Approved"
                                ? "success"
                                : studentStatus?.status === "Visa Rejected"
                                  ? "danger"
                                  : studentStatus?.status === "Processing"
                                    ? "info"
                                    : studentStatus?.status ===
                                      "Application Submitted"
                                      ? "primary"
                                      : studentStatus?.status === "Visa Filed"
                                        ? "secondary"
                                        : "warning"
                            }
                          >
                            {studentStatus?.status || "Query Received"}
                          </Badge>
                        </td>

                        <td>
                          {studentStatus?.internationalContactNumber || "N/A"}
                        </td>
                        {isAdmin && (
                          <>
                            <td>{studentEarnings?.feePaid.toLocaleString('en-US')}</td>
                            <td>{studentEarnings?.commissionPercentage ? `${studentEarnings.commissionPercentage}%` : "N/A"}</td>
                            <td>{studentEarnings?.commissionAmount.toLocaleString('en-US') || "N/A"}</td>
                            <td>{studentEarnings?.splitPercentage ? `${studentEarnings.splitPercentage}%` : "N/A"}</td>
                            <td>
                              {loadingConversions[studentEarnings?.studentId?._id]
                                ? <Spinner
                                  animation="border"
                                  variant="success"
                                  role="status"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    margin: "auto",
                                  }}
                                ></Spinner>
                                : (convertedAmounts[studentEarnings?.studentId?._id]?.amount.toLocaleString('en-US')
                                  ? `${convertedAmounts[studentEarnings?.studentId?._id].amount.toLocaleString('en-US')} ${targetCurrency === 'PKR' && 'Rs'}`
                                  : studentEarnings?.splitAmount.toLocaleString('en-US'))}
                            </td>
                            <td>
                              {studentEarnings?.dueDate
                                ? formatDate(studentEarnings.dueDate)
                                : "N/A"}
                            </td>
                            <td>
                              {studentEarnings?.invoiceFiledOn
                                ? formatDate(studentEarnings.invoiceFiledOn)
                                : "N/A"}
                            </td>
                            <td>
                              {studentEarnings?.invoiceReceivedOn
                                ? formatDate(studentEarnings.invoiceReceivedOn)
                                : "N/A"}
                            </td>
                          </>
                        )}
                        <td className="d-flex justify-content-around align-items-center gap-2">
                          {isAdmin ? (
                            <>
                              <IoMdAddCircleOutline
                                style={{
                                  visibility: studentEarnings ? "hidden" : "visible",
                                }}
                                className="student-icon"
                                onClick={(e) => {
                                  if (!studentEarnings) {
                                    e.stopPropagation();
                                    handleAddEarningsModal(student);
                                  }
                                }}
                                title="Add Earnings"
                              />
                              <Dropdown onClick={(e) => e.stopPropagation()}>
                                <Dropdown.Toggle
                                  as="span"
                                  className="no-arrow cursor-pointer"
                                >
                                  <MdOutlineCurrencyExchange size={20} title="Select currency" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  {currencies.map((value, index) => (
                                    <Dropdown.Item key={index} eventKey={value} onClick={() => handleCurrencySelect(studentEarnings?.studentId?._id, value)}>
                                      {value} <CgArrowsExchange size={20} /> PKR
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                              <BiSolidEdit
                                className="student-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateEarningsModal(studentEarnings);
                                }}
                                title="Edit Earnings"
                              />
                              <MdOutlineDeleteOutline
                                className="student-icon"
                                style={{
                                  color: "red",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStudent(student._id);
                                }}
                                title="Delete Student"
                              />
                            </>
                          ) : (
                            <>
                              <FaUserEdit
                                title="Edit Student Details"
                                className="student-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStudentDetails(student);
                                }}
                              />
                              <IoIosCheckbox
                                style={{
                                  color: "#28a745",
                                }}
                                className="student-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowStatusModal(student);
                                }}
                                title="Edit Status"
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No students found.
                    </td>
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

          {/* Earning Adding Modal  */}

          <AddEarningsModal
            isOpen={showAddEarningsModal}
            onRequestClose={closeAddEarningsModal}
            student={currentStudent}
            refetch={refetchEarnings}
          />

          {/* Earning Edit Modal */}

          <UpdateEarningsModal
            isOpen={showUpdateEarningsModal}
            onRequestClose={closeUpdateEarningsModal}
            earnings={currentStudent}
            refetch={refetchEarnings}
          />

          {/* Student Info Modal */}

          <StudentInfoModal
            isOpen={showStudentModal}
            onRequestClose={handleCloseStudentModal}
            selectedStudent={selectedStudent}
          />

          {/* Student Edit Modal */}

          <UpdateStudentScreen
            isOpen={showStudentEditModal}
            onRequestClose={closeStudentEditModal}
            student={currentStudentDetails}
            refetch={refetchStudents}
          />

          {/* Status Edit Modal */}

          <StatusEditModal
            isOpen={showStatusModal}
            onRequestClose={handleCloseStatusModal}
            editingStatusId={editingStatusId}
            handleStatusSubmit={handleStatusSubmit}
            setStatusDetails={setStatusDetails}
            statusDetails={statusDetails}
            students={students}
            handleStatusDelete={handleStatusDelete}
          />
        </>
      )
      }
    </>
  );
}

export default StudentScreen;
