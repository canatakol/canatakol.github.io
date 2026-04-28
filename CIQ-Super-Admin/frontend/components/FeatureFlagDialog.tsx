import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface FeatureFlagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function FeatureFlagDialog({
  open,
  onOpenChange,
  onSubmit,
}: FeatureFlagDialogProps) {
  const [formData, setFormData] = useState({
    key: "",
    name: "",
    description: "",
    enabled: false,
    rolloutPercentage: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      key: "",
      name: "",
      description: "",
      enabled: false,
      rolloutPercentage: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Feature Flag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="feature_name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enabled: checked })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollout">Rollout Percentage</Label>
            <Input
              id="rollout"
              type="number"
              min="0"
              max="100"
              value={formData.rolloutPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rolloutPercentage: Number(e.target.value),
                })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Create Feature Flag
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
