import Spinner from 'react-bootstrap/Spinner';

function Loader() {
  return (
    <Spinner
      animation="grow"
      variant="success"
      role="status"
      style={{
        width: "50px",
        height: "50px",
        margin: "auto",
        display: "block",
      }}
    ></Spinner>
  );
}

export default Loader;