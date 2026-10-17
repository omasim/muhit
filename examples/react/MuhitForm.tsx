import { useEffect, useRef } from "react";
import { MuhitForm as Forms, type FormInstance } from "muhit-ui";
export type MuhitFormProps = Parameters<typeof Forms.mount>[1] & {
  onReady?: (form: FormInstance) => void;
};
export function MuhitForm(props: MuhitFormProps) {
  const host = useRef<HTMLDivElement>(null),
    form = useRef<FormInstance | null>(null),
    latest = useRef(props),
    draft = useRef<ReturnType<FormInstance["getSnapshot"]> | null>(null);
  useEffect(() => {
    latest.current = props;
  });
  useEffect(() => {
    if (!host.current) return;
    const p = latest.current;
    let baseline = draft.current?.baseline ?? p.baseline;
    let values = draft.current?.values || p.values;
    try {
      Forms.normalizeValues(p.fields, values);
      if (baseline) Forms.normalizeValues(p.fields, baseline);
    } catch {
      values = p.values;
      baseline = p.baseline;
    }
    const instance = Forms.mount(host.current, {
      ...p,
      values,
      baseline,
      onSubmit: p.onSubmit
        ? (v, s) => latest.current.onSubmit?.(v, s)
        : undefined,
      onChange: (v, s) => latest.current.onChange?.(v, s),
      validate: p.validate
        ? (v) => latest.current.validate?.(v) || {}
        : undefined,
      validateAsync: p.validateAsync
        ? (v, s) => latest.current.validateAsync?.(v, s) || Promise.resolve({})
        : undefined,
    });
    form.current = instance;
    p.onReady?.(instance);
    return () => {
      draft.current = instance.getSnapshot();
      instance.destroy();
      form.current = null;
    };
  }, [
    props.fields,
    props.locale,
    props.dir,
    props.messages,
    props.title,
    props.submitLabel,
    props.validationDelay,
    !!props.onSubmit,
    !!props.validate,
    !!props.validateAsync,
  ]);
  useEffect(() => {
    if (props.values) form.current?.setValues(props.values);
  }, [props.values, props.fields]);
  return <div ref={host} />;
}
