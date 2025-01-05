import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddExpenseForm from "../../components/HomePage/AddExpenseForm/AddExpenseForm";
import { useUser } from "../../context/UserContext";

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../api/categoryApi", () => ({
  getUserCategories: jest.fn(),
  addCategory: jest.fn(),
  suggestCategory: jest.fn(),
}));

jest.mock("../../api/expenseApi", () => ({
  addExpense: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AddExpenseForm", () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });
  });

  it("calls onClose when the close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(<AddExpenseForm onClose={onCloseMock} onExpenseAdded={jest.fn()} />);

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("shows a loading spinner when loading categories", async () => {
    render(<AddExpenseForm onClose={jest.fn()} onExpenseAdded={jest.fn()} />);

    expect(
      screen.getByRole("button", { name: /Suggest Category/i })
    ).toBeInTheDocument();
  });
});
