import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { TabsHeader } from "./app_route";

export default function SarabunOverview() {
  return (
    <div>
      <div className="app-page-header mb-4">
        <div>
          <h3>ภาพรวมระบบ Sarabun</h3>
          <p className="app-page-subtitle">สถิติและเอกสารล่าสุด</p>
        </div>
        <div />
      </div>

      <TabsHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>เอกสารทั้งหมด</CardHeader>
          <CardBody>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-500">รวมเอกสารในระบบ</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>รอดำเนินการ</CardHeader>
          <CardBody>
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-gray-500">กำลังส่งต่อให้ผู้อนุมัติ</div>
            <Progress value={40} className="mt-2" aria-label="Pending approvals progress" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>เสร็จแล้ว</CardHeader>
          <CardBody>
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-gray-500">อนุมัติแล้ว</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
