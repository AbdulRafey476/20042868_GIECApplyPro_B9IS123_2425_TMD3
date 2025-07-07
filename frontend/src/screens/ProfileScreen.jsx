import { Card, Col, Container, Row } from "react-bootstrap";
import { useSpecificUserQuery } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Image from "../assets/Profile.jpeg";
import { useEffect } from "react";

function ProfileScreen() {
  const { data: user, isLoading, error, refetch } = useSpecificUserQuery();

  useEffect(() => {
    if (!user) {
      refetch();
    }
  }, [refetch, user]);

  if (isLoading) return <Loader />;

  if (error) {
    const errorMsg = error?.data?.message || error?.message || "An error occurred";
    toast.error(errorMsg);
    return <div>Error: {errorMsg}</div>;
  }

  if (!user?.profile) {
    return <div>No user data found</div>;
  }

  const capitalizeName = user?.profile?.username
    ? user.profile.username.charAt(0).toUpperCase() + user.profile.username.slice(1)
    : "Unknown User";

  return (
    <section className="profile-section">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={4} md={6}>
            <Card className="mb-4 shadow">
              <Card.Body className="text-center">
                <img
                  src={Image || "fallbackImage.jpg"}
                  alt="avatar"
                  className="rounded-circle img-fluid profile-image"
                />
                <h5 className="my-2">{capitalizeName}</h5>
                <p className="text-muted mb-1">
                  {user.profile.role === "admin"
                    ? "Admin"
                    : user.profile.role === "branch_admin"
                    ? "Branch Admin"
                    : "Consultant"}
                </p>
                <p className="text-muted mb-4">
                  {user.profile.role === "admin"
                    ? "GIEC HEAD OFFICE"
                    : user.profile.branch_id?.name || "Branch Name"}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8} md={6}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Row>
                  <Col sm={3}>
                    <p className="mb-0">Full Name</p>
                  </Col>
                  <Col sm={9}>
                    <p className="text-muted mb-0">{capitalizeName}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm={3}>
                    <p className="mb-0">Email</p>
                  </Col>
                  <Col sm={9}>
                    <p className="text-muted mb-0">{user.profile.email}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm={3}>
                    <p className="mb-0">Mobile</p>
                  </Col>
                  <Col sm={9}>
                    <p className="text-muted mb-0">
                      {user.profile.role === "admin"
                        ? "(+92) 3357729999"
                        : `(+92) ${user.profile.branch_id?.phoneNumber || ""}`}
                    </p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm={3}>
                    <p className="mb-0">Address</p>
                  </Col>
                  <Col sm={9}>
                    <p className="text-muted mb-0">
                      {user.profile.role === "admin"
                        ? "Gulshan-e-Iqbal, Karachi, SD"
                        : user.profile.branch_id?.location || "Branch Location"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ProfileScreen;
