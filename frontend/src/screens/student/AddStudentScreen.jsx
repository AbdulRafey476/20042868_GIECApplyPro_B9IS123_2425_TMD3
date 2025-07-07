import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAddStudentMutation } from "../../slices/studentApiSlice";
import { useGetConsultantsByBranchQuery } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useSpecificUserQuery } from "../../slices/usersApiSlice";
import { useOutletContext } from "react-router-dom";

function AddStudentScreen() {
    const { refetchStudents } = useOutletContext();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [last_qualification, setLast_qualification] = useState("");
    const [otherQualification, setOtherQualification] = useState("");
    const [gpa, setGPA] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [englishTest, setEnglishTest] = useState("");
    const [source, setSource] = useState("");
    const [country_interested_in, setCountry_interested_in] = useState("");
    const [branch, setBranch] = useState({ id: "", name: "" });
    const [consultant_id, setConsultantId] = useState("");
    const navigate = useNavigate();
    const [addStudent, { isLoading }] = useAddStudentMutation();
    const { data: user } = useSpecificUserQuery();
    const { data: consultants = [] } = useGetConsultantsByBranchQuery(branch.id);

    useEffect(() => {
        if (user) {
            setBranch({
                id: user.profile.branch_id._id,
                name: user.profile.branch_id.name,
            });
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await addStudent({
                name,
                email,
                last_qualification: last_qualification === "other" ? otherQualification : last_qualification ? last_qualification : "None",
                gpa: gpa || "None",
                englishTest: englishTest || "None",
                phone: phone || 0,
                city,
                source,
                country_interested_in,
                branch_id: branch.id,
                consultant_id
            }).unwrap();
            refetchStudents();
            navigate("/dashboard/cases");
            toast.success("Case added successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Form onSubmit={submitHandler}>
            <h1>Create Student</h1>
            <Form.Group className="my-2" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="my-2" controlId="last_qualification">
                <Form.Label>Last Qualification</Form.Label>
                <Form.Select
                    value={last_qualification}
                    onChange={(e) => {
                        setLast_qualification(e.target.value);
                        if (e.target.value !== "other") {
                            setOtherQualification("");
                        }
                    }}
                >
                    <option value="">Select Qualification</option>
                    <option value="MBBS">MBBS</option>
                    <option value="BBA">BBA</option>
                    <option value="HSC">HSC</option>
                    <option value="SSC">SSC</option>
                    <option value="MBA">MBA</option>
                    <option value="BA">BA</option>
                    <option value="BSC">BSC</option>
                    <option value="Com">B.Com</option>
                    <option value="BIT">BIT</option>
                    <option value="LLB">LLB</option>
                    <option value="MSC">MSC</option>
                    <option value="MA">MA</option>
                    <option value="B.Ed">B.Ed</option>
                    <option value="Pharm.D">Pharm.D</option>
                    <option value="B.Arch">B.Arch</option>
                    <option value="other">Others</option>
                </Form.Select>
                {last_qualification === "other" && (
                    <Form.Control
                        type="text"
                        placeholder="Please specify"
                        value={otherQualification}
                        onChange={(e) => setOtherQualification(e.target.value)}
                        className="mt-2"
                    />
                )}
            </Form.Group>

            <Form.Group className="my-2" controlId="gpa">
                <Form.Label>GPA</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter GPA"
                    value={gpa}
                    onChange={(e) => setGPA(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="my-2" controlId="englishTest">
                <Form.Label>English Test</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter English Score"
                    value={englishTest}
                    onChange={(e) => setEnglishTest(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="branchPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="my-2" controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                >
                    <option value="">Select City</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Multan">Multan</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Bahawalpur">Bahawalpur</option>
                    <option value="Larkana">Larkana</option>
                    <option value="Mardan">Mardan</option>
                    <option value="Sukkur">Sukkur</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="my-2" controlId="source">
                <Form.Label>Source</Form.Label>
                <Form.Select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                >
                    <option value="">Select Source</option>
                    <option value="Walk In">Walk In</option>
                    <option value="Reference">Reference</option>
                    <option value="Whatsapp">WhatsApp</option>
                    <option value="Call">Call</option>
                    <option value="Social Media">Social Media</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="my-2" controlId="countryInterestedIn">
                <Form.Label>Country Interested In</Form.Label>
                <Form.Select
                    value={country_interested_in}
                    onChange={(e) => setCountry_interested_in(e.target.value)}
                    required
                >
                    <option value="">Select Country</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Australia">Australia</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Canada">Canada</option>
                    <option value="Spain">Spain</option>
                    <option value="France">France</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="consultant">
                <Form.Label>Select Consultant</Form.Label>
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

            <Button type="submit" variant="primary" className="my-2">
                Submit
            </Button>
        </Form>
    );
}

export default AddStudentScreen;
