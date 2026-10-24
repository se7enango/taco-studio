/**
 * 기호 아이콘. 글자(+, −, ✕)로 쓰면 글꼴마다 폭과 굵기가 달라 열고 닫을 때 흔들리므로 같은 크기의 상자에 선으로 그립니다.
 * 크기는 글자 크기의 0.75배, 색은 currentColor를 따릅니다.
 */
import type { ReactNode } from "react";

type IconProps = { className?: string };

const base = "size-[0.75em] shrink-0";

function Svg({ className = "", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`${base} ${className}`}
    >
      {children}
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M1.5 6h9M6 1.5v9" />
    </Svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M1.5 6h9" />
    </Svg>
  );
}

export function CrossIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
    </Svg>
  );
}

/** 접고 펴는 <details>의 + / − 표시. 부모 <details>에 `group` 클래스가 있어야 합니다. */
export function DisclosureIcon({ className = "" }: IconProps) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center text-ink-muted ${className}`}>
      <PlusIcon className="group-open:hidden" />
      <MinusIcon className="hidden group-open:inline" />
    </span>
  );
}
