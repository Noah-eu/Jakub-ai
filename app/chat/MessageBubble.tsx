type MessageBubbleProps = {
  sender: 'user' | 'jakub';
  text: string;
};

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  return (
    <div className={`flex items-end ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      {/* Fotka u Jakuba zprávy */}
      {sender === 'jakub' && (
        <img
          src="/jakub.jpg"
          alt="Jakub"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <div
        className={`
          rounded-2xl px-4 py-2 max-w-xs
          ${sender === 'user'
            ? 'bg-blue-500 text-white self-end'
            : 'bg-gray-200 text-gray-900 self-start'}
        `}
      >
        {text}
      </div>
    </div>
  );
}
