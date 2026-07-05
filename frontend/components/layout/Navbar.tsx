export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="font-semibold">Mission Control</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">Connected</div>
        <div className="size-3 rounded-full bg-success"></div>
      </div>
    </header>
  );
}
