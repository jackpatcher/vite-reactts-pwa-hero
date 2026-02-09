# สรุป: ใช้ Google Sheets + Cloudflare Workers + GitHub Pages

## 1) GitHub Pages + env
- GitHub Pages เป็น static hosting: ใช้ env ได้แค่ตอน build-time เท่านั้น
- ใน Vite ต้องใช้ตัวแปรที่ขึ้นต้นด้วย VITE_
- ถ้าค่าเปลี่ยน ต้อง build ใหม่ (re-run workflow)

## 2) เก็บค่าใน Google Sheets ได้ไหม
- ทำได้เฉพาะค่าที่ไม่ลับ (public) เพราะทุกคนเข้าถึงได้
- ถ้าเป็นคีย์ลับ/ข้อมูลลับ ไม่ควรเก็บในชีต public

## 3) Cloudflare Workers ช่วยยังไง
- Frontend เรียก Worker
- Worker ไปอ่าน Google Sheets แทน โดยคีย์ลับเก็บใน Worker (Secrets)
- ข้อมูลลับไม่ถูกฝังใน frontend

## 4) Service Account ต้องมี JSON ไหม
- ต้องมี JSON credentials
- แต่ไม่ควรเก็บใน repo
- ให้เก็บเป็น Secret ใน Cloudflare Workers แล้วอ่านจาก env

## 5) ฟรีไหม และลิมิต
- Cloudflare Workers มีฟรี tier (เหมาะกับงานเล็ก/ส่วนตัว)
- Google Sheets API มีโควตา ทั้งแบบ API key และ OAuth/Service Account
- ประมาณ 1,000 ครั้ง/วัน ถือว่าน้อย อยู่ในโควตาฟรีได้

## 6) เลือกแบบไหนดี
- ข้อมูลไม่ลับ/อ่านอย่างเดียว: ใช้ API key + Worker (ง่ายสุด)
- ข้อมูลลับ/คุมสิทธิ์: ใช้ Service Account หรือ OAuth ผ่าน Worker
