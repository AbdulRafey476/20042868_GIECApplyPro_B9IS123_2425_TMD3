import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAddUserMutation } from "../../slices/usersApiSlice";
import { useAllBranchesQuery } from "../../slices/branchApiSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

function AddUserScreen() {
    const { refetchUsers } = useOutletContext();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [branch_id, setBranchID] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();
    const [addUser, { isLoading }] = useAddUserMutation();

    const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useAllBranchesQuery({ page: 1, limit: 100 });

    const branches = branchesData ? branchesData.branches : [];

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await addUser({ username, email, password, role, branch_id }).unwrap();
            toast.success("User created successfully");
            navigate("/dashboard/users");
            refetchUsers();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <h1>Create User</h1>
            {branchesLoading && <Loader />}
            {branchesError && <div>Error: {branchesError.message}</div>}
            {!branchesLoading && !branchesError && (
                <Form onSubmit={submitHandler}>
                    <Form.Group className="my-2" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="my-2" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
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

                    <Form.Group className="my-2" controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="branch_admin">Branch Admin</option>
                            <option value="consultant">Consultant</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="my-2" controlId="branchID">
                        <Form.Label>Branch</Form.Label>
                        <Form.Select
                            value={branch_id}
                            onChange={(e) => setBranchID(e.target.value)}
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {isLoading && <Loader />}

                    <Button type="submit" variant="primary" className="mt-3">
                        Create
                    </Button>
                </Form>
            )}
        </>
    );
}

export default AddUserScreen;
