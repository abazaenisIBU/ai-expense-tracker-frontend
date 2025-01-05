import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Welcome from "../../components/WelcomePage/Welcome/Welcome";

describe("Welcome Component", () => {
  const mockHandleCreateProfile = jest.fn();
  const mockHandleAccessAccount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the feature list correctly", () => {
    render(
      <Welcome
        onHandleCreateProfile={mockHandleCreateProfile}
        onHandleAccessAccount={mockHandleAccessAccount}
      />
    );

    const featureListItems = screen.getAllByRole("listitem");
    expect(featureListItems).toHaveLength(4);
    expect(screen.getByText(/Expense Categorization/i)).toBeInTheDocument();
    expect(screen.getByText(/Detailed Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Visualisation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/AI-powered category prediction/i)
    ).toBeInTheDocument();
  });

  it("renders the buttons correctly", () => {
    render(
      <Welcome
        onHandleCreateProfile={mockHandleCreateProfile}
        onHandleAccessAccount={mockHandleAccessAccount}
      />
    );

    expect(
      screen.getByRole("button", { name: /Create Profile/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Access Account/i })
    ).toBeInTheDocument();
  });

  it("calls onHandleCreateProfile when 'Create Profile' button is clicked", () => {
    render(
      <Welcome
        onHandleCreateProfile={mockHandleCreateProfile}
        onHandleAccessAccount={mockHandleAccessAccount}
      />
    );

    const createProfileButton = screen.getByRole("button", {
      name: /Create Profile/i,
    });
    fireEvent.click(createProfileButton);

    expect(mockHandleCreateProfile).toHaveBeenCalledTimes(1);
  });

  it("calls onHandleAccessAccount when 'Access Account' button is clicked", () => {
    render(
      <Welcome
        onHandleCreateProfile={mockHandleCreateProfile}
        onHandleAccessAccount={mockHandleAccessAccount}
      />
    );

    const accessAccountButton = screen.getByRole("button", {
      name: /Access Account/i,
    });
    fireEvent.click(accessAccountButton);

    expect(mockHandleAccessAccount).toHaveBeenCalledTimes(1);
  });
});
