// Copy and lists used across the pages. Text here was carried over from the previous site and tidied.

// ---------------------------------------------------------------- health check packages
export const PACKAGES = {
  ec: {
    note: 'Tests may be customised by the consulting doctor based on your history and findings. Prices are indicative — please confirm when you book.',
    items: [
      { id: 'executive-full-body', name: 'Executive Full Body Check', for: 'For busy professionals · 30+ parameters', price: '₹7,999', featured: true, icon: 'briefcase-medical',
        tests: ['Complete Blood Count (CBC)', 'Liver, Kidney, Thyroid Profile (LFT, KFT, TSH)', 'Fasting Blood Sugar, HbA1c, Lipid Profile', 'Urine Analysis, Vitamin D, B12', 'Chest X-Ray, ECG, Echo Screening', 'Consultations: Physician + Dietician'] },
      { id: 'cardiac-care', name: 'Cardiac Heart Care', for: 'For chest discomfort or a family history of heart disease', price: '₹5,499', icon: 'heart-pulse',
        tests: ['ECG, 2D Echo, TMT/Stress Test', 'Lipid Profile, hs-CRP', 'Blood Pressure, BMI, Chest X-Ray', 'Consultation: Cardiologist'] },
      { id: 'diabetes-screen', name: 'Diabetes Screening', for: 'Track and manage diabetes effectively', price: '₹3,999', icon: 'droplet',
        tests: ['FBS/PPBS, HbA1c', 'Urine Sugar & Microalbumin', 'Lipid Profile, Kidney Profile', 'Foot & Eye Screening', 'Consultation: Diabetologist'] },
      { id: 'womens-wellness', name: 'Women’s Wellness', for: 'Holistic care for women (18–60)', price: '₹6,499', icon: 'venus',
        tests: ['CBC, Thyroid, Iron Studies', 'Pelvic Ultrasound', 'Pap Smear (as advised)', 'Breast Screening (Mammogram for 40+)', 'Consultations: Gynaecologist + Dietician'] },
      { id: 'senior-complete', name: 'Senior Citizen Complete', for: 'Age 60+ · comprehensive screening', price: '₹5,999', icon: 'accessibility',
        tests: ['CBC, LFT, KFT, Electrolytes', 'Bone Profile (Calcium, Vitamin D)', 'ECG, Echo Screening, Chest X-Ray', 'Eye & Dental Screening', 'Consultations: Physician + Physiotherapy'] },
      { id: 'pre-employment', name: 'Pre-Employment Check', for: 'As per your organisation’s standards', price: 'From ₹1,999', icon: 'clipboard-check',
        tests: ['CBC, Blood Group, Urine Routine', 'Chest X-Ray, ECG', 'Vision, Hearing, Physical Fitness', 'Optional: Drug/Specific Panels'] },
    ],
  },
  kudlu: {
    note: 'Tests may be customised by the consulting doctor based on your history and findings. Call or message us for current package prices.',
    items: [
      { id: 'basic', name: 'Basic Health Check-up', for: 'A complete baseline for adults', icon: 'clipboard-check',
        groups: [
          ['Consultations', ['Consultation with physician', 'Diet consultation']],
          ['Investigation', ['CBC', 'ESR', 'Blood group', 'Urine complete']],
          ['Lipid profile', ['Total cholesterol', 'HDL', 'LDL', 'VLDL', 'Triglycerides']],
          ['Renal', ['Urea', 'S. Creatinine', 'S. Electrolytes', 'S. Uric acid']],
          ['Liver function test', ['All liver function tests']],
          ['Thyroid function test', ['T3', 'T4', 'TSH', 'Free T3', 'Free T4']],
          ['Diabetic evaluation', ['FBS', 'PPBS']],
          ['Cardiac risk evaluation', ['ECG']],
          ['Imaging', ['USG (abdomen & pelvis)', 'X-ray (chest PA)']],
        ] },
      { id: 'executive-male', name: 'Executive Health Check-up — Male', for: 'Extended screening for men', icon: 'briefcase-medical',
        groups: [
          ['Consultations', ['Consultation with physician', 'Diet consultation', 'Physiotherapy consultation', 'Orthopaedic consultation']],
          ['Investigation', ['CBC', 'Blood group', 'Urine complete', 'PSA']],
          ['Lipid profile', ['Total cholesterol', 'HDL', 'LDL', 'VLDL', 'Triglycerides']],
          ['Diabetic evaluation', ['FBS', 'PPBS', 'HbA1c']],
          ['Cardiac risk evaluation', ['ECG', 'Trop-I', '2D Echo']],
          ['Renal', ['Urea', 'S. Creatinine', 'S. Electrolytes', 'S. Uric acid']],
          ['Imaging', ['USG (abdomen & pelvis)', 'X-ray (chest PA)']],
        ] },
      { id: 'executive-female', name: 'Executive Health Check-up — Female', for: 'Extended screening for women', icon: 'venus',
        groups: [
          ['Consultations', ['Consultation with physician', 'Diet consultation', 'Physiotherapy consultation', 'Orthopaedic consultation']],
          ['Investigation', ['CBC', 'ESR', 'Blood group', 'Urine complete']],
          ['Lipid profile', ['Total cholesterol', 'HDL', 'LDL', 'VLDL', 'Triglycerides']],
          ['Diabetic evaluation', ['FBS', 'PPBS', 'HbA1c']],
          ['Cardiac risk evaluation', ['ECG', '2D Echo', 'Trop-I']],
          ['Renal', ['Urea', 'S. Creatinine', 'S. Electrolytes', 'S. Uric acid']],
          ['Imaging', ['USG (abdomen & pelvis)', 'X-ray (chest PA)']],
          ['Cancer markers', ['Pap smear']],
        ] },
    ],
  },
};

