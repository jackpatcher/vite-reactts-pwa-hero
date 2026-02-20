import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }: Props) {
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-600 dark:text-gray-300">แสดง {Math.min(totalItems, page * pageSize)} จาก {totalItems} รายการ</div>

      <div className="flex items-center gap-2">
        <button
          aria-label="ก่อนหน้า"
          disabled={!canPrev}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="p-2 rounded-md border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-700"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-200" />
        </button>

        <div className="px-3 py-1 border border-gray-200 rounded text-sm bg-white dark:bg-slate-700 shadow-sm text-gray-700 dark:text-gray-200">{page} / {totalPages}</div>

        <button
          aria-label="ถัดไป"
          disabled={!canNext}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="p-2 rounded-md border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-700"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-200" />
        </button>
      </div>
    </div>
  )
}
