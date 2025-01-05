import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WelcomePage from "../../pages/WelcomePage/WelcomePage";

// Mocking child components
jest.mock(
  "../../components/WelcomePage/Welcome/Welcome",
  () => (props: any) =>
    (
      <div data-testid="welcome-component">
        Welcome Component
        <button onClick={props.onHandleCreateProfile}>Create Profile</button>
        <button onClick={props.onHandleAccessAccount}>Access Account</button>
      </div>
    )
);
jest.mock(
  "../../components/WelcomePage/CreateProfile/CreateProfile",
  () => (props: any) =>
    (
      <div data-testid="create-profile-component">
        CreateProfile Component
        <button onClick={props.handleAccessAccount}>Access Account</button>
      </div>
    )
);
jest.mock(
  "../../components/WelcomePage/AccessAccount/AccessAccount",
  () => (props: any) =>
    (
      <div data-testid="access-account-component">
        AccessAccount Component
        <button onClick={props.handleCreateProfile}>Create Profile</button>
      </div>
    )
);

describe("WelcomePage", () => {
  test("renders Welcome component by default", () => {
    render(<WelcomePage />);

    expect(screen.getByTestId("welcome-component")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Expense Tracker")).toBeInTheDocument();
  });

  test("switches to CreateProfile component when 'Create Profile' button is clicked", () => {
    render(<WelcomePage />);

    // Click the 'Create Profile' button
    fireEvent.click(screen.getByText("Create Profile"));

    // Verify that CreateProfile component is displayed
    expect(screen.getByTestId("create-profile-component")).toBeInTheDocument();
    expect(screen.getByText("Create Your Profile")).toBeInTheDocument();
  });

  test("switches to AccessAccount component when 'Access Account' button is clicked", () => {
    render(<WelcomePage />);

    // Click the 'Access Account' button
    fireEvent.click(screen.getByText("Access Account"));

    // Verify that AccessAccount component is displayed
    expect(screen.getByTestId("access-account-component")).toBeInTheDocument();
    expect(screen.getByText("Access Your Account")).toBeInTheDocument();
  });

  test("switches back to Welcome component from CreateProfile", () => {
    render(<WelcomePage />);

    // Click the 'Create Profile' button
    fireEvent.click(screen.getByText("Create Profile"));

    // Click the 'Access Account' button inside CreateProfile
    fireEvent.click(screen.getByText("Access Account"));

    // Verify that AccessAccount component is displayed
    expect(screen.getByTestId("access-account-component")).toBeInTheDocument();
  });

  test("switches back to Welcome component from AccessAccount", () => {
    render(<WelcomePage />);

    // Click the 'Access Account' button
    fireEvent.click(screen.getByText("Access Account"));

    // Click the 'Create Profile' button inside AccessAccount
    fireEvent.click(screen.getByText("Create Profile"));

    // Verify that CreateProfile component is displayed
    expect(screen.getByTestId("create-profile-component")).toBeInTheDocument();
  });
});
