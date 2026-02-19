import { useState } from 'react'
import { Card, CardBody } from '@heroui/react'
import FloatLabelInput from '../../../components/FloatLabelInput'
import { TabsHeader } from './app_route'

export default function SarabunOfficer() {
  const [title, setTitle] = useState('')
  const [uploader, setUploader] = useState('')
  const [file, setFile] = useState<File | null>(null)

  function handleUpload() {
    // TODO: wire to API or shared state
    alert(`อัปโหลด (ตัวอย่าง)\nหัวข้อ: ${title}\nผู้ส่ง: ${uploader}\nไฟล์: ${file?.name || '(ไม่มี)'}`)
    setTitle('')
    setUploader('')
    setFile(null)
  }

  function handleSendToDirector() {
    // Simulate sending to ผอ
    alert('ส่งหนังสือไปยังผู้อำนวยการเรียบร้อย (ตัวอย่าง)')
  }

  return (
    <div>
      <TabsHeader />

      <Card className="p-4">
        <CardBody>
          <div className="space-y-3">
            <FloatLabelInput name="title" label="หัวข้อเอกสาร" value={title} onChange={setTitle} />
            <FloatLabelInput name="uploader" label="ผู้ส่ง" value={uploader} onChange={setUploader} />

            <div>
              <label className="block text-sm text-gray-600 mb-1">ไฟล์ (PDF)</label>
              <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpload}>อัปโหลด</button>
              <button className="px-4 py-2 bg-amber-500 text-white rounded" onClick={handleSendToDirector}>ส่งผอ</button>
              <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => { setTitle(''); setUploader(''); setFile(null) }}>ล้าง</button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
