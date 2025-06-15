import axios from "axios";

/**
 * Fetch user statistics by email.
 * @param {string} email - The email of the user.
 * @returns {Promise<any>} The statistics data.
 */
export const getUserStatistics = async (email: string): Promise<any> => {
  const response = await axios.get(
    `${process.env.REACT_APP_STATISTICS_API_BASE_URL}/user/${encodeURIComponent(email)}`,
  );
  return response.data;
};
