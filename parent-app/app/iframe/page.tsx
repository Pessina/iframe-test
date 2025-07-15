"use client";

import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Monitor, ExternalLink, Smartphone, Settings } from "lucide-react";

const SANDBOX_PERMISSIONS = [
  {
    key: "allow-scripts",
    label: "Scripts",
    description: "Allow JavaScript execution",
  },
  {
    key: "allow-same-origin",
    label: "Same Origin",
    description: "Access to localStorage, sessionStorage",
  },
  { key: "allow-forms", label: "Forms", description: "Allow form submissions" },
  { key: "allow-popups", label: "Popups", description: "Allow popup windows" },
  {
    key: "allow-popups-to-escape-sandbox",
    label: "Popup Escape",
    description: "Popups can escape sandbox",
  },
  {
    key: "allow-modals",
    label: "Modals",
    description: "Allow alert, confirm, prompt",
  },
  {
    key: "allow-pointer-lock",
    label: "Pointer Lock",
    description: "Allow pointer lock API",
  },
  {
    key: "allow-top-navigation",
    label: "Top Navigation",
    description: "Navigate top-level window",
  },
  {
    key: "allow-downloads",
    label: "Downloads",
    description: "Allow file downloads",
  },
];

export default function IframePage() {
  const [mounted, setMounted] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [inputUrl, setInputUrl] = useState<string>("");
  const [sandboxPermissions, setSandboxPermissions] = useState<string[]>([
    "allow-scripts",
    "allow-same-origin",
    "allow-forms",
    "allow-popups",
    "allow-popups-to-escape-sandbox",
    "allow-modals",
  ]);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setIframeUrl(inputUrl.trim());
    }
  };

  const toggleSandboxPermission = (permission: string) => {
    setSandboxPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const sandboxValue =
    sandboxPermissions.length > 0 ? sandboxPermissions.join(" ") : "";

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card ref={formRef}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Custom Iframe Viewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="url-input" className="sr-only">
                      Enter URL to display in iframe
                    </Label>
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="Enter URL to display in iframe (e.g., https://example.com)"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" disabled={!inputUrl.trim()}>
                    Load
                  </Button>
                </div>
                {iframeUrl && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                      {iframeUrl}
                    </span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Sandbox Permissions Control */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sandbox Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Toggle iframe sandbox permissions. Unchecked permissions will
                  be restricted.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SANDBOX_PERMISSIONS.map((permission) => (
                    <div
                      key={permission.key}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        sandboxPermissions.includes(permission.key)
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                      onClick={() => toggleSandboxPermission(permission.key)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {permission.label}
                        </span>
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            sandboxPermissions.includes(permission.key)
                              ? "bg-green-500 border-green-500"
                              : "border-red-300"
                          }`}
                        >
                          {sandboxPermissions.includes(permission.key) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs mt-1 opacity-75">
                        {permission.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                  <Label className="text-sm font-medium">
                    Current Sandbox Value:
                  </Label>
                  <code className="block mt-1 text-xs bg-white p-2 rounded border">
                    {sandboxValue || "(empty - maximum restrictions)"}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {iframeUrl && (
            <div className="space-y-6">
              {/* Desktop View */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-slate-600" />
                      <span className="font-medium text-sm">Desktop View</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-slate-100 p-4">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                      <iframe
                        src={iframeUrl}
                        title="Desktop Iframe Content"
                        className="w-full h-[600px] border-0"
                        tabIndex={-1}
                        sandbox={sandboxValue}
                        allow="clipboard-read; clipboard-write"
                        referrerPolicy="strict-origin-when-cross-origin"
                        onError={(e) => {
                          console.error("Iframe failed to load:", e);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile View */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-slate-600" />
                      <span className="font-medium text-sm">Mobile View</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-slate-100 p-4 flex justify-center">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border w-[375px]">
                      <iframe
                        src={iframeUrl}
                        title="Mobile Iframe Content"
                        className="w-full h-[667px] border-0"
                        tabIndex={-1}
                        sandbox={sandboxValue}
                        allow="clipboard-read; clipboard-write"
                        referrerPolicy="strict-origin-when-cross-origin"
                        onError={(e) => {
                          console.error("Iframe failed to load:", e);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!iframeUrl && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Monitor className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    No URL Provided
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Enter a URL above to display it in an iframe.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
