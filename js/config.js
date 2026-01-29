// config.js - Configuration สำหรับ Surat OTOP Biz
// ระบบจัดการธุรกิจสำหรับผู้ประกอบการ OTOP จังหวัดสุราษฎร์ธานี

const CONFIG = {
  // ✅ แก้ไขชื่อตัวแปรให้ตรงกับ api.js
  API_URL: 'https://script.google.com/macros/s/AKfycbyyUrJSL0lsAeHMBK8z998cW0Z3G2pfjSrV2BsyiKvfHHFXCeK_35Jk6uuU3liYUnrn/exec',
  SHEET_ID: '1poLCq2Qk_gWm38dFpPPjomAI4LBK5ZPJdqaPUrvdISY',
  
  // โครงสร้างฟิลด์ Users
  USER_FIELDS: {
    USER_ID: 'user_id',
    ENTREPRENEURS_NAME: 'entrepreneurs_name',
    OPERATING_MODEL: 'operating_model',
    CHAIRMAN_OWNER_NAME: 'chairman_owner_name',
    ADDRESS_INFO: 'address_info',
    PHONE: 'phone',
    EMAIL: 'email',
    PASSWORD: 'password',
    STATUS: 'status',
    REGISTRATION_DATE: 'registration_date',
    DISTRICT: 'district',
    LAST_LOGIN: 'last_login'
  },
  
  // ค่าเริ่มต้นสำหรับ Smart Costing
  DEFAULTS: {
    MARKETING_PERCENT: {
      food: 12,
      goods: 10,
      handicraft: 15,
      herb: 12,
      other: 10
    },
    PROFIT_PERCENT: {
      food: 25,
      goods: 30,
      handicraft: 35,
      herb: 30,
      other: 25
    }
  },
  
  // ธีมสีของระบบ
  COLORS: {
    primary: '#10b981',
    secondary: '#14b8a6',
    dark: '#047857',
    bg: '#f0fdf4',
    header: '#2c4c3b'
  },
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    USER: 'surat_otop_user',
    TOKEN: 'surat_otop_token',
    COSTING_DRAFT: 'surat_otop_costing_draft',
    SETTINGS: 'surat_otop_settings'
  },
  
  // อำเภอในจังหวัดสุราษฎร์ธานี
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
  
  // ลักษณะผู้ประกอบการ
  OPERATING_MODELS: [
    'รายบุคคล',
    'กลุ่มอาชีพ',
    'วิสาหกิจชุมชน',
    'สหกรณ์',
    'บริษัท/ห้างหุ้นส่วน',
    'อื่นๆ'
  ],
  
  // ประเภทสินค้า OTOP
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
    VERSION: '2.2',
    DEFAULT_LANGUAGE: 'th',
    ITEMS_PER_PAGE: 10,
    MAX_INGREDIENTS: 20,
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}