/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUpdateEarningsMutation } from '../../slices/earningApiSlice.js';
import { toast } from "react-toastify";

const UpdateEarningsModal = ({ isOpen, onRequestClose, earnings, refetch }) => {
    const [feePaid, setFeePaid] = useState('');
    const [splitPercentage, setSplitPercentage] = useState('');
    const [commissionPercentage, setCommissionPercentage] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [invoiceFiledOn, setInvoiceFiledOn] = useState('');
    const [invoiceReceivedOn, setInvoiceReceivedOn] = useState('');
    const [comments, setComments] = useState('');
    const [updateEarnings] = useUpdateEarningsMutation();

    useEffect(() => {
        if (earnings) {
            setFeePaid(earnings.feePaid || '');
            setSplitPercentage(earnings.splitPercentage || '');
            setCommissionPercentage(earnings.commissionPercentage || '');
            setDueDate(earnings.dueDate ? earnings.dueDate.split('T')[0] : '');
            setInvoiceFiledOn(earnings.invoiceFiledOn ? earnings.invoiceFiledOn.split('T')[0] : '');
            setInvoiceReceivedOn(earnings.invoiceReceivedOn ? earnings.invoiceReceivedOn.split('T')[0] : '');
            setComments(earnings.comments || '');
        }
    }, [earnings, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setFeePaid('');
        setCommissionPercentage('');
        setSplitPercentage('');
        setDueDate('');
        setInvoiceFiledOn('');
        setInvoiceReceivedOn('');
        setComments('');
    };

    const handleUpdateEarnings = async (e) => {
        e.preventDefault();

        const updatedEarnings = {
            feePaid: Math.round(parseFloat(feePaid)),
            commissionPercentage: parseFloat(commissionPercentage),
            splitPercentage: parseInt(splitPercentage),
            dueDate: new Date(dueDate),
            invoiceFiledOn: new Date(invoiceFiledOn),
            invoiceReceivedOn: new Date(invoiceReceivedOn),
            comments,
        };

        try {
            await updateEarnings({ id: earnings._id, ...updatedEarnings }).unwrap();
            toast.success("Earning update successfully");
            onRequestClose();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "An error occurred");
        }
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Earnings for {earnings?.studentId?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdateEarnings}>
                    <Form.Group controlId="feePaid">
                        <Form.Label>Fee Paid</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter fee paid"
                            value={feePaid}
                            onChange={(e) => setFeePaid(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="commissionAmount">
                        <Form.Label>Commission Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter commission % amount"
                            value={commissionPercentage}
                            onChange={(e) => setCommissionPercentage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="splitPercentage">
                        <Form.Label>Split Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter split % amount"
                            value={splitPercentage}
                            onChange={(e) => setSplitPercentage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="dueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="invoiceFiledOn">
                        <Form.Label>Invoice Filed On</Form.Label>
                        <Form.Control
                            type="date"
                            value={invoiceFiledOn}
                            onChange={(e) => setInvoiceFiledOn(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="invoiceReceivedOn">
                        <Form.Label>Invoice Received On</Form.Label>
                        <Form.Control
                            type="date"
                            value={invoiceReceivedOn}
                            onChange={(e) => setInvoiceReceivedOn(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="comments">
                        <Form.Label>Comments</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onRequestClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Earnings
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateEarningsModal;
