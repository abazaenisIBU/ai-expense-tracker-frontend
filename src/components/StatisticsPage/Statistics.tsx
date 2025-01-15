import React, { useEffect, useState, useRef } from "react";
import { getUserStatistics } from "../../api/statisticsApi";
import { getExpensesGroupedByCategory } from "../../api/expenseApi"; // New API call
import { useUser } from "../../context/UserContext";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Statistics.css";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";
import { Chart as ChartJS, ActiveElement } from "chart.js";
import ExpenseItem from "../StatisticsPage/ExpenseItem/ExpenseItem"; // import ExpenseItem

// Types for the grouped expenses API response
interface ExpenseResponseDTO {
  id: number;
  amount: number;
  date: string;
  description: string;
  categoryId: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface ExpensesByCategoryDTO {
  category: string; // category name
  expenses: ExpenseResponseDTO[];
}

const Statistics: React.FC = () => {
  const { user } = useUser();
  const [statistics, setStatistics] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupedExpenses, setGroupedExpenses] = useState<
    ExpensesByCategoryDTO[]
  >([]);
  const [selectedExpenses, setSelectedExpenses] = useState<
    ExpenseResponseDTO[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const barChartRef = useRef<ChartJS<"bar", number[], unknown> | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const data = await getUserStatistics(user.email);
        setStatistics(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [user]);

  useEffect(() => {
    const fetchGroupedExpenses = async () => {
      if (!user?.email) return;
      try {
        const groupedData = await getExpensesGroupedByCategory(user.email);
        setGroupedExpenses(groupedData);
      } catch (error) {
        console.error("Failed to fetch grouped expenses:", error);
      }
    };

    fetchGroupedExpenses();
  }, [user]);

  const categoryLabels =
    statistics?.categoryStatistics.map((stat: any) => stat.categoryName) || [];
  const categoryTotals =
    statistics?.categoryStatistics.map((stat: any) => stat.totalAmount) || [];

  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Total Amount by Category",
        data: categoryTotals,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  let monthlyLabels: string[] = [];
  let monthlyTotals: number[] = [];
  if (statistics?.monthlyStatistics) {
    const sortedMonthlyStats = [...statistics.monthlyStatistics].sort(
      (a: any, b: any) =>
        new Date(`${a.monthYear}-01`).getTime() -
        new Date(`${b.monthYear}-01`).getTime()
    );
    monthlyLabels = sortedMonthlyStats.map((stat: any) => stat.monthYear);
    monthlyTotals = sortedMonthlyStats.map((stat: any) => stat.totalAmount);
  }
  const lineData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Spending Rate by Month",
        data: monthlyTotals,
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const handleBarClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!barChartRef.current) return;
    const elements: ActiveElement[] =
      barChartRef.current.getElementsAtEventForMode(
        event.nativeEvent,
        "nearest",
        { intersect: true },
        false
      );
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const category = categoryLabels[clickedIndex];
      setSelectedCategory(category);
      const group = groupedExpenses.find((grp) => grp.category === category);
      if (group) {
        setSelectedExpenses(group.expenses);
      } else {
        setSelectedExpenses([]);
      }
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="statistics-container">
      <div className="chart-container">
        <div className="chart-title">
          <h3>Total Amount by Category</h3>
        </div>
        {loading ? (
          <LoadingSpinner size={30} height="50px" width="50px" />
        ) : categoryLabels.length > 0 ? (
          <Bar
            data={barData}
            height={55}
            ref={barChartRef}
            onClick={handleBarClick}
          />
        ) : (
          <p>No data available for categories.</p>
        )}
      </div>

      <hr className="chart-divider" />

      <div className="chart-container">
        <div className="chart-title">
          <h3>Spending Rate by Month</h3>
        </div>
        {loading ? (
          <LoadingSpinner size={30} height="50px" width="50px" />
        ) : monthlyLabels.length > 0 ? (
          <Line data={lineData} height={50} />
        ) : (
          <p>No data available for monthly spending.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              X
            </button>
            <div className="modal-body">
              <h4>Expenses for Category: {selectedCategory}</h4>
              {selectedExpenses.length > 0 ? (
                <div>
                  {selectedExpenses.map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      amount={expense.amount}
                      date={expense.date}
                      description={expense.description}
                    />
                  ))}
                </div>
              ) : (
                <p>No expenses found for this category.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
