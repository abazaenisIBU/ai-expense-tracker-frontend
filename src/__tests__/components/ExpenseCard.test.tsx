import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExpenseCard from "../../components/HomePage/ExpenseCard/ExpenseCard";

describe("ExpenseCard Component", () => {
  const mockEditHandler = jest.fn();
  const mockDeleteHandler = jest.fn();

  const defaultProps = {
    id: 1,
    date: "2025-01-01",
    amount: 123.45,
    description: "Grocery Shopping",
    category: "",
    createdAt: "",
    updatedAt: "",
    onEdit: mockEditHandler,
    onDelete: mockDeleteHandler,
    showEditActions: true,
  };

  test("renders expense card with correct data", async () => {
    render(<ExpenseCard {...defaultProps} />);

    // Check if description is rendered
    expect(screen.getByText("Grocery Shopping")).toBeInTheDocument();

    // Check if date is formatted correctly (match with locale-aware pattern)
    expect(screen.getByText(/1\.\s1\.\s2025\./)).toBeInTheDocument();

    // Check if amount is displayed correctly
    expect(screen.getByText("$123.45")).toBeInTheDocument();
  });

  test("calls onEdit when Edit button is clicked", async () => {
    render(<ExpenseCard {...defaultProps} />);
    const editButton = screen.getByText("Edit");

    fireEvent.click(editButton);

    // Ensure the handler is called with the correct id
    expect(mockEditHandler).toHaveBeenCalledWith(1);
  });

  test("calls onDelete when Delete button is clicked", async () => {
    render(<ExpenseCard {...defaultProps} />);
    const deleteButton = screen.getByText("Delete");

    fireEvent.click(deleteButton);

    // Ensure the handler is called with the correct id
    expect(mockDeleteHandler).toHaveBeenCalledWith(1);
  });
});
