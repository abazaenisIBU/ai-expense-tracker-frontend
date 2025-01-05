import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../../pages/StatisticsPage/StatisticsPage";
import { useUser } from "../../context/UserContext";

// Mocking components and hooks
jest.mock("../../components/Shared/Header/Header", () => () => (
  <div data-testid="header">Header Component</div>
));
jest.mock("../../components/StatisticsPage/Statistics", () => () => (
  <div data-testid="statistics">Statistics Component</div>
));
jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("StatisticsPage", () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  test("renders the StatisticsPage with Header and Statistics components", () => {
    // Mock the useUser hook to return a user
    (useUser as jest.Mock).mockReturnValue({ user: { name: "Test User" } });

    render(<ProfilePage />);

    // Check that the Header component is rendered
    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header Component");

    // Check that the Statistics component is rendered
    const statistics = screen.getByTestId("statistics");
    expect(statistics).toBeInTheDocument();
    expect(statistics).toHaveTextContent("Statistics Component");
  });

  test("displays user details in the console when a user is logged in", () => {
    // Mock the console.log function
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // Mock the useUser hook to return a user
    (useUser as jest.Mock).mockReturnValue({ user: { name: "Test User" } });

    render(<ProfilePage />);

    // Check that the console.log was called with user details
    expect(consoleSpy).toHaveBeenCalledWith("User Details:", {
      name: "Test User",
    });

    // Restore the original console.log implementation
    consoleSpy.mockRestore();
  });

  test("displays a message in the console when no user is logged in", () => {
    // Mock the console.log function
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // Mock the useUser hook to return no user
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<ProfilePage />);

    // Check that the console.log was called with the correct message
    expect(consoleSpy).toHaveBeenCalledWith("No user is logged in.");

    // Restore the original console.log implementation
    consoleSpy.mockRestore();
  });
});
