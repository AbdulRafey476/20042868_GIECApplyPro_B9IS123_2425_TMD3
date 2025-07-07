/* eslint-disable react/prop-types */
import { Modal, Button } from 'react-bootstrap';

const StudentInfoModal = ({ isOpen, onRequestClose, selectedStudent }) => {

    return (
        <Modal
            show={isOpen}
            onHide={onRequestClose}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>{selectedStudent?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Details</h5>
                <p>
                    <strong>Last Qualification:</strong>{" "}
                    {selectedStudent?.last_qualification || "N/A"}
                </p>
                <p>
                    <strong>English Test:</strong>{" "}
                    {selectedStudent?.englishTest || "N/A"}
                </p>
                <p>
                    <strong>GPA:</strong> {selectedStudent?.gpa || "N/A"}
                </p>
                <p>
                    <strong>City:</strong> {selectedStudent?.city || "N/A"}
                </p>
                <p>
                    <strong>Country Interested:</strong>{" "}
                    {selectedStudent?.country_interested_in || "N/A"}
                </p>
                <p>
                    <strong>Source:</strong> {selectedStudent?.source || "N/A"}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onRequestClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StudentInfoModal;
