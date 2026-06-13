'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isWarning?: boolean;
}

export default function DiagnosePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Halo! Saya <strong>KutuBot</strong>, asisten teknisi AI KutuKabel.<br><br>Tolong jelaskan masalah Anda dengan jelas dan lengkap agar saya bisa membantu dengan baik.",
      isUser: false,
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortMessageCount, setShortMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isShortOrInvalid = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < 8) return true;

    const lowQuality = ["tes", "test", "coba", "halo", "hai", "hi", "bot", "oke", "ok", "?"];
    const lower = trimmed.toLowerCase();

    if (lowQuality.some(word => lower.includes(word) && trimmed.length < 20)) {
      return true;
    }

    if (/^[\d\s\W]+$/.test(trimmed)) return true;

    return false;
  };

  const addMessage = (text: string, isUser: boolean, isWarning = false) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      isUser,
      isWarning
    }]);
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    addMessage(trimmedInput, true);
    setInput('');
    setIsLoading(true);

    // Filter Logic
    if (isShortOrInvalid(trimmedInput)) {
      setShortMessageCount(prev => prev + 1);

      if (shortMessageCount + 1 >= 3) {
        addMessage(
          "Maaf, sepertinya Anda hanya mencoba-coba.<br><br>Untuk mendapatkan bantuan yang maksimal, tolong jelaskan masalah Anda dengan lebih lengkap ya.",
          false,
          true
        );
      } else {
        addMessage(
          "Mohon maaf, pesan Anda terlalu singkat.<br><br>Contoh yang baik:<br>• Kamera CCTV no.3 mati total setelah hujan<br>• Pintu access control tidak respon setelah scan RFID",
          false,
          true
        );
      }
      setIsLoading(false);
      return;
    }

    // Reset counter jika pesan bagus
    setShortMessageCount(0);

    // Simulasi delay (nanti ganti dengan panggil Groq API)
    setTimeout(() => {
      addMessage(
        "Terima kasih atas penjelasannya. Saya sedang menganalisa masalah Anda...<br><br>Apakah Anda bisa tambahkan informasi ini?<br>1. Merk & tipe perangkat<br>2. Gejala yang muncul persis<br>3. Sudah pernah dicoba apa saja?",
        false
      );
      setIsLoading(false);
    }, 900);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D8D4CC]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-[#1A1A18]">
            Kutu<b className="text-[#C94E18]">Kabel</b>
          </a>
          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 bg-[#C94E18] text-white rounded-full text-sm font-semibold">
              KutuBot AI
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-white border border-[#D8D4CC] rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-140px)] flex flex-col">
          
          {/* Chat Header */}
          <div className="p-6 border-b border-[#D8D4CC] flex items-center gap-4 bg-[#FAFAF8]">
            <div className="w-12 h-12 bg-[#C94E18] rounded-2xl flex items-center justify-center text-3xl">
              🤖
            </div>
            <div>
              <h1 className="text-2xl font-bold">KutuBot</h1>
              <p className="text-sm text-gray-600">Asisten Diagnosa CCTV • Access Control • Jaringan</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#F0EDE6] space-y-6" id="chat">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-5 py-4 rounded-2xl text-[15.5px] leading-relaxed ${
                    msg.isUser
                      ? 'bg-[#C94E18] text-white rounded-br-md'
                      : msg.isWarning
                      ? 'bg-yellow-100 border border-yellow-400 text-yellow-800'
                      : 'bg-white border border-[#D8D4CC] rounded-bl-md'
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#D8D4CC] px-5 py-4 rounded-2xl rounded-bl-md">
                  KutuBot sedang berpikir...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-[#D8D4CC]">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Jelaskan masalah Anda secara detail..."
                className="flex-1 px-6 py-4 bg-[#F0EDE6] border border-[#D8D4CC] rounded-full focus:outline-none focus:border-[#C94E18] text-[16px]"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 bg-[#C94E18] hover:bg-[#A93E14] disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-all"
              >
                <Send size={24} />
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">
              Gratis • Diagnosa awal AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}