// ---------------------------------------------------------------- facilities shown on the home page
export const FACILITIES = {
  ec: [
    { title: 'Emergency & trauma care', icon: 'siren', photo: 'ec/ward-1', alt: 'Monitored beds for emergency and critical care',
      text: 'A rapid-response emergency team for immediate stabilisation and specialised treatment of critical injuries and accidents.' },
    { title: 'ICU with ventilators', icon: 'activity', photo: 'ec/icu', alt: 'Intensive care unit',
      text: 'A fully equipped ICU operating 24×7 with advanced life support and continuous monitoring.' },
    { title: 'Operation theatres', icon: 'scissors', photo: 'ec/ot-1', alt: 'Operation theatre with C-arm',
      text: 'Theatres for general, laparoscopic and orthopaedic surgery, including knee and hip replacement and arthroscopic procedures.' },
    { title: 'Diagnostics & laboratory', icon: 'microscope', photo: 'ec/lab', alt: 'Laboratory staff at work',
      text: 'Digital X-ray, ultrasound, ECG, Echo, TMT and an in-house lab for quick, accurate reports.' },
    { title: 'Mother & newborn care', icon: 'baby', photo: 'ec/nicu', alt: 'Newborn care unit with radiant warmer',
      text: 'Maternity care with newborn support for babies who need extra attention.' },
    { title: 'Comfortable patient rooms', icon: 'bed', photo: 'ec/patient-room', alt: 'Patient room with attendant sofa',
      text: 'Clean, well-lit rooms and wards designed for rest, recovery and family support.' },
  ],
  kudlu: [
    { title: 'Emergency care & ICU', icon: 'siren', photo: 'kudlu/nursing-station', alt: 'Nursing station at Raksha Hospital, Kudlu',
      text: 'Immediate care, available 24×7 for any medical emergency, backed by an ICU and round-the-clock nursing.' },
    { title: 'Operation theatre', icon: 'scissors', photo: 'kudlu/ot', alt: 'Operation theatre at Raksha Hospital, Kudlu',
      text: 'A well-equipped theatre for general, orthopaedic, laparoscopic and other surgical procedures.' },
    { title: 'In-house pharmacy', icon: 'pill', photo: 'kudlu/pharmacy', alt: 'Pharmacy at Raksha Hospital, Kudlu',
      text: 'A well-stocked pharmacy with quality medicines and expert guidance, open round the clock.' },
    { title: 'Reception & help desk', icon: 'headset', photo: 'kudlu/reception', alt: 'Reception at Raksha Hospital, Kudlu',
      text: 'A front-desk team to guide you through registration, billing and insurance.' },
    { title: 'OPD & waiting lounge', icon: 'stethoscope', photo: 'kudlu/lounge', alt: 'Waiting lounge at Raksha Hospital, Kudlu',
      text: 'Consultation rooms with a comfortable waiting area for patients and families.' },
    { title: 'Inpatient care', icon: 'bed', photo: 'kudlu/corridor', alt: 'Corridor at Raksha Hospital, Kudlu',
      text: 'Recovery, post-surgery care, physical therapy and blood transfusion support.' },
  ],
};

