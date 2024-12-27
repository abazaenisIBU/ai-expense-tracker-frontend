// userApi.ts (API Calls for User Management)
import axios from "axios";
import { User } from "../types/User";

const USER_API_BASE_URL = "http://localhost:8080/api/users";

/**
 * Fetch all users.
 * @returns {Promise<User[]>} A list of users.
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${USER_API_BASE_URL}/`);
  return response.data;
};

/**
 * Fetch user details by email.
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<User>} The details of the user.
 */
export const getUserByEmail = async (email: string): Promise<User> => {
  const response = await axios.get(
    `${USER_API_BASE_URL}/${encodeURIComponent(email)}`
  );
  return response.data;
};
/**
 * Create a new user.
 * @param {Partial<User>} user - The user data to create (excluding generated fields).
 * @returns {Promise<User>} The newly created user.
 */
export const createUser = async (user: Partial<User>): Promise<User> => {
  const response = await axios.post(`${USER_API_BASE_URL}`, user, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Update user details.
 * @param {number} userId - The ID of the user to update.
 * @param {Partial<User>} userData - The user data to update.
 * @returns {Promise<User>} The updated user.
 */
export const updateUser = async (
  userId: number,
  userData: Partial<User>
): Promise<User> => {
  const response = await axios.put(`${USER_API_BASE_URL}/${userId}`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateProfilePicture = async (
  userId: number,
  profilePictureUrl: string
): Promise<void> => {
  await axios.post(
    `http://localhost:8080/api/users/${userId}/profile-picture`,
    { profilePicture: profilePictureUrl },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

/**
 * Delete a user by ID.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<void>} Confirmation of deletion.
 */
export const deleteUser = async (userId: number): Promise<void> => {
  await axios.delete(`${USER_API_BASE_URL}/${userId}`);
};
