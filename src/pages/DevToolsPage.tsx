import DatabaseQuickView from "../components/DatabaseQuickView";
import DatabaseViewer from "../components/DatabaseViewer";

export default function DevToolsPage() {
  return (
    <div className="space-y-6">
      {/* Quick Overview */}
      <DatabaseQuickView />

      {/* Full Viewer */}
      <DatabaseViewer />
    </div>
  );
}
