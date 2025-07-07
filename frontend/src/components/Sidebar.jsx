import { Nav } from "react-bootstrap";
import { MdOutlinePayments } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaUserGraduate, FaSitemap, FaUserTie, FaFolderOpen, FaTachometerAlt } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { LinkContainer } from "react-router-bootstrap";
import { useSpecificUserQuery } from "../slices/usersApiSlice";
import Loader from "./Loader";
import { useEffect } from "react";

const Sidebar = () => {
  const { data: user, isLoading, isError, error, refetch } = useSpecificUserQuery();

  useEffect(() => {
    if (!user) {
      refetch();
    }
  }, [user, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error: {error?.message || "An unknown error occurred"}</div>;
  }

  return (
    <Nav defaultActiveKey="/dashboard" className="flex-column fs-6">
      <LinkContainer to="/dashboard">
        <Nav.Link className="d-flex align-items-center sidebar-text">
          <FaTachometerAlt className="me-2 menu-icon" />
          Dashboard
        </Nav.Link>
      </LinkContainer>

      {user?.profile?.isAdmin ? (
        <>
          <LinkContainer to="/dashboard/transactions">
            <Nav.Link className="d-flex align-items-center sidebar-text">
              <GrTransaction className="me-2 menu-icon" />
              Transactions
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/dashboard/branches">
            <Nav.Link className="d-flex align-items-center sidebar-text">
              <FaSitemap className="me-2 menu-icon" />
              Branches
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/dashboard/students">
            <Nav.Link className="d-flex align-items-center sidebar-text">
              <FaUserGraduate className="me-2 menu-icon" />
              Students
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/dashboard/users">
            <Nav.Link className="d-flex align-items-center sidebar-text">
              <FaUsers className="me-2 menu-icon" />
              Users
            </Nav.Link>
          </LinkContainer>
        </>
      ) : (
        <>
          {user?.profile?.role === 'branch_admin' && (
            <LinkContainer to="/dashboard/consultants">
              <Nav.Link className="d-flex align-items-center sidebar-text">
                <FaUserTie className="me-2 menu-icon" />
                Consultants
              </Nav.Link>
            </LinkContainer>
          )}

          <LinkContainer to="/dashboard/cases">
            <Nav.Link className="d-flex align-items-center sidebar-text">
              <FaFolderOpen className="me-2 menu-icon" />
              Cases
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/dashboard/payments">
            <Nav.Link className="d-flex align-items-center sidebar-text">
              <MdOutlinePayments className="me-2 menu-icon" />
              Payments
            </Nav.Link>
          </LinkContainer>
        </>
      )}
    </Nav>
  );
};

export default Sidebar;
