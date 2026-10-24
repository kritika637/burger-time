import { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import Layout from "../../Components/Layouts/Layout";
import "../../Styles/AuthStyle.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone,
    );
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>Register</h1>
          <p>Create your account to start ordering.</p>
        </div>
      </div>

      <section className="auth_section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <div className="auth_card">
                <h3 className="auth_title">CREATE ACCOUNT</h3>
                <p className="text-muted mb-4">
                  Fill in your details to get started
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <button
                    type="submit"
                    className="btn btn_red w-100 py-3 fw-bold"
                  >
                    REGISTER
                  </button>
                </Form>

                <p className="text-center mt-4 mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="fw-bold">
                    Login here
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

export default Register;
