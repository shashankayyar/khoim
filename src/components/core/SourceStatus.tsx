import { STATUS_TEXT } from '../../data/khoim';
import type { Status } from '../../data/types';
import './core.css';

export interface SourceStatusProps {
  status: Status;
}

/** "Sources agree" (full mark), "Sources differ" (half), "Official name only" (empty). Never colour alone: the words carry it. */
export function SourceStatus({ status }: SourceStatusProps) {
  const text = STATUS_TEXT[status];
  if (!text) return null;
  return (
    <span className="k-source-status">
      <span className={`k-source-status__mark k-source-status__mark--${status}`} aria-hidden="true" />
      {text}
    </span>
  );
}
