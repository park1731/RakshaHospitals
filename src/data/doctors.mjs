// Consultants and leadership. Photos live in assets/img/doctors/<id>.webp (see src/tools/images.py).
//
// To add a doctor: add an entry to DOCTORS, add a photo line in src/tools/images.py, run that script,
// then run `node src/build.mjs`. `specs` links the doctor to speciality pages (keys in specialities.mjs);
// `aliases` are old ?doctor= values that must keep working on the appointment form.

export const DEPARTMENTS = [
  'General Medicine', 'Cardiology & Diabetology', 'Obstetrics & Gynaecology', 'Orthopaedics & Spine', 'Paediatrics',
  'General & Gastro Surgery', 'Urology', 'Plastic Surgery', 'Dermatology', 'ENT', 'Psychiatry',
];

export const DOCTORS = [
  {
    id: 'dayanand-yaligar', name: 'Dr. Dayanand B Yaligar', role: 'Physician, Diabetologist & Cardiologist',
    depts: ['General Medicine', 'Cardiology & Diabetology'], specs: ['general-medicine', 'cardiology', 'diabetology'],
    quals: 'MBBS, D.Card (NH), D.Card (RCP UK), MHSc.Diab, D.Diab, CCDM (Chennai), PGDGC (Elderly Care), D.Lipidology',
    bio: 'Former Consultant at Apollo Hospital, Bommasandra, Bengaluru.',
    aliases: ['dr-dayanand'],
  },
  {
    id: 'shrilakshmi', name: 'Dr. Shrilakshmi', role: 'Gynaecologist',
    depts: ['Obstetrics & Gynaecology'], specs: ['obgyn', 'high-risk-pregnancy'],
    quals: 'MBBS, MS (Gynaecology & Obstetrics)',
    bio: 'Experienced gynaecologist specialising in women’s health, pregnancy care, reproductive health and gynaecological surgeries. Dedicated to providing comprehensive healthcare for women at all stages of life.',
    aliases: ['dr-gynecologist'],
  },
  {
    id: 'chandan-s', name: 'Dr. Chandan S', role: 'Orthopaedic Surgeon',
    depts: ['Orthopaedics & Spine'], specs: ['orthopedics'],
    quals: 'MBBS, MS Ortho, DNB Ortho, SICOT Diploma, Fellowship in Joint Replacement (SIAA), Fellowship in Robotic Joint Replacement',
    bio: 'Orthopaedic surgeon specialising in advanced joint replacement surgeries, robotic procedures and comprehensive bone and joint care.',
    aliases: ['dr-chandan'],
  },
  {
    id: 'aj-babu', name: 'Dr. A. J. Babu', role: 'Paediatrician & Neonatologist',
    depts: ['Paediatrics'], specs: ['pediatrics'],
    quals: '',
    bio: 'Former Senior Consultant Paediatrician, Ministry of Health, Libya, and former Paediatrician/Neonatologist (SNCU), Jayanagar General Hospital, Bengaluru. Specialises in comprehensive child healthcare, newborn care and paediatric emergency medicine.',
    aliases: ['dr-aj-babu'],
  },
  {
    id: 'nanda-kishore', name: 'Dr. Nanda Kishore R', role: 'Paediatrician',
    depts: ['Paediatrics'], specs: ['pediatrics'],
    quals: 'MBBS, MD (Paediatrics)',
    bio: 'Paediatrician with expertise in child healthcare, growth monitoring and preventive medicine.',
    aliases: ['dr-nanda-kishore'],
  },
  {
    id: 'sudeep-kumar', name: 'Dr. Sudeep Kumar', role: 'Trauma & Spine Surgeon',
    depts: ['Orthopaedics & Spine'], specs: ['orthopedics'],
    quals: 'MBBS, MS (Orthopaedics), MCh (Spine Surgery)',
    bio: 'Trauma and spine surgeon specialising in complex spinal procedures, trauma surgeries, spinal deformity corrections and minimally invasive spine surgeries.',
    aliases: ['dr-trauma-spine-surgeon', 'dr-sudeep-kumar'],
  },
  {
    id: 'narasimhaiah-k', name: 'Dr. Narasimhaiah K', role: 'Urologist',
    depts: ['Urology'], specs: ['urology'],
    quals: 'MBBS, MS (General Surgery), MCh (Urology)',
    bio: 'Urologist with 31 years of experience in urology. Previously associated with The Oxford Medical College, Hospital and Research Centre, Bengaluru.',
    aliases: ['dr-narasimhaiah-k'],
  },
  {
    id: 'deepak-mr', name: 'Dr. Deepak M R', role: 'Plastic & Reconstructive Surgeon',
    depts: ['Plastic Surgery'], specs: [],
    quals: 'MBBS, DNB (General Surgery), MCh (Plastic Surgery)',
    bio: 'Consultant plastic and reconstructive surgeon with over 9 years of surgical experience. Specialises in trauma injuries, congenital anomalies, oncoplasty and cosmetic surgery procedures including liposuction and rhinoplasty.',
    aliases: ['dr-deepak-mr'],
  },
  {
    id: 'arti-priya', name: 'Dr. Arti Priya', role: 'Dermatologist (Skin & Hair Care)',
    depts: ['Dermatology'], specs: ['dermatology'],
    quals: 'MBBS, MD (Dermatology)',
    bio: 'Dermatologist specialising in comprehensive skin care, advanced hair treatments, cosmetic dermatology and aesthetic procedures, with personalised solutions for skin and hair concerns.',
    aliases: ['dr-arti-priya'],
  },
  {
    id: 'navya', name: 'Dr. Navya', role: 'Dermatologist',
    depts: ['Dermatology'], specs: ['dermatology'],
    quals: 'MBBS, MD (Dermatology)',
    bio: 'Dermatologist specialising in skin care, hair disorders, nail conditions and cosmetic dermatology. Treats acne, eczema, psoriasis and skin infections, and provides aesthetic treatments.',
    aliases: ['dr-dermatologist', 'dr-navya'],
  },
  {
    id: 'manojith-ss', name: 'Dr. Manojith S S', role: 'General & Laparoscopic Surgeon',
    depts: ['General & Gastro Surgery'], specs: ['general-surgery', 'gastroenterology'],
    quals: '',
    bio: 'A specialist in gastroenterology with over 13 years of experience. Known for handling complex cases with attention to detail, accurate diagnosis and empathy for patients.',
    aliases: ['dr-gastro-specialist', 'dr-manojith'],
  },
  {
    id: 'srivachan-shapur', name: 'Dr. Srivachan S Shapur', role: 'Laparoscopic & Gastro Surgeon',
    depts: ['General & Gastro Surgery'], specs: ['general-surgery', 'gastroenterology'],
    quals: 'MBBS, MS (General Surgery), FSGE (Surgical Gastroenterology)',
    bio: 'Laparoscopic and gastro surgeon specialising in minimally invasive surgical procedures and advanced gastroenterological surgeries, with a focus on precise surgical care and faster recovery.',
    aliases: ['dr-srivachan-shapur'],
  },
  {
    id: 'prarthana-patil', name: 'Dr. Prarthana Patil', role: 'Paediatrician',
    depts: ['Paediatrics'], specs: ['pediatrics'],
    quals: 'MD (Paediatrics)',
    bio: 'Offers compassionate, evidence-based paediatric care, specialising in neonatal care, growth monitoring and paediatric emergencies.',
    aliases: ['dr-prarthana-patil'],
  },
  {
    id: 'sushma-s', name: 'Dr. Sushma S', role: 'General Physician',
    depts: ['General Medicine'], specs: ['general-medicine'],
    quals: 'MD (General Medicine)',
    bio: 'Diagnoses and treats a wide range of adult health problems including fever, infections, diabetes, hypertension, stomach and liver conditions and long-term medical issues. Experienced in medical emergencies and critical care.',
    aliases: ['dr-sushma-s'],
  },
  {
    id: 'harshita', name: 'Dr. Harshita', role: 'ENT Surgeon',
    depts: ['ENT'], specs: ['ent'],
    quals: 'MBBS, MS (ENT)',
    bio: 'ENT specialist providing comprehensive care for ear, nose and throat disorders, including hearing problems, sinus issues, throat infections and ENT surgeries.',
    aliases: ['dr-ent-specialist', 'dr-harshita'],
  },
  {
    id: 'madhu-sekhar', name: 'Dr. C. Madhu Sekhar', role: 'Psychiatrist',
    depts: ['Psychiatry'], specs: ['psychiatry'],
    quals: 'MBBS, MD (Psychiatry)',
    bio: 'Psychiatrist providing comprehensive mental health care and psychiatric treatment, with a focus on holistic mental wellness.',
    aliases: ['dr-madhu-sekhar'],
  },
];