export const ALWAYS_ON = {
  ec: [
    { title: 'Emergency care', icon: 'siren', items: ['Emergency room', 'ICU with ventilators', 'Trauma care', 'Ambulance'] },
    { title: '24-hour services', icon: 'clock', items: ['Pharmacy', 'Ultrasound & X-ray', 'Lab tests', 'ECG & Echo'] },
    { title: 'Inpatient care', icon: 'bed', items: ['Surgery & post-surgery care', 'Maternity & newborn care', 'Physiotherapy', 'Day-care procedures'] },
  ],
  kudlu: [
    { title: 'Emergency care', icon: 'siren', items: ['ICU', 'Surgery', 'Ambulance', 'Lab test'] },
    { title: '24-hour services', icon: 'clock', items: ['Pharmacy', 'USG / X-ray', 'Emergency room', 'Lab test', 'Surgery', 'Consultation'] },
    { title: 'Inpatient care', icon: 'bed', items: ['Recovery', 'Physical therapy', 'Blood transfusion', 'Post-surgery care', 'ICU', 'Surgical ward'] },
  ],
};

export const KUDLU_EXTRA_SERVICES = [
  { title: 'Paediatric surgery', icon: 'baby', text: 'Surgical care of infants, children and adolescents, addressing congenital conditions, injuries and diseases in young patients.' },
  { title: 'Neurosurgery & spine', icon: 'brain', text: 'Treatment of brain, spinal cord and nerve disorders through advanced surgical techniques and technologies.' },
  { title: 'Blood transfusion', icon: 'droplet', text: 'Replenishes blood lost through surgery, injury or conditions like anaemia, helping restore oxygen levels and support recovery.' },
  { title: 'Ear treatment', icon: 'ear', text: 'Management of infections, hearing loss and balance disorders with medication, surgery or hearing aids.' },
  { title: 'Vision care', icon: 'eye', text: 'Care for cataracts, glaucoma and refractive errors through lenses, medication or surgery.' },
];

// ---------------------------------------------------------------- why choose us / about
export const WHY = [
  { title: 'Experienced specialists', icon: 'user-round-check', text: 'Qualified, experienced consultants across medical and surgical specialities.' },
  { title: '24×7 emergency team', icon: 'siren', text: 'Emergency doctors and staff ready for immediate care, round the clock.' },
  { title: 'Modern facilities', icon: 'hospital', text: 'ICU with ventilators, operation theatres, an in-house lab and imaging.' },
  { title: 'Patient-centred care', icon: 'hand-heart', text: 'Personalised treatment plans, explained clearly and delivered with compassion.' },
  { title: 'Integrated services', icon: 'waypoints', text: 'Close coordination between departments for faster diagnosis and treatment.' },
  { title: 'Affordable, transparent care', icon: 'badge-indian-rupee', text: 'Reasonable costs, transparent pricing and cashless insurance support.' },
];

export const ABOUT = {
  intro: [
    'Raksha Multi Speciality Hospital offers a comprehensive range of medical services across multiple specialities. With modern technology and a team of highly skilled doctors, we provide care in fields such as cardiology, orthopaedics, neurology and emergency medicine.',
    'Our hospital is committed to patient-centric care, ensuring that each treatment plan is tailored to the individual needs of our patients. Your health, well-being and satisfaction are our top priorities.',
  ],
  mission: 'We prioritise advanced diagnostics and minimally invasive procedures so that we can deliver high standards of healthcare. Our modern facilities, combined with a compassionate approach, foster an environment of healing and well-being for every patient.',
  promise: 'We continuously upgrade our equipment and technology so that our patients receive effective, up-to-date treatment — with personal attention from doctors, nurses and staff who care.',
  hygieneIntro: 'We follow strict cleanliness rules to keep the hospital safe and hygienic for patients, families and staff.',
  hygiene: [
    ['Hand hygiene', 'Staff wash hands before and after every patient contact.', 'hand'],
    ['Disinfection & sterilisation', 'Equipment and patient areas are sanitised regularly.', 'spray-can'],
    ['Waste management', 'Biomedical waste is disposed of properly to prevent contamination.', 'trash-2'],
    ['Air & water quality', 'Clean air and water are maintained throughout the hospital.', 'wind'],
    ['Protective equipment', 'Staff wear gloves, masks and gowns to prevent infections.', 'shield-plus'],
  ],
};

