import "@testing-library/jest-dom";
import { vi } from "vitest";

const alertMock: (message?: string) => void = vi.fn();

// Mock global
vi.stubGlobal("alert", alertMock);

// Force window.alert à pointer sur le même mock
if (typeof window !== "undefined") {
  window.alert = alertMock;
}
