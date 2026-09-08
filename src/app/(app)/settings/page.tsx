"use client";

import * as React from "react";
import { Building2, Shield, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-border/50">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your organization profile, security policies, and team preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Organization Info */}
        <div className="md:col-span-2 p-5 rounded-xl border border-border/60 bg-card space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Organization Profile</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Organization Name</label>
              <Input defaultValue="Acme Corp" className="text-xs max-w-md" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Workspace URL</label>
              <div className="flex items-center max-w-md">
                <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-xs text-muted-foreground">
                  app.relay.com/
                </span>
                <Input defaultValue="acme" className="rounded-l-none text-xs" />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button type="submit" size="sm" className="text-xs">
                {saved ? "Saved ✨" : "Save Changes"}
              </Button>
              {saved && (
                <span className="text-xs text-emerald-500 font-medium animate-in fade-in">
                  Organization profile updated.
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Account Security & Sessions */}
        <div className="p-5 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Security & Login</h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Session Status</span>
              <Badge variant="success" className="text-[10px]">Active</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Two-Factor Authentication</span>
              <span className="text-muted-foreground">Not Enabled</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Data Encryption</span>
              <span className="font-medium text-foreground">TLS 1.3 · AES-256</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Manage your personal sign-in credentials, trusted devices, and security notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
