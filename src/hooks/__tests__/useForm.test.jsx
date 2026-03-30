import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "../useForm";

const initialValues = {
  title: "",
  year: "",
};

const validate = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Required";
  }

  if (!values.year) {
    errors.year = "Required";
  }

  return errors;
};

describe("useForm", () => {
  it("updates values on handleChange", () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({ initialValues, validate, onSubmit }),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "title", value: "Interstellar" },
      });
    });

    expect(result.current.values.title).toBe("Interstellar");
  });

  it("resets values, errors and touched", () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({ initialValues, validate, onSubmit }),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "title", value: "Movie" },
      });
      result.current.handleBlur({ target: { name: "title" } });
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it("calls onSubmit when form is valid", () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({ initialValues, validate, onSubmit }),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "title", value: "Dune" },
      });
      result.current.handleChange({
        target: { name: "year", value: "2021" },
      });
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      { title: "Dune", year: "2021" },
      expect.objectContaining({ resetForm: expect.any(Function) }),
    );
  });
});
