import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Chip,
  Input,
} from "@heroui/react";
import { db, clearTable, setAppState } from "../modules/storage";
import { useTheme } from "../modules/storage/hooks";
import { useToast } from "./ToastContext";
import { CheckCircle } from "flowbite-react-icons/solid";
import { CloseCircle, Clipboard as CopyIcon } from "flowbite-react-icons/outline";
import { FlowbiteIcon } from "./FlowbiteIcon";
import ConfirmModal from "./ConfirmModal";
import { useThemeColor, useThemeColorRgba, hexToRgba } from "../hooks/useThemeColor";

export default function DatabaseViewer() {
  const theme = useTheme();
  const isDark = theme?.mode === "dark";
  const themeColor = useThemeColor();
  const themeColorRgba = useThemeColorRgba(0.05);
  const [selectedTable, setSelectedTable] = useState<string>("config");
  const [searchTerm, setSearchTerm] = useState("");
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { showToast } = useToast();

  // Get current app states for toggling


  // Toggle functions for appState


  // Populate sample data for appState
  async function populateSampleData() {
    if (confirm("Add sample app state data?")) {
      try {
        await setAppState({ appId: "inventory", isFavorite: true, isInstalled: true });
        await setAppState({ appId: "analytics", isFavorite: false, isInstalled: true });
        await setAppState({ appId: "crm", isFavorite: true, isInstalled: false });
        await setAppState({ appId: "billing", isFavorite: false, isInstalled: false });
        await setAppState({ appId: "catalog", isFavorite: true, isInstalled: true });
        showToast({ message: "Sample data added successfully!", type: "success", icon: <CheckCircle className="text-green-500 mr-2" size={18} /> });
      } catch (error) {
        showToast({ message: "Error adding sample data: " + error, type: "danger", icon: <CloseCircle className="text-red-500 mr-2" size={18} /> });
      }
    }
  }

  // Use useLiveQuery to reactively load all table data
  const allTablesData = useLiveQuery(async () => {
    const tableNames = db.tables.map((t) => t.name);
    const tableData = await Promise.all(
      tableNames.map(async (name) => {
        const data = await db.table(name).toArray();
        
        // Extract columns from first item
        const columns = data.length > 0 
          ? Object.keys(data[0] as Record<string, unknown>).sort()
          : [];
        
        return {
          name,
          count: data.length,
          data,
          columns,
        };
      })
    );
    return tableData;
  });

  const tables = allTablesData ?? [];

  // Get current table data
  const currentTable = tables.find((t) => t.name === selectedTable);
  const currentData = currentTable?.data || [];

  // Filter data
  const filteredData = currentData.filter((item) => {
    if (!searchTerm) return true;
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  // Clear table
  const handleClearTable = async () => {
    setIsClearing(true);
    try {
      await clearTable(selectedTable);
      // useLiveQuery will auto-update
      showToast({ message: `Cleared ${selectedTable} successfully!`, type: "success", icon: <CheckCircle className="text-green-500 mr-2" size={18} /> });
    } catch (error) {
      showToast({ message: `Error clearing ${selectedTable}: ` + error, type: "danger", icon: <CloseCircle className="text-red-500 mr-2" size={18} /> });
    } finally {
      setIsClearing(false);
      setIsClearOpen(false);
    }
  };

  // Get primary key from item


  // Render value safely


  return (
    <>
      <div 
        className={`p-4 md:p-6 min-h-screen flex flex-col ${isDark ? "bg-gray-900" : "bg-gray-50"}`} 
        style={{overflow: 'visible'}}
      >
        <Card className={`flex-1 flex flex-col shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`} style={{overflow: 'visible'}}>
          <CardHeader className={`flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b-2 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <div>
              <h2 className={`text-3xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}><FlowbiteIcon name="overview" size={28} /> IndexedDB Viewer</h2>
              <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Database: ambridge-db (Auto-updating ✨)</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedTable === "appState" && currentData.length === 0 && (
                <Button color="primary" variant="solid" size="sm" onPress={populateSampleData} className="font-semibold relative" startContent={<FlowbiteIcon name="plus" size={16} />}>
                  Add Sample Data
                </Button>
              )}
              <Button color="danger" variant="flat" size="sm" onPress={() => setIsClearOpen(true)} className="font-semibold relative" startContent={<FlowbiteIcon name="trash" size={16} />}>
                Clear
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 flex-1 flex flex-col">
            {/* Table Tabs */}
            <div className={`border-b ${isDark ? "border-gray-700" : "border-gray-300"}`}>
              <Tabs
                selectedKey={selectedTable}
                onSelectionChange={(key) => setSelectedTable(key as string)}
                color="primary"
                variant="underlined"
                size="lg"
                classNames={{
                  tabList: "gap-6 w-full p-0",
                  cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-500",
                  tab: `max-w-fit px-4 h-12 font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`,
                  tabContent: `group-data-[selected=true]:${isDark ? "text-blue-400" : "text-blue-600"} font-semibold`,
                }}
              >
                {tables.map((table) => {
                  const icon = table.name === "config"
                    ? <FlowbiteIcon name="config" size={18} />
                    : table.name === "appState"
                    ? <FlowbiteIcon name="appState" size={18} />
                    : <FlowbiteIcon name="package" size={18} />;
                  return (
                    <Tab
                      key={table.name}
                      title={
                        <span className="flex items-center gap-1.5">
                          <span className="text-base mr-1">{icon}</span>
                          <span className="capitalize font-bold">{table.name}</span>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.375rem 0.375rem',
                              borderRadius: '0.5rem',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              lineHeight: 1,
                              backgroundColor: themeColorRgba,
                              color: themeColor,
                              boxShadow: `0 2px 8px ${hexToRgba(themeColor, 0.1)}`,
                            }}
                          >
                            {table.count}
                          </span>
                        </span>
                      }
                    />
                  );
                })}
              </Tabs>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col gap-2">
              <Input
                placeholder="🔍 Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isClearable
                onClear={() => setSearchTerm("")}
                className="w-full"
                size="lg"
                startContent={<span className="text-lg">🔍</span>}
                classNames={{
                  input: isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900",
                  inputWrapper: isDark ? "bg-gray-700" : "bg-white",
                }}
              />
              <div className="flex gap-2 flex-wrap text-xs md:text-sm">
                  <Chip color="primary" variant="flat" className="font-bold">
                    <FlowbiteIcon name="overview" size={15} className="mr-1" /> Total: {currentData.length}
                  </Chip>
                  <Chip color="secondary" variant="flat" className="font-bold">
                    <FlowbiteIcon name="search" size={15} className="mr-1" /> Filtered: {filteredData.length}
                  </Chip>
              </div>
            </div>

            {/* Data Display */}
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No data found</p>
              </div>
            ) : (
              <div className={`flex-1 overflow-auto rounded-xl p-3 ${isDark ? "bg-gray-900" : "bg-white"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredData.map((item, index) => {
                    const mainKey = item.key || item.appId || item.id || `#${index + 1}`;
                    const jsonStr = JSON.stringify(item.value ?? item, null, 2);
                    return (
                      <Card key={index} className={`shadow-sm ${isDark ? "bg-gray-800" : "bg-white"}`} style={{minWidth: 0, border: 'none', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'}}>
                        <CardBody className="p-2 space-y-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.375rem 0.375rem',
                                borderRadius: '0.5rem',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                lineHeight: 1,
                                backgroundColor: themeColorRgba,
                                color: themeColor,
                                boxShadow: `0 2px 8px ${hexToRgba(themeColor, 0.1)}`,
                                minWidth: 0,
                                maxWidth: '100%',
                                textShadow: '0 1px 2px rgba(0,0,0,0.10)'
                              }}
                            >
                              {mainKey}
                            </span>
                            <span className="font-normal text-xs ml-1" style={{opacity: 0.7}}>: key</span>
                            <Button size="sm" variant="flat" color="secondary" style={{marginLeft: 'auto', fontSize: 13, minWidth: 0, height: 22, padding: 0, width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                              isIconOnly
                              aria-label="Copy JSON"
                              className="relative"
                              onPress={() => {
                                navigator.clipboard.writeText(jsonStr);
                                showToast({ message: `Copied!`, type: "success", icon: <CheckCircle className="text-green-500 mr-2" size={18} /> });
                              }}
                            >
                              <CopyIcon size={16} />
                            </Button>
                          </div>
                          {/* ตัด key ข้างล่าง heading ออก ไม่แสดง */}
                          <pre className={`p-2 rounded text-xs font-mono overflow-auto max-h-32 ${isDark ? "bg-gray-900 text-green-400" : "bg-gray-100 text-gray-900"}`} style={{fontSize: 11, margin: 0}}>
                            {jsonStr}
                          </pre>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        isOpen={isClearOpen}
        title="Clear table data?"
        message={`This will permanently delete all records in ${selectedTable}.`}
        confirmText="Clear"
        cancelText="Cancel"
        isLoading={isClearing}
        buttonColor={themeColor}
        onConfirm={handleClearTable}
        onCancel={() => setIsClearOpen(false)}
      />
    </>
  );
}
