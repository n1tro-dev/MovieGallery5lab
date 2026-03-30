import { useMemo, useState } from "react";

export const useForm = ({ initialValues, validate, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const runValidation = (nextValues) => {
    const nextErrors = validate ? validate(nextValues) : {};
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => {
      const nextValues = { ...prev, [name]: value };
      runValidation(nextValues);
      return nextValues;
    });
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    runValidation(values);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const markedTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(markedTouched);

    const nextErrors = runValidation(values);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    onSubmit(values, { resetForm });
  };

  const isValid = useMemo(
    () => Object.values(errors).every((value) => !value),
    [errors],
  );

  return {
    values,
    errors,
    touched,
    isValid,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};
