/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAddEarningsMutation } from '../../slices/earningApiSlice.js';
import { toast } from "react-toastify";

const AddEarningsModal = ({ isOpen, onRequestClose, student, refetch }) => {
    const [feePaid, setFeePaid] = useState('');
    const [commissionPercentage, setCommissionPercentage] = useState('');
    const [commissionAmount, setCommissionAmount] = useState('');
    const [splitPercentage, setSplitPercentage] = useState('');
    const [splitAmount, setSplitAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [invoiceFiledOn, setInvoiceFiledOn] = useState('');
    const [invoiceReceivedOn, setInvoiceReceivedOn] = useState('');
    const [comments, setComments] = useState('');
    const [addEarnings] = useAddEarningsMutation();

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setFeePaid('');
        setCommissionPercentage('');
        setCommissionAmount('');
        setSplitPercentage('');
        setSplitAmount('');
        setDueDate('');
        setInvoiceFiledOn('');
        setInvoiceReceivedOn('');
        setComments('');
    };

    const handleAddEarnings = async (e) => {
        e.preventDefault();

        const newEarnings = {
            studentId: student._id,
            feePaid: parseFloat(feePaid),
            commissionPercentage: parseFloat(commissionPercentage),
            commissionAmount: parseFloat(commissionAmount),
            splitPercentage: parseInt(splitPercentage),
            splitAmount: parseInt(splitAmount),
            dueDate: new Date(dueDate),
            invoiceFiledOn: new Date(invoiceFiledOn),
            invoiceReceivedOn: new Date(invoiceReceivedOn),
            comments,
        };

        try {
            await addEarnings(newEarnings).unwrap();
            refetch();
            toast.success("Earning added successfully");
            onRequestClose();
        } catch (err) {
            toast.error(err?.data?.message || "An error occurred");
            console.error('Failed to add earnings: ', err);
        }
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Earnings for {student?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleAddEarnings}>
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
                    <Form.Group controlId="commissionPercentage">
                        <Form.Label>Commission Percentage</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter commission % amount"
                            value={commissionPercentage}
                            onChange={(e) => setCommissionPercentage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="splitPercentage">
                        <Form.Label>Split Percentage</Form.Label>
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
                            Add Earnings
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddEarningsModal;
