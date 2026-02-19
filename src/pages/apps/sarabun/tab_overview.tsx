import { useMemo, useState, useEffect, type JSX } from "react";
import { TabsHeader } from "./app_route";
import MetricCard from "../../../components/MetricCard";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { MapPin, FileText, Search, Clipboard, File, FileCheck, ChevronLeft, ChevronRight } from "lucide-react";

export default function SarabunOverview() {
  const [query, setQuery] = useState("")
  const [docType, setDocType] = useState("all")
  const [dept, setDept] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const pageSize = 6

  const docs = useMemo(() => [
    {
      id: 1,
      type: "คำสั่ง",
      number: "ว25-2569/1",
      title: "รายงานการประชุม",
      status: "มอบหมายแล้ว",
      date: "19 ก.พ. 2569 10:05",
      dept: "ฝ่ายกิจการนักเรียน",
      iconBg: "bg-pink-100",
    },
    {
      id: 2,
      type: "คำสั่ง",
      number: "ว25-2569/2",
      title: "หนังสือเวียน",
      status: "รอเสนอ",
      date: "20 ก.พ. 2569 09:00",
      dept: "ฝ่ายบริหาร",
      iconBg: "bg-green-100",
    },
    {
      id: 3,
      type: "รายงาน",
      number: "ว25-2569/3",
      title: "แบบฟอร์มรายงาน",
      status: "เซ็นแล้ว",
      date: "18 ก.พ. 2569 14:30",
      dept: "ฝ่ายการเงิน",
      iconBg: "bg-blue-100",
    },
  ], [])

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (docType !== "all" && d.type !== docType) return false
      if (dept !== "all" && d.dept !== dept) return false
      if (statusFilter !== "all" && !d.status.includes(statusFilter)) return false
      if (query) {
        const hay = `${d.title} ${d.type} ${d.dept} ${d.status} ${d.date}`.toLowerCase()
        if (!hay.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [docs, docType, dept, query, statusFilter])

  // reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [docType, dept, query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  function badgeClassForStatus(status: string) {
    const s = status?.toLowerCase() || ''
    if (s.includes('เซ็น')) return 'text-xs text-white bg-emerald-500 px-2 py-1 rounded-full'
    if (s.includes('มอบ')) return 'text-xs text-white bg-orange-400 px-2 py-1 rounded-full'
    if (s.includes('รอ')) return 'text-xs text-white bg-sky-500 px-2 py-1 rounded-full'
    return 'text-xs text-white bg-gray-400 px-2 py-1 rounded-full'
  }

  const typeMeta: Record<string, { badgeClass: string; bgClass: string; icon: JSX.Element }> = {
    คำสั่ง: {
      badgeClass: 'text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full',
      bgClass: 'bg-amber-100',
      icon: <FileText className="w-6 h-6 text-amber-600" />,
    },
    รายงาน: {
      badgeClass: 'text-xs font-medium bg-violet-100 text-violet-700 px-2 py-1 rounded-full',
      bgClass: 'bg-violet-100',
      icon: <Clipboard className="w-6 h-6 text-violet-600" />,
    },
    แบบฟอร์ม: {
      badgeClass: 'text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full',
      bgClass: 'bg-green-100',
      icon: <FileCheck className="w-6 h-6 text-green-600" />,
    },
  }

  function getTypeMeta(type: string) {
    if (!type) return { badgeClass: 'text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full', bgClass: 'bg-gray-100', icon: <File className="w-6 h-6 text-sky-600" /> }
    const key = Object.keys(typeMeta).find((k) => type.includes(k))
    return key ? typeMeta[key as keyof typeof typeMeta] : { badgeClass: 'text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full', bgClass: 'bg-gray-100', icon: <File className="w-6 h-6 text-sky-600" /> }
  }

  return (
    <div>


      <TabsHeader />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricCard
          title="รอเสนอ"
          value="5"
          subtitle="เอกสารรอเสนอ"
          initials="รส"
          accent="#3b82f6"
            progress={68}
            onClick={() => setStatusFilter('รอเสนอ')}
            active={statusFilter === 'รอเสนอ'}
          titleEn="Pending"
          subtitleEn="Documents awaiting proposal"
        />
        <MetricCard
          title="เซ็นแล้ว"
          value="7"
          subtitle="เอกสารที่ลงนามแล้ว"
          initials="สล"
          accent="#10b981"
            progress={74}
            onClick={() => setStatusFilter('เซ็น')}
            active={statusFilter === 'เซ็น'}
          titleEn="Signed"
          subtitleEn="Signed documents"
        />
        <MetricCard
          title="มอบหมาย"
          value="3"
          subtitle="เอกสารที่ถูกมอบหมาย"
          initials="มม"
          accent="#f97316"
            progress={42}
            onClick={() => setStatusFilter('มอบ')}
            active={statusFilter === 'มอบ'}
          titleEn="Assigned"
          subtitleEn="Documents assigned to others"
        />
        <MetricCard
          title="ทั้งหมด"
          value="12"
          subtitle="เอกสารรวมในระบบ"
          initials="ทท"
          accent="#8b5cf6"
            progress={100}
            onClick={() => setStatusFilter('all')}
            active={statusFilter === 'all'}
          titleEn="Total"
          subtitleEn="Total documents in system"
        />
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader className="px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <div className="font-medium">รายการเอกสาร</div>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  placeholder="ค้นหาเอกสาร หรือหัวข้อ..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select value={docType} onChange={(e) => setDocType(e.target.value)} className="py-2 px-3 border rounded-lg">
                <option value="all">ประเภท: ทั้งหมด</option>
                <option value="คำสั่ง">คำสั่ง</option>
                <option value="รายงาน">รายงาน</option>
              </select>
              <select value={dept} onChange={(e) => setDept(e.target.value)} className="py-2 px-3 border rounded-lg">
                <option value="all">หน่วยงาน: ทั้งหมด</option>
                <option value="ฝ่ายกิจการนักเรียน">ฝ่ายกิจการนักเรียน</option>
                <option value="ฝ่ายบริหาร">ฝ่ายบริหาร</option>
                <option value="ฝ่ายการเงิน">ฝ่ายการเงิน</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
            {paginated.map((it) => (
              <div key={it.id} className="w-full bg-white rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className={`${getTypeMeta(it.type).bgClass || it.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  {getTypeMeta(it.type).icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-gray-800">{it.title} <span className="text-xs text-gray-400 ml-2">{it.number}</span></div>
                        <div className={getTypeMeta(it.type).badgeClass}>{it.type}</div>
                      </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                          <div>{it.date}</div>
                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-pink-500" /> <span className="text-pink-600">{it.dept}</span></div>
                        </div>
                    </div>
                    <div className="flex items-start">
                      <div className={badgeClassForStatus(it.status)}>{it.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">แสดง {Math.min(filtered.length, page * pageSize)} จาก {filtered.length} รายการ</div>
            <div className="flex items-center gap-2">
              <button
                aria-label="ก่อนหน้า"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              <div className="px-3 py-1 border rounded text-sm bg-white">{page} / {totalPages}</div>

              <button
                aria-label="ถัดไป"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
