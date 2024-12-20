import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import logo from "../assets/pixally-logo-light.png";
import * as formik from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const Register = () => {
  const [error, setError] = useState("");
  const { Formik } = formik;
  const navigate = useNavigate(); // Initialize useNavigate hook

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
  });

  const handleRegister = (registerData) => {
    axiosClient
      .post(`/api/v1/user/register`, registerData)
      .then((response) => {
        console.log("Registration successful", response);
        // Handle post-registration logic here (e.g., redirect, display success message, etc.)
      })
      .catch((error) => {
        console.log("Registration error", error.response);
        setError(
          error?.response?.data?.message ||
            "An error occurred during registration"
        );
      });
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
    >
      <Row className="justify-content-center w-100">
        <Col md={4} className="text-center px-5">
          {/* Logo Section */}
          <img
            src={logo}
            alt="Logo"
            className="img-fluid my-5"
            style={{ maxWidth: "250px" }}
          />
          {error && <Alert variant="danger">{error}</Alert>}

          <Formik
            validationSchema={schema}
            onSubmit={(formData) => handleRegister(formData)}
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="floatingFirstName"
                  label="First Name"
                  className="mb-3"
                >
                  <Form.Control
                    placeholder="John"
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    isInvalid={touched.firstName && errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingLastName"
                  label="Last Name"
                  className="mb-3"
                >
                  <Form.Control
                    placeholder="Doe"
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    isInvalid={touched.lastName && errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingEmail"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control
                    placeholder="name@example.com"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingPassword"
                  label="Password"
                  className="mb-3"
                >
                  <Form.Control
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <Row className="w-100">
                  <Col md={6}>
                    <Button type="submit" className="w-100">
                      Register
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => navigate("/login")} // Navigate to login page
                    >
                      Login
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
