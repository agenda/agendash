import { useState } from "react";

export const useRegisterField = <TData extends object>(initData: TData) => {
  const [form, setForm] = useState<TData>(initData);

  const setValue = <TKey extends keyof TData>(
    key: TKey,
    value: TData[TKey]
  ) => {
    setForm({ ...form, [key]: value });
  };
  const setValues = (data: Partial<TData>) => {
    setForm({ ...form, ...data });
  };

  // Similar with register function in react-hook-form
  const register = (key: keyof TData) => {
    return {
      value: form[key] as any,
      onChange: (e: React.ChangeEvent<HTMLInputElement> | any) =>
        setValue(key, e.target.value),
    };
  };

  const reset = () => {
    setForm(initData);
  };

  return { form, register, setValue, setValues, reset };
};
