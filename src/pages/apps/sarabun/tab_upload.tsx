import { useState } from "react";
import FloatLabelInput from "../../../components/FloatLabelInput";
import { TabsHeader } from "./app_route";

export default function SarabunUpload() {
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <div className="app-page-header mb-4">
        <div>
          <h3>อัปโหลดเอกสาร</h3>
          <p className="app-page-subtitle">ส่งไฟล์ PDF เพื่อเข้าสู่กระบวนการอนุมัติ</p>
        </div>
      </div>

      <TabsHeader />

      <div className="p-4 bg-white rounded shadow space-y-3">
        <FloatLabelInput name="title" label="หัวข้อเอกสาร" value={title} onChange={setTitle} />
        <FloatLabelInput name="uploader" label="ผู้ส่ง" value={uploader} onChange={setUploader} />
        <div>
          <label className="block text-sm text-gray-600 mb-1">ไฟล์ (PDF)</label>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => alert('อัปโหลดตัวอย่าง: ' + (file?.name || '(no file)'))}>อัปโหลด</button>
          <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => { setTitle(""); setUploader(""); setFile(null); }}>ล้าง</button>
        </div>
      </div>
    </div>
  );
}
