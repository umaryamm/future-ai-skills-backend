/* Floating WhatsApp button, rendered once in Layout so it appears on
   every public page. Update PHONE (international format, no + or spaces)
   and MESSAGE to change where it links. */

const PHONE = '923008739555'; // +92 300 8739555
const MESSAGE = 'Hi Future AI Skills! I would like to know more about your courses.';

export default function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      className="whatsapp-fab"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.46 1.712 6.402L3.2 28.8l6.564-1.68a12.74 12.74 0 0 0 6.237 1.62h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.052A12.71 12.71 0 0 0 16.001 3.2zm0 2.133c2.85 0 5.527 1.11 7.542 3.126a10.62 10.62 0 0 1 3.125 7.541c0 5.884-4.788 10.667-10.672 10.667a10.6 10.6 0 0 1-5.406-1.48l-.388-.23-4.028 1.03 1.075-3.926-.253-.403a10.58 10.58 0 0 1-1.62-5.658c0-5.884 4.788-10.667 10.672-10.667zm-4.57 5.7c-.216 0-.567.08-.864.403-.297.323-1.134 1.108-1.134 2.7 0 1.593 1.16 3.132 1.322 3.348.162.216 2.283 3.487 5.53 4.888.772.334 1.375.533 1.844.681.775.246 1.48.211 2.037.128.622-.093 1.913-.782 2.183-1.538.27-.755.27-1.403.19-1.538-.081-.135-.297-.216-.62-.377-.324-.162-1.913-.944-2.21-1.052-.297-.108-.513-.162-.729.162-.216.323-.836 1.052-1.025 1.268-.19.216-.378.243-.702.081-.324-.162-1.366-.503-2.602-1.605-.962-.858-1.611-1.918-1.8-2.241-.19-.324-.02-.499.142-.66.146-.146.324-.378.486-.567.162-.19.216-.324.324-.54.108-.216.054-.405-.027-.567-.081-.162-.708-1.76-1.005-2.406-.252-.556-.508-.542-.729-.552l-.62-.011z"
        />
      </svg>
      <span className="whatsapp-fab-label">WhatsApp</span>
    </a>
  );
}
