import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../components/Shared/ProtectedRoute/ProtectedRoute";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("ProtectedRoute", () => {
  const ProtectedComponent = () => <h1>Protected Page</h1>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the children when the user is authenticated", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Page")).toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("redirects to the home page and shows a toast message when the user is not authenticated", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith(
      "Please login to access this page."
    );
  });
});
