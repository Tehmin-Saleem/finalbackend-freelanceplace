import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, X } from 'lucide-react';

const ChatInterface = ({ selectedChat, messages, onSendMessage, isTyping }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSend = () => {
    if (newMessage.trim() || attachment) {
      const formData = new FormData();
      if (newMessage) {
        formData.append('content', newMessage);
      }
      if (attachment) {
        formData.append('file', attachment.file);
      }
      formData.append('chatId', selectedChat._id);
      
      onSendMessage(formData);
      setNewMessage('');
      clearAttachment();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert('File size exceeds 100MB limit');
        return;
      }

      setAttachment({ name: file.name, file });

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    setPreview(null);
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="text-sm text-gray-600">{message.sender.name}</div>
            <div className="bg-gray-100 p-3 rounded-lg">
              {message.content && <p>{message.content}</p>}
              {message.attachment && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    <span>{message.attachment.fileName}</span>
                    <button className="text-blue-500 hover:text-blue-700">
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-gray-500">Typing...</div>}
      </div>

      <div className="border-t p-4">
        {attachment && (
          <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">{attachment.name}</span>
            </div>
            <button onClick={clearAttachment} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Paperclip className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </label>
          
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;