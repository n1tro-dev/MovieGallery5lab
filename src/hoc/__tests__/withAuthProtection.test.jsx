import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MovieContext } from "../../MovieContext";
import withAuthProtection from "../withAuthProtection";

const SecretPage = () => <h2>Secret ratings data</h2>;
const ProtectedSecretPage = withAuthProtection(SecretPage);

const renderWithAuth = (isAuthenticated) => {
  render(
    <MovieContext.Provider value={{ isAuthenticated }}>
      <ProtectedSecretPage />
    </MovieContext.Provider>,
  );
};

describe("withAuthProtection", () => {
  it("shows wrapped component for authorized user", () => {
    renderWithAuth(true);
    expect(screen.getByText("Secret ratings data")).toBeInTheDocument();
  });

  it("shows access denied for non-authorized user", () => {
    renderWithAuth(false);
    expect(screen.getByText("Access denied")).toBeInTheDocument();
  });
});
