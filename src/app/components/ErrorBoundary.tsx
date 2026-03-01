import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Catches render errors in child components and displays a recovery UI
 * instead of a white screen crash.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        padding: "2rem",
                        fontFamily: "Inter, system-ui, sans-serif",
                        color: "#2A0B11",
                    }}
                >
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "0.75rem" }}>
                        Something went wrong
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem", textAlign: "center" }}>
                        {this.state.error?.message || "An unexpected error occurred."}
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        style={{
                            padding: "0.5rem 1.25rem",
                            borderRadius: "10px",
                            border: "none",
                            background: "#2A0B11",
                            color: "#FDF6EE",
                            cursor: "pointer",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                        }}
                    >
                        Reload page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
