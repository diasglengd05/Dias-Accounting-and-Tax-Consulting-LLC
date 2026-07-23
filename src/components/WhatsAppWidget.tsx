import React, { useState } from "react";
import { MessageSquare, X, Send, Check } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Open WhatsApp Web/App with custom message
    const phoneNumber = "971529226958"; // UAE phone number for Dias Accounting
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setMessage("");
    setIsOpen(false);
  };

  const selectQuickQuery = (query: string) => {
    const phoneNumber = "971529226958";
    const text = `Hi Dias Accounting! I would like to inquire about: ${query}.`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="w-[330px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden mb-4 transition-all duration-300 scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120"
                  alt="Glen Dias - Tax Consultant"
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm leading-tight">Glen Dias</h5>
                <span className="text-[10px] text-emerald-100 font-medium">Senior Tax Advisor</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="p-4 bg-slate-50 space-y-3 max-h-[220px] overflow-y-auto text-xs">
            <div className="bg-emerald-50 text-slate-800 p-3 rounded-2xl rounded-tl-none border border-emerald-100/50 max-w-[90%] leading-relaxed">
              <p className="font-semibold text-[10px] text-emerald-700 mb-1">Glen from Dias Accounting</p>
              Hi there! 👋 I am Glen, a senior tax advisor here. 
              <br /><br />
              How can I help you optimize your taxes or handle your bookkeeping today?
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Frequently Asked Queries:
              </span>
              <button
                onClick={() => selectQuickQuery("Corporate Tax Registration")}
                className="w-full text-left bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 px-3 py-2 rounded-xl border border-slate-100 transition-all font-medium text-[11px] block truncate"
              >
                📝 Register for UAE Corporate Tax
              </button>
              <button
                onClick={() => selectQuickQuery("Bookkeeping Quotation")}
                className="w-full text-left bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 px-3 py-2 rounded-xl border border-slate-100 transition-all font-medium text-[11px] block truncate"
              >
                📊 Monthly Bookkeeping Quotation
              </button>
              <button
                onClick={() => selectQuickQuery("VAT Advisory Filing")}
                className="w-full text-left bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 px-3 py-2 rounded-xl border border-slate-100 transition-all font-medium text-[11px] block truncate"
              >
                📈 Quarterly VAT Filing assistance
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your tax query here..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-800 bg-white"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
              aria-label="Send WhatsApp message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 focus:outline-none relative group cursor-pointer"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow animate-bounce">
          1
        </span>
        <MessageSquare className="w-7 h-7" />
        
        {/* Hover label */}
        <span className="absolute right-16 bg-navy-950 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all origin-right pointer-events-none whitespace-nowrap">
          Consult on WhatsApp
        </span>
      </button>
    </div>
  );
}
