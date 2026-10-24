import type { ReactNode } from "react";

export const inputClass =
  "block w-full rounded-sm border border-line-strong bg-canvas px-4 text-base text-ink placeholder:text-ink-faint transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface aria-invalid:border-danger";

/** 어두운 배경에서 기본 체크박스(accent-color)가 회색 사각형으로 보여 비활성처럼 보이므로 직접 그립니다. 고대비 모드에서는 기본 모양으로 돌아갑니다. */
export const checkboxClass =
  "grid size-5 shrink-0 cursor-pointer appearance-none place-content-center rounded-xs border border-line-strong bg-canvas transition-colors checked:border-ink checked:bg-ink before:size-3 before:scale-0 before:bg-canvas before:transition-transform before:content-[''] before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)] checked:before:scale-100 group-hover/cb:not-checked:not-aria-invalid:border-ink-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface aria-invalid:border-danger forced-colors:appearance-auto";

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
