import React from "react";
import "./ExpenseCard.css";

interface ExpenseCardProps {
  id: number;
  date: string;
  amount: number;
  description: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  showEditActions: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  id,
  date,
  amount,
  description,
  onEdit,
  onDelete,
  showEditActions,
}) => {
  return (
    <div className="expense-card-container">
      <div className="expense-card-content">
        <p className="expense-description">{description}</p>
        <div className="expense-date-container">
          <div>
            <p className="expense-date">
              {new Date(date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="expense-amount">${amount.toFixed(2)}</p>
          </div>
        </div>
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
