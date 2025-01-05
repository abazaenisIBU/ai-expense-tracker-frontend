import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";

// Mock components used within ProfilePage
jest.mock("../../components/Shared/Header/Header", () => () => (
  <div data-testid="header">Header Component</div>
));
jest.mock(
  "../../components/ProfilePage/UpdateUserForm/UpdateUserForm",
  () => () => <div data-testid="update-user-form">UpdateUserForm Component</div>
);

describe("ProfilePage", () => {
  test("renders the ProfilePage with Header and UpdateUserForm", () => {
    render(<ProfilePage />);

    // Check that the Header component is rendered
    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header Component");

    // Check that the UpdateUserForm component is rendered
    const updateUserForm = screen.getByTestId("update-user-form");
    expect(updateUserForm).toBeInTheDocument();
    expect(updateUserForm).toHaveTextContent("UpdateUserForm Component");

    // Check that the profile title is rendered
    const profileTitle = screen.getByText(/Profile Information/i);
    expect(profileTitle).toBeInTheDocument();
  });

  test("renders the profile page container with the correct styling", () => {
    render(<ProfilePage />);

    const profilePageContainer = screen
      .getByText(/Profile Information/i)
      .closest("div");
    expect(profilePageContainer).toHaveClass("profile-info");
  });
});
