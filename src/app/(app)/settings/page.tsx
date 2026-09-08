import { Building2, Shield, Key, Bell, Palette, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your organization profile, teams, authentication, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organization Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Organization Profile</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Basic identification information for your company workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Organization Name</label>
              <Input defaultValue="Acme Corp" className="text-xs max-w-md" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Workspace Slug</label>
              <div className="flex items-center max-w-md">
                <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-xs text-muted-foreground">
                  app.tms.com/
                </span>
                <Input defaultValue="acme" className="rounded-l-none text-xs" />
              </div>
            </div>
            <div className="pt-2">
              <Button size="sm" className="text-xs">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Multi-tenancy Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-base">Security & RLS</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Multi-tenant architecture status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Supabase RLS</span>
                <Badge variant="success" className="text-[10px]">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Client ID Trust</span>
                <Badge variant="outline" className="text-[10px] text-rose-500 border-rose-500/30">Never Trusted</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tenant Isolation</span>
                <span className="font-semibold text-emerald-500">Database-enforced</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              In Phase 1, password reset, organization invitations, and session cookies will be active.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
