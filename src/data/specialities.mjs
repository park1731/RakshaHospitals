// Speciality (department) pages for each branch.
//   key   - shared id used to link doctors (doctors.mjs `specs`) to a department
//   slug  - file name of the page (kept identical to the old site so existing links and search results keep working)
//   icon  - file name in src/icons (without .svg)
//   photo - hero photo in assets/img (without extension)
// The page body comes from src/content/ec-specialities/<slug>.html or src/content/kudlu-diseases/<slug>.html.

export const SPECIALITIES = {
  ec: [
    { key: 'cardiology', slug: 'cardiology', name: 'Cardiology', icon: 'heart-pulse', photo: 'ec/ward-1',
      blurb: 'Heart care from prevention and diagnosis to treatment and rehabilitation.' },
    { key: 'neurology', slug: 'neurology', name: 'Neurology & Neurosurgery', icon: 'brain', photo: 'ec/consult-room-2',
      blurb: 'Care for brain, spine and nervous-system disorders.' },
    { key: 'orthopedics', slug: 'orthopedics', name: 'Orthopaedics', icon: 'bone', photo: 'ec/ot-1',
      blurb: 'Bone, joint and musculoskeletal care, including joint replacement.' },
    { key: 'general-medicine', slug: 'general-medicine', name: 'General Medicine', icon: 'stethoscope', photo: 'ec/consult-room-1',
      blurb: 'Primary healthcare and long-term disease management for adults.' },
    { key: 'pediatrics', slug: 'pediatrics', name: 'Paediatrics', icon: 'baby', photo: 'ec/nicu',
      blurb: 'Child healthcare, newborn care and vaccinations.' },
    { key: 'obgyn', slug: 'obgyn', name: 'Obstetrics & Gynaecology', icon: 'venus', photo: 'ec/patient-room',
      blurb: 'Women’s health, pregnancy and maternity care.' },
    { key: 'urology', slug: 'urology', name: 'Urology', icon: 'droplet', photo: 'ec/ot-2',
      blurb: 'Treatment for kidney stones, prostate and urinary conditions.' },
    { key: 'nephrology', slug: 'nephrology', name: 'Nephrology', icon: 'bean', photo: 'ec/consult-room-3',
      blurb: 'Kidney disease management, dialysis and renal care.' },
    { key: 'general-surgery', slug: 'general-surgery', name: 'General Surgery', icon: 'scissors', photo: 'ec/ot-2',
      blurb: 'Laparoscopic, open and day-care surgical procedures.' },
    { key: 'icu', slug: 'icu', name: 'ICU & Critical Care', icon: 'activity', photo: 'ec/icu',
      blurb: 'Round-the-clock intensive care with ventilator support.' },
    { key: 'oncology', slug: 'oncology', name: 'Oncology', icon: 'ribbon', photo: 'ec/ward-2',
      blurb: 'Cancer screening, diagnosis and treatment support.' },
    { key: 'dermatology', slug: 'dermatology', name: 'Dermatology', icon: 'scan-face', photo: 'ec/consult-room-3',
      blurb: 'Skin, hair and cosmetic dermatology services.' },
    { key: 'ent', slug: 'ent', name: 'ENT', icon: 'ear', photo: 'ec/consult-room-1',
      blurb: 'Ear, nose, throat and head-and-neck care.' },
    { key: 'psychiatry', slug: 'psychiatry', name: 'Psychiatry', icon: 'brain-cog', photo: 'ec/reception',
      blurb: 'Mental health care, counselling and therapy.' },
    { key: 'diagnostics', slug: 'diagnostics', name: 'Diagnostics & Laboratory', icon: 'microscope', photo: 'ec/lab',
      blurb: 'Lab tests, ECG, X-ray, Echo and ultrasound.' },
  ],

  kudlu: [
    { key: 'obgyn', slug: 'Obstetrics_Gynaecology', content: 'Obstetrics _Gynaecology', name: 'Obstetrics & Gynaecology', icon: 'venus', photo: 'kudlu/front-desk',
      blurb: 'Pregnancy care, childbirth and complete women’s health services.' },
    { key: 'general-surgery', slug: 'general_surgery', name: 'General Surgery', icon: 'scissors', photo: 'kudlu/ot',
      blurb: 'Laparoscopic and open surgical procedures with careful post-operative care.' },
    { key: 'general-medicine', slug: 'general_medicine', name: 'General Medicine', icon: 'stethoscope', photo: 'kudlu/nursing-station',
      blurb: 'Diagnosis and treatment of everyday illnesses and long-term conditions.' },
    { key: 'urology', slug: 'urology', name: 'Urology', icon: 'droplet', photo: 'kudlu/ot',
      blurb: 'Care for kidney stones, prostate and urinary tract conditions.' },
    { key: 'dermatology', slug: 'skin_cosmetology', name: 'Skin & Cosmetology', icon: 'sparkles', photo: 'kudlu/corridor',
      blurb: 'Treatment for skin, hair and nail concerns, plus cosmetic care.' },
    { key: 'diabetology', slug: 'diabetology', name: 'Diabetology', icon: 'syringe', photo: 'kudlu/pharmacy',
      blurb: 'Diabetes screening, treatment and long-term management.',
      // The previous site showed the skin-care text on this page by mistake, so this content was rewritten.
      boxes: [
        { title: 'Symptoms', items: ['Frequent urination', 'Excessive thirst or hunger', 'Unexplained weight loss', 'Tiredness and fatigue', 'Blurred vision', 'Slow-healing wounds'] },
        { title: 'Causes', items: ['Family history of diabetes', 'Excess weight and inactivity', 'Unhealthy diet', 'Insulin resistance', 'Pregnancy (gestational diabetes)', 'Autoimmune factors (type 1)'] },
        { title: 'Treatment', items: ['Diet and lifestyle changes', 'Oral medications', 'Insulin therapy', 'Regular glucose monitoring', 'Blood pressure and cholesterol control', 'Treatment of complications'] },
        { title: 'Care', items: ['Regular HbA1c checks', 'Balanced diet and exercise', 'Daily foot care and yearly eye exams', 'Take medicines as prescribed', 'Know the signs of low sugar', 'Regular follow-ups'] },
      ] },
    { key: 'cardiology', slug: 'cardiology', name: 'Cardiology', icon: 'heart-pulse', photo: 'kudlu/nursing-station',
      blurb: 'Heart check-ups, diagnosis and treatment of cardiac conditions.' },
    { key: 'oncology', slug: 'oncology', name: 'Oncology', icon: 'ribbon', photo: 'kudlu/lounge',
      blurb: 'Cancer screening, diagnosis and treatment support.' },
    { key: 'orthopedics', slug: 'orthopedics', name: 'Orthopaedics', icon: 'bone', photo: 'kudlu/ot',
      blurb: 'Fracture, joint, spine and sports-injury care.' },
    { key: 'nephrology', slug: 'Nephrology', name: 'Nephrology', icon: 'bean', photo: 'kudlu/lounge',
      blurb: 'Evaluation and treatment of kidney diseases.' },
    { key: 'ophthalmology', slug: 'ophthalmology', name: 'Ophthalmology', icon: 'eye', photo: 'kudlu/corridor',
      blurb: 'Eye check-ups and treatment for vision problems.' },
    { key: 'pediatrics', slug: 'pediatrics', name: 'Paediatrics', icon: 'baby', photo: 'kudlu/reception',
      blurb: 'Newborn, child and adolescent healthcare and vaccinations.' },
    { key: 'ent', slug: 'ent', name: 'ENT', icon: 'ear', photo: 'kudlu/corridor',
      blurb: 'Ear, nose and throat care for adults and children.' },
    { key: 'gastroenterology', slug: 'gastroentrology', name: 'Gastroenterology', icon: 'stomach', photo: 'kudlu/ot',
      blurb: 'Care for digestive, liver and stomach disorders.' },
    { key: 'vascular', slug: 'vascular', name: 'Vascular & Endovascular Surgery', icon: 'droplets', photo: 'kudlu/ot',
      blurb: 'Treatment for blood-vessel conditions such as varicose veins and DVT.' },
    { key: 'pulmonology', slug: 'pulmonology', name: 'Pulmonology', icon: 'wind', photo: 'kudlu/nursing-station',
      blurb: 'Care for asthma, COPD and other lung conditions.' },
    { key: 'high-risk-pregnancy', slug: 'High_Risk_Pregnance', name: 'High-Risk Pregnancy Care', icon: 'heart-handshake', photo: 'kudlu/front-desk',
      blurb: 'Close monitoring and specialist care for complex pregnancies.' },
  ],
};

// Departments offered in the appointment form (same list as the previous site, plus the ones that had pages).
export const APPOINTMENT_DEPARTMENTS = [
  'General Medicine', 'Cardiology', 'Diabetology', 'Orthopaedics', 'Paediatrics', 'Obstetrics & Gynaecology', 'General Surgery',
  'Neurology', 'Urology', 'Nephrology', 'ENT', 'Dermatology', 'Ophthalmology', 'Psychiatry', 'Oncology', 'Gastroenterology',
  'Plastic Surgery', 'Health Check-up',
];
