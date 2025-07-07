import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useUpdateUserMutation, useGetUserByIdQuery } from "../../slices/usersApiSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useOutletContext } from "react-router-dom";

function UpdateConsultant() {
    const { id } = useParams();
    const { refetchUsers } = useOutletContext();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();

    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const { data: user, refetch } = useGetUserByIdQuery(id);

    useEffect(() => {
        if (user) {
            setUsername(user.profile.username || "");
            setEmail(user.profile.email || "");
            setPassword(user.profile.password || "");
        }
        refetch();
    }, [refetch, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ id, username, email, password }).unwrap();
            navigate("/dashboard/consultants");
            refetchUsers()
            toast.success("Consultant updated successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <h1>Update Consultant</h1>
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

                {isLoading && <Loader />}

                <Button type="submit" variant="primary" className="mt-3">
                    update
                </Button>
            </Form>
        </>
    );
}

export default UpdateConsultant;
