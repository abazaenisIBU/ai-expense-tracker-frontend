import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { updateUser, updateProfilePicture } from "../../../api/userApi";
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
  const [userTimer, setUserTimer] = useState(0);
  const [pictureTimer, setPictureTimer] = useState(0);

  const startTimer = (
    setTimer: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setTimer(5);
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

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
      toast.error("Failed to update user. Please try again.");
    } finally {
      setLoadingUserUpdate(false);
      startTimer(setUserTimer);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setLoadingPictureUpdate(false);
      startTimer(setPictureTimer);
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
            <button
              type="submit"
              className="update-button"
              disabled={loadingUserUpdate || userTimer > 0}
            >
              {loadingUserUpdate ? (
                <LoadingSpinner
                  size={20}
                  color="#fff"
                  width="auto"
                  height="auto"
                />
              ) : (
                "Update User"
              )}
            </button>
            <div className="rate-limit-message-container">
              {userTimer > 0 && (
                <p className="timer-message">
                  Please wait {userTimer} seconds to update again.
                </p>
              )}
            </div>
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
              disabled={loadingPictureUpdate || pictureTimer > 0}
            >
              {loadingPictureUpdate ? (
                <LoadingSpinner
                  size={20}
                  color="#fff"
                  width="auto"
                  height="auto"
                />
              ) : (
                "Update Profile Picture"
              )}
            </button>
            <div className="rate-limit-message-container">
              {pictureTimer > 0 && (
                <p className="timer-message">
                  Please wait {pictureTimer} seconds to update again.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserForm;
