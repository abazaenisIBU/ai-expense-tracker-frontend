import React from "react";
import { CircularProgress } from "@mui/material";

interface LoadingSpinnerProps {
  height?: string | number;
  width?: string | number;
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  height = "100vh",
  width = "100%",
  size = 35,
  color = "primary",
}) => {
  return (
    <div className="loading-spinner-container">
      <CircularProgress size={size} color={color as any} />
    </div>
  );
};

export default LoadingSpinner;
