# 🏪 Surat OTOP Biz v2.0

ระบบจัดการธุรกิจสำหรับผู้ประกอบการ OTOP จังหวัดสุราษฎร์ธานี

**🎯 เวอร์ชันนี้ปรับปรุงให้สอดคล้องกับทะเบียนผู้ประกอบการ OTOP ต้นทาง**

---

## ✨ จุดเด่นของเวอร์ชัน 2.0

### 🔄 รองรับข้อมูลจากทะเบียนต้นทาง
- โครงสร้างฐานข้อมูลสอดคล้องกับทะเบียน OTOP ของสำนักงานพัฒนาชุมชนจังหวัดสุราษฎร์ธานี
- นำเข้าข้อมูลจากทะเบียนได้โดยตรง (Copy-Paste หรือ Import)
- ไม่ต้องปรับแก้ข้อมูลเดิม

### 📊 โครงสร้างข้อมูล Users

```
คอลัมน์จากทะเบียนต้นทาง (A-F):
├── user_id (รหัสผู้ใช้)
├── entrepreneurs_name (ชื่อผู้ประกอบการ)
├── operating_model (ลักษณะผู้ประกอบการ)
├── chairman_owner_name (ชื่อประธานกลุ่ม/เจ้าของ)
├── address_info (ที่อยู่)
└── phone (เบอร์โทร)

คอลัมน์เพิ่มเติมสำหรับระบบ (G-L):
├── email (อีเมล)
├── password (รหัสผ่าน - แฮชแล้ว)
├── status (สถานะ: Active/Ban)
├── registration_date (วันที่ลงทะเบียน)
├── district (อำเภอ)
└── last_login (เข้าใช้ครั้งล่าสุด)
```

---

## 🎯 คุณสมบัติหลัก

### 🧮 Smart Costing
- คำนวณต้นทุนสินค้าอัตโนมัติ
- รองรับวัตถุดิบหลายรายการ
- คำนวณราคาขายแนะนำ
- พิจารณาค่าการตลาดและกำไร

### 💰 Accounting
- บันทึกรายรับรายจ่าย
- รายงานสรุปรายเดือน
- แยกประเภทรายการ
- ติดตามกำไรขาดทุน

### 📊 Dashboard
- สรุปภาพรวมธุรกิจ
- สถิติรายเดือน
- รายการล่าสุด
- ข่าวสารและประกาศ

---

## 🚀 การติดตั้งและใช้งาน

### 📋 สิ่งที่ต้องเตรียม

1. ✅ บัญชี Google (suratotopbiz@gmail.com)
2. ✅ GitHub Account
3. ✅ Cloudflare Account
4. ✅ ทะเบียนผู้ประกอบการ OTOP (Excel/CSV)

---

### 📖 คู่มือการใช้งาน

อ่านคู่มือตามลำดับ:

1. **SHEETS_SETUP.md** ⭐ (อ่านก่อน!)
   - วิธีตั้งค่า Google Sheets
   - วิธีนำข้อมูลจากทะเบียนต้นทางมาใช้
   - ตัวอย่างการ Import ข้อมูล

2. **QUICK_START.md**
   - เริ่มใช้งานได้ใน 10 นาที
   - ขั้นตอนย่อที่สำคัญ

3. **SETUP_GUIDE.md**
   - คู่มือติดตั้งแบบละเอียด
   - แก้ไขปัญหาที่พบบ่อย

---

## 📥 วิธีนำข้อมูลจากทะเบียนมาใช้

### แบบง่าย (Copy-Paste)

```bash
1. เปิดไฟล์ Excel ทะเบียน OTOP
2. เลือกข้อมูลคอลัมน์ A-F (ไม่รวม Header)
3. Copy (Ctrl+C)
4. เปิด Google Sheets → ชีท "Users"
5. Paste ที่เซลล์ A2 (Ctrl+V)
6. เพิ่มข้อมูลคอลัมน์ G-L ตามต้องการ
```

### แบบละเอียด

ดูคู่มือใน **SHEETS_SETUP.md**

---

## ⚙️ การตั้งค่า

### 1. แก้ไขไฟล์ config

**js/config.js:**
```javascript
// บรรทัดที่ 5-6
API_BASE_URL: 'https://script.google.com/macros/s/YOUR_ID/exec',
SHEET_ID: 'YOUR_SHEET_ID_HERE',
```

### 2. Deploy Google Apps Script

**GAS_Code.gs:**
```javascript
// บรรทัดที่ 6
SHEET_ID: 'YOUR_SHEET_ID_HERE',
```

คัดลอกไป script.google.com → Deploy เป็น Web App

### 3. Push ไป GitHub

