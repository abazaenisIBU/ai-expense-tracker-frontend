import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditExpenseForm from "../../components/HomePage/EditExpenseForm/EditExpenseForm";
import { useUser } from "../../context/UserContext";

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../api/expenseApi", () => ({
  updateExpense: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("EditExpenseForm", () => {
  const defaultProps = {
    expenseId: 1,
    initialData: {
      amount: 100,
      date: "2024-01-01",
      description: "Test description",
      categoryId: 1,
    },
    categories: [
      { id: 1, name: "Food" },
      { id: 2, name: "Transport" },
    ],
    onClose: jest.fn(),
    onExpenseUpdated: jest.fn(),
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });
  });

  it("renders form fields correctly", () => {
    render(<EditExpenseForm {...defaultProps} />);

    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    render(<EditExpenseForm {...defaultProps} />);

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
