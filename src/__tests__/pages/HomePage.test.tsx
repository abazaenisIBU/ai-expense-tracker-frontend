// HomePage.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../../pages/HomePage/HomePage";
import { getExpenses, deleteExpense } from "../../api/expenseApi";
import { getUserCategories } from "../../api/categoryApi";
import { useUser } from "../../context/UserContext";
import { MemoryRouter } from "react-router-dom";

// Mocking API functions
jest.mock("../../api/expenseApi", () => ({
  getExpenses: jest.fn(),
  deleteExpense: jest.fn(),
}));

jest.mock("../../api/categoryApi", () => ({
  getUserCategories: jest.fn(),
}));

// Mocking the UserContext
jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simulate a logged-in user
    (useUser as jest.Mock).mockReturnValue({
      user: { email: "testuser@example.com" },
    });
  });

  test("renders the header and basic elements", async () => {
    (getExpenses as jest.Mock).mockResolvedValueOnce([]);
    (getUserCategories as jest.Mock).mockResolvedValueOnce([]);

    // Wrap in MemoryRouter
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // If your Header has some text (like a site title),
    // you can test for it. Otherwise, just wait for "No expenses found."
    await waitFor(() => {
      expect(screen.getByText(/No expenses found\./i)).toBeInTheDocument();
    });
  });

  test("fetches and displays expenses", async () => {
    const mockExpenses = [
      { id: 1, amount: 50, date: "2025-01-01", description: "Groceries" },
      { id: 2, amount: 100, date: "2025-01-02", description: "Utilities" },
    ];
    (getExpenses as jest.Mock).mockResolvedValueOnce(mockExpenses);
    (getUserCategories as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Wait for the mock expenses to appear
    expect(await screen.findByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Utilities")).toBeInTheDocument();

    // "No expenses found." should not be visible
    expect(screen.queryByText(/No expenses found\./i)).not.toBeInTheDocument();
  });

  test("toggles edit mode when EditIcon is clicked", async () => {
    (getExpenses as jest.Mock).mockResolvedValueOnce([]);
    (getUserCategories as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // "Edit Expenses" is the titleAccess for EditIcon
    const editIconButton = screen.getByTitle("Edit Expenses");
    userEvent.click(editIconButton);

    // You can now assert the UI changes to "edit mode."
    // For instance, if in edit mode you show a delete button or something:
    // expect(screen.getByText("Delete")).toBeInTheDocument();
    // Or you might just ensure some 'active' class got toggled, etc.
  });

  test("opens the AddExpenseForm when AddCircleOutlineIcon is clicked", async () => {
    (getExpenses as jest.Mock).mockResolvedValueOnce([]);
    (getUserCategories as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const addIconButton = screen.getByTitle("Add Expense");
    userEvent.click(addIconButton);

    // Now the AddExpenseForm should appear
    // For example, if AddExpenseForm has a label or heading:
    // expect(screen.getByText("Add Expense Form")).toBeInTheDocument();
  });

  test("calls deleteExpense API when deleting an expense", async () => {
    // Preload with a single expense to confirm deletion
    (getExpenses as jest.Mock).mockResolvedValueOnce([
      {
        id: 1,
        amount: 50,
        date: "2025-01-01",
        description: "Groceries",
      },
    ]);
    (getUserCategories as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Wait for the expense to show up
    expect(await screen.findByText("Groceries")).toBeInTheDocument();

    // Switch to edit mode so that the delete button is visible
    const editIconButton = screen.getByTitle("Edit Expenses");
    userEvent.click(editIconButton);

    // Suppose your `ExpenseCard` has a delete button
    // for each expense with some text or title like "Delete"
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    userEvent.click(deleteButton);

    // Expect the deleteExpense function to be called with correct params
    expect(deleteExpense).toHaveBeenCalledWith("testuser@example.com", 1);
  });
});
