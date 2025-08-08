import React, { useEffect, useState, memo } from "react";
import { CircleOff, Cpu, HardDrive, Server, Clock } from "lucide-react";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
// Mock server performance data
const generateServerData = () => {
  return {
    cpu: Math.floor(Math.random() * 40) + 30,
    memory: Math.floor(Math.random() * 30) + 50,
    disk: Math.floor(Math.random() * 20) + 30,
    responseTime: Math.floor(Math.random() * 200) + 100,
    uptime: 99.98,
    lastIncident: "23 days ago",
    status: "Operational",
    activeConnections: Math.floor(Math.random() * 1000) + 500,
    lastRestart: "7 days ago",
    region: "US-East",
  };
};
const ServerPerformance: React.FC = () => {
  const [serverData, setServerData] = useState(generateServerData());
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateServerData();
      setServerData(newData);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "success";
      case "Degraded":
        return "warning";
      case "Outage":
        return "destructive";
      default:
        return "info";
    }
  };
  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex flex-col items-center justify-center p-1 sm:p-2">
              <Cpu className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                CPU
              </div>
              <div className="mb-1 text-base sm:text-xl font-bold">
                {serverData.cpu}%
              </div>
              <Progress value={serverData.cpu} className="h-1 sm:h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex flex-col items-center justify-center p-1 sm:p-2">
              <HardDrive className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Memory
              </div>
              <div className="mb-1 text-base sm:text-xl font-bold">
                {serverData.memory}%
              </div>
              <Progress value={serverData.memory} className="h-1 sm:h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex flex-col items-center justify-center p-1 sm:p-2">
              <Server className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Response
              </div>
              <div className="mb-1 text-base sm:text-xl font-bold">
                {serverData.responseTime}ms
              </div>
              <Progress
                value={serverData.responseTime / 5}
                className="h-1 sm:h-1.5"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex flex-col items-center justify-center p-1 sm:p-2">
              <CircleOff className="mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Uptime
              </div>
              <div className="mb-1 text-base sm:text-xl font-bold">
                {serverData.uptime}%
              </div>
              <Progress value={serverData.uptime} className="h-1 sm:h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm font-medium">
                Server Status
              </div>
              <Badge className={`bg-${getStatusColor(serverData.status)}`}>
                {serverData.status}
              </Badge>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center justify-between">
              <div className="text-xs sm:text-sm font-medium">
                Active Connections
              </div>
              <div className="text-xs sm:text-sm">
                {serverData.activeConnections}
              </div>
            </div>
            <div className="mt-1 sm:mt-2 flex items-center justify-between">
              <div className="text-xs sm:text-sm font-medium">Region</div>
              <div className="text-xs sm:text-sm">{serverData.region}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <div className="text-xs sm:text-sm font-medium">Time Stats</div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center justify-between">
              <div className="text-xs sm:text-sm font-medium">Last Restart</div>
              <div className="text-xs sm:text-sm">{serverData.lastRestart}</div>
            </div>
            <div className="mt-1 sm:mt-2 flex items-center justify-between">
              <div className="text-xs sm:text-sm font-medium">
                Last Incident
              </div>
              <div className="text-xs sm:text-sm">
                {serverData.lastIncident}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between text-xs sm:text-sm">
        <div>
          <span className="font-medium">Disk Usage:</span> {serverData.disk}%
        </div>
        <div>
          <span className="font-medium">Last Updated:</span> Just now
        </div>
      </div>
    </div>
  );
};
export { ServerPerformance };