const RAVINDRA = {
  id: 'ravindra-s', name: 'Dr. Ravindra S', role: 'Managing Director',
  bio: 'Experienced general medicine practitioner and family physician with expertise in comprehensive healthcare for all age groups.',
};

export const LEADERSHIP = {
  ec: [
    RAVINDRA,
    { id: 'nanda-gowda', name: 'Dr. Nanda Gowda', role: 'Managing Director',
      bio: 'Leads healthcare administration with a focus on patient care quality and dependable hospital services.' },
    { id: 'chandru', name: 'Dr. Chandru', role: 'Managing Director',
      bio: 'Brings extensive experience in healthcare administration and hospital management.' },
  ],
  kudlu: [
    RAVINDRA,
    { id: 'nanda-gowda', name: 'Dr. Nanda Gowda', role: 'Managing Director',
      bio: 'Manages hospital administration, ensuring efficient healthcare services and overseeing patient care quality and facility operations.' },
    { id: 'tilak-kumar', name: 'Dr. Tilak Kumar V', role: 'Managing Director',
      bio: 'Focused on patient care, clinical excellence and innovative treatments that improve healthcare outcomes.' },
    { id: 'bhavya-gowda', name: 'Dr. Bhavya Gowda', role: 'Managing Director',
      bio: 'Focused on medical oversight and pharmaceutical management, ensuring quality care and effective medication practices.' },
  ],
};
