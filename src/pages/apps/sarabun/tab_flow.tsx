import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/react";
import { TabsHeader } from "./app_route";

type Doc = { id: string; title: string; uploader: string; status: string; approver?: string };

export default function SarabunFlow() {
  const [docs, setDocs] = useState<Doc[]>([
    { id: "1", title: "คำสั่งประชุม", uploader: "ครูสมปอง", status: "รอดำเนินการ", approver: "ผอ" },
    { id: "2", title: "แบบฟอร์มอนุมัติ", uploader: "ครูสมชาย", status: "ระหว่างส่งต่อ", approver: "รอง ผอ" },
  ]);

  const advance = (id: string) =>
    setDocs(docs.map(d =>
      d.id === id
        ? {
            ...d,
            approver: d.approver === "ผอ" ? "รอง ผอ" : d.approver === "รอง ผอ" ? "เซ็น" : undefined,
            status: d.approver === "เซ็น" ? "เสร็จแล้ว" : "ระหว่างส่งต่อ",
          }
        : d
    ));

  // Removed unused activeTab state

  return (
    <div>
      <div className="app-page-header mb-4">
        <div>
          <h3>รายการเอกสาร</h3>
          <p className="app-page-subtitle">จัดการและส่งต่อเอกสาร</p>
        </div>
      </div>
      <TabsHeader />

      <div className="p-4 bg-white rounded shadow">
        <Tabs aria-label="Sarabun options" disabledKeys={["history"]}>
          <Tab key="list" title="รายการ" aria-label="รายการ">
            <Card>
              <CardBody>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th>หัวข้อ</th>
                      <th>ผู้ส่ง</th>
                      <th>สถานะ</th>
                      <th>การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="py-2">{d.title}</td>
                        <td className="py-2">{d.uploader}</td>
                        <td className="py-2">{d.status} {d.approver ? `• ${d.approver}` : ''}</td>
                        <td className="py-2">
                          <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => advance(d.id)}>ส่งต่อ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="history" title="ประวัติ" aria-label="ประวัติ">
            <Card>
              <CardBody>
                <ul className="space-y-2 text-sm">
                  {docs.map((d) => (
                    <li key={d.id} className="p-2 border rounded">
                      <div className="font-medium">{d.title}</div>
                      <div className="text-xs text-gray-500">โดย {d.uploader} — {d.status} {d.approver ? `• ${d.approver}` : ''}</div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="settings" title="การตั้งค่า" aria-label="การตั้งค่า">
            <Card>
              <CardBody>
                <div className="text-sm text-gray-600">การตั้งค่า (ตัวอย่าง): กำหนดผู้อนุมัติเริ่มต้น, แจ้งเตือน, ฯลฯ</div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
