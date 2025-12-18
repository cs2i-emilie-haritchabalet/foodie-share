import "@testing-library/jest-dom";
import { vi } from "vitest";

// jsdom n’a pas toujours alert/confirm/prompt
Object.defineProperty(window, "alert", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, "confirm", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, "prompt", {
  value: vi.fn(),
  writable: true,
});
