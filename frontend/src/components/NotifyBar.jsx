import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../admin/context/DataContext.tsx';

export default function NotifyBar() {
  const { db } = useData();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('fas_notify_dismissed') === '1'
  );

  // The backend's public /api/announcements endpoint already only returns
  // active announcements within their date window, so this just picks the
  // first one to display.
  const announcement = db.announcements.find((a) => a.isActive);

  if (dismissed || !announcement) return null;

  const handleClose = () => {
    setDismissed(true);
    sessionStorage.setItem('fas_notify_dismissed', '1');
  };

  const ctaLink = announcement.ctaLink || '/contact';
  const isExternal = /^https?:\/\//.test(ctaLink);

  return (
    <div className="notify-bar">
      <div className="notify-inner">
        <span>🎓 <strong>{announcement.message}</strong></span>
        {announcement.ctaText && (
          isExternal ? (
            <a href={ctaLink} className="notify-cta">{announcement.ctaText} →</a>
          ) : (
            <Link to={ctaLink} className="notify-cta">{announcement.ctaText} →</Link>
          )
        )}
      </div>
      <button className="notify-close" aria-label="Dismiss notification" onClick={handleClose}>✕</button>
    </div>
  );
}