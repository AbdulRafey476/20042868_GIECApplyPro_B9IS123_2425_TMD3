import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useUpdateBranchMutation, useSpecificBranchQuery } from "../../slices/branchApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

function UpdateBranchScreen() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    const navigate = useNavigate();
    const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
    const { data: branchData, isLoading, error } = useSpecificBranchQuery(id);

    useEffect(() => {
        if (branchData) {
            setName(branchData.data.name || "");
            setLocation(branchData.data.location || "");
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to fetch branch data");
        }
    }, [branchData, error]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateBranch({ id, name, location }).unwrap();
            toast.success("Branch updated successfully");
            navigate("/dashboard/branches");
        } catch (err) {
            toast.error(err?.data?.message || "Update failed");
        }
    };

    return (
        <>
            <h1>Update Branch</h1>
            {(isLoading || isUpdating) && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Branch Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Edit Branch Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="my-2" controlId="location">
                    <Form.Label>Branch Location</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Branch Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3" disabled={isUpdating}>
                    Update
                </Button>
            </Form>
        </>
    );
}

export default UpdateBranchScreen;
