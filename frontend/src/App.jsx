import Header from "./components/Header.jsx";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <Container className="mw-100">
        <Outlet />
      </Container>
    </>
  );
}

export default App;
