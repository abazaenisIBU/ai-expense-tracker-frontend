import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";
import { CircularProgress } from "@mui/material";

describe("LoadingSpinner", () => {
  it("renders the loading spinner with default props", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();

    const parentBox = spinner.closest("div");
    expect(parentBox).toHaveStyle({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
    });
  });

  it("renders the spinner with a custom size", () => {
    render(<LoadingSpinner size={60} />);

    const spinner = screen.getByRole("progressbar");
    expect(spinner).toHaveAttribute("style", expect.stringContaining("60px"));
  });

  it("renders the spinner with a custom color", () => {
    render(<LoadingSpinner color="secondary" />);

    const spinner = screen.getByRole("progressbar");
    expect(spinner).toHaveClass("MuiCircularProgress-colorSecondary");
  });

  it("applies custom height and width styles", () => {
    render(<LoadingSpinner height="50vh" width="50%" />);

    const spinner = screen.getByRole("progressbar");
    const parentBox = spinner.closest("div");
    expect(parentBox).toHaveStyle({
      height: "50vh",
      width: "50%",
    });
  });
});
