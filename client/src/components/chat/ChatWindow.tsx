import React, { useState, useEffect, useRef } from 'react';
import { IMessage, IConversation } from '@/types/chat';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Send, ArrowLeft, Edit2, X, Check } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageHelper';

interface ChatWindowProps {
  conversation: IConversation;
  messages: IMessage[];
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  loading: boolean;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  onEditMessage,
  loading,
  onBack,
}) => {
  const { user: currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participants.find(
    (p) => p._id !== currentUser?._id
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleEditClick = (message: IMessage) => {
    setEditingMessageId(message._id);
    setEditContent(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (editingMessageId && editContent.trim()) {
      await onEditMessage(editingMessageId, editContent);
      setEditingMessageId(null);
      setEditContent('');
    }
  };

  if (!otherParticipant) return <div>Conversation error</div>;

  const imageUrl = getImageUrl(otherParticipant.profilePicture);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden mr-3 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={otherParticipant.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover mr-3"
            unoptimized
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
            {otherParticipant.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">
            {otherParticipant.name}
          </h3>
          <p className="text-xs text-green-500">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center mt-4">Loading messages...</div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender === currentUser?._id;
            const isEditing = editingMessageId === message._id;

            return (
              <div
                key={message._id}
                className={`flex ${
                  isOwn ? 'justify-end' : 'justify-start'
                } group`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm relative ${
                    isOwn
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="text-gray-900 px-2 py-1 rounded bg-white border border-indigo-300 outline-none w-full min-w-[150px]"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 hover:bg-indigo-500 rounded text-green-300"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 hover:bg-indigo-500 rounded text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>{message.content}</p>
                      <div
                        className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                          isOwn ? 'text-indigo-200' : 'text-gray-400'
                        }`}
                      >
                        {message.isEdited && <span>(edited)</span>}
                        <span>{format(new Date(message.createdAt), 'p')}</span>
                      </div>
                    </>
                  )}
                  {isOwn && !isEditing && (
                    <button
                      onClick={() => handleEditClick(message)}
                      className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-indigo-100"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 p-2"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
