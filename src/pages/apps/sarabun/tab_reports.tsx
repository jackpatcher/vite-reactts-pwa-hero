import { Card, CardBody } from '@heroui/react'
import { TabsHeader } from './app_route'

export default function SarabunReports() {
  function handlePrint() {
    // Simple print; later we can render a print-only layout or PDF
    window.print()
  }

  return (
    <div>
      <TabsHeader />

      <Card className="p-4">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-700">สรุปรายการเอกสารวันนี้</div>
            <div>
              <button onClick={handlePrint} className="px-3 py-1 bg-blue-600 text-white rounded">พิมพ์ A4</button>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div>• เอกสารรับเข้า: 12</div>
            <div>• เอกสารส่งออก: 3</div>
            <div>• รอเสนอ: 5</div>
            <div>• เซ็นแล้ว: 7</div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
