import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Paperclip, Search, Clock, Check, CheckCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  category: 'urgent' | 'routine' | 'administrative';
}

interface User {
  id: string;
  full_name: string;
  role: string;
  online: boolean;
}

export default function Chat() {
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<Message['category']>('routine');

  useEffect(() => {
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, payload => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    // Fetch initial messages
    fetchMessages();
    fetchUsers();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: userId,
          receiver_id: userId, // Replace with actual recipient
          content: newMessage,
          category,
        }
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Handle file upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('medical-files')
      .upload(`${userId}/${file.name}`, file);

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    // Send message with file link
    const fileUrl = data.path;
    await sendMessage();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Users Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto">
          {users.map(user => (
            <div
              key={user.id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user.full_name.charAt(0)}
                  </span>
                </div>
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{user.full_name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">Team Chat</h2>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                HIPAA Secure
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-lg rounded-lg px-4 py-2 ${
                  message.sender_id === userId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs opacity-75">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </span>
                  {message.category === 'urgent' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p>{message.content}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  {message.read ? (
                    <CheckCheck className="h-4 w-4 opacity-75" />
                  ) : (
                    <Check className="h-4 w-4 opacity-75" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center space-x-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Message['category'])}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="administrative">Administrative</option>
            </select>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.png,.doc,.docx"
              />
              <Paperclip className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}