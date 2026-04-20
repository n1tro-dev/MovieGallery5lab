import React, { useContext } from "react";
import { MovieContext } from "../MovieContext";

const withAuthProtection = (WrappedComponent) => {
  const ProtectedComponent = (props) => {
    const { isAuthenticated } = useContext(MovieContext);

    if (!isAuthenticated) {
      return (
        <div className="page">
          <h1>Access denied</h1>
          <p>This page is available only for authorized users.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `WithAuthProtection(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ProtectedComponent;
};

export default withAuthProtection;
