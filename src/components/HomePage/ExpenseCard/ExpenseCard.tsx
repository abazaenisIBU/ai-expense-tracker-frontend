import React from "react";
import "./ExpenseCard.css";

interface ExpenseCardProps {
  id: number;
  date: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  showEditActions: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  id,
  date,
  amount,
  description,
  category,
  createdAt,
  updatedAt,
  onEdit,
  onDelete,
  showEditActions,
}) => {
  return (
    <div className="expense-card-container">
      {/* Column Labels */}
      <div className="expense-card-labels">
        <span className="column-label">Description</span>
        <span className="column-label">Category</span>
        <span className="column-label">Created</span>
        <span className="column-label">Updated</span>
        <span className="column-label">Date</span>
        <span className="column-label">Amount</span>
      </div>

      {/* Actual Data */}
      <div className="expense-card-data">
        <span className="expense-description">{description}</span>
        <span className="expense-date2">{category}</span>
        <span className="expense-date2">
          {new Date(createdAt).toLocaleDateString()}
        </span>
        <span className="expense-date2">
          {new Date(updatedAt).toLocaleDateString()}
        </span>
        <span className="expense-date">
          {new Date(date).toLocaleDateString()}
        </span>
        <span className="expense-amount">${amount.toFixed(2)}</span>
      </div>

      {showEditActions && (
        <div className="expense-card-actions">
          <button
            className="expense-card-edit-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(id);
            }}
          >
            Edit
          </button>
          <button
            className="expense-card-delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
