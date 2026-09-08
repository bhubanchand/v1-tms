import { MessageSquare, Hash, Users, Send, Paperclip } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const CHANNELS = [
    { name: "general", unread: 0 },
    { name: "engineering", unread: 2 },
    { name: "design-critique", unread: 0 },
    { name: "announcements", unread: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Team Chat
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Contextual discussions organized by project channels and direct messages.
          </p>
        </div>
        <Badge variant="outline" className="text-xs self-start sm:self-auto">
          Phase 4 Preview
        </Badge>
      </div>

      {/* Chat Container Interface */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-xl border border-border/70 overflow-hidden bg-card min-h-[460px]">
        {/* Channel Rail */}
        <div className="p-3 border-b md:border-b-0 md:border-r border-border/60 bg-muted/20 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
            Channels
          </div>
          <div className="space-y-1">
            {CHANNELS.map((channel) => (
              <div
                key={channel.name}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  channel.name === "engineering"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5" />
                  <span>{channel.name}</span>
                </div>
                {channel.unread > 0 && (
                  <span className="text-[10px] bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.2 rounded-full">
                    {channel.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="md:col-span-3 flex flex-col justify-between p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar fallback="AL" className="h-8 w-8" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Alex Lee</span>
                  <span className="text-[10px] text-muted-foreground">10:42 AM</span>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0">Manager</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 bg-muted/40 p-2.5 rounded-lg max-w-md">
                  Phase 0 application shell is looking great. The 360px mobile view with bottom navigation works cleanly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Avatar fallback="JD" className="h-8 w-8" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Jane Doe</span>
                  <span className="text-[10px] text-muted-foreground">10:45 AM</span>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0">CEO</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 bg-muted/40 p-2.5 rounded-lg max-w-md">
                  Next up is Phase 1 Auth + Organization isolation. Supabase RLS will ensure complete data privacy across tenants.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Input Placeholder */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type message in #engineering... (Realtime coming Phase 4)"
              disabled
              className="text-xs"
            />
            <Button size="icon" className="h-8 w-8" disabled>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
