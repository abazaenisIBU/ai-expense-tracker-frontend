import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../api/userApi";
import { toast } from "react-toastify";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import { useUser } from "../../../context/UserContext";
import "./CreateProfile.css";

interface CreateProfileProps {
  handleAccessAccount: () => void;
}

const CreateProfile: React.FC<CreateProfileProps> = ({
  handleAccessAccount,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await createUser(formData);
      setUser(user);
      toast.success("Profile created successfully!");
      navigate("/home");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.details?.[0]?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <LoadingSpinner
              height="20px"
              width="20px"
              size={20}
              color="#007BFF"
            />
          ) : (
            "Submit"
          )}
        </button>
        <p onClick={handleAccessAccount}>Already have a profile?</p>
      </form>
    </div>
  );
};

export default CreateProfile;
