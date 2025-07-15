import * as React from "react";
import { UseWhitelabelReturn } from "../../hooks/useWhitelabel";
import { WHITELABEL_THEMES } from "../../lib/whitelabel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Palette, Settings, Code2, RotateCcw } from "lucide-react";

interface WhitelabelControlsProps {
  whitelabel: UseWhitelabelReturn;
  className?: string;
}

export const WhitelabelControls: React.FC<WhitelabelControlsProps> = ({
  whitelabel,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Presets
          </CardTitle>
          <CardDescription>
            Choose a preset theme to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(WHITELABEL_THEMES).map(([preset, config]) => (
              <Button
                key={preset}
                variant="outline"
                onClick={() => whitelabel.setPreset(preset)}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <div
                  className="w-8 h-8 rounded-full border-2"
                  style={{ backgroundColor: config.colors?.primary }}
                />
                <span className="capitalize text-sm font-medium">{preset}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Brand Identity
          </CardTitle>
          <CardDescription>Customize your brand name and logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                type="text"
                value={whitelabel.config.brand?.name || ""}
                onChange={(e) => whitelabel.setBrand({ name: e.target.value })}
                placeholder="Your Brand"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                type="url"
                value={whitelabel.config.brand?.logo || ""}
                onChange={(e) => whitelabel.setBrand({ logo: e.target.value })}
                placeholder="https://your-logo.png"
              />
            </div>
          </div>

          {(whitelabel.config.brand?.name || whitelabel.config.brand?.logo) && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <Label className="text-xs text-muted-foreground mb-2 block">
                PREVIEW
              </Label>
              <div className="flex items-center gap-3">
                {whitelabel.config.brand?.logo ? (
                  <img
                    src={whitelabel.config.brand.logo}
                    alt="Logo preview"
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                    style={{
                      backgroundColor:
                        whitelabel.config.colors?.primary || "#2563eb",
                    }}
                  >
                    {whitelabel.config.brand?.name?.[0]?.toUpperCase() || "W"}
                  </div>
                )}
                <span className="font-medium">
                  {whitelabel.config.brand?.name || "Your Brand"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Customize your brand colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={whitelabel.config.colors?.primary || "#2563eb"}
                  onChange={(e) =>
                    whitelabel.setColors({ primary: e.target.value })
                  }
                  className="w-12 h-10 p-1 rounded"
                />
                <Input
                  type="text"
                  value={whitelabel.config.colors?.primary || "#2563eb"}
                  onChange={(e) =>
                    whitelabel.setColors({ primary: e.target.value })
                  }
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background-color">Background</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="background-color"
                  type="color"
                  value={whitelabel.config.colors?.background || "#ffffff"}
                  onChange={(e) =>
                    whitelabel.setColors({ background: e.target.value })
                  }
                  className="w-12 h-10 p-1 rounded"
                />
                <Input
                  type="text"
                  value={whitelabel.config.colors?.background || "#ffffff"}
                  onChange={(e) =>
                    whitelabel.setColors({ background: e.target.value })
                  }
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={whitelabel.config.colors?.text || "#000000"}
                  onChange={(e) =>
                    whitelabel.setColors({ text: e.target.value })
                  }
                  className="w-12 h-10 p-1 rounded"
                />
                <Input
                  type="text"
                  value={whitelabel.config.colors?.text || "#000000"}
                  onChange={(e) =>
                    whitelabel.setColors({ text: e.target.value })
                  }
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg">
            <Label className="text-xs text-muted-foreground mb-2 block">
              COLOR PREVIEW
            </Label>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor:
                  whitelabel.config.colors?.background || "#ffffff",
                color: whitelabel.config.colors?.text || "#000000",
              }}
            >
              <Button
                style={{
                  backgroundColor:
                    whitelabel.config.colors?.primary || "#2563eb",
                }}
                className="text-white"
              >
                Primary Button
              </Button>
              <p className="mt-2 text-sm">Sample text content</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Style Options</CardTitle>
          <CardDescription>
            Configure theme and styling preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={
                    whitelabel.config.theme === "light" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => whitelabel.setTheme("light")}
                  className="justify-start"
                >
                  ☀️ Light
                </Button>
                <Button
                  variant={
                    whitelabel.config.theme === "dark" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => whitelabel.setTheme("dark")}
                  className="justify-start"
                >
                  🌙 Dark
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Radius</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "0px", label: "None" },
                  { value: "4px", label: "Small" },
                  { value: "8px", label: "Medium" },
                  { value: "12px", label: "Large" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      whitelabel.config.borderRadius === option.value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => whitelabel.setBorderRadius(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Integration
          </CardTitle>
          <CardDescription>
            Copy these URL parameters for your iframe implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>URL Parameters</Label>
              <Badge variant="secondary" className="text-xs">
                {whitelabel.toUrlParams().toString().split("&").length} params
              </Badge>
            </div>
            <div className="relative">
              <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">
                {whitelabel.toUrlParams().toString().split("&").join("\n&")}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    whitelabel.toUrlParams().toString()
                  );
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={whitelabel.reset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
