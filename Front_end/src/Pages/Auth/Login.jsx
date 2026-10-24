import { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import Layout from "../../Components/Layouts/Layout";
import "../../Styles/AuthStyle.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>Login</h1>
          <p>Welcome back! Sign in to your account.</p>
        </div>
      </div>

      <section className="auth_section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <div className="auth_card">
                <h3 className="auth_title">SIGN IN</h3>
                <p className="text-muted mb-4">
                  Enter your credentials to access your account
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <button
                    type="submit"
                    className="btn btn_red w-100 py-3 fw-bold"
                  >
                    LOGIN
                  </button>
                </Form>

                <p className="text-center mt-4 mb-0">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="fw-bold">
                    Register here
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
}

export default Login;
