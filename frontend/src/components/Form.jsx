import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload =
        method === "login"
          ? {
              username: formData.username,
              password: formData.password,
            }
          : formData; // includes email for register

      const response = await api.post(route, payload);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/home");
      } else if (method === "register") {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(" Invalid credentials or something went wrong.");
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "60px auto",
      padding: "30px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      backgroundColor: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
    },
    error: {
      color: "red",
      marginBottom: "15px",
      textAlign: "center",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2 style={styles.heading}>{method === "login" ? "Login" : "Register"}</h2>
      {error && <p style={styles.error}>{error}</p>}

      {method === "register" && (
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            style={styles.input}
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>
      )}

      <div style={styles.inputGroup}>
        <label style={styles.label}>Username:</label>
        <input
          type="text"
          name="username"
          style={styles.input}
          onChange={handleChange}
          value={formData.username}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Password:</label>
        <input
          type="password"
          name="password"
          style={styles.input}
          onChange={handleChange}
          value={formData.password}
          required
        />
      </div>

      <button type="submit" style={styles.button}>
        {method === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Form;
