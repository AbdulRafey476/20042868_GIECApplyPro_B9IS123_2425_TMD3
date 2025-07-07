import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Badge } from "react-bootstrap";
import { useAddPaymentMutation, useAllPaymentsQuery, useUpdatePaymentsMutation, useDeletePaymentsMutation } from "../../slices/paymentApiSlice";
import { useAllStudentsQuery } from "../../slices/studentApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import formatDate from '../../formatDate.js';
import Filters from "../../components/Filters.jsx";

function PaymentScreen() {
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showPaymentsAdded, setShowPaymentsAdded] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        studentId: '',
        amount: '',
        paidOn: '',
        status: 'Pending',
        paymentType: 'Consultancy',
        invoiceNumber: '',
        paymentMethod: 'Bank Transfer',
        comments: '',
    });
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [page, setPage] = useState(0);
    const [limit] = useState(10);
    const [pageCount, setPageCount] = useState(1);

    const { data: payments, isLoading: paymentsLoading, error: paymentsError, refetch } = useAllPaymentsQuery({ page: page + 1, limit, search, status: selectedStatus });
    const { data: allStudents, refetch: refetchStudents } = useAllStudentsQuery({ page: page + 1, showPaymentsAdded: showPaymentsAdded });

    const [addPayment] = useAddPaymentMutation();
    const [updatePayments] = useUpdatePaymentsMutation();
    const [deletePayments] = useDeletePaymentsMutation();

    useEffect(() => {
        if (payments?.pageCount) {
            setPageCount(payments.pageCount);
        } else if (allStudents?.pageCount) {
            setPageCount(allStudents.pageCount);
            setShowPaymentsAdded(true)
        }
        refetch();
    }, [payments, page, refetch, allStudents]);

    const resetPaymentDetails = () => {
        setPaymentDetails({
            studentId: '',
            amount: '',
            paidOn: '',
            status: 'Pending',
            paymentType: 'Consultancy',
            invoiceNumber: '',
            paymentMethod: 'Bank Transfer',
            comments: '',
        });
        setEditingPaymentId(null);
    };

    const handleShowModal = (payment = null) => {
        if (payment) {
            setPaymentDetails({
                studentId: payment.studentId ? payment.studentId._id : '',
                amount: payment.amount,
                paidOn: payment.paidOn ? new Date(payment.paidOn).toISOString().split('T')[0] : '',
                status: payment.status || 'Pending',
                paymentType: payment.paymentType || 'Consultancy',
                invoiceNumber: payment.invoiceNumber || '',
                paymentMethod: payment.paymentMethod || 'Bank Transfer',
                comments: payment.comments || '',
            });
            setEditingPaymentId(payment._id);
        } else {
            resetPaymentDetails();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPaymentId) {
                await updatePayments({ id: editingPaymentId, ...paymentDetails }).unwrap();
                toast.success("Payment updated successfully");
            } else {
                await addPayment(paymentDetails).unwrap();
                toast.success("Payment added successfully");
            }
            refetch();
            handleCloseModal();
        } catch (error) {
            toast.error(error?.data?.message || "An error occurred");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment?")) {
            try {
                await deletePayments(id).unwrap();
                toast.success("Payment deleted successfully");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "An error occurred");
            }
        }
    };

    const filteredStudents = allStudents?.students?.length > 0 && payments?.payments?.length > 0
        ? allStudents.students.filter(student => {
            const hasPayment = payments.payments.some(payment => payment.studentId._id === student._id);
            return !hasPayment;
        })
        : allStudents?.students || [];

    const calculateTotalAmountForStudent = (studentId) => {
        let totalAmount = 0;

        const studentPayments = payments?.payments.filter((p) => p.studentId._id === studentId);

        studentPayments.forEach((p) => {
            totalAmount += p.amount || 0;

            if (p.log && p.log.length > 0) {
                p.log.forEach((log) => {
                    totalAmount += log.amount || 0;
                });
            }
        });

        return totalAmount;
    };
    const handlePageClick = (e) => {
        setPage(e.selected);
        refetchStudents();
    };

    if (paymentsLoading) {
        return <Loader />;
    }

    if (paymentsError) {
        return <p>An error occurred while loading data</p>;
    }

    return (
        <>
            <Row className="mt-3">
                <Col>
                    <MdOutlinePayment
                        onClick={() => handleShowModal()}
                        style={{
                            fontSize: "2.5rem",
                            cursor: "pointer",
                            marginLeft: "10px",
                            float: "right",
                        }}
                    />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Filters setPage={setPage} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} filterOptions={payments?.payments} setSearch={setSearch} setSearchInput={setSearchInput} refetch={refetchStudents} searchInput={searchInput} />
                    </div>
                </Col>
            </Row>

            <div className="table-container">
                <Table striped bordered hover className="mt-3 table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Consultant</th>
                            <th>Comment</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.payments?.length > 0 ? (
                            payments.payments.map((payment, index) => {

                                const totalAmount = calculateTotalAmountForStudent(payment.studentId._id);

                                return (
                                    <tr key={payment._id}>
                                        <td>{index + 1 + page * limit}</td>
                                        <td>{payment.studentId?.name || "N/A"}</td>
                                        <td>{payment.studentId?.consultant_id?.username || "N/A"}</td>
                                        <td>{payment.comments}</td>
                                        <td>{totalAmount}</td>
                                        <td>{payment.paidOn ? formatDate(payment.paidOn) : "N/A"}</td>
                                        <td>
                                            <Badge bg={payment.status === "Completed" ? "success" : "warning"}>
                                                {payment.status}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <BiSolidEdit
                                                style={{ fontSize: "1.5rem", cursor: "pointer", color: "black" }}
                                                onClick={() => handleShowModal(payment)}
                                                title="Edit"
                                            />
                                            <MdOutlineDeleteOutline
                                                style={{ fontSize: "1.5rem", cursor: "pointer", color: "red" }}
                                                onClick={() => handleDelete(payment._id)}
                                                title="Delete"
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center mx-4">No payments found.</td>
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingPaymentId ? "Edit Payment" : "Add Payment"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="studentId">
                            <Form.Label>Student</Form.Label>
                            <Form.Control as="select" style={{
                                overflowY: "scroll",
                                border: "1px solid #ccc",
                            }}
                                value={paymentDetails.studentId} onChange={(e) => setPaymentDetails({ ...paymentDetails, studentId: e.target.value })}>
                                <option value="">Select Student</option>
                                {filteredStudents?.map((student) => (
                                    <option key={student._id} value={student._id}>{student.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="amount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" placeholder="Enter amount" value={paymentDetails.amount} onChange={(e) => setPaymentDetails({ ...paymentDetails, amount: e.target.value })} />
                        </Form.Group>

                        <Form.Group controlId="paidOn">
                            <Form.Label>Payment Date</Form.Label>
                            <Form.Control type="date" value={paymentDetails.paidOn} onChange={(e) => setPaymentDetails({ ...paymentDetails, paidOn: e.target.value })} />
                        </Form.Group>

                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" value={paymentDetails.status} onChange={(e) => setPaymentDetails({ ...paymentDetails, status: e.target.value })}>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="paymentType">
                            <Form.Label>Payment Type</Form.Label>
                            <Form.Control as="select" value={paymentDetails.paymentType} onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentType: e.target.value })}>
                                <option value="Consultancy">Consultancy</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="invoiceNumber">
                            <Form.Label>Invoice Number</Form.Label>
                            <Form.Control type="text" value={paymentDetails.invoiceNumber} onChange={(e) => setPaymentDetails({ ...paymentDetails, invoiceNumber: e.target.value })} />
                        </Form.Group>

                        <Form.Group controlId="paymentMethod">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Control as="select" value={paymentDetails.paymentMethod} onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })}>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cash">Cash</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="comments">
                            <Form.Label>Comments</Form.Label>
                            <Form.Control as="textarea" rows={3} value={paymentDetails.comments} onChange={(e) => setPaymentDetails({ ...paymentDetails, comments: e.target.value })} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            {editingPaymentId ? "Update Payment" : "Add Payment"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PaymentScreen;
