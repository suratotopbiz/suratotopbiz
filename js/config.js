// config.js - Configuration สำหรับ Surat OTOP Biz
// ระบบจัดการธุรกิจสำหรับผู้ประกอบการ OTOP จังหวัดสุราษฎร์ธานี

const CONFIG = {
  // ⚠️ กรุณาแก้ไขค่าเหล่านี้ก่อนใช้งาน
  API_BASE_URL: 'https://script.google.com/macros/s/AKfycbzhwlN31US9ZjyJ_ZNKJiAwykTTc2p9aWQxsGJxdC0uxj-ABNtZ86s5U3MxeE02nFC1/exec',  // URL จาก Google Apps Script Web App
  SHEET_ID: '1poLCq2Qk_gWm38dFpPPjomAI4LBK5ZPJdqaPUrvdISY',             // Google Sheets ID
  
  // โครงสร้างฟิลด์ Users (สอดคล้องกับทะเบียน OTOP)
  USER_FIELDS: {
    // คอลัมน์จากทะเบียนต้นทาง (A-F)
    USER_ID: 'user_id',                           // A: รหัสผู้ใช้
    ENTREPRENEURS_NAME: 'entrepreneurs_name',     // B: ชื่อผู้ประกอบการ
    OPERATING_MODEL: 'operating_model',           // C: ลักษณะผู้ประกอบการ
    CHAIRMAN_OWNER_NAME: 'chairman_owner_name',   // D: ชื่อประธานกลุ่ม/เจ้าของ
    ADDRESS_INFO: 'address_info',                 // E: ที่อยู่
    PHONE: 'phone',                               // F: เบอร์โทร
    
    // คอลัมน์เพิ่มเติมสำหรับระบบ (G-L)
    EMAIL: 'email',                               // G: อีเมล
    PASSWORD: 'password',                         // H: รหัสผ่าน (แฮช)
    STATUS: 'status',                             // I: สถานะ (Active/Ban)
    REGISTRATION_DATE: 'registration_date',       // J: วันที่ลงทะเบียน
    DISTRICT: 'district',                         // K: อำเภอ
    LAST_LOGIN: 'last_login'                      // L: เข้าใช้ล่าสุด
  },
  
  // ค่าเริ่มต้นสำหรับ Smart Costing
  DEFAULTS: {
    MARKETING_PERCENT: {
      food: 12,        // อาหารและเครื่องดื่ม 12%
      goods: 10,       // ของใช้และของตกแต่ง 10%
      handicraft: 15,  // ผ้าและเครื่องแต่งกาย 15%
      herb: 12,        // สมุนไพรเพื่อสุขภาพ 12%
      other: 10        // อื่นๆ 10%
    },
    PROFIT_PERCENT: {
      food: 25,        // อาหารและเครื่องดื่ม 25%
      goods: 30,       // ของใช้และของตกแต่ง 30%
      handicraft: 35,  // ผ้าและเครื่องแต่งกาย 35%
      herb: 30,        // สมุนไพรเพื่อสุขภาพ 30%
      other: 25        // อื่นๆ 25%
    }
  },
  
  // ธีมสีของระบบ
  COLORS: {
    primary: '#10b981',    // เขียวหลัก (Emerald)
    secondary: '#14b8a6',  // เขียวรอง (Teal)
    dark: '#047857',       // เขียวเข้ม
    bg: '#f0fdf4',         // พื้นหลัง (เขียวอ่อน)
    header: '#2c4c3b'      // สีหัวข้อ
  },
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    USER: 'surat_otop_user',
    TOKEN: 'surat_otop_token',
    COSTING_DRAFT: 'surat_otop_costing_draft',
    SETTINGS: 'surat_otop_settings'
  },
  
  // อำเภอในจังหวัดสุราษฎร์ธานี (19 อำเภอ)
  DISTRICTS: [
    'เมืองสุราษฎร์ธานี',
    'กาญจนดิษฐ์',
    'ดอนสัก',
    'เกาะสมุย',
    'เกาะพะงัน',
    'ไชยา',
    'ท่าชนะ',
    'คีรีรัฐนิคม',
    'บ้านตาขุน',
    'พนม',
    'ท่าฉาง',
    'บ้านนาสาร',
    'บ้านนาเดิม',
    'เคียนซา',
    'เวียงสระ',
    'พระแสง',
    'พุนพิน',
    'ชัยบุรี',
    'วิภาวดี'
  ],
  
  // ลักษณะผู้ประกอบการ (จากทะเบียน OTOP)
  OPERATING_MODELS: [
    'รายบุคคล',
    'กลุ่มอาชีพ',
    'วิสาหกิจชุมชน',
    'สหกรณ์',
    'บริษัท/ห้างหุ้นส่วน',
    'อื่นๆ'
  ],
  
  // ประเภทสินค้า OTOP (5 หมวด)
  PRODUCT_CATEGORIES: [
    { value: 'food', label: 'อาหารและเครื่องดื่ม' },
    { value: 'goods', label: 'ของใช้และของตกแต่ง' },
    { value: 'handicraft', label: 'ผ้าและเครื่องแต่งกาย' },
    { value: 'herb', label: 'สมุนไพรเพื่อสุขภาพ' },
    { value: 'other', label: 'อื่นๆ' }
  ],
  
  // หน่วยวัดวัตถุดิบ
  UNITS: [
    'กก.',
    'กรัม',
    'ลิตร',
    'มล.',
    'ชิ้น',
    'ห่อ',
    'กล่อง',
    'ถุง',
    'ขวด',
    'แพ็ค',
    'เม็ด',
    'ช้อนโต๊ะ',
    'ถ้วย'
  ],
  
  // ประเภทรายรับรายจ่าย
  TRANSACTION_TYPES: {
    income: {
      label: 'รายรับ',
      color: 'emerald',
      categories: [
        'ขายสินค้า',
        'ขายบริการ',
        'รายได้อื่นๆ'
      ]
    },
    expense: {
      label: 'รายจ่าย',
      color: 'red',
      categories: [
        'ค่าวัตถุดิบ',
        'ค่าแรงงาน',
        'ค่าขนส่ง',
        'ค่าบรรจุภัณฑ์',
        'ค่าการตลาด',
        'ค่าสาธารณูปโภค',
        'ค่าอุปกรณ์',
        'รายจ่ายอื่นๆ'
      ]
    }
  },
  
  // ชื่อชีทใน Google Sheets
  SHEET_NAMES: {
    USERS: 'Users',
    TRANSACTIONS: 'Transactions',
    COSTING: 'Smart_Costing',
    ADMINS: 'Admins',
    NEWS: 'News_Feed',
    FORMULAS: 'Formulas',
    NOTES: 'Notes'
  },
  
  // การตั้งค่าอื่นๆ
  SETTINGS: {
    APP_NAME: 'Surat OTOP Biz',
    VERSION: '1.0.0',
    DEFAULT_LANGUAGE: 'th',
    ITEMS_PER_PAGE: 10,
    MAX_INGREDIENTS: 20,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  }
};

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
