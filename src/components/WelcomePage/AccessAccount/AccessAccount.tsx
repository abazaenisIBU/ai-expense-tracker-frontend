import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserByEmail } from "../../../api/userApi";
import { useUser } from "../../../context/UserContext";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import "./AccessAccount.css";

interface AccessAccountProps {
  handleCreateProfile: () => void;
}

const AccessAccount: React.FC<AccessAccountProps> = ({ handleCreateProfile }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await getUserByEmail(email);
      setUser(user);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate("/home");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.details?.[0]?.message ||
        "Failed to access account. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="access-account-container">
      <form onSubmit={handleSubmit} className="access-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? <LoadingSpinner height="20px" width="20px" size={20} color="#007BFF" /> : "Submit"}
        </button>
        <p onClick={handleCreateProfile}>Don't have an account?</p>
      </form>
    </div>
  );
};

export default AccessAccount;
