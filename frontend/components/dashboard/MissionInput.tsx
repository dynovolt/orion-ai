import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function MissionInput() {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-lg font-semibold mb-4">Mission Console</h2>
      <textarea
        className="w-full h-32 bg-background border border-border rounded-lg p-4 mb-4 outline-none focus:border-accent transition-colors"
        placeholder="Enter your mission instructions..."
      />
      <div className="flex justify-between items-center">
        <Button variant="outline">
          <Upload className="size-4 mr-2" />
          Upload Files
        </Button>
        <Button>Launch Mission</Button>
      </div>
    </div>
  );
}
