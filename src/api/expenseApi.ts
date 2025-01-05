import axios from "axios";

const BASE_URL =
  "https://ai-expense-tracker-backend-c953.onrender.com/api/expenses/user";

export const getExpenses = async (
  email: string,
  sortBy: string,
  direction: string
) => {
  const response = await axios.get(`${BASE_URL}/${encodeURIComponent(email)}`, {
    params: { sortBy, direction },
  });
  return response.data;
};

export const addExpense = async (
  email: string,
  expense: {
    amount: number;
    date: string;
    description: string;
    categoryId: number;
  }
) => {
  const response = await axios.post(
    `${BASE_URL}/${encodeURIComponent(email)}`,
    {
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
      categoryId: expense.categoryId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateExpense = async (
  email: string,
  expenseId: number,
  updatedExpense: any
) => {
  const response = await axios.put(
    `${BASE_URL}/${encodeURIComponent(email)}/${expenseId}`,
    updatedExpense,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteExpense = async (email: string, expenseId: number) => {
  await axios.delete(`${BASE_URL}/${encodeURIComponent(email)}/${expenseId}`);
};
