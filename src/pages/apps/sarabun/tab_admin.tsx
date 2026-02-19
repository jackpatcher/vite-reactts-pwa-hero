import { useState } from 'react'
import { Card, CardBody } from '@heroui/react'
import { TabsHeader } from './app_route'

type Doc = { id: string; title: string; sender: string; status: string; assignedTo?: string }

export default function SarabunAdmin() {
  const [docs, setDocs] = useState<Doc[]>([
    { id: '1', title: 'คำสั่งประชุม', sender: 'ครูสมปอง', status: 'มาถึง ผอ' },
    { id: '2', title: 'แบบฟอร์มอนุมัติ', sender: 'ครูสมชาย', status: 'มาถึง ผอ' },
  ])

  function assignTo(id: string, assignee: string) {
    setDocs(docs.map(d => d.id === id ? { ...d, assignedTo: assignee, status: `มอบให้ ${assignee}` } : d))
  }

  return (
    <div>
      <TabsHeader />

      <Card className="p-4">
        <CardBody>
          <div className="space-y-3">
            {docs.map(d => (
              <div key={d.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{d.title}</div>
                  <div className="text-xs text-gray-500">จาก {d.sender} — {d.status} {d.assignedTo ? `• ${d.assignedTo}` : ''}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={() => assignTo(d.id, 'ฝ่ายบริหาร')}>มอบ ฝ่ายบริหาร</button>
                  <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm" onClick={() => assignTo(d.id, 'รอง ผอ')}>มอบ รอง ผอ</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm" onClick={() => assignTo(d.id, 'ครู/กลุ่มสาระ')}>มอบ ครู/กลุ่มสาระ</button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
