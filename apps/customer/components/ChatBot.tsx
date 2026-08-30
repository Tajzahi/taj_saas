"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Ada yang bisa saya bantu terkait informasi menu dan pemesanan hari ini?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const parentDragControls = useDragControls();

  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [position, setPosition] = useState<'bottom-left' | 'top-left' | 'top-right' | 'bottom-right'>('bottom-left');
  const [parentConstraints, setParentConstraints] = useState({ left: -16, right: 300, top: -600, bottom: 16 });

  useEffect(() => {
    const updateSizeAndConstraints = () => {
      if (typeof window !== 'undefined') {
        const W = window.innerWidth;
        const H = window.innerHeight;
        setWindowSize({ width: W, height: H });
        setParentConstraints({
          left: -16,
          right: W - 80,
          top: -H + 144, // Batas atas agar tidak menabrak navbar di layar
          bottom: 16,
        });
      }
    };
    updateSizeAndConstraints();
    window.addEventListener('resize', updateSizeAndConstraints);
    return () => window.removeEventListener('resize', updateSizeAndConstraints);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    // Gunakan viewport coordinates (kurangi scroll offset) agar deteksi sudut
    // tetap akurat meskipun halaman sudah di-scroll ke bawah/samping
    const x = info.point.x - window.scrollX;
    const y = info.point.y - window.scrollY;
    const W = windowSize.width;
    const H = windowSize.height;

    const isLeft = x < W / 2;
    const isTop = y < H / 2;

    let targetPos: 'bottom-left' | 'top-left' | 'top-right' | 'bottom-right' = 'bottom-left';
    if (isLeft && !isTop) {
      targetPos = 'bottom-left';
    } else if (isLeft && isTop) {
      targetPos = 'top-left';
    } else if (!isLeft && isTop) {
      targetPos = 'top-right';
    } else {
      targetPos = 'bottom-right';
    }
    setPosition(targetPos);
  };

  const getSnapTarget = () => {
    const W = windowSize.width;
    const H = windowSize.height;

    switch (position) {
      case 'top-left':
        return { x: 0, y: 80 - (H - 80) }; // Di bawah navbar
      case 'top-right':
        return { x: W - 104, y: 80 - (H - 80) }; // Di bawah navbar
      case 'bottom-right':
        return { x: W - 168, y: 0 }; // Di samping WhatsApp
      case 'bottom-left':
      default:
        return { x: 0, y: 0 };
    }
  };

  const getChatWindowStyle = (): React.CSSProperties => {
    const isMobile = windowSize.width < 640;
    
    // HP: Tampilan modal/bottom-sheet yang terlepas sepenuhnya dari posisi ikon
    // Ini menjamin jendela chat TIDAK PERNAH terpotong di layar HP sekecil apapun
    if (isMobile) {
      return {
        bottom: '16px',
        left: '16px',
        right: '16px',
        top: 'auto',
        height: 'calc(100vh - 100px)', // Hampir full screen, sisakan jarak sedikit di atas
        maxHeight: '500px', // Jangan terlalu tinggi di HP yang agak panjang
        width: 'auto',
        transformOrigin: 'bottom center',
        zIndex: 60,
      };
    }

    // Desktop: Mengikuti sudut tempat ikon berada (menggunakan fixed coordinates)
    const baseMarginX = 24; // Jarak dasar ikon (left-6 / bottom-6 = 24px)
    const iconWidthAndGap = 56 + 16; // 72px
    const topMargin = 80; // Posisi y ikon saat di atas (menghindari navbar)

    switch (position) {
      case 'top-left':
        return { top: `${topMargin}px`, left: `${baseMarginX + iconWidthAndGap}px`, width: '384px', height: '500px', transformOrigin: 'top left' };
      case 'top-right':
        return { top: `${topMargin}px`, right: `${baseMarginX + iconWidthAndGap}px`, width: '384px', height: '500px', transformOrigin: 'top right' };
      case 'bottom-right':
        return { bottom: `${baseMarginX}px`, right: `${baseMarginX + iconWidthAndGap + 64}px`, width: '384px', height: '500px', transformOrigin: 'bottom right' };
      case 'bottom-left':
      default:
        return { bottom: `${baseMarginX}px`, left: `${baseMarginX + iconWidthAndGap}px`, width: '384px', height: '500px', transformOrigin: 'bottom left' };
    }
  };

  const getChatWindowAnimation = () => {
    const isMobile = windowSize.width < 640;
    const isTop = position.startsWith('top');
    const isLeft = position.endsWith('left');

    if (isMobile) {
      // Mobile: Animasi vertikal karena muncul di atas/bawah ikon
      return {
        initial: { opacity: 0, y: isTop ? -30 : 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: isTop ? -30 : 30, scale: 0.95 },
      };
    }

    // Desktop: Animasi horizontal karena muncul di samping ikon
    return {
      initial: { opacity: 0, x: isLeft ? -30 : 30, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: isLeft ? -30 : 30, scale: 0.95 },
    };
  };

  const startParentDrag = (event: React.PointerEvent) => {
    parentDragControls.start(event);
  };

  const quickReplies = [
    'Rekomendasi menu favorit?',
    'Lokasi & Jam operasional?',
    'Cara pesan antar / pickup?',
    'Apakah ada promo hari ini?'
  ];

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput('');
    }

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error(data.error || 'Terjadi kesalahan sistem');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, sistem asisten AI sedang sibuk atau kunci API belum dikonfigurasi dengan benar. Silakan coba kembali beberapa saat lagi atau hubungi kami langsung via WhatsApp!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        drag
        dragControls={parentDragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={parentConstraints}
        onDragEnd={handleDragEnd}
        animate={getSnapTarget()}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-6 left-6 z-50 flex flex-col items-start select-none"
      >
        {/* Floating Chat Button */}
        <motion.button
          onPointerDown={startParentDrag}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:opacity-90 cursor-grab active:cursor-grabbing relative z-50"
          style={{ background: 'linear-gradient(to top right, var(--primary-color, #8E0E0E), var(--secondary-color, #E05009))' }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
              </span>
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Chat Window (Terpisah dari motion.div drag agar tidak ikut ter-translate) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...getChatWindowAnimation()}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={getChatWindowStyle()}
            className="fixed bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-[60]"
          >
            {/* Header */}
            <div
              className="p-4 text-white flex items-center justify-between select-none"
              style={{ background: 'linear-gradient(to right, var(--primary-color, #8E0E0E), var(--secondary-color, #E05009))' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative border border-white/30 text-white">
                  <Sparkles className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Asisten Toko</h4>
                  <p className="text-xs text-white/80">Online • AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scrollbar-thin select-text">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#8E0E0E] text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && !loading && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(reply)}
                    className="flex-shrink-0 bg-white border border-gray-200 hover:border-[#8E0E0E] hover:text-[#8E0E0E] text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t bg-white flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan sesuatu..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-[#8E0E0E]/20 transition-all select-text"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
