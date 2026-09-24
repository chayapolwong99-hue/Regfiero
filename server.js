// =============================================================================
// FIERO SCHOOL SYSTEM - BACKEND REST API SERVER (Node.js Zero-Dependency HTTP)
// =============================================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Template with 10 Head Teachers, 10 Subjects, Registrar, Officer, Student
function getInitialDatabase() {
  return {
    term: "ภาคเรียนที่ 1 ปีการศึกษา 2569",
    termStartDate: "2026-05-18",
    termEndDate: "2026-10-09",
    isFinApproved: false,
    isGradingWindowOpen: true,
    gradingWindowDates: { start: "2026-05-18", end: "2026-10-09" },
    scoreWeights: { f1: 10, f1e: 10, sum: 30, f2: 10, f2e: 10, fin: 30 },
    studentsInitialized: true,
    students: [
      { id: "46696", citizenId: "1103702948", name: "นายชยพล วงศ์ปิติรุ่งเรือง", birthDate: "2553-05-15", room: "ม.4/1", no: 12, plan: "วิทยาศาสตร์-คณิตศาสตร์", phone: "089-123-4567", status: "กำลังศึกษา", parentName: "นายวิชาญ วงศ์ปิติรุ่งเรือง", parentPhone: "081-987-6543" },
      { id: "46697", citizenId: "1103702949", name: "นายกฤษฎา มงคลสุข", birthDate: "2553-06-20", room: "ม.4/1", no: 1, plan: "วิทยาศาสตร์-คณิตศาสตร์", phone: "081-234-5678", status: "กำลังศึกษา", parentName: "นางสุมาลี มงคลสุข", parentPhone: "089-876-5432" },
      { id: "46698", citizenId: "1103702950", name: "นางสาวณิชากร พงศ์พิพัฒน์", birthDate: "2553-08-11", room: "ม.4/2", no: 1, plan: "ภาษา-คณิตศาสตร์", phone: "082-345-6789", status: "กำลังศึกษา", parentName: "นายพิพัฒน์ พงศ์พิพัฒน์", parentPhone: "084-567-8901" },
      { id: "46699", citizenId: "1103702951", name: "นายธนภัทร เจริญรัตน์", birthDate: "2553-09-02", room: "ม.4/2", no: 2, plan: "ภาษา-คณิตศาสตร์", phone: "083-456-7890", status: "กำลังศึกษา", parentName: "นางกานดา เจริญรัตน์", parentPhone: "085-678-9012" },
      { id: "46700", citizenId: "1103702952", name: "นางสาวพิมพ์มาดา วัฒนากุล", birthDate: "2553-11-24", room: "ม.4/3", no: 1, plan: "ภาษาต่างประเทศ", phone: "086-789-0123", status: "กำลังศึกษา", parentName: "นายวัฒนา วัฒนากุล", parentPhone: "087-890-1234" }
    ],
    subjects: [
      {
            "code": "ท23001",
            "name": "ภาษาไทย 1",
            "credits": 1.5,
            "type": "พื้นฐาน",
            "dept": "ภาษาไทย",
            "teacher": "อ.กานต์พิชชา รัตนดิลก",
            "head": "อ.กานต์พิชชา รัตนดิลก",
            "plans": [
                  "all"
            ]
      },
      {
            "code": "ค23001",
            "name": "คณิตศาสตร์ 1",
            "credits": 1.5,
            "type": "พื้นฐาน",
            "dept": "คณิตศาสตร์",
            "teacher": "อ.ปรีชา เก่งคิดสกุล",
            "head": "อ.ปรีชา เก่งคิดสกุล",
            "plans": [
                  "all"
            ]
      },
      {
            "code": "ค23101",
            "name": "คณิตศาสตร์เสริม 1",
            "credits": 1.0,
            "type": "เพิ่มเติม",
            "dept": "คณิตศาสตร์",
            "teacher": "อ.พิมลพรรณ สัจจวาที",
            "head": "อ.พิมลพรรณ สัจจวาที",
            "plans": [
                  "วิทยาศาสตร์-คณิตศาสตร์",
                  "ภาษา-คณิตศาสตร์"
            ]
      },
      {
            "code": "ว23001",
            "name": "วิทยาศาสตร์ 1",
            "credits": 1.5,
            "type": "พื้นฐาน",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "teacher": "อ.สมชาย สอนดีสกุล",
            "head": "อ.สมชาย สอนดีสกุล",
            "plans": [
                  "all"
            ]
      },
      {
            "code": "ว23101",
            "name": "ฟิสิกส์ 1",
            "credits": 1.5,
            "type": "เพิ่มเติม",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "teacher": "อ.ดร.วิชาญ พลังศรัทธา",
            "head": "อ.ดร.วิชาญ พลังศรัทธา",
            "plans": [
                  "วิทยาศาสตร์-คณิตศาสตร์"
            ]
      },
      {
            "code": "ว23102",
            "name": "เคมี 1",
            "credits": 1.5,
            "type": "เพิ่มเติม",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "teacher": "อ.วิภาวรรณ สารประสิทธิ์",
            "head": "อ.วิภาวรรณ สารประสิทธิ์",
            "plans": [
                  "วิทยาศาสตร์-คณิตศาสตร์"
            ]
      },
      {
            "code": "ว23103",
            "name": "ชีววิทยา 1",
            "credits": 1.5,
            "type": "เพิ่มเติม",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "teacher": "อ.กฤษฎา พฤกษ์พันธุ์",
            "head": "อ.กฤษฎา พฤกษ์พันธุ์",
            "plans": [
                  "วิทยาศาสตร์-คณิตศาสตร์"
            ]
      },
      {
            "code": "ส23001",
            "name": "ศาสนา วัฒนธรรม จริยธรรม",
            "credits": 1.0,
            "type": "พื้นฐาน",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "teacher": "อ.ธนภัทร ธรรมธาดา",
            "head": "อ.ธนภัทร ธรรมธาดา",
            "plans": [
                  "all"
            ]
      },
      {
            "code": "ส23002",
            "name": "พระพุทธศาสนา",
            "credits": 0.5,
            "type": "พื้นฐาน",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "teacher": "อ.พระนาย ศาสนโสภณ",
            "head": "อ.พระนาย ศาสนโสภณ",
            "plans": [
                  "all"
            ]
      },
      {
            "code": "ศ23001",
            "name": "ศิลปะ 1",
            "credits": 1.0,
            "type": "พื้นฐาน",
            "dept": "ศิลปะ",
            "teacher": "อ.พรรณพิไล วิจิตรศิลป์",
            "head": "อ.พรรณพิไล วิจิตรศิลป์",
            "plans": [
                  "all"
            ]
      }
],
    teachers: [
      {
            "id": "t_head_thai",
            "username": "Karnpitcha.R",
            "name": "อ.กานต์พิชชา รัตนดิลก",
            "subjectCode": "ท23001",
            "subjectName": "ภาษาไทย 1",
            "dept": "ภาษาไทย",
            "isHead": true
      },
      {
            "id": "t_thai_01",
            "username": "Supaporn.S",
            "name": "อ.สุภาพร สุขสมบัติ",
            "subjectCode": "ท23001",
            "subjectName": "ภาษาไทย 1",
            "dept": "ภาษาไทย",
            "isHead": false
      },
      {
            "id": "t_thai_02",
            "username": "Wannapa.P",
            "name": "อ.วรรณภา ภักดีรัตน์",
            "subjectCode": "ท23001",
            "subjectName": "ภาษาไทย 1",
            "dept": "ภาษาไทย",
            "isHead": false
      },
      {
            "id": "t_thai_03",
            "username": "Nopporn.S",
            "name": "อ.นพพร ศิริวัฒนา",
            "subjectCode": "ท23001",
            "subjectName": "ภาษาไทย 1",
            "dept": "ภาษาไทย",
            "isHead": false
      },
      {
            "id": "t_head_math",
            "username": "Preecha.K",
            "name": "อ.ปรีชา เก่งคิดสกุล",
            "subjectCode": "ค23001",
            "subjectName": "คณิตศาสตร์ 1",
            "dept": "คณิตศาสตร์",
            "isHead": true
      },
      {
            "id": "t_math_01",
            "username": "Chanchai.W",
            "name": "อ.ชาญชัย วิทยารัตน์",
            "subjectCode": "ค23001",
            "subjectName": "คณิตศาสตร์ 1",
            "dept": "คณิตศาสตร์",
            "isHead": false
      },
      {
            "id": "t_math_02",
            "username": "Siriporn.B",
            "name": "อ.ศิริพร บุญเสริม",
            "subjectCode": "ค23001",
            "subjectName": "คณิตศาสตร์ 1",
            "dept": "คณิตศาสตร์",
            "isHead": false
      },
      {
            "id": "t_math_03",
            "username": "Ekkachai.L",
            "name": "อ.เอกชัย เลิศปัญญา",
            "subjectCode": "ค23001",
            "subjectName": "คณิตศาสตร์ 1",
            "dept": "คณิตศาสตร์",
            "isHead": false
      },
      {
            "id": "t_head_mathadv",
            "username": "Pimonpan.S",
            "name": "อ.พิมลพรรณ สัจจวาที",
            "subjectCode": "ค23101",
            "subjectName": "คณิตศาสตร์เสริม 1",
            "dept": "คณิตศาสตร์",
            "isHead": true
      },
      {
            "id": "t_mathadv_01",
            "username": "Kriangkrai.C",
            "name": "อ.เกรียงไกร ชำนาญคิด",
            "subjectCode": "ค23101",
            "subjectName": "คณิตศาสตร์เสริม 1",
            "dept": "คณิตศาสตร์",
            "isHead": false
      },
      {
            "id": "t_mathadv_02",
            "username": "Chalita.T",
            "name": "อ.ชลิตา ธนปรีชา",
            "subjectCode": "ค23101",
            "subjectName": "คณิตศาสตร์เสริม 1",
            "dept": "คณิตศาสตร์",
            "isHead": false
      },
      {
            "id": "t_mathadv_03",
            "username": "Thawatchai.M",
            "name": "อ.ธวัชชัย มหาสถิต",
            "subjectCode": "ค23101",
            "subjectName": "คณิตศาสตร์เสริม 1",
            "dept": "คณิตศาสตร์",
            "isHead": false
      },
      {
            "id": "t_head_sci",
            "username": "Somchai.S",
            "name": "อ.สมชาย สอนดีสกุล",
            "subjectCode": "ว23001",
            "subjectName": "วิทยาศาสตร์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": true
      },
      {
            "id": "t_sci_01",
            "username": "Rattana.P",
            "name": "อ.รัตนา พิพัฒน์ชัย",
            "subjectCode": "ว23001",
            "subjectName": "วิทยาศาสตร์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_sci_02",
            "username": "Pichai.S",
            "name": "อ.พิชัย สุรนันทน์",
            "subjectCode": "ว23001",
            "subjectName": "วิทยาศาสตร์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_sci_03",
            "username": "Aphisit.W",
            "name": "อ.อภิสิทธิ์ วชิรเมธา",
            "subjectCode": "ว23001",
            "subjectName": "วิทยาศาสตร์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_head_physics",
            "username": "Wichan.P",
            "name": "อ.ดร.วิชาญ พลังศรัทธา",
            "subjectCode": "ว23101",
            "subjectName": "ฟิสิกส์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": true
      },
      {
            "id": "t_phys_01",
            "username": "Parichat.J",
            "name": "อ.ปาริฉัตร จิรังกร",
            "subjectCode": "ว23101",
            "subjectName": "ฟิสิกส์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_phys_02",
            "username": "Theeradech.S",
            "name": "อ.ธีรเดช สุทธิพงษ์",
            "subjectCode": "ว23101",
            "subjectName": "ฟิสิกส์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_phys_03",
            "username": "Kritsana.P",
            "name": "อ.กฤษณะ พลวัฒน์",
            "subjectCode": "ว23101",
            "subjectName": "ฟิสิกส์ 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_head_chem",
            "username": "Wipawan.S",
            "name": "อ.วิภาวรรณ สารประสิทธิ์",
            "subjectCode": "ว23102",
            "subjectName": "เคมี 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": true
      },
      {
            "id": "t_chem_01",
            "username": "Chawalit.T",
            "name": "อ.ชวลิต ธาตุมงคล",
            "subjectCode": "ว23102",
            "subjectName": "เคมี 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_chem_02",
            "username": "Patcharin.W",
            "name": "อ.พัชรินทร์ วิทยาสาร",
            "subjectCode": "ว23102",
            "subjectName": "เคมี 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_chem_03",
            "username": "Anusorn.P",
            "name": "อ.อนุสรณ์ ปฏิกิริยา",
            "subjectCode": "ว23102",
            "subjectName": "เคมี 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_head_bio",
            "username": "Kritsada.P",
            "name": "อ.กฤษฎา พฤกษ์พันธุ์",
            "subjectCode": "ว23103",
            "subjectName": "ชีววิทยา 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": true
      },
      {
            "id": "t_bio_01",
            "username": "Duangjai.S",
            "name": "อ.ดวงใจ เซลล์สมบูรณ์",
            "subjectCode": "ว23103",
            "subjectName": "ชีววิทยา 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_bio_02",
            "username": "Montri.P",
            "name": "อ.มนตรี พันธุกรรม",
            "subjectCode": "ว23103",
            "subjectName": "ชีววิทยา 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_bio_03",
            "username": "Benjamas.P",
            "name": "อ.เบญจมาศ พฤกษศาสตร์",
            "subjectCode": "ว23103",
            "subjectName": "ชีววิทยา 1",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "isHead": false
      },
      {
            "id": "t_head_soc",
            "username": "Thanapat.T",
            "name": "อ.ธนภัทร ธรรมธาดา",
            "subjectCode": "ส23001",
            "subjectName": "ศาสนา วัฒนธรรม จริยธรรม",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": true
      },
      {
            "id": "t_soc_01",
            "username": "Surasak.J",
            "name": "อ.สุรศักดิ์ จริยธรรม",
            "subjectCode": "ส23001",
            "subjectName": "ศาสนา วัฒนธรรม จริยธรรม",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": false
      },
      {
            "id": "t_soc_02",
            "username": "Phensri.P",
            "name": "อ.เพ็ญศรี ประเพณีไทย",
            "subjectCode": "ส23001",
            "subjectName": "ศาสนา วัฒนธรรม จริยธรรม",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": false
      },
      {
            "id": "t_soc_03",
            "username": "Pairoj.P",
            "name": "อ.ไพโรจน์ พลเมืองดี",
            "subjectCode": "ส23001",
            "subjectName": "ศาสนา วัฒนธรรม จริยธรรม",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": false
      },
      {
            "id": "t_head_buddhism",
            "username": "Pranai.S",
            "name": "อ.พระนาย ศาสนโสภณ",
            "subjectCode": "ส23002",
            "subjectName": "พระพุทธศาสนา",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": true
      },
      {
            "id": "t_budd_01",
            "username": "Metha.T",
            "name": "อ.เมธา ธรรมปรีชา",
            "subjectCode": "ส23002",
            "subjectName": "พระพุทธศาสนา",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": false
      },
      {
            "id": "t_budd_02",
            "username": "Sumontha.P",
            "name": "อ.สุมนฑา พุทธรักษา",
            "subjectCode": "ส23002",
            "subjectName": "พระพุทธศาสนา",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": false
      },
      {
            "id": "t_budd_03",
            "username": "Bancha.J",
            "name": "อ.บัญชา จริยศาสตร์",
            "subjectCode": "ส23002",
            "subjectName": "พระพุทธศาสนา",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "isHead": false
      },
      {
            "id": "t_head_art",
            "username": "Panpilai.W",
            "name": "อ.พรรณพิไล วิจิตรศิลป์",
            "subjectCode": "ศ23001",
            "subjectName": "ศิลปะ 1",
            "dept": "ศิลปะ",
            "isHead": true
      },
      {
            "id": "t_art_01",
            "username": "Chatri.L",
            "name": "อ.ชาตรี ลายไทย",
            "subjectCode": "ศ23001",
            "subjectName": "ศิลปะ 1",
            "dept": "ศิลปะ",
            "isHead": false
      },
      {
            "id": "t_art_02",
            "username": "Mallika.J",
            "name": "อ.มัลลิกา จิตรกรรม",
            "subjectCode": "ศ23001",
            "subjectName": "ศิลปะ 1",
            "dept": "ศิลปะ",
            "isHead": false
      },
      {
            "id": "t_art_03",
            "username": "Prasert.D",
            "name": "อ.ประเสริฐ ดนตรีสากล",
            "subjectCode": "ศ23001",
            "subjectName": "ศิลปะ 1",
            "dept": "ศิลปะ",
            "isHead": false
      }
],
    userAccounts: [
      {
            "id": "admin_01",
            "username": "Chayapol.W",
            "password": "password",
            "role": "registrar",
            "name": "นายชยพล วงศ์ปิติรุ่งเรือง (นายทะเบียน)",
            "email": "registrar@firo.ac.th"
      },
      {
            "id": "staff_01",
            "username": "Kanlaya.S",
            "password": "password",
            "role": "officer",
            "name": "นางสาวกัลยา สถิติทะเบียน (เจ้าหน้าที่ทะเบียน)",
            "email": "officer@firo.ac.th"
      },
      {
            "id": "t_head_thai",
            "username": "Karnpitcha.R",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.กานต์พิชชา รัตนดิลก (หัวหน้าวิชา ภาษาไทย 1)",
            "subjectCode": "ท23001",
            "dept": "ภาษาไทย",
            "email": "karnpitcha@firo.ac.th"
      },
      {
            "id": "t_thai_01",
            "username": "Supaporn.S",
            "password": "password",
            "role": "teacher",
            "name": "อ.สุภาพร สุขสมบัติ (ครูผู้สอนวิชา ภาษาไทย 1)",
            "subjectCode": "ท23001",
            "dept": "ภาษาไทย",
            "email": "supaporn@firo.ac.th"
      },
      {
            "id": "t_thai_02",
            "username": "Wannapa.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.วรรณภา ภักดีรัตน์ (ครูผู้สอนวิชา ภาษาไทย 1)",
            "subjectCode": "ท23001",
            "dept": "ภาษาไทย",
            "email": "wannapa@firo.ac.th"
      },
      {
            "id": "t_thai_03",
            "username": "Nopporn.S",
            "password": "password",
            "role": "teacher",
            "name": "อ.นพพร ศิริวัฒนา (ครูผู้สอนวิชา ภาษาไทย 1)",
            "subjectCode": "ท23001",
            "dept": "ภาษาไทย",
            "email": "nopporn@firo.ac.th"
      },
      {
            "id": "t_head_math",
            "username": "Preecha.K",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.ปรีชา เก่งคิดสกุล (หัวหน้าวิชา คณิตศาสตร์ 1)",
            "subjectCode": "ค23001",
            "dept": "คณิตศาสตร์",
            "email": "preecha@firo.ac.th"
      },
      {
            "id": "t_math_01",
            "username": "Chanchai.W",
            "password": "password",
            "role": "teacher",
            "name": "อ.ชาญชัย วิทยารัตน์ (ครูผู้สอนวิชา คณิตศาสตร์ 1)",
            "subjectCode": "ค23001",
            "dept": "คณิตศาสตร์",
            "email": "chanchai@firo.ac.th"
      },
      {
            "id": "t_math_02",
            "username": "Siriporn.B",
            "password": "password",
            "role": "teacher",
            "name": "อ.ศิริพร บุญเสริม (ครูผู้สอนวิชา คณิตศาสตร์ 1)",
            "subjectCode": "ค23001",
            "dept": "คณิตศาสตร์",
            "email": "siriporn@firo.ac.th"
      },
      {
            "id": "t_math_03",
            "username": "Ekkachai.L",
            "password": "password",
            "role": "teacher",
            "name": "อ.เอกชัย เลิศปัญญา (ครูผู้สอนวิชา คณิตศาสตร์ 1)",
            "subjectCode": "ค23001",
            "dept": "คณิตศาสตร์",
            "email": "ekkachai@firo.ac.th"
      },
      {
            "id": "t_head_mathadv",
            "username": "Pimonpan.S",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.พิมลพรรณ สัจจวาที (หัวหน้าวิชา คณิตศาสตร์เสริม 1)",
            "subjectCode": "ค23101",
            "dept": "คณิตศาสตร์",
            "email": "pimonpan@firo.ac.th"
      },
      {
            "id": "t_mathadv_01",
            "username": "Kriangkrai.C",
            "password": "password",
            "role": "teacher",
            "name": "อ.เกรียงไกร ชำนาญคิด (ครูผู้สอนวิชา คณิตศาสตร์เสริม 1)",
            "subjectCode": "ค23101",
            "dept": "คณิตศาสตร์",
            "email": "kriangkrai@firo.ac.th"
      },
      {
            "id": "t_mathadv_02",
            "username": "Chalita.T",
            "password": "password",
            "role": "teacher",
            "name": "อ.ชลิตา ธนปรีชา (ครูผู้สอนวิชา คณิตศาสตร์เสริม 1)",
            "subjectCode": "ค23101",
            "dept": "คณิตศาสตร์",
            "email": "chalita@firo.ac.th"
      },
      {
            "id": "t_mathadv_03",
            "username": "Thawatchai.M",
            "password": "password",
            "role": "teacher",
            "name": "อ.ธวัชชัย มหาสถิต (ครูผู้สอนวิชา คณิตศาสตร์เสริม 1)",
            "subjectCode": "ค23101",
            "dept": "คณิตศาสตร์",
            "email": "thawatchai@firo.ac.th"
      },
      {
            "id": "t_head_sci",
            "username": "Somchai.S",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.สมชาย สอนดีสกุล (หัวหน้าวิชา วิทยาศาสตร์ 1)",
            "subjectCode": "ว23001",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "somchai@firo.ac.th"
      },
      {
            "id": "t_sci_01",
            "username": "Rattana.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.รัตนา พิพัฒน์ชัย (ครูผู้สอนวิชา วิทยาศาสตร์ 1)",
            "subjectCode": "ว23001",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "rattana@firo.ac.th"
      },
      {
            "id": "t_sci_02",
            "username": "Pichai.S",
            "password": "password",
            "role": "teacher",
            "name": "อ.พิชัย สุรนันทน์ (ครูผู้สอนวิชา วิทยาศาสตร์ 1)",
            "subjectCode": "ว23001",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "pichai@firo.ac.th"
      },
      {
            "id": "t_sci_03",
            "username": "Aphisit.W",
            "password": "password",
            "role": "teacher",
            "name": "อ.อภิสิทธิ์ วชิรเมธา (ครูผู้สอนวิชา วิทยาศาสตร์ 1)",
            "subjectCode": "ว23001",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "aphisit@firo.ac.th"
      },
      {
            "id": "t_head_physics",
            "username": "Wichan.P",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.ดร.วิชาญ พลังศรัทธา (หัวหน้าวิชา ฟิสิกส์ 1)",
            "subjectCode": "ว23101",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "wichan@firo.ac.th"
      },
      {
            "id": "t_phys_01",
            "username": "Parichat.J",
            "password": "password",
            "role": "teacher",
            "name": "อ.ปาริฉัตร จิรังกร (ครูผู้สอนวิชา ฟิสิกส์ 1)",
            "subjectCode": "ว23101",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "parichat@firo.ac.th"
      },
      {
            "id": "t_phys_02",
            "username": "Theeradech.S",
            "password": "password",
            "role": "teacher",
            "name": "อ.ธีรเดช สุทธิพงษ์ (ครูผู้สอนวิชา ฟิสิกส์ 1)",
            "subjectCode": "ว23101",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "theeradech@firo.ac.th"
      },
      {
            "id": "t_phys_03",
            "username": "Kritsana.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.กฤษณะ พลวัฒน์ (ครูผู้สอนวิชา ฟิสิกส์ 1)",
            "subjectCode": "ว23101",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "kritsana@firo.ac.th"
      },
      {
            "id": "t_head_chem",
            "username": "Wipawan.S",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.วิภาวรรณ สารประสิทธิ์ (หัวหน้าวิชา เคมี 1)",
            "subjectCode": "ว23102",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "wipawan@firo.ac.th"
      },
      {
            "id": "t_chem_01",
            "username": "Chawalit.T",
            "password": "password",
            "role": "teacher",
            "name": "อ.ชวลิต ธาตุมงคล (ครูผู้สอนวิชา เคมี 1)",
            "subjectCode": "ว23102",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "chawalit@firo.ac.th"
      },
      {
            "id": "t_chem_02",
            "username": "Patcharin.W",
            "password": "password",
            "role": "teacher",
            "name": "อ.พัชรินทร์ วิทยาสาร (ครูผู้สอนวิชา เคมี 1)",
            "subjectCode": "ว23102",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "patcharin@firo.ac.th"
      },
      {
            "id": "t_chem_03",
            "username": "Anusorn.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.อนุสรณ์ ปฏิกิริยา (ครูผู้สอนวิชา เคมี 1)",
            "subjectCode": "ว23102",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "anusorn@firo.ac.th"
      },
      {
            "id": "t_head_bio",
            "username": "Kritsada.P",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.กฤษฎา พฤกษ์พันธุ์ (หัวหน้าวิชา ชีววิทยา 1)",
            "subjectCode": "ว23103",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "kritsada@firo.ac.th"
      },
      {
            "id": "t_bio_01",
            "username": "Duangjai.S",
            "password": "password",
            "role": "teacher",
            "name": "อ.ดวงใจ เซลล์สมบูรณ์ (ครูผู้สอนวิชา ชีววิทยา 1)",
            "subjectCode": "ว23103",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "duangjai@firo.ac.th"
      },
      {
            "id": "t_bio_02",
            "username": "Montri.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.มนตรี พันธุกรรม (ครูผู้สอนวิชา ชีววิทยา 1)",
            "subjectCode": "ว23103",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "montri@firo.ac.th"
      },
      {
            "id": "t_bio_03",
            "username": "Benjamas.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.เบญจมาศ พฤกษศาสตร์ (ครูผู้สอนวิชา ชีววิทยา 1)",
            "subjectCode": "ว23103",
            "dept": "วิทยาศาสตร์และเทคโนโลยี",
            "email": "benjamas@firo.ac.th"
      },
      {
            "id": "t_head_soc",
            "username": "Thanapat.T",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.ธนภัทร ธรรมธาดา (หัวหน้าวิชา ศาสนา วัฒนธรรม จริยธรรม)",
            "subjectCode": "ส23001",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "thanapat@firo.ac.th"
      },
      {
            "id": "t_soc_01",
            "username": "Surasak.J",
            "password": "password",
            "role": "teacher",
            "name": "อ.สุรศักดิ์ จริยธรรม (ครูผู้สอนวิชา ศาสนา วัฒนธรรม จริยธรรม)",
            "subjectCode": "ส23001",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "surasak@firo.ac.th"
      },
      {
            "id": "t_soc_02",
            "username": "Phensri.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.เพ็ญศรี ประเพณีไทย (ครูผู้สอนวิชา ศาสนา วัฒนธรรม จริยธรรม)",
            "subjectCode": "ส23001",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "phensri@firo.ac.th"
      },
      {
            "id": "t_soc_03",
            "username": "Pairoj.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.ไพโรจน์ พลเมืองดี (ครูผู้สอนวิชา ศาสนา วัฒนธรรม จริยธรรม)",
            "subjectCode": "ส23001",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "pairoj@firo.ac.th"
      },
      {
            "id": "t_head_buddhism",
            "username": "Pranai.S",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.พระนาย ศาสนโสภณ (หัวหน้าวิชา พระพุทธศาสนา)",
            "subjectCode": "ส23002",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "pranai@firo.ac.th"
      },
      {
            "id": "t_budd_01",
            "username": "Metha.T",
            "password": "password",
            "role": "teacher",
            "name": "อ.เมธา ธรรมปรีชา (ครูผู้สอนวิชา พระพุทธศาสนา)",
            "subjectCode": "ส23002",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "metha@firo.ac.th"
      },
      {
            "id": "t_budd_02",
            "username": "Sumontha.P",
            "password": "password",
            "role": "teacher",
            "name": "อ.สุมนฑา พุทธรักษา (ครูผู้สอนวิชา พระพุทธศาสนา)",
            "subjectCode": "ส23002",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "sumontha@firo.ac.th"
      },
      {
            "id": "t_budd_03",
            "username": "Bancha.J",
            "password": "password",
            "role": "teacher",
            "name": "อ.บัญชา จริยศาสตร์ (ครูผู้สอนวิชา พระพุทธศาสนา)",
            "subjectCode": "ส23002",
            "dept": "สังคมศึกษา ศาสนา และวัฒนธรรม",
            "email": "bancha@firo.ac.th"
      },
      {
            "id": "t_head_art",
            "username": "Panpilai.W",
            "password": "password",
            "role": "head_teacher",
            "name": "อ.พรรณพิไล วิจิตรศิลป์ (หัวหน้าวิชา ศิลปะ 1)",
            "subjectCode": "ศ23001",
            "dept": "ศิลปะ",
            "email": "panpilai@firo.ac.th"
      },
      {
            "id": "t_art_01",
            "username": "Chatri.L",
            "password": "password",
            "role": "teacher",
            "name": "อ.ชาตรี ลายไทย (ครูผู้สอนวิชา ศิลปะ 1)",
            "subjectCode": "ศ23001",
            "dept": "ศิลปะ",
            "email": "chatri@firo.ac.th"
      },
      {
            "id": "t_art_02",
            "username": "Mallika.J",
            "password": "password",
            "role": "teacher",
            "name": "อ.มัลลิกา จิตรกรรม (ครูผู้สอนวิชา ศิลปะ 1)",
            "subjectCode": "ศ23001",
            "dept": "ศิลปะ",
            "email": "mallika@firo.ac.th"
      },
      {
            "id": "t_art_03",
            "username": "Prasert.D",
            "password": "password",
            "role": "teacher",
            "name": "อ.ประเสริฐ ดนตรีสากล (ครูผู้สอนวิชา ศิลปะ 1)",
            "subjectCode": "ศ23001",
            "dept": "ศิลปะ",
            "email": "prasert@firo.ac.th"
      },
      {
            "id": "46696",
            "username": "46696",
            "password": "password",
            "role": "student",
            "name": "นายชยพล วงศ์ปิติรุ่งเรือง",
            "email": "46696@firo.ac.th"
      },
      {
            "id": "46697",
            "username": "46697",
            "password": "password",
            "role": "student",
            "name": "นายกฤษฎา มงคลสุข",
            "email": "46697@firo.ac.th"
      },
      {
            "id": "46698",
            "username": "46698",
            "password": "password",
            "role": "student",
            "name": "นางสาวณิชากร พงศ์พิพัฒน์",
            "email": "46698@firo.ac.th"
      },
      {
            "id": "46699",
            "username": "46699",
            "password": "password",
            "role": "student",
            "name": "นายธนภัทร เจริญรัตน์",
            "email": "46699@firo.ac.th"
      },
      {
            "id": "46700",
            "username": "46700",
            "password": "password",
            "role": "student",
            "name": "นางสาวพิมพ์มาดา วัฒนากุล",
            "email": "46700@firo.ac.th"
      }
],
    scores: {},
    rooms: ["ม.4/1", "ม.4/2", "ม.4/3", "ม.4/4"],
    documentRequests: []
  };
}

