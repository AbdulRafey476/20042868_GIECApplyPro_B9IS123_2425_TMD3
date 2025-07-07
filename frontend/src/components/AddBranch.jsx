import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCreateBranchMutation } from "../slices/branchApiSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "../components/Loader";

function AddBranch() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  const [createBranch, { isLoading }] = useCreateBranchMutation();

  const submitHandler = async function (e) {
    e.preventDefault();
    try {
      await createBranch({ name, location, phoneNumber }).unwrap();
      navigate("/dashboard/branches");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="formBranchName">
        <Form.Label>Branch Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formBranchLocation">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="branchPhoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </Form.Group>

      {isLoading && <Loader />}

      <Button variant="success" className="mt-3" type="submit">
        Create Branch
      </Button>
    </Form>
  );
}

export default AddBranch;
