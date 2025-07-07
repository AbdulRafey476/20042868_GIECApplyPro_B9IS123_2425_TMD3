/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUpdateStudentsMutation } from '../../slices/studentApiSlice.js';
import { useGetConsultantsByBranchQuery } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UpdateStudentScreen = ({ isOpen, onRequestClose, student, refetch }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [last_qualification, setLast_qualification] = useState("");
    const [gpa, setGPA] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [englishTest, setEnglishTest] = useState("");
    const [source, setSource] = useState("");
    const [country_interested_in, setCountry_interested_in] = useState("");
    const [consultant_id, setConsultantId] = useState("");

    const branchId = student?.branch_id?._id;

    const [updateStudents] = useUpdateStudentsMutation();
    const { data: consultants = [] } = useGetConsultantsByBranchQuery(branchId, {
        skip: !branchId,
    });

    useEffect(() => {
        if (student) {
            setName(student.name || '');
            setEmail(student.email || '');
            setLast_qualification(student.last_qualification || '');
            setGPA(student.gpa || '');
            setPhone(student.phone || 0);
            setCity(student.city || '');
            setEnglishTest(student.englishTest || '');
            setSource(student.source || '');
            setCountry_interested_in(student.country_interested_in || '');
            setConsultantId(student.consultant_id?._id || '');
        }
    }, [student, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setName('');
        setEmail('');
        setLast_qualification('');
        setGPA('');
        setPhone('');
        setCity('');
        setEnglishTest('');
        setSource('');
        setCountry_interested_in('');
        setConsultantId('');
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        const updatedStudent = {
            name,
            email,
            last_qualification,
            gpa,
            phone: phone || 0,
            city,
            englishTest,
            source,
            country_interested_in,
            consultant_id
        };

        try {
            await updateStudents({ id: student._id, ...updatedStudent }).unwrap();
            toast.success("Student updated successfully");
            onRequestClose();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "An error occurred");
        }
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Student Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdateStudent}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter student name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter student email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="lastQualification">
                        <Form.Label>Last Qualification</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last qualification"
                            value={last_qualification}
                            onChange={(e) => setLast_qualification(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="gpa">
                        <Form.Label>GPA</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter GPA"
                            value={gpa}
                            onChange={(e) => setGPA(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="phone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="englishTest">
                        <Form.Label>English Test</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter English test score"
                            value={englishTest}
                            onChange={(e) => setEnglishTest(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="source">
                        <Form.Label>Source</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="countryInterestedIn">
                        <Form.Label>Country Interested In</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter country of interest"
                            value={country_interested_in}
                            onChange={(e) => setCountry_interested_in(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="consultant">
                        <Form.Label>Change Consultant</Form.Label>
                        <Form.Control
                            as="select"
                            value={consultant_id}
                            onChange={(e) => setConsultantId(e.target.value)}
                            required
                        >
                            <option value="">Choose...</option>
                            {consultants.map((consultant) => (
                                <option key={consultant._id} value={consultant._id}>
                                    {consultant.username}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onRequestClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Student
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateStudentScreen;
