import axios from "axios";

export const getExpenses = async (
  email: string,
  sortBy: string,
  direction: string,
  filterColumn?: string,
  filterValue?: string,
) => {
  const response = await axios.get(
    `${process.env.REACT_APP_EXPENSE_API_BASE_URL}/${encodeURIComponent(email)}`,
    {
      params: { sortBy, direction, filterColumn, filterValue },
    },
  );
  return response.data;
};

export const addExpense = async (
  email: string,
  expense: {
    amount: number;
    date: string;
    description: string;
    categoryId: number;
  },
) => {
  const response = await axios.post(
    `${process.env.REACT_APP_EXPENSE_API_BASE_URL}/${encodeURIComponent(email)}`,
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
    },
  );
  return response.data;
};

export const updateExpense = async (
  email: string,
  expenseId: number,
  updatedExpense: any,
) => {
  const response = await axios.put(
    `${process.env.REACT_APP_EXPENSE_API_BASE_URL}/${encodeURIComponent(email)}/${expenseId}`,
    updatedExpense,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const deleteExpense = async (email: string, expenseId: number) => {
  await axios.delete(
    `${process.env.REACT_APP_EXPENSE_API_BASE_URL}/${encodeURIComponent(email)}/${expenseId}`,
  );
};

export const getExpensesGroupedByCategory = async (email: string) => {
  const response = await axios.get(
    `${process.env.REACT_APP_EXPENSE_API_BASE_URL}/${encodeURIComponent(email)}/by-category`,
  );
  return response.data;
};
