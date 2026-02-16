import { useEffect, useState } from "react";
import { Card, CardBody, Chip, Button } from "@heroui/react";
import { FlowbiteIcon } from "./FlowbiteIcon";
import { db } from "../modules/storage";

type QuickStat = {
  table: string;
  count: number;
  icon: React.ReactNode;
};

export default function DatabaseQuickView() {
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [totalSize, setTotalSize] = useState<string>("calculating...");

  const loadStats = async () => {
    const tableNames = db.tables.map((t) => t.name);
    const icons: Record<string, React.ReactNode> = {
      config: <FlowbiteIcon name="config" size={22} />,
      appState: <FlowbiteIcon name="appState" size={22} />,
      todos: <FlowbiteIcon name="package" size={22} />,
      notes: <FlowbiteIcon name="package" size={22} />,
      userProfiles: <FlowbiteIcon name="package" size={22} />,
    };

    const data = await Promise.all(
      tableNames.map(async (name) => {
        const count = await db.table(name).count();
        return {
          table: name,
          count,
          icon: icons[name] || <FlowbiteIcon name="package" size={22} />,
        };
      })
    );

    setStats(data);
    
    // Calculate approximate size
    try {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const usedMB = (usage / (1024 * 1024)).toFixed(2);
        const quotaMB = (quota / (1024 * 1024)).toFixed(0);
        setTotalSize(`${usedMB} MB / ${quotaMB} MB`);
      }
    } catch (e) {
      setTotalSize("unknown");
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  const totalItems = stats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><FlowbiteIcon name="overview" size={22} /> Database Overview</h3>
          <Button size="sm" variant="flat" onPress={() => void loadStats()} isIconOnly aria-label="Refresh">
            <FlowbiteIcon name="refresh" size={18} />
          </Button>
        </div>

        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          marginBottom: 8,
        }}>
          {stats.map((stat) => {
            const colorClass = stat.table === "config"
              ? "metric-card--users"
              : stat.table === "appState"
              ? "metric-card--revenue"
              : "";
            const iconBg = stat.table === "config"
              ? "metric-media-art metric-media-art--users"
              : stat.table === "appState"
              ? "metric-media-art metric-media-art--revenue"
              : "metric-media-art";
            return (
              <Card key={stat.table} className={`metric-card ${colorClass}`} isBlurred shadow="sm" style={{
                minWidth: 120,
                maxWidth: 160,
                padding: 0,
                margin: 0,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <CardBody className="metric-media" style={{padding: 10, gap: 8, minHeight: 0}}>
                  <div className={iconBg} style={{fontSize: 22, width: 32, height: 32, marginRight: 8}}>{stat.icon}</div>
                  <div className="metric-media-content" style={{gap: 2}}>
                    <div className="metric-media-title" style={{textTransform: "capitalize", fontSize: 13}}>{stat.table}</div>
                    <div className="metric-media-stat" style={{fontSize: 20}}>{stat.count}</div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Chip color="primary" variant="flat">
            <FlowbiteIcon name="package" size={16} className="mr-1" /> Total Items: {totalItems}
          </Chip>
          <Chip color="secondary" variant="flat">
            <FlowbiteIcon name="database" size={16} className="mr-1" /> Tables: {stats.length}
          </Chip>
          <Chip color="success" variant="flat">
            <FlowbiteIcon name="database" size={16} className="mr-1" /> Storage: {totalSize}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}
