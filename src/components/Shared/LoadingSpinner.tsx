import React from "react";
import { CircularProgress, Box } from "@mui/material";

interface LoadingSpinnerProps {
  height?: string | number;
  width?: string | number;
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  height = "100vh",
  width = "100%",
  size = 40,
  color = "primary",
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={height}
      width={width}
    >
      <CircularProgress size={size} color={color as any} />
    </Box>
  );
};

export default LoadingSpinner;
