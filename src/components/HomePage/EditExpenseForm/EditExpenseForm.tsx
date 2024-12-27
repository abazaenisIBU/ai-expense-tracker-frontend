import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import "./EditExpenseForm.css";
import { updateExpense } from "../../../api/expenseApi";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

interface EditExpenseFormProps {
  expenseId: number;
  initialData: {
    amount: number;
    date: string;
    description?: string;
    categoryId?: number;
  };
  categories: { id: number; name: string }[];
  onClose: () => void;
  onExpenseUpdated: () => void;
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({
  expenseId,
  initialData,
  categories,
  onClose,
  onExpenseUpdated,
}) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    amount: initialData.amount || 0,
    date: initialData.date || "",
    description: initialData.description || "",
    categoryId: initialData.categoryId || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateExpense(user?.email as string, expenseId, formData);
      toast.success("Expense updated successfully!");
      onExpenseUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update expense:", error);
      toast.error("Failed to update expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-expense-form-container">
      <form onSubmit={handleSubmit} className="edit-expense-form">
        <div className="form-header">
          <h3>Edit Expense</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="categoryId">Category:</label>
        <select
          id="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? (
            <LoadingSpinner size={16} height="auto" width="auto" />
          ) : (
            "Update Expense"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditExpenseForm;
