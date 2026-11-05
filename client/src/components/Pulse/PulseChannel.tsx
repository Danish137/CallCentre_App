import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { ChannelThread } from '../../types';
import { PinnedInputCard } from './PinnedInputCard';
import styles from './PulseChannel.module.css';

interface PulseChannelProps {
  channelId: string;
  thread: ChannelThread;
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onRespondPinned: (optionId: string, replyText?: string) => void;
}

export const PulseChannel: React.FC<PulseChannelProps> = ({
  channelId,
  thread,
  onBack,
  onSendMessage,
  onRespondPinned,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.channelWrapper}>
      {/* Header */}
      <div className={styles.headerBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Channels</span>
        </button>

        <div>
          <div className={styles.channelTitle}>{thread.title}</div>
          <div className={styles.channelMeta}>{thread.dateLabel}</div>
        </div>
      </div>

      {/* Pinned "Needs your input" card if present */}
      {thread.pinnedCard && (
        <PinnedInputCard
          card={thread.pinnedCard}
          onRespond={onRespondPinned}
        />
      )}

      {/* Messages Feed */}
      <div className={styles.messagesScroll}>
        {thread.messages.map((msg) => {
          const isSelf = msg.isSelf;

          return (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${isSelf ? styles.messageRowSelf : ''}`}
            >
              <div
                className={styles.messageAvatar}
                style={{
                  background: msg.bg || (isSelf ? '#1d9e75' : '#e0e7ff'),
                  color: msg.color || (isSelf ? '#ffffff' : '#3730a3'),
                }}
              >
                {msg.init}
              </div>

              <div className={styles.messageContent}>
                <div
                  className={`${styles.messageMeta} ${
                    isSelf ? styles.messageMetaSelf : ''
                  }`}
                >
                  <span className={styles.senderName}>{msg.who}</span>
                  <span className={styles.msgTime}>{msg.time}</span>
                </div>

                <div
                  className={`${styles.messageBubble} ${
                    isSelf ? styles.bubbleSelf : msg.isBot ? styles.bubbleBot : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input Bar */}
      <div className={styles.inputBar}>
        <input
          type="text"
          className={styles.textInput}
          placeholder={`Message ${thread.title}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.sendBtn} onClick={handleSend} title="Send message">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