// Read database from disk
function readDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initData = getInitialDatabase();
    writeDatabase(initData);
    return initData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file:", err);
    return getInitialDatabase();
  }
}

// Write database to disk atomically
function writeDatabase(data) {
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error("Error saving database file:", err);
    return false;
  }
}

// Parse request body helper
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on('end', () => {
      try {
        if (!body) resolve({});
        else resolve(JSON.parse(body));
      } catch (e) {
        resolve(body);
      }
    });
    req.on('error', reject);
  });
}

// MIME types dictionary for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ---------------------------------------------------------------------------
  // REST API ROUTING
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // 1. GET /api/db - Fetch database
    if (pathname === '/api/db' && req.method === 'GET') {
      const db = readDatabase();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: db, serverTime: new Date().toISOString() }));
      return;
    }

    // 2. POST /api/db - Save database
    if (pathname === '/api/db' && req.method === 'POST') {
      try {
        const body = await getRequestBody(req);
        const payload = (typeof body === 'object' && body.data) ? body.data : body;
        if (!payload || typeof payload !== 'object') {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: "Invalid database payload" }));
          return;
        }
        writeDatabase(payload);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: "Database saved to server successfully", studentCount: (payload.students || []).length }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 3. POST /api/upload-csv - Server-side CSV processor
    if (pathname === '/api/upload-csv' && req.method === 'POST') {
      try {
        const body = await getRequestBody(req);
        const csvText = typeof body === 'object' ? (body.csvText || body.content) : body;
        if (!csvText) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: "Missing csvText in request body" }));
          return;
        }

        // Parse CSV
        const lines = csvText.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
        const rows = lines.map(line => {
          let cols = [], inQuotes = false, token = '';
          for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === '"') inQuotes = !inQuotes;
            else if ((ch === ',' || ch === ';' || ch === '\t') && !inQuotes) {
              cols.push(token.trim().replace(/^"|"$/g, ''));
              token = '';
            } else token += ch;
          }
          cols.push(token.trim().replace(/^"|"$/g, ''));
          return cols;
        });

        let idIdx = 0, noIdx = 1, roomIdx = 2, nameIdx = 3, planIdx = 4;
        let startRow = 0;
        if (rows.length > 0) {
          const h = rows[0].join(' ').toLowerCase();
          if (h.includes('รหัส') || h.includes('id') || h.includes('ชื่อ') || h.includes('name')) {
            startRow = 1;
            rows[0].forEach((col, idx) => {
              const c = col.toLowerCase();
              if (c.includes('รหัส') || c.includes('id')) idIdx = idx;
              else if (c.includes('เลขที่') || c.includes('no')) noIdx = idx;
              else if (c.includes('ห้อง') || c.includes('room')) roomIdx = idx;
              else if (c.includes('ชื่อ') || c.includes('name')) nameIdx = idx;
              else if (c.includes('แผน') || c.includes('plan')) planIdx = idx;
            });
          }
        }

        const imported = [];
        for (let r = startRow; r < rows.length; r++) {
          const row = rows[r];
          if (!row || row.length === 0) continue;
          const id = row[idIdx] || String(46696 + imported.length);
          const name = row[nameIdx] || ('นักเรียน ' + id);
          const room = row[roomIdx] || 'ม.4/1';
          const no = parseInt(row[noIdx]) || (imported.length + 1);
          const plan = row[planIdx] || 'วิทยาศาสตร์-คณิตศาสตร์';
          imported.push({ id, name, room, no, plan, status: 'กำลังศึกษา' });
        }

        const db = readDatabase();
        const mode = (typeof body === 'object' && body.mode) || 'replace';
        if (mode === 'replace') {
          db.students = imported;
        } else {
          imported.forEach(st => {
            if (!db.students.some(s => s.id === st.id)) db.students.push(st);
          });
        }
        // Auto-register student ID into userAccounts so they can log in immediately
        if (!db.userAccounts) db.userAccounts = [];
        imported.forEach(st => {
          if (!db.userAccounts.some(a => a.username.toLowerCase() === st.id.toLowerCase())) {
            db.userAccounts.push({
              id: st.id,
              username: st.id,
              password: 'password',
              role: 'student',
              name: st.name,
              email: st.id + '@firo.ac.th'
            });
          }
        });
        db.studentsInitialized = true;
        writeDatabase(db);

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: "CSV imported to server successfully", importedCount: imported.length, totalStudents: db.students.length }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 4. POST /api/students/delete-all - Delete all students
    if (pathname === '/api/students/delete-all' && req.method === 'POST') {
      const db = readDatabase();
      const count = (db.students || []).length;
      db.students = [];
      db.scores = {};
      db.studentsInitialized = true;
      writeDatabase(db);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: "Deleted all students on server", deletedCount: count }));
      return;
    }

    // 5. GET /api/health - Server Status Check
    if (pathname === '/api/health') {
      const db = readDatabase();
      res.writeHead(200);
      res.end(JSON.stringify({
        status: "online",
        service: "Fiero School Registry Backend Server",
        serverTime: new Date().toLocaleString('th-TH'),
        databaseSize: JSON.stringify(db).length,
        studentCount: (db.students || []).length,
        subjectCount: (db.subjects || []).length,
        teacherCount: (db.teachers || []).length
      }));
      return;
    }

    // Default API 404
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: "Endpoint not found" }));
    return;
  }

  // ---------------------------------------------------------------------------
  // STATIC ASSET SERVING
  // ---------------------------------------------------------------------------
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Start listening
server.listen(PORT, () => {
  console.log(`=============================================================================`);
  console.log(` FIERO SCHOOL SYSTEM - SERVER RUNNING AT http://localhost:${PORT}`);
  console.log(` Server-side persistence active: ${DB_FILE}`);
  console.log(`=============================================================================`);
});
