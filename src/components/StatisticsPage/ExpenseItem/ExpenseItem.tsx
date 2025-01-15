import React from "react";
import "./ExpenseItem.css";

interface ExpenseItemProps {
  amount: number;
  date: string;
  description: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  amount,
  date,
  description,
}) => {
  return (
    <div className="expense-item">
      <p>
        <strong>Amount:</strong> ${amount.toFixed(2)}
      </p>
      <p>
        <strong>Date:</strong> {date}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
    </div>
  );
};

export default ExpenseItem;
