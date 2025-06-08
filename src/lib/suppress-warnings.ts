/**
 * Utility to suppress known third-party library warnings in development
 * This specifically handles React 18 defaultProps warnings from recharts
 */

const originalConsoleWarn = console.warn;

export const suppressDefaultPropsWarnings = () => {
  if (process.env.NODE_ENV === "development") {
    console.warn = (...args: any[]) => {
      const message = args[0];

      // Suppress React 18 defaultProps warnings from recharts
      if (
        typeof message === "string" &&
        (message.includes(
          "Support for defaultProps will be removed from function components",
        ) ||
          message.includes("XAxis") ||
          message.includes("YAxis"))
      ) {
        return; // Suppress this warning
      }

      // For all other warnings, use the original console.warn
      originalConsoleWarn(...args);
    };
  }
};

export const restoreConsoleWarn = () => {
  console.warn = originalConsoleWarn;
};
