import React, { useEffect, useState } from "react";
import { getUserStatistics } from "../../api/statisticsApi";
import { useUser } from "../../context/UserContext";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Statistics.css";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";

const Statistics: React.FC = () => {
  const { user } = useUser();
  const [statistics, setStatistics] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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

  // Prepare data for bar chart
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

  // Prepare data for line chart
  let monthlyLabels = [];
  let monthlyTotals = [];

  if (statistics?.monthlyStatistics) {
    // Sort monthlyStatistics by monthYear in ascending order
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

  return (
    <div className="statistics-container">
      <div className="chart-container">
        <div className="chart-title">
          <h3>Total Amount by Category</h3>
        </div>
        {loading ? (
          <LoadingSpinner size={30} height="50px" width="50px" />
        ) : categoryLabels.length > 0 ? (
          <Bar data={barData} height={55} />
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
    </div>
  );
};

export default Statistics;
