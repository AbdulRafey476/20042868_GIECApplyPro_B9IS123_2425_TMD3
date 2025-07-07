import {
  Navbar,
  Nav,
  Container,
  NavbarCollapse,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { CgProfile } from "react-icons/cg";
import LOGO from "../assets/LOGO.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout } from '../slices/authSlice';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const branchName = useSelector((state) => state.auth.branchName);

  const logoutHandler = async () => {
    try {
      dispatch(logout());
      navigate('/');
    } catch (err) {
      toast.error(err)
    }
  };

  const capitalizeName = userInfo
    ? userInfo.username?.charAt(0).toUpperCase() + userInfo?.username?.slice(1)
    : "";
  return (
    <header>
      <Navbar style={{ background: '#06202f' }} variant="dark" expand="lg" collapseOnSelect>
        <Container className="mw-100">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse id="basic-navbar-nav">
            <Nav className="w-100 d-flex justify-content-between align-items-center">
              <LinkContainer to={userInfo ? '/dashboard' : '/'} style={{ height: '5rem' }}>
                <Navbar.Brand className="d-flex align-items-center">
                  <Image
                    src={LOGO}
                    className="me-2"
                    alt="Logo"
                    style={{ width: '8rem' }}
                  />
                </Navbar.Brand>
              </LinkContainer>

              <span className="navbar-heading" id="navbar-heading">{branchName}</span>

              {userInfo ? (
                <NavDropdown
                  id="username"
                  className="custom-dropdown"
                  title={
                    <span className="d-flex flex-column align-items-center" style={{ color: 'white ' }}>
                      <CgProfile size={25} className="mb-1" />
                      {capitalizeName}
                    </span>
                  }
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/">
                  <Nav.Link>
                    <FaSignInAlt />
                    Login
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar >
    </header >
  );
}
