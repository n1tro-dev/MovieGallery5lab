import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFetch } from "../useFetch";

const deferredPromise = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

describe("useFetch", () => {
  it("loads data successfully", async () => {
    const fetcher = vi.fn().mockResolvedValue([{ id: 1, title: "Movie" }]);

    const { result } = renderHook(() => useFetch(fetcher));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([{ id: 1, title: "Movie" }]);
    expect(result.current.error).toBe(null);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("handles request errors", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Network failed"));

    const { result } = renderHook(() => useFetch(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Network failed");
  });

  it("can refetch data manually", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ id: 2 }]);

    const { result } = renderHook(() => useFetch(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([{ id: 1 }]);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.data).toEqual([{ id: 2 }]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("does not update state after unmount", async () => {
    const pending = deferredPromise();
    const fetcher = vi.fn().mockReturnValue(pending.promise);

    const { unmount } = renderHook(() => useFetch(fetcher));

    unmount();

    await act(async () => {
      pending.resolve([{ id: 10 }]);
      await pending.promise;
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
