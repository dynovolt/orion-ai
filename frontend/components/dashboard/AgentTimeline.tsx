export function AgentTimeline() {
  const events = [
    { time: "10:00 AM", event: "Mission initialized" },
    { time: "10:01 AM", event: "Planner agent activated" },
  ];

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-lg font-semibold mb-4">Agent Timeline</h2>
      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-muted-foreground text-sm">{event.time}</span>
            <span className="text-sm">{event.event}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
