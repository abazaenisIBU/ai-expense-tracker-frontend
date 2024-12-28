import React, { useEffect, useState } from "react";
import {
  getUserCategories,
  addCategory,
  suggestCategory,
} from "../../../api/categoryApi";
import { addExpense } from "../../../api/expenseApi";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import "./AddExpenseForm.css";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import OpenAILogo from "../../../assets/images/openai-logo.png";

interface AddExpenseFormProps {
  onClose: () => void;
  onExpenseAdded: () => void;
}

interface Category {
  id: number | string;
  name: string;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  onClose,
  onExpenseAdded,
}) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    amount: 0,
    date: "",
    description: "",
    categoryId: "", // Change the type to string
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [suggestingCategory, setSuggestingCategory] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<{
    name: string;
    isNew: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.email) return;
      setLoadingCategories(true);
      try {
        const data = await getUserCategories(user.email);
        setCategories(data);
      } catch (error: any) {
        handleApiError(error, "Failed to fetch categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSuggestCategory = async () => {
    if (!formData.description.trim()) {
      toast.error("Description is required to suggest a category!");
      return;
    }
    setSuggestingCategory(true);
    try {
      const response = await suggestCategory(
        user?.email as string,
        formData.description
      );
      const { categoryName, isNew, status } = response;

      if (status === 200) {
        setSuggestedCategory({ name: categoryName, isNew });
        let selectedCategory: Category;

        if (isNew) {
          const newCategory = { id: `temp-${Date.now()}`, name: categoryName };

          // Update categories first
          setCategories((prev) => [...prev, newCategory]);
          selectedCategory = newCategory;

          // Update formData to reflect the new category selection
          setFormData((prev) => ({
            ...prev,
            categoryId: newCategory.id.toString(), // Ensure this matches the option's value
          }));
        } else {
          selectedCategory = categories.find((c) => c.name === categoryName);

          if (selectedCategory) {
            setFormData((prev) => ({
              ...prev,
              categoryId: selectedCategory.id.toString(),
            }));
          }
        }

        toast.success(`Suggested category: ${categoryName}`);
      } else {
        toast.error("Description doesn't make sense for a category!");
      }
    } catch (error: any) {
      handleApiError(error, "Failed to suggest category.");
    } finally {
      setSuggestingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalCategoryId = formData.categoryId;

      // Check if the current category is the suggested category and is new
      if (
        suggestedCategory &&
        suggestedCategory.isNew &&
        categories.find((c) => c.id.toString() === formData.categoryId)
          ?.name === suggestedCategory.name
      ) {
        // Create the new category
        const newCategoryResponse = await addCategory(user?.email as string, {
          name: suggestedCategory.name,
          description: formData.description,
        });

        // Use the id from the addCategory response
        finalCategoryId = newCategoryResponse.id.toString();

        // Update the dropdown list and formData
        setCategories((prev) => [
          ...prev,
          { id: newCategoryResponse.id, name: newCategoryResponse.name },
        ]);
        setFormData((prev) => ({ ...prev, categoryId: finalCategoryId }));

        toast.success("New category created successfully!");
      }

      // Add the expense with the final categoryId
      await addExpense(user?.email as string, {
        amount: formData.amount,
        date: formData.date,
        description: formData.description,
        categoryId: Number(finalCategoryId),
      });

      toast.success("Expense added successfully!");
      onExpenseAdded();
      onClose();
    } catch (error: any) {
      handleApiError(error, "Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (error: any, defaultMessage: string) => {
    if (error.response && error.response.data) {
      const { error: errorTitle, details } = error.response.data;
      toast.error(`${errorTitle}: ${details?.[0]?.message || defaultMessage}`);
    } else {
      toast.error(defaultMessage);
    }
  };

  return (
    <div className="add-expense-form-container">
      <form onSubmit={handleSubmit} className="add-expense-form">
        <div className="form-header">
          <h3>Add Expense</h3>
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
          required
        />

        <label htmlFor="categoryId">Category:</label>
        {loadingCategories ? (
          <LoadingSpinner size={20} />
        ) : (
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        <div className="form-buttons">
          <button
            type="button"
            className="suggest-category-button"
            onClick={handleSuggestCategory}
            disabled={suggestingCategory}
          >
            {suggestingCategory ? (
              <LoadingSpinner size={16} />
            ) : (
              <img src={OpenAILogo} alt="OpenAI" className="openai-logo" />
            )}
            Suggest Category
          </button>

          <button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size={16} /> : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;
