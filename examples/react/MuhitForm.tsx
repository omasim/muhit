import { useEffect, useRef } from "react";
import {
  MuhitForm as Forms,
  type FormField,
  type FormValues,
  type FormInstance,
} from "muhit-ui";
type Submit = (
  values: FormValues,
  signal: AbortSignal,
) => Promise<void | { errors?: Record<string, string> }>;
export function MuhitForm({
  fields,
  values,
  onSubmit,
}: {
  fields: FormField[];
  values: FormValues;
  onSubmit: Submit;
}) {
  const host = useRef<HTMLDivElement>(null),
    instance = useRef<FormInstance | null>(null),
    submit = useRef(onSubmit);
  useEffect(() => {
    submit.current = onSubmit;
  }, [onSubmit]);
  useEffect(() => {
    if (!host.current) return;
    const form = Forms.mount(host.current, {
      title: "Profil",
      fields,
      values,
      onSubmit: (values, signal) => submit.current(values, signal),
    });
    instance.current = form;
    return () => {
      form.destroy();
      instance.current = null;
    };
  }, [fields]);
  useEffect(() => {
    instance.current?.setValues(values);
  }, [values, fields]);
  return <div ref={host} />;
}