// ---------------------------------------------------------------- local services (home page, both branches)
// {area} is replaced with the branch area.
export const LOCAL_SERVICES = [
  ['siren', '24×7 emergency care', 'Round-the-clock emergency department in {area} with trauma care and immediate attention for critical conditions.'],
  ['activity', 'ICU & critical care', 'ICU with ventilators, critical-care specialists and 24×7 monitoring for critically ill patients.'],
  ['ambulance', 'Ambulance service', '24×7 ambulance service across {area} with advanced life-support systems and trained paramedics.'],
  ['heart-pulse', 'Cardiac care', 'ECG, Echo, TMT, preventive cardiology, heart disease treatment and emergency cardiac care.'],
  ['venus', 'Maternity care', 'Experienced gynaecologists, newborn care, normal delivery, C-section and complete pre-natal and post-natal care.'],
  ['baby', 'Children’s care', 'Paediatric care, vaccination, newborn care and child emergency services.'],
  ['brain', 'Neurology', 'Care for brain disorders, stroke, epilepsy, headaches and other neurological conditions.'],
  ['bone', 'Orthopaedics', 'Joint replacement, fracture treatment, sports injuries, spine surgery and bone care.'],
  ['scissors', 'General surgery', 'Laparoscopic surgery, emergency surgery, hernia repair and minimally invasive procedures.'],
  ['scan-line', 'Diagnostic imaging', 'X-ray, ultrasound, ECG, Echo and TMT, available round the clock.'],
  ['test-tubes', 'Lab services', 'Blood tests, pathology and clinical laboratory services with quick reports.'],
  ['dumbbell', 'Physiotherapy', 'Rehabilitation, sports-injury care, post-surgery recovery and pain management.'],
  ['scan-face', 'Dermatology', 'Treatment for skin conditions, acne and hair problems, plus cosmetic dermatology.'],
  ['stethoscope', 'Outpatient services', 'Consultations, follow-ups, minor procedures and day-care treatments.'],
  ['pill', '24×7 pharmacy', 'Round-the-clock pharmacy stocked with medicines, surgical supplies and healthcare products.'],
  ['brain-cog', 'Psychiatry', 'Mental health services, counselling and psychiatric consultations.'],
  ['ribbon', 'Oncology', 'Cancer screening, chemotherapy, oncology consultations and care support.'],
  ['stomach', 'Gastroenterology', 'Care for digestive disorders and liver diseases, including endoscopy.'],
  ['clipboard-check', 'Preventive health check-ups', 'Full-body check-up packages, cardiac and diabetes screening for individuals and corporates.'],
];

// ---------------------------------------------------------------- patient reviews
// Only quotes that were published as Google reviews on the previous Kudlu site are kept, word for word.
export const REVIEWS = {
  ec: [],
  kudlu: [
    { name: 'Pratima Shahu', text: 'We came with low HB, treated very well doctors and nursing staff is very helpful and cooperative' },
    { name: 'Deepak Behera', text: 'Management and doctor and nursing staff very cooperative. As a attendant my experience good' },
    { name: 'Sree', text: 'Fantastic Treatment and Extreme hospitality. The best Services especially Nursing, attendance in seconds of call 24/7. Thanks you team. Keep it up.' },
  ],
};

