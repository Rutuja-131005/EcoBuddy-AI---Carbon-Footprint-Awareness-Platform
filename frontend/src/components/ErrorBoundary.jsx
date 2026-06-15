import React from "react";
import ErrorBanner from "./ErrorBanner";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Something went wrong."
    };
  }

  componentDidCatch(_error) {
    // Errors are surfaced through the fallback UI.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-10">
          <ErrorBanner message={this.state.message} />
          <button
            type="button"
            className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => this.setState({ hasError: false, message: "" })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
