import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAddUserMutation, useSpecificUserQuery } from "../../slices/usersApiSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

function AddUserScreen() {
    const { refetchUsers } = useOutletContext();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [branch, setBranch] = useState({ id: "", name: "" });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();

    const [addUser, { isLoading }] = useAddUserMutation();
    const { data: user } = useSpecificUserQuery();

    useEffect(() => {
        if (user && user.profile && user.profile.branch_id) {
            setBranch({
                id: user.profile.branch_id._id,
                name: user.profile.branch_id.name,
            });
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await addUser({ username, email, password, role: "consultant", branch_id: branch.id }).unwrap();
            navigate("/dashboard/consultants");
            refetchUsers();
            toast.success("Consultant added successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <h1>Create Consultant</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <div style={{ position: "relative" }}>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant="light"
                            onClick={togglePasswordVisibility}
                            style={{
                                position: "absolute",
                                right: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                padding: 0,
                                border: "none",
                                background: "none",
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </div>
                </Form.Group>

                <Form.Group className="my-2" controlId="branchID">
                    <Form.Label>Branch</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        value={branch.name}
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">
                    Create Consultant
                </Button>
            </Form>
        </>
    );
}

export default AddUserScreen;
