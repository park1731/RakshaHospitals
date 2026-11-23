// Organisation-wide facts and the two branches. Edit here, then run `node src/build.mjs`.

export const SITE = {
  name: 'Raksha Multi Speciality Hospital',
  shortName: 'Raksha Hospital',
  tagline: 'Health & Happiness for All',
  origin: 'https://rakshahospital.com',
  themeColor: '#0057B8',
};

export const BRANCHES = {
  ec: {
    id: 'ec',
    dir: 'electroniccity',
    name: 'Electronic City',
    area: 'Electronic City',
    areaLong: 'Electronic City, Bengaluru',
    fullName: 'Raksha Multi Speciality Hospital, Electronic City',
    phone: '+919494060671',
    phoneDisplay: '+91 94940 60671',
    extraPhones: [],
    whatsapp: '919494060671',
    email: 'rakshahospital.electroniccity@gmail.com',
    address: {
      lines: ['Ananth Nagar Phase 2, 14th Cross,', 'New Town, Electronic City Post,', 'Bengaluru, Karnataka 560100'],
      short: 'Ananth Nagar Phase 2, Electronic City, Bengaluru',
      street: 'Ananth Nagar Phase 2, 14th Cross, New Town, Electronic City Post',
      locality: 'Bengaluru', region: 'Karnataka', postal: '560100',
    },
    geo: { lat: 12.8336, lng: 77.6915 },
    landmarks: 'Opposite Sunshine Badminton on 14th Cross Road; near Wipro campus and Hosur Road, Electronic City',
    nearby: ['Wipro campus', 'Infosys', 'TCS', 'Hosur Road'],
    hours: [
      ['Emergency, ICU & pharmacy', 'Open 24 hours, every day'],
      ['OPD (Mon – Fri)', '8:00 AM – 8:00 PM'],
      ['OPD (Sat & Sun)', '9:00 AM – 6:00 PM'],
    ],
    // Search-based embed: resolves to the hospital's own Google listing ("Raksha Hospital", 14th Cross Road, Ananth Nagar Phase 2).
    mapEmbed: 'https://www.google.com/maps?q=Raksha+Hospital+14th+Cross+Road+Ananth+Nagar+Phase+2+Electronic+City+Bengaluru&output=embed',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Raksha+Hospital+14th+Cross+Road+Ananth+Nagar+Phase+2+Electronic+City+Bengaluru',
    reviewLink: 'https://g.page/r/CSxGzjidps71EBI/review',
    social: {
      facebook: 'https://www.facebook.com/rakshahospitals.electroniccity/',
      instagram: 'https://www.instagram.com/rakshahospitals.electroniccity/',
      youtube: 'https://www.youtube.com/@RakshaHospitalsBengaluru',
    },
    paths: {
      home: '', about: 'about.html', doctors: 'doctors.html', specialities: 'specialities.html', specialityDir: 'specialities',
      healthCheck: 'health-check.html', appointment: 'appointment.html', blogs: 'blogs.html', blogDir: 'blogs',
      gallery: 'gallary.html', contact: 'contact.html', notFound: '404.html', serverError: '500.html',
    },
    hero: {
      eyebrow: 'Multi-speciality hospital · Electronic City, Bengaluru',
      title: 'Multi‑speciality care, close to home in <em>Electronic City</em>',
      text: '24×7 emergency and ICU, experienced specialists, diagnostics and pharmacy under one roof — at Ananth Nagar, minutes from Hosur Road and the Electronic City tech parks.',
      // photoFocus keeps the logo wall clear of the small inset photo (it is a CSS object-position value)
      photo: 'ec/reception', photoAlt: 'Reception at Raksha Hospital, Electronic City', photoFocus: '22% 50%',
      photo2: 'ec/icu', photo2Alt: 'Intensive care unit at Raksha Hospital, Electronic City',
    },
    about: {
      photo: 'ec/building', photoAlt: 'Raksha Hospital building in Electronic City',
      photo2: 'ec/consult-room-1', photo2Alt: 'Consultation room at Raksha Hospital, Electronic City',
    },
    og: 'ec',
  },

  kudlu: {
    id: 'kudlu',
    dir: 'kudlu',
    name: 'Kudlu',
    area: 'Kudlu',
    areaLong: 'Kudlu, Bengaluru',
    fullName: 'Raksha Multi Speciality Hospital, Kudlu',
    phone: '+918050222777',
    phoneDisplay: '+91 80502 22777',
    extraPhones: [{ tel: '+918151048109', display: '+91 81510 48109' }],
    whatsapp: '918050222777',
    email: 'rakshamsphospital@gmail.com',
    address: {
      lines: ['Nisarga Complex, 24/A, Kudlu Main Road,', 'near Venkateswara Temple, VGP Layout, Kudlu,', 'Bengaluru, Karnataka 560068'],
      short: 'Nisarga Complex, Kudlu Main Road, Bengaluru',
      street: 'Nisarga Complex, 24/A, Kudlu Main Rd, near Venkateswara Temple, Kudlu, VGP Layout',
      locality: 'Bengaluru', region: 'Karnataka', postal: '560068',
    },
    geo: { lat: 12.889237, lng: 77.64788 },
    landmarks: 'Near Venkateswara Temple on Kudlu Main Road; close to HSR Layout, Singasandra and BTM Layout',
    nearby: ['HSR Layout', 'Singasandra', 'BTM Layout'],
    hours: [
      ['Emergency, ICU & pharmacy', 'Open 24 hours, every day'],
      ['Consultations', 'Open all days — call to confirm doctor timings'],
    ],
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.2873215114664!2d77.64788027472656!3d12.889237216679394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae156f056a1f2f%3A0xdd4cad96b660594f!2sRaksha%20Emergency%20Multi%20Speciality%20Hospital%20in%20VGP%20Layout%20Kudlu%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1740322156510!5m2!1sen!2sin',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Raksha+Emergency+Multi+Speciality+Hospital+VGP+Layout+Kudlu+Bengaluru',
    reviewLink: 'https://g.page/raksha-hospital/review',
    social: {
      facebook: 'https://www.facebook.com/rakshahospitals.electroniccity/',
      instagram: 'https://www.instagram.com/blr_raksha_hospitals',
      linkedin: 'https://www.linkedin.com/company/rakshahospital',
    },
    paths: {
      home: '', about: 'about.html', doctors: 'doctors.html', specialities: 'specialities.html', specialityDir: 'Diseases',
      healthCheck: 'healthCheckups.html', appointment: 'Appointment.html', blogs: 'blog.html', blogDir: 'blogs',
      gallery: 'gallery.html', contact: 'contact.html', insights: 'insights.html', feedback: 'feedback.html', notFound: '404.html',
    },
    hero: {
      eyebrow: 'Multi-speciality hospital · Kudlu, Bengaluru',
      title: 'Excellence in healthcare, with <em>you</em> at the centre',
      text: 'Raksha Hospital on Kudlu Main Road brings 24×7 emergency care, ICU, surgery, diagnostics and an in-house pharmacy to HSR Layout, Singasandra and the neighbourhoods around Kudlu.',
      photo: 'kudlu/reception', photoAlt: 'Reception and help desk at Raksha Hospital, Kudlu',
      photo2: 'kudlu/ot', photo2Alt: 'Operation theatre at Raksha Hospital, Kudlu',
    },
    about: {
      photo: 'kudlu/front-desk', photoAlt: 'Front desk at Raksha Hospital, Kudlu, with the words Health and Happiness for All',
      photo2: 'kudlu/pharmacy', photo2Alt: '24-hour pharmacy at Raksha Hospital, Kudlu',
    },
    og: 'kudlu',
  },
};

export const BRANCH_LIST = [BRANCHES.ec, BRANCHES.kudlu];
