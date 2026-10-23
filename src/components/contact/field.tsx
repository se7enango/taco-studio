import type { ReactNode } from "react";

export const inputClass =
  "block w-full rounded-sm border border-line-strong bg-canvas px-4 text-base text-ink placeholder:text-neutral-500 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface aria-invalid:border-danger";

export function fieldId(name: string) {
  return `field-${name}`;
}

/** 입력 요소에 붙일 접근성 속성. 힌트와 오류 문구를 aria-describedby로 연결합니다. */
export function describedBy(name: string, { hint, error }: { hint?: boolean; error?: string }) {
  const ids = [hint && `${fieldId(name)}-hint`, error && `${fieldId(name)}-error`].filter(Boolean);
  return {
    id: fieldId(name),
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": ids.length ? ids.join(" ") : undefined,
  } as const;
}

export function FieldError({ name, error }: { name: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${fieldId(name)}-error`} className="mt-1.5 text-sm text-danger">
      <span className="sr-only">오류: </span>
      {error}
    </p>
  );
}

type FieldProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  /** 입력창 오른쪽 아래에 붙는 보조 정보(글자 수 등) */
  aside?: ReactNode;
  children: ReactNode;
};

export function Field({ name, label, hint, error, aside, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={fieldId(name)} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint || aside ? (
        <div className="mt-1.5 flex items-start justify-between gap-4 text-[13px] leading-[1.6] text-ink-muted">
          {hint ? <p id={`${fieldId(name)}-hint`}>{hint}</p> : <span />}
          {aside}
        </div>
      ) : null}
      <FieldError name={name} error={error} />
    </div>
  );
}
