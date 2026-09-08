"use client";

import * as React from "react";
import { Hash, Send, Paperclip, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  fallback: string;
  content: string;
  time: string;
}

const CHANNELS = [
  { name: "general", unread: 0 },
  { name: "engineering", unread: 2 },
  { name: "design-critique", unread: 0 },
  { name: "announcements", unread: 0 },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "Alex Lee",
    role: "Manager",
    fallback: "AL",
    content: "The refined warm neutral design system and 360px mobile navigation look and feel great.",
    time: "10:42 AM",
  },
  {
    id: "msg-2",
    sender: "Jane Doe",
    role: "CEO",
    fallback: "JD",
    content: "Excellent. The threat model and multi-tenant RLS boundaries ensure client-supplied tenant IDs will never be trusted.",
    time: "10:45 AM",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = React.useState("");
  const [activeChannel, setActiveChannel] = React.useState("engineering");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "Jane Doe",
      role: "CEO",
      fallback: "JD",
      content: inputVal.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Team Chat
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Contextual team channels, project discussions, and direct messages.
          </p>
        </div>
        <Badge variant="outline" className="text-xs self-start sm:self-auto">
          Phase 4 Preview
        </Badge>
      </div>

      {/* Chat Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 rounded-xl border border-border/70 overflow-hidden bg-card min-h-[460px]">
        {/* Channel Rail */}
        <div className="p-3 border-b md:border-b-0 md:border-r border-border/60 bg-muted/20 space-y-3">
          <div className="text-[11px] font-medium text-muted-foreground px-2">
            Channels
          </div>
          <div className="space-y-0.5">
            {CHANNELS.map((channel) => (
              <button
                key={channel.name}
                onClick={() => setActiveChannel(channel.name)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left",
                  activeChannel === channel.name
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5" />
                  <span>{channel.name}</span>
                </div>
                {channel.unread > 0 && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full",
                      activeChannel === channel.name
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="md:col-span-3 flex flex-col justify-between p-4 space-y-4">
          <div className="space-y-4 overflow-y-auto max-h-96">
            {messages.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="Start a conversation."
                description="Send a message to your team to begin collaboration."
              />
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <Avatar fallback={msg.fallback} className="h-8 w-8 text-xs" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      <Badge variant="secondary" className="text-[9px] px-1 py-0">
                        {msg.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground/90 mt-1 bg-muted/30 p-2.5 rounded-lg max-w-md leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={sendMessage} className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Message #${activeChannel}...`}
              className="text-xs"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
