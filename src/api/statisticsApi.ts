import axios from "axios";

const STATISTICS_API_BASE_URL = "http://localhost:8080/api/statistics";

/**
 * Fetch user statistics by email.
 * @param {string} email - The email of the user.
 * @returns {Promise<any>} The statistics data.
 */
export const getUserStatistics = async (email: string): Promise<any> => {
  const response = await axios.get(
    `${STATISTICS_API_BASE_URL}/user/${encodeURIComponent(email)}`
  );
  return response.data;
};
