import axios from "axios";

const BASE_URL = "http://localhost:8080/api/expenses/user";

export const getExpenses = async (
  email: string,
  sortBy: string,
  direction: string,
  filterColumn?: string,
  filterValue?: string
) => {
  const response = await axios.get(`${BASE_URL}/${encodeURIComponent(email)}`, {
    params: { sortBy, direction, filterColumn, filterValue },
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
