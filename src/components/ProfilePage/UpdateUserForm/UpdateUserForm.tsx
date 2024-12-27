import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { updateUser, updateProfilePicture } from "../../../api/userApi"; // Import API functions
import defaultUserProfilePicture from "../../../assets/images/default-user.png";
import { toast } from "react-toastify";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import "./UpdateUserForm.css";

const IMG_BB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;
const IMG_BB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`;

const UpdateUserForm: React.FC = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [loadingUserUpdate, setLoadingUserUpdate] = useState(false);
  const [loadingPictureUpdate, setLoadingPictureUpdate] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle input changes for the user form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Update user details
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingUserUpdate(true);

    try {
      if (!user?.id) {
        throw new Error("User ID is missing.");
      }

      const updatedUser = await updateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      setUser(updatedUser);
      toast.success("User updated successfully!");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { error: apiError, details } = error.response.data;

        toast.error(apiError || "Failed to update user.");
        if (details && Array.isArray(details)) {
          details.forEach((detail: { field: string | null; message: string }) => {
            toast.error(detail.message);
          });
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoadingUserUpdate(false);
    }
  };

  // Handle file selection for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Update profile picture
  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    setLoadingPictureUpdate(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const imgBBResponse = await fetch(IMG_BB_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const imgBBData = await imgBBResponse.json();

      if (!imgBBData.success) {
        throw new Error("Image upload failed.");
      }

      const profilePictureUrl = imgBBData.data.url;

      await updateProfilePicture(user?.id as number, profilePictureUrl);

      setUser((prev) => {
        if (!prev) throw new Error("No user found in context.");
        return { ...prev, profilePicture: profilePictureUrl };
      });

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setLoadingPictureUpdate(false);
    }
  };

  return (
    <div className="update-user-container">
      <form className="update-user-form" onSubmit={handleUpdateUser}>
        <div className="form-left">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
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
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="update-button" disabled={loadingUserUpdate}>
              {loadingUserUpdate ? (
                <LoadingSpinner size={20} color="#fff" width="auto" height="auto" />
              ) : (
                "Update User"
              )}
            </button>
          </div>
        </div>
        <div className="form-right">
          <div className="profile-picture-container">
            <img
              src={user?.profilePicture || defaultUserProfilePicture}
              alt="Profile"
              className="profile-picture"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <button
              type="button"
              className="update-button"
              onClick={handleUploadProfilePicture}
              disabled={loadingPictureUpdate}
            >
              {loadingPictureUpdate ? (
                <LoadingSpinner size={20} color="#fff" width="auto" height="auto" />
              ) : (
                "Update Profile Picture"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserForm;
