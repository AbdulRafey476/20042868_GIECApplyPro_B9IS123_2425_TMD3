import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div
      id="error-page"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#dc3545" }}>Oops!</h1>
      <p style={{ fontSize: "1.25rem", color: "#6c757d" }}>
        Sorry, an unexpected error has occurred. Try Reloading the page
      </p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
