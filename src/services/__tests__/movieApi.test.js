import { describe, expect, it, vi, afterEach } from "vitest";
import {
  fetchMoviesFromApi,
  updateMovieOnApi,
  createMovieOnApi,
  deleteMovieOnApi,
} from "../movieApi";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("movieApi", () => {
  it("fetchMoviesFromApi normalizes API data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 11,
            name: "Demo Show",
            genres: ["Drama"],
            rating: { average: 7.5 },
            premiered: "2020-01-01",
            summary: "<p>Simple summary</p>",
            image: { medium: "https://example.com/cover.jpg" },
          },
        ],
      }),
    );

    const result = await fetchMoviesFromApi();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 11,
      title: "Demo Show",
      genre: "Drama",
      rating: 7.5,
      year: 2020,
      description: "Simple summary",
    });
  });

  it("createMovieOnApi returns created movie with id", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 77 }),
      }),
    );

    const payload = { title: "New" };
    const result = await createMovieOnApi(payload);

    expect(result).toEqual({ title: "New", id: 77 });
  });

  it("updateMovieOnApi throws on failed response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(updateMovieOnApi(1, { title: "x" })).rejects.toThrow(
      "Failed to update movie through API",
    );
  });

  it("deleteMovieOnApi returns true for successful delete", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    );

    const result = await deleteMovieOnApi(3);
    expect(result).toBe(true);
  });
});
