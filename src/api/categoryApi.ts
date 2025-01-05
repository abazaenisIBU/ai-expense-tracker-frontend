import axios from "axios";

const CATEGORY_API_BASE_URL =
  "https://ai-expense-tracker-backend-c953.onrender.com/api/categories/user";

export const getUserCategories = async (email: string) => {
  const response = await axios.get(
    `${CATEGORY_API_BASE_URL}/${encodeURIComponent(email)}`
  );
  return response.data;
};

export const suggestCategory = async (email: string, description: string) => {
  const response = await axios.post(
    `${CATEGORY_API_BASE_URL}/suggest/${encodeURIComponent(
      email
    )}?description=${encodeURIComponent(description)}`
  );
  return response.data;
};

export const addCategory = async (
  email: string,
  category: { name: string; description: string }
) => {
  const response = await axios.post(
    `${CATEGORY_API_BASE_URL}/${encodeURIComponent(email)}`,
    category,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
