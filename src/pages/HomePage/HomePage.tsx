import React, { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../../api/expenseApi";
import ExpenseCard from "../../components/HomePage/ExpenseCard/ExpenseCard";
import AddExpenseForm from "../../components/HomePage/AddExpenseForm/AddExpenseForm";
import { useUser } from "../../context/UserContext";
import "./HomePage.css";
import Header from "../../components/Shared/Header/Header";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import EditExpenseForm from "../../components/HomePage/EditExpenseForm/EditExpenseForm";
import { getUserCategories } from "../../api/categoryApi";

const HomePage: React.FC = () => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [sortBy, setSortBy] = useState("amount");
  const [direction, setDirection] = useState("asc");
  const [editMode, setEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, [sortBy, direction]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getUserCategories(user?.email as string);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(user?.email as string, sortBy, direction);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteExpense(user?.email as string, id);
      fetchExpenses(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
  };

  return (
    <>
      <Header />
      <div className="home-page-container">
        <div className="top-bar">
          <div className="expense-buttons-container">
            <EditIcon
              className="icon-button"
              titleAccess="Edit Expenses"
              onClick={() => setEditMode(!editMode)}
            />
            <AddCircleOutlineIcon
              className="icon-button"
              titleAccess="Add Expense"
              onClick={() => setShowAddForm(true)}
            />
          </div>

          <div className="expenses-title-container">
            <span className="expenses-title">Expenses</span>
          </div>

          <div className="sort-controls-container">
            <IconButton
              color="primary"
              onClick={() => setDirection(direction === "asc" ? "desc" : "asc")}
            >
              {direction === "asc" ? "\u2191" : "\u2193"}
            </IconButton>

            <FormControl variant="outlined" size="small">
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <hr className="expense-chart-divider" />

        {expenses.length > 0 && (
          <div className="expenses-list">
            {expenses.map((expense: any) => (
              <ExpenseCard
                key={expense.id}
                id={expense.id}
                date={expense.date}
                amount={expense.amount}
                description={expense.description}
                showEditActions={editMode}
                onDelete={handleDeleteExpense}
                onEdit={() => handleEditExpense(expense)}
              />
            ))}
          </div>
        )}
        {expenses.length === 0 && (
          <p className="no-expenses-message">No expenses found.</p>
        )}

        {editingExpense && (
          <EditExpenseForm
            expenseId={editingExpense.id}
            initialData={{
              amount: editingExpense.amount,
              date: editingExpense.date,
              description: editingExpense.description,
              categoryId: editingExpense.categoryId,
            }}
            categories={categories}
            onClose={() => setEditingExpense(null)}
            onExpenseUpdated={fetchExpenses}
          />
        )}

        {showAddForm && (
          <AddExpenseForm
            onClose={() => setShowAddForm(false)}
            onExpenseAdded={fetchExpenses}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
