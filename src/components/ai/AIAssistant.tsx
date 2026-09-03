'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  Camera,
  AlertTriangle,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  Pill,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AIChatMessage, PrescriptionMedicine } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const AIAssistant: React.FC = () => {
  const {
    patientProfile,
    language,
    setIsEmergencyOpen,
    setActiveTab,
    addToCart,
    showToast
  } = useApp();

  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: 'image' | 'pdf' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load chat history
  const loadChatHistory = async () => {
    try {
      const res = await fetch('/api/ai/chat');
      const data = await res.json();
      if (data.history) {
        setMessages(data.history);
      }
    } catch (e) {
      console.error('Error fetching chat history:', e);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Web Speech API Voice Input
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice speech recognition not supported in this browser. Please type your query.', 'info');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'Spanish' ? 'es-ES' : language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... speak your medical question now.', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !attachedFile) return;

    setInputText('');
    const curAttachment = attachedFile;
    setAttachedFile(null);

    // Optimistic user bubble
    const userBubble: AIChatMessage = {
      id: `user-${Date.now()}`,
      patientId: 'user-patient-1',
      sessionId: 'session-default',
      sender: 'user',
      text: textToSend || `[Uploaded file: ${curAttachment?.name}]`,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userBubble]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          mediaAttachment: curAttachment
        })
      });
      const data = await res.json();
      setIsTyping(false);

      if (data.aiMessage) {
        setMessages((prev) => [...prev, data.aiMessage]);
        playChimeSound(data.triage?.isEmergency ? 'emergency' : 'notification');

        // If emergency triggered, open emergency modal automatically
        if (data.triage?.isEmergency) {
          setIsEmergencyOpen(true);
        }
      }
    } catch (e) {
      setIsTyping(false);
      showToast('Error communicating with AI assistant', 'error');
    }
  };

  const handleClearChat = async () => {
    try {
      await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      loadChatHistory();
      showToast('Chat history cleared', 'info');
    } catch (e) {
      showToast('Error clearing chat', 'error');
    }
  };

  const handleExportChat = () => {
    const transcript = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediai-consultation-chat-${Date.now()}.txt`;
    a.click();
    showToast('Chat transcript exported', 'success');
  };

  // Quick suggestion chips
  const suggestionChips = [
    'I have chest pain and shortness of breath',
    'I have this prescription to upload',
    'When will my Atorvastatin refill run out?',
    'How should I take Metformin 500mg?',
    'Explain my upcoming doctor appointment'
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 170px)',
        maxHeight: '850px',
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* AI Header */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-hover)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}
          >
            <Bot size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: 'var(--font-md)' }}>MediAI Clinical Assistant</span>
              <span className="badge badge-success" style={{ fontSize: '10px' }}>Online</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Medical Triage & Prescription Intelligence • Active Language: {language}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={handleExportChat}
            className="btn btn-secondary btn-sm"
            title="Export Consultation"
          >
            <Download size={14} />
            <span style={{ display: 'none' }}>Export</span>
          </button>
          <button
            onClick={handleClearChat}
            className="btn btn-secondary btn-sm"
            title="Clear Chat"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Clinical Disclaimer Alert */}
      <div
        style={{
          padding: '0.4rem 1rem',
          background: 'rgba(2, 132, 199, 0.08)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}
      >
        <Sparkles size={13} color="var(--primary)" />
        <span>
          Non-diagnostic triage assistant. For acute emergencies, call 911 or visit the Emergency Room.
        </span>
      </div>

      {/* Chat Messages Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          const isEmergency = msg.type === 'emergency_alert' || msg.data?.isEmergency;
          const extractedRx = msg.data?.extractedPrescription;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                flexDirection: isAI ? 'row' : 'row-reverse'
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: isAI
                    ? isEmergency
                      ? 'var(--emergency-red)'
                      : 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)'
                    : 'var(--surface-hover)',
                  color: isAI ? 'white' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: isAI ? 'var(--shadow-xs)' : 'none'
                }}
              >
                {isAI ? <Bot size={18} /> : <User size={18} />}
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: '82%',
                  padding: '0.9rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: isAI
                    ? isEmergency
                      ? 'var(--emergency-light)'
                      : 'var(--surface-muted)'
                    : 'linear-gradient(135deg, var(--primary) 0%, #0f766e 100%)',
                  color: isAI ? (isEmergency ? '#7f1d1d' : 'var(--text-main)') : 'white',
                  border: isEmergency ? '1.5px solid var(--emergency-red)' : '1px solid var(--border-subtle)',
                  fontSize: 'var(--font-sm)',
                  lineHeight: 1.6,
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {isEmergency && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 800,
                      color: 'var(--emergency-red)',
                      marginBottom: '0.5rem',
                      fontSize: 'var(--font-sm)'
                    }}
                  >
                    <AlertTriangle size={18} />
                    <span>TIME-SENSITIVE EMERGENCY DETECTED</span>
                  </div>
                )}

                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                {/* If Emergency, render immediate SOS action button */}
                {isEmergency && (
                  <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setIsEmergencyOpen(true)}
                      className="btn btn-danger btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <AlertTriangle size={14} />
                      <span>Open Emergency SOS Page</span>
                    </button>
                    <a href="tel:911" className="btn btn-secondary btn-sm">
                      Call 911 Direct
                    </a>
                  </div>
                )}

                {/* If Structured Prescription Detected */}
                {extractedRx && (
                  <div
                    style={{
                      marginTop: '0.9rem',
                      padding: '0.85rem',
                      background: 'var(--surface-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 'var(--font-xs)', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      EXTRACTED PRESCRIPTION DETAILS
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                      Prescriber: <strong>{extractedRx.doctorName}</strong> ({extractedRx.doctorRegNumber}) • Date: {extractedRx.date}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.8rem' }}>
                      {extractedRx.medicines.map((m: PrescriptionMedicine, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.5rem 0.6rem',
                            borderRadius: '4px',
                            background: 'var(--surface-hover)',
                            fontSize: 'var(--font-xs)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 700 }}>{m.medicineName}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                              ({m.dosage} • {m.frequency} • {m.foodInstruction.replace('_', ' ')})
                            </span>
                          </div>
                          <span className="badge badge-primary">{m.duration}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons: Edit | Confirm | Save | Order */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          showToast('Prescription saved to My Health Records!', 'success');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <CheckCircle2 size={13} color="var(--primary)" />
                        <span>Save to Prescriptions</span>
                      </button>

                      <button
                        onClick={() => {
                          extractedRx.medicines.forEach((m: PrescriptionMedicine) => {
                            addToCart({
                              id: `item-${Date.now()}-${m.id}`,
                              medicineId: 'med-3',
                              medicineName: m.medicineName,
                              quantity: 1,
                              unitPrice: 8.40,
                              totalAmount: 8.40,
                              requiresPrescription: true
                            });
                          });
                          setActiveTab('orders');
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        <ShoppingBag size={13} />
                        <span>Order Medicines Now</span>
                      </button>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    fontSize: '10px',
                    opacity: 0.7,
                    marginTop: '0.4rem',
                    textAlign: isAI ? 'left' : 'right'
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)' }}>
            <Bot size={18} />
            <span style={{ fontSize: 'var(--font-xs)', fontStyle: 'italic' }}>
              MediAI is analyzing your clinical query...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div
        style={{
          padding: '0.5rem 1rem',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-hover)'
        }}
      >
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              color: 'var(--text-secondary)'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Attachment Preview (if any) */}
      {attachedFile && (
        <div
          style={{
            padding: '0.4rem 1rem',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--font-xs)',
            color: 'var(--primary)',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={14} />
            <span>Attached for AI review: {attachedFile.name}</span>
          </div>
          <button onClick={() => setAttachedFile(null)} style={{ color: 'var(--primary)', fontWeight: 800 }}>
            ✕
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--surface-card)'
        }}
      >
        {/* Attachment triggers */}
        <label
          style={{
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--text-muted)'
          }}
          title="Attach Image or Report"
        >
          <input
            type="file"
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAttachedFile({
                  name: file.name,
                  type: file.type.includes('pdf') ? 'pdf' : 'image'
                });
                showToast(`Attached ${file.name}`, 'info');
              }
            }}
          />
          <Camera size={18} />
        </label>

        {/* Voice Input Toggle */}
        <button
          onClick={toggleSpeechRecognition}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-xs)',
            color: isListening ? 'var(--emergency-red)' : 'var(--text-muted)',
            background: isListening ? 'var(--emergency-light)' : 'transparent'
          }}
          title={isListening ? 'Stop Listening' : 'Voice Input (Speech-to-Text)'}
        >
          {isListening ? <MicOff size={18} className="anim-heartbeat" /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          placeholder={isListening ? 'Listening to your voice...' : 'Type medical questions, symptoms, or medication queries...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="input-control"
          style={{
            flex: 1,
            borderRadius: 'var(--radius-full)',
            background: 'var(--surface-hover)',
            border: isListening ? '1.5px solid var(--emergency-red)' : '1px solid var(--border-subtle)'
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          className="btn btn-primary"
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            borderRadius: '50%',
            flexShrink: 0
          }}
          title="Send Query"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
