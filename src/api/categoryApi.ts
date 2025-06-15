import axios from "axios";

export const getUserCategories = async (email: string) => {
  const response = await axios.get(
    `${process.env.REACT_APP_CATEGORY_API_BASE_URL}/${encodeURIComponent(email)}`,
  );
  return response.data;
};

export const suggestCategory = async (email: string, description: string) => {
  const response = await axios.post(
    `${process.env.REACT_APP_CATEGORY_API_BASE_URL}/suggest/${encodeURIComponent(
      email,
    )}?description=${encodeURIComponent(description)}`,
  );
  return response.data;
};

export const addCategory = async (
  email: string,
  category: { name: string; description: string },
) => {
  const response = await axios.post(
    `${process.env.REACT_APP_CATEGORY_API_BASE_URL}/${encodeURIComponent(email)}`,
    category,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};