// ---------------------------------------------------------------- galleries
export const GALLERY = {
  ec: [
    ['ec/building', 'Hospital building, Ananth Nagar'],
    ['ec/front-desk', 'Reception and front desk'],
    ['ec/reception', 'Reception lobby'],
    ['ec/signboard', 'Specialities at a glance — entrance signboard'],
    ['ec/corridor', 'OPD corridor and waiting area'],
    ['ec/consult-room-1', 'Consultation room'],
    ['ec/consult-room-3', 'Consultation and examination room'],
    ['ec/consult-room-2', 'Consultation room with examination bed'],
    ['ec/patient-room', 'Patient room'],
    ['ec/ward-2', 'Inpatient ward'],
    ['ec/ward-1', 'Critical care beds with monitoring'],
    ['ec/icu', 'Intensive care unit'],
    ['ec/nicu', 'Newborn care unit'],
    ['ec/ot-1', 'Operation theatre'],
    ['ec/ot-2', 'Operation theatre — wide view'],
    ['ec/lab', 'Laboratory'],
  ],
  kudlu: [
    ['kudlu/front-desk', 'Front desk — “Health & Happiness for All”'],
    ['kudlu/reception', 'Reception and help desk'],
    ['kudlu/lounge', 'Waiting lounge'],
    ['kudlu/corridor', 'OPD corridor'],
    ['kudlu/nursing-station', 'Nursing station'],
    ['kudlu/pharmacy', 'In-house pharmacy'],
    ['kudlu/ot', 'Operation theatre'],
    ['kudlu/team', 'Our team with a recovering patient'],
    ['kudlu/signage', 'Reception'],
  ],
};

// Kudlu "Insights": clinical work. `sensitive` images are blurred until the visitor chooses to view them.
export const INSIGHTS = [
  ['kudlu/insights/knee-replacement-xray', 'Post knee replacement — X-ray', false],
  ['kudlu/insights/knee-surgery', 'Osteoarthritis of the left knee — surgery in progress', true],
  ['kudlu/insights/post-op-rounds', 'Post-operative rounds', false],
  ['kudlu/insights/plate-fixation-xray', 'Post-operative X-ray — fixation with plates and screws', false],
  ['kudlu/insights/tibial-nailing-xray', 'Tibial nailing — post-operative X-rays', false],
  ['kudlu/insights/intra-operative-1', 'Intra-operative — orthopaedic surgery', true],
  ['kudlu/insights/knee-joint-findings', 'Degenerative changes and osteoarthritis noted at the knee joint', true],
  ['kudlu/insights/ward-rounds', 'On rounds at the nursing station', false],
  ['kudlu/insights/intra-operative-2', 'Intra-operative — orthopaedic procedure', false],
];

// ---------------------------------------------------------------- blogs
// cover: file in assets/img/blog (without extension). category is used for Electronic City; Kudlu articles carry their own.
export const BLOG_META = {
  Heart_Health: { cover: 'heart', category: 'Cardiology' },
  cardiac: { cover: 'cardiac', category: 'Cardiology' },
  arrhythmia: { cover: 'stresss', category: 'Cardiology' },
  cardiomapathy: { cover: 'cardiomaphy', category: 'Cardiology' },
  aroatic: { cover: 'tatv', category: 'Cardiology' },
  cronary: { cover: 'cronory', category: 'Cardiology' },
  echocardiogram: { cover: 'echocardiogram', category: 'Cardiology' },
  dyslipidaemia: { cover: 'dyslipidaemia', category: 'Cardiology' },
  cancer: { cover: 'cancer', category: 'Oncology' },
  child_Health: { cover: 'childhealth', category: 'Paediatrics' },
  congential: { cover: 'cognetial', category: 'Cardiology' },
  excersizeHeart: { cover: 'exercize', category: 'Cardiology' },
  kidney_stone: { cover: 'kidney', category: 'Urology' },
  prostatist: { cover: 'prostatitis', category: 'Urology' },
  stress: { cover: 'stress', category: 'Wellness' },
  thrombosis: { cover: 'dvt', category: 'Vascular health' },
  pumping: { cover: 'pumpinglife', category: 'Cardiology' },
  uti: { cover: 'uti', category: 'Urology' },
  urethral: { cover: 'uthral', category: 'Urology' },
  vital: { cover: 'ffr', coverEc: 'heart', category: 'Cardiology', categoryEc: 'General health' },
};

export const APPOINTMENT_STEPS = [
  ['Send your request', 'Fill in the form and tap “Send on WhatsApp”. Your request reaches our front desk directly.', 'send'],
  ['We confirm your slot', 'Our team replies within 24 hours to confirm the doctor, date and time.', 'calendar-check'],
  ['Visit the hospital', 'Arrive 15 minutes early with your ID, reports and current medications.', 'hospital'],
];

export const APPOINTMENT_TIPS = [
  'Bring your ID and insurance card', 'List your current medications', 'Note down your symptoms', 'Carry previous reports and prescriptions', 'Bring a family member if needed',
];
