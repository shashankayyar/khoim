/* A short confirmation, such as "Link copied" (design/components/share/Toast.jsx). A polite live region; the app
   clears it after 2400ms (--dur-demo). */
import { Icon } from '../core/Icon';
import './share.css';

export function Toast({ text }: { text: string | null }) {
  return (
    <div className="k-toast-wrap" role="status" aria-live="polite">
      {text && <div className="k-toast"><Icon name="check" size={18} />{text}</div>}
    </div>
  );
}