```bash
git add .
git commit -m "Setup config"
git push origin main
```

Cloudflare Pages จะ deploy อัตโนมัติ!

---

## 📂 โครงสร้างโปรเจค

```
suratotopbiz/
├── 📄 index.html              # หน้า Login
├── 📄 dashboard.html          # Dashboard
├── 📄 costing.html           # Smart Costing
├── 📄 accounting.html        # Accounting
├── 📁 js/
│   ├── config.js             # ⚠️ แก้ไขที่นี่!
│   ├── auth.js
│   ├── api.js
│   ├── dashboard.js
│   ├── costing.js
│   └── utils.js
├── 📄 GAS_Code.gs            # ⚠️ Deploy ที่นี่!
└── 📁 docs/
    ├── SHEETS_SETUP.md       # คู่มือ Sheets ⭐
    ├── QUICK_START.md
    └── SETUP_GUIDE.md
```

---

## 🎓 ตัวอย่างข้อมูล

### ทะเบียนต้นทาง (Excel)

```
user_id | entrepreneurs_name    | operating_model | chairman_owner_name | address_info        | phone
OTOP001 | นางสาวสมหญิง ใจดี      | รายบุคคล        | นางสาวสมหญิง ใจดี    | 123 หมู่ 5 ต.มะขาม  | 0812345678
OTOP002 | กลุ่มแม่บ้านบ้านนา      | กลุ่มอาชีพ      | นางสมศรี แสงจันทร์   | 456 หมู่ 7 ต.บ้านนา | 0898765432
```

### หลัง Import ใน Google Sheets

```
A-F: ข้อมูลจากต้นทาง (เหมือนเดิม)
G: email (ว่างไว้)
H: password (ว่างไว้ - จะแฮชเมื่อตั้งรหัสผ่าน)
I: Active
J: 2026-01-27
K: เมืองสุราษฎร์ธานี
L: (ว่างไว้ - อัปเดตเมื่อ login)
```

---

## ✅ Checklist ก่อนใช้งาน

- [ ] นำข้อมูลจากทะเบียนเข้า Google Sheets
- [ ] ตั้งค่า Data Validation (Status, District)
- [ ] Deploy Google Apps Script
- [ ] แก้ไข js/config.js
- [ ] Push ไป GitHub
- [ ] ทดสอบ Login ด้วย user จริง

---

## 🔧 แก้ไขปัญหา

### ปัญหา: นำข้อมูลเข้าแล้ว Login ไม่ได้

✅ **แก้ไข:**
1. เช็คว่า Column F (phone) มีเบอร์โทรถูกต้อง
2. เช็คว่า Column I (status) เป็น "Active"
3. ตั้งรหัสผ่านก่อน (คลิก "ตั้งรหัสผ่านครั้งแรก")

### ปัญหา: ข้อมูลบางคอลัมน์หาย

✅ **แก้ไข:**
1. เช็คว่า Import ครบทั้ง 6 คอลัมน์ (A-F)
2. ถ้าขาด → เพิ่มคอลัมน์ที่ขาด
3. Save และลองใหม่

### ปัญหา: ระบบแสดงชื่อผิด

✅ **แก้ไข:**
- ระบบจะแสดง `entrepreneurs_name` (คอลัมน์ B)
- ถ้าไม่มี จะแสดง `chairman_owner_name` (คอลัมน์ D)
- ตรวจสอบข้อมูลใน Sheets

---

## 💡 Tips

1. **Backup ก่อนทุกครั้ง**
   - File → Make a copy

2. **ใช้ Filter เพื่อค้นหา**
   - Data → Create a filter

3. **ตรวจสอบข้อมูลซ้ำ**
   - ใช้สูตร `=COUNTIF(A:A, A2)>1`

4. **Protect ข้อมูลสำคัญ**
   - Data → Protect sheets and ranges

---

## 📞 ติดต่อ

- **Email:** suratotopbiz@gmail.com
- **Website:** suratotopbiz.pages.dev
- **Documentation:** อ่านใน docs/

---

## 📄 License

© 2026 Surat OTOP Biz v2.0

พัฒนาโดยสำนักงาน OTOP จังหวัดสุราษฎร์ธานี

---

## 🎉 พร้อมใช้งาน!

**เวอร์ชัน 2.0 นี้ออกแบบมาเพื่อ:**
- ✅ ใช้ข้อมูลจากทะเบียนต้นทางได้โดยตรง
- ✅ ไม่ต้องแก้ไขข้อมูลเดิม
- ✅ เพิ่มคอลัมน์เสริมได้ง่าย
- ✅ รักษาโครงสร้างข้อมูลเดิม

**เริ่มใช้งานได้เลย!** 🚀
