/* eslint-disable react/prop-types */
import { Form, Modal, Button } from 'react-bootstrap';

const StatusEditModal = ({ isOpen, onRequestClose, editingStatusId, handleStatusSubmit, setStatusDetails, statusDetails, students, handleStatusDelete }) => {
    return (
        <Modal show={isOpen} onHide={onRequestClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingStatusId ? "Edit Status" : "Add Status"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleStatusSubmit}>
                    <Form.Group controlId="studentId">
                        <Form.Label>Student</Form.Label>
                        <Form.Control
                            as="select"
                            value={statusDetails.studentId}
                            onChange={(e) =>
                                setStatusDetails({
                                    ...statusDetails,
                                    studentId: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Student</option>
                            {students?.students?.length > 0 &&
                                students?.students?.map((student) => (
                                    <option key={student._id} value={student._id}>
                                        {student.name}
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="comments">
                        <Form.Label>Comments</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={statusDetails.comments}
                            onChange={(e) =>
                                setStatusDetails({
                                    ...statusDetails,
                                    comments: e.target.value,
                                })
                            }
                        />
                    </Form.Group>

                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            value={statusDetails.status}
                            onChange={(e) =>
                                setStatusDetails({
                                    ...statusDetails,
                                    status: e.target.value,
                                })
                            }
                        >
                            <option>Query Received</option>
                            <option>Processing</option>
                            <option>Application Submitted</option>
                            <option>Visa Filed</option>
                            <option>Visa Approved</option>
                            <option>Visa Rejected</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="processedOn">
                        <Form.Label>Processed On</Form.Label>
                        <Form.Control
                            type="date"
                            value={statusDetails.processedOn}
                            onChange={(e) =>
                                setStatusDetails({
                                    ...statusDetails,
                                    processedOn: e.target.value,
                                })
                            }
                        />
                    </Form.Group>

                    <Form.Group controlId="admissionReceivedOn">
                        <Form.Label>Admission Received On</Form.Label>
                        <Form.Control
                            type="date"
                            value={statusDetails.admissionReceivedOn}
                            onChange={(e) =>
                                setStatusDetails({
                                    ...statusDetails,
                                    admissionReceivedOn: e.target.value,
                                })
                            }
                        />
                    </Form.Group>

                    <Form.Group controlId="visaFiledOn">
                        <Form.Label>Visa Filed On</Form.Label>
                        <Form.Control
                            type="date"
                            value={statusDetails.visaFiledOn}
                            onChange={(e) =>
                                setStatusDetails({
                                    ...statusDetails,
                                    visaFiledOn: e.target.value,
                                })
                            }
                        />
                    </Form.Group>

                    <Form.Group controlId="visaDecisionOn">
                        <Form.Label>Visa Decision On</Form.Label>
                        <Form.Control
                            type="date"
                            value={statusDetails.visaDecisionOn}
                            onChange={(e) =>
                                setStatusDetails({
                                    ...statusDetails,
                                    visaDecisionOn: e.target.value,
                                })
                            }
                        />
                    </Form.Group>

                    {statusDetails.status === "Visa Approved" && (
                        <Form.Group controlId="internationalContactNumber">
                            <Form.Label>International Contact Number</Form.Label>
                            <div className="d-flex">
                                <Form.Select
                                    className="me-2"
                                    style={{ width: "auto" }}
                                    value={statusDetails.countryCode}
                                    onChange={(e) =>
                                        setStatusDetails({
                                            ...statusDetails,
                                            countryCode: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select Country</option>
                                    <option value="+61">Australia (+61)</option>
                                    <option value="+353">Ireland (+353)</option>
                                    <option value="+1">Canada (+1)</option>
                                    <option value="+64">New Zealand (+64)</option>
                                    <option value="+1">USA (+1)</option>
                                    <option value="+44">UK (+44)</option>
                                </Form.Select>
                                <Form.Control
                                    type="text"
                                    placeholder="Student International Number"
                                    value={statusDetails.internationalContactNumber}
                                    onChange={(e) =>
                                        setStatusDetails({
                                            ...statusDetails,
                                            internationalContactNumber: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </Form.Group>
                    )}

                    <Button variant="primary" type="submit">
                        {editingStatusId ? "Update Status" : "Add Status"}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onRequestClose}>
                    Close
                </Button>
                {editingStatusId && (
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleStatusDelete(editingStatusId)
                            onRequestClose()
                        }}
                    >
                        Delete Status
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default StatusEditModal;