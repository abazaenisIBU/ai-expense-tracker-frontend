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
  TextField,
} from "@mui/material";
import EditExpenseForm from "../../components/HomePage/EditExpenseForm/EditExpenseForm";
import { getUserCategories } from "../../api/categoryApi";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";
import { Category } from "../../types/Category";

const HomePage: React.FC = () => {
  const { user } = useUser();

  // Expenses
  const [expenses, setExpenses] = useState([]);
  // Categories for the user
  const [categories, setCategories] = useState<Category[]>([]);

  // Sorting and filtering
  const [sortBy, setSortBy] = useState("amount");
  const [direction, setDirection] = useState("asc");
  const [filterColumn, setFilterColumn] = useState("description");
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit/add state
  const [editMode, setEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

  // Loader
  const [loading, setLoading] = useState(false);

  //
  // 1) Fetch expenses whenever sort/filter changes
  //
  useEffect(() => {
    fetchExpenses();
  }, [sortBy, direction, filterColumn, filterValue]);

  //
  // 2) Debounce: searchQuery -> filterValue
  //
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterValue(searchQuery);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  //
  // 3) Fetch categories for user
  //
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (user?.email) {
          const data = await getUserCategories(user.email);
          setCategories(data); // data is array of { id, name, description, ... }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [user]);

  //
  // 4) Actual function to fetch expenses
  //
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses(
        user?.email as string,
        sortBy,
        direction,
        filterColumn,
        filterValue
      );
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  //
  // Handle Deletion
  //
  const handleDeleteExpense = async (id: number) => {
    setLoading(true);
    try {
      await deleteExpense(user?.email as string, id);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setLoading(false);
    }
  };

  //
  // Handle Edit
  //
  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
  };

  return (
    <>
      <Header />
      <div className="home-page-container">
        {/* Top bar: left side (title, sort, filter) + right side (edit/add icons) */}
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="expenses-title-container">
              <span className="expenses-title">Expenses</span>
            </div>

            <div className="sort-controls-container">
              <div className="sort-buttons-container">
                <IconButton
                  color="primary"
                  onClick={() =>
                    setDirection(direction === "asc" ? "desc" : "asc")
                  }
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

              <div className="filter-buttons-container">
                <FormControl variant="outlined" size="small">
                  <InputLabel id="filter-by-label">Filter By</InputLabel>
                  <Select
                    labelId="filter-by-label"
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                    label="Filter By"
                  >
                    <MenuItem value="description">Description</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="createdat">Created At</MenuItem>
                    <MenuItem value="updatedat">Updated At</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  className="search-field"
                  variant="outlined"
                  size="medium"
                  placeholder="Filter Value"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  inputProps={{
                    style: {
                      padding: "12px",
                      height: "40px",
                    },
                  }}
                />
              </div>
            </div>
          </div>

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
        </div>

        <hr className="expense-chart-divider" />

        {/* Loader or expenses list */}
        {loading ? (
          <div className="loading-wrapper">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {expenses.length > 0 && (
              <div className="expenses-list">
                {expenses.map((expense: any) => {
                  const foundCategory = categories.find(
                    (cat) => cat.id === expense.categoryId
                  );
                  const categoryName =
                    foundCategory?.name || "Unknown Category";

                  return (
                    <ExpenseCard
                      key={expense.id}
                      id={expense.id}
                      date={expense.date}
                      amount={expense.amount}
                      description={expense.description}
                      category={categoryName}
                      createdAt={expense.createdAt}
                      updatedAt={expense.updatedAt}
                      showEditActions={editMode}
                      onDelete={handleDeleteExpense}
                      onEdit={() => handleEditExpense(expense)}
                    />
                  );
                })}
              </div>
            )}
            {expenses.length === 0 && (
              <p className="no-expenses-message">No expenses found.</p>
            )}
          </>
        )}

        {/* Edit Expense Form */}
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

        {/* Add Expense Form */}
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
