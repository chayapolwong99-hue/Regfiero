# FIERO SCHOOL SYSTEM - FULL STACK SYSTEM

ระบบบริหารจัดการงานทะเบียน วัดผล และสารสนเทศนักเรียน โรงเรียนฟีร์โร่

## วิธีการรันระบบหลังบ้าน (Backend Server)
สามารถรันระบบเซิร์ฟเวอร์ได้ทันทีโดยไม่ต้องติดตั้งไลบรารีภายนอกเพิ่มเติม:
```bash
node server.js
```
ระบบจะเปิดให้บริการที่ http://localhost:3000 พร้อมจัดเก็บข้อมูลลงใน data/database.json โดยอัตโนมัติ

## การ Deploy ขึ้นออนไลน์
1. **Vercel**: นำโปรเจกต์ขึ้น Vercel ได้ทันที มีการตั้งค่า vercel.json และ serverless functions รองรับ
2. **Netlify Drop**: ลากวางโฟลเดอร์นี้ที่ app.netlify.com/drop ได้ทันที
