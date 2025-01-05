import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Shared/Header/Header";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("Header", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/home" });
    (useUser as jest.Mock).mockReturnValue({
      user: {
        profilePicture: "https://example.com/profile.jpg",
      },
    });
  });

  it("renders the logo and navigates to /home when clicked", () => {
    render(<Header />);

    const logo = screen.getByAltText("Expense Tracker Logo");
    expect(logo).toBeInTheDocument();

    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("highlights the active link based on the current location", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/statistics" });

    render(<Header />);

    const statisticsLink = screen.getByText("Statistics");
    expect(statisticsLink).toHaveClass("active-link");
  });

  it("renders the profile picture and navigates to /profile when clicked", () => {
    render(<Header />);

    const profilePicture = screen.getByAltText("Profile");
    expect(profilePicture).toBeInTheDocument();

    fireEvent.click(profilePicture);
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("renders the default profile picture if no user profile picture is provided", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {},
    });

    render(<Header />);

    const profilePicture = screen.getByAltText("Profile");
    expect(profilePicture).toHaveAttribute(
      "src",
      expect.stringContaining("default-user.png")
    );
  });

  it("navigates to /statistics when the Statistics link is clicked", () => {
    render(<Header />);

    const statisticsLink = screen.getByText("Statistics");
    fireEvent.click(statisticsLink);

    expect(mockNavigate).toHaveBeenCalledWith("/statistics");
  });
});
