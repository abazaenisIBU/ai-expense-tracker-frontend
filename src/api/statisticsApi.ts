import axios from "axios";

const STATISTICS_API_BASE_URL =
  "https://ai-expense-tracker-backend-c953.onrender.com/api/statistics";

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
