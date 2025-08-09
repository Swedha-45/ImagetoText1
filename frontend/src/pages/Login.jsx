
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from "../components/Form";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      // Already logged in, redirect to home
      navigate("/home", { replace: true });
    }
  }, []);

  return (
    <>
      <Form route="/api/token/" method="login" />
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <Link to="/">No account yet? Please register!</Link>
      </div>
    </>
  );
}

export default Login;