import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useModal } from "../useModal";

describe("useModal", () => {
  it("opens with payload and closes with reset", () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBe(null);

    act(() => {
      result.current.open({ id: 10, title: "Movie" });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual({ id: 10, title: "Movie" });

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBe(null);
  });
});
