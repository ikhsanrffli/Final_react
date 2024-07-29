import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { TypeAnimation } from "react-type-animation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        toast.success("Login successful");
        navigate("/");
      })
      .catch((error) => {
        toast.error("Login failed. Please check your email and password.");
      });
  };

  return (
    <div className="login">
      <div className="left-section">
        <TypeAnimation
          sequence={[
            "KISAAN E-SAHULAT Admin Portal",
            1000,
            "Your Gateway to Control",
            1000,
            "Secure Access for Administrators",
            1000,
            "Explore the Admin Dashboard",
            1000,
          ]}
          wrapper="p"
          speed={50}
          repeat={Infinity}
        />
      </div>
      <div className="right-section">
        <div>
          <h1>KISAAN E-SAHULAT</h1>
          <h3>Happy to see you again</h3>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
