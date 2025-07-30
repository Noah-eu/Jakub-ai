"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { askJakub } from "../../utils/openai";

type Message = {
  sender: 'user' | 'jakub';
  text: string;
};

const HISTORY_KEY = "jakub_chat_history";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Načtení historie z localStorage při startu
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Uložení historie po každé změně
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    // Posun na konec chatu
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Volání API s celou historií
      const answer = await askJakub(input, newMessages);
      setMessages((msgs) => [
        ...msgs,
        { sender: 'jakub', text: answer }
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'jakub', text: "Omlouvám se, něco se pokazilo. Zkuste to prosím znovu." }
      ]);
    }
    setLoading(false);
  }

  function handleReset() {
    setMessages([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  return (
    <div className="max-w-md w-full mx-auto flex flex-col h-[90vh] max-h-[700px] bg-white rounded-2xl shadow-xl p-4">
      {/* Hlavička s fotkou a jménem */}
      <div className="flex flex-col items-center mb-4">
        <img src="/jakub.jpg" alt="Jakub" className="w-16 h-16 rounded-full shadow-md" />
        <div className="font-semibold text-gray-700 mt-2">Jakub</div>
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 underline mt-1"
        >
          Začít znovu
        </button>
      </div>
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && (
          <MessageBubble sender="jakub" text="Jakub přemýšlí..." />
        )}
        <div ref={chatBottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl p-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Napiš zprávu Jakubovi…"
          disabled={loading}
        />
        <button
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
          onClick={handleSend}
          disabled={loading}
        >
          Odeslat
        </button>
      </div>
    </div>
  );
}

