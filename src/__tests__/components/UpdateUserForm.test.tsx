import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UpdateUserForm from "../../components/ProfilePage/UpdateUserForm/UpdateUserForm";
import { useUser } from "../../context/UserContext";

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../api/userApi", () => ({
  updateUser: jest.fn(),
  updateProfilePicture: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("UpdateUserForm", () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        profilePicture: "",
      },
      setUser: jest.fn(),
    });
  });

  it("renders form fields correctly", () => {
    render(<UpdateUserForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
  });

  it("displays a loading spinner during user update", () => {
    render(<UpdateUserForm />);

    const submitButton = screen.getByRole("button", { name: /Update User/i });
    fireEvent.click(submitButton);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
