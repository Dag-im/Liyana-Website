export type ServiceCategory = {
  id: string;
  title: string;
  tagline: string;
  attributes: string[];
  divisions: Division[];
};

export type Division = {
  id: string;
  slug: string;
  name: string;
  location?: string;
  overview: string;
  description: string[];
  images: string[];
  coreServices: string[];
  contact: {
    phone?: string;
    email?: string;
    address?: string;
    googleMap?: string;
  };
  groupPhoto?: string;
};

// ---------- BASE URL ----------
const IMAGE_URL =
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=900';

// ---------- DATA ----------
export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: 'advanced-services',
    title: 'Healthcare Services',
    tagline: 'Delivering Specialized & Comprehensive Medical Excellence',
    attributes: [
      'Subspecialized Medical Care',
      'Advanced Diagnostic Services: Laboratory, Pathology, Radiology, Endoscopy',
      'Subspecialized Therapeutic Services: Hemodialysis, Cancer Chemotherapy',
      'State-of-the-Art Care Facilities: Adult ICUs, Neonatal ICUs',
    ],
    divisions: [
      {
        id: 'yimsc-addis',
        slug: 'yanet-internal-medicine-surgical-center-addis',
        name: 'Yanet Internal Medicine & Surgical Center (Addis Ababa)',
        location: 'Addis Ababa, Ethiopia',
        overview:
          'High-quality internal medicine, surgical care, and chronic disease management with strong affordability and community partnerships.',
        description: [
          'Located in Addis Ababa, YIMSC is a reputable healthcare facility integral to the community since receiving a COVID-19 treatment license on August 29, 2013.',
          'Initially a COVID-19 treatment center, it transitioned to an internal medicine service provider with a license obtained on January 30, 2013, offering high-quality medical services.',
          'Staffed by dedicated internal medicine specialists, it excels in chronic condition treatment and kidney care, maintaining a clean and comfortable environment.',
          'With 105 permanent and temporary staff, YIMSC collaborates with government institutions for discounted diagnostics and continuous professional training, aiming to upgrade to a general hospital and initiate kidney transplantation.',
        ],
        images: [
          `${IMAGE_URL}&yimsc1`,
          `${IMAGE_URL}&yimsc2`,
          `${IMAGE_URL}&yimsc3`,
        ],
        coreServices: [
          'Internal Medicine',
          'Surgery',
          'Kidney Treatments',
          'Chronic Care',
        ],
        contact: {
          phone: '+251-9-12-334455',
          email: 'contact@yimsc.com',
          address: 'Addis Ababa, Ethiopia',
        },
      },
      {
        id: 'yph',
        slug: 'yanet-primary-hospital',
        name: 'Yanet Primary Hospital (YPH)',
        location: 'Hawassa, Ethiopia',
        overview:
          'Comprehensive hospital services with Dialysis, Chemotherapy, MCH & NICU, Radiology, OR, Emergency, and In/Outpatient care.',
        description: [
          'Yanet Primary Hospital (YPH), a key member of the Liyana Healthcare family, is dedicated to providing comprehensive medical care to the community.',
          'Noted for specialized services like dialysis, chemotherapy, Maternal and Child Health (MCH), and Neonatal Intensive Care Unit (NICU) services.',
          'Features departments including Outpatient, Inpatient, Emergency, MNCH, Dialysis, Chemotherapy, Radiology, and Operating Room (OR) units for comprehensive diagnostics and surgery.',
          'Supported by a compassionate team and modern facilities prioritizing patient comfort and safety.',
        ],
        images: [
          `${IMAGE_URL}&yph1`,
          `${IMAGE_URL}&yph2`,
          `${IMAGE_URL}&yph3`,
          `${IMAGE_URL}&yph4`,
        ],
        coreServices: [
          'Dialysis',
          'Chemotherapy',
          'MCH & NICU',
          'Radiology',
          'OR',
        ],
        contact: {
          phone: '+251-9-11-223344',
          email: 'info@yanetprimaryhospital.com',
          address: 'Hawassa, Ethiopia',
          googleMap: 'https://maps.app.goo.gl/sQ96E6HJ7ZhFYu949',
        },
        groupPhoto: `${IMAGE_URL}&yph-group`,
      },
      {
        id: 'ytssc',
        slug: 'yanet-trauma-surgical-specialized-center',
        name: 'Yanet Trauma & Surgical Specialized Center (YTSSC)',
        location: 'Ethiopia',
        overview:
          '24/7 trauma and surgical excellence across orthopedics, neurosurgery, plastics, and intensive care capacity.',
        description: [
          'A division of Liyana Healthcare, YTSSC provides specialized trauma management and surgical care by highly qualified orthopedists and surgeons.',
          'Offers high-quality, compassionate care on outpatient and inpatient bases through Trauma Management and Surgery Departments.',
          'Handles acute care and trauma surgeries, including orthopedic, plastic, neurosurgery, and more, with 24/7 advanced diagnostic and treatment facilities.',
          'Capable of serving up to 250 clients daily with comprehensive surgical and intensive care services.',
        ],
        images: [
          `${IMAGE_URL}&ytssc1`,
          `${IMAGE_URL}&ytssc2`,
          `${IMAGE_URL}&ytssc3`,
        ],
        coreServices: [
          'Trauma',
          'Orthopedics',
          'Plastics',
          'Neurosurgery',
          'ICU',
        ],
        contact: {
          email: 'info@ytssc.com',
          address: 'Ethiopia',
        },
      },
      {
        id: 'yimsc-specialized',
        slug: 'yanet-internal-medicine-specialized-center',
        name: 'Yanet Internal Medicine Specialized Center (YIMSC)',
        location: 'Ethiopia',
        overview:
          'Round-the-clock subspecialty services: Neurology, Gastroenterology, ENT, Dermatology, Oncology, Hemodialysis & Psychiatry; MRI/CT-equipped.',
        description: [
          'A division of Liyana Healthcare, YIMSC specializes in advanced internal medicine clinical services with 24/7 specialty care.',
          'Offers services in Neurology, Gastroenterology, ENT, Dermatology, Women’s Health, Cancer Treatment, Hemodialysis, and Psychiatry.',
          'Equipped with state-of-the-art diagnostic technologies like MRI, CT-Scan, and advanced clinical laboratories.',
          'Selected by Ethiopia’s Federal Ministry of Health to partner with GAMCA for medical examinations for expatriates heading to Gulf countries.',
        ],
        images: [
          `${IMAGE_URL}&yimsc-spec1`,
          `${IMAGE_URL}&yimsc-spec2`,
          `${IMAGE_URL}&yimsc-spec3`,
        ],
        coreServices: [
          'Neurology',
          'Gastro',
          'ENT',
          'Derm',
          'Oncology',
          'MRI/CT',
        ],
        contact: {
          email: 'contact@yimsc-specialized.com',
          address: 'Ethiopia',
        },
      },
    ],
  },
  {
    id: 'education-research',
    title: 'Educational Services',
    tagline: 'Building the Future of Healthcare Knowledge & Leadership',
    attributes: [
      'Graduate Courses (MPH): Public Health, Health Service Management, Epidemiology, Reproductive Health, Nutrition',
      'Undergraduate Courses (BSc): Anesthesia, Pharmacy, Radiography',
      'Continuing Professional Development',
      'Public Health',
      'Healthcare Operations',
      'Business, Management, & Organizational Development',
    ],
    divisions: [
      {
        id: 'ylchc',
        slug: 'yanet-liyana-college',
        name: 'Yanet-Liyana College of Health Sciences (YLCHC)',
        location: 'Hawassa, Ethiopia',
        overview:
          'Accredited, competency-based UG & PG programs with scholarships, internships, CPD, and strong job placement within Liyana Healthcare PLC.',
        description: [
          'Established in 2021, YLCHC, part of Liyana Healthcare PLC, offers postgraduate (MPH) and undergraduate (BSc) programs in health sciences, aiming to excel by 2027.',
          'Emphasizes competency-based training with theoretical and practical learning, upholding the motto "Quality Is Non-Negotiable."',
          'Provides scholarships, internships at Yanet clinical facilities, discounted medical care for students, and job placements within Liyana Healthcare.',
          'Accredited by Hawassa University as a CPD provider, offering short-term training certified by the Ministry of Health, with expanded infrastructure including a G+3 building.',
        ],
        images: [
          `${IMAGE_URL}&college1`,
          `${IMAGE_URL}&college2`,
          `${IMAGE_URL}&college3`,
        ],
        coreServices: ['MPH Tracks', 'BSc Programs', 'CPD', 'Research'],
        contact: {
          email: 'info@ylchc.edu.et',
          address: 'Hawassa, Ethiopia',
        },
      },
      {
        id: 'lhc-rct',
        slug: 'liyana-research-consultancy-team',
        name: 'LHC-RCT (Research & Consultancy Team)',
        location: 'Ethiopia',
        overview:
          'End-to-end research and advisory: strategy, operations, finance, HR, feasibility studies, evaluations, and organizational development.',
        description: [
          'LHC-RCT, part of Liyana Healthcare, provides health service and management consultancy for in-house and external customers.',
          'Supports organizational and business development through strategic decision-making, health research, baseline surveys, and feasibility studies.',
          'Offers consultancy in project management, evaluations, business strategy, financial management, corporate governance, HR, and supply chain management.',
          'Equipped with professional staff and premises to deliver comprehensive advisory services.',
        ],
        images: [`${IMAGE_URL}&lhc-rct1`, `${IMAGE_URL}&lhc-rct2`],
        coreServices: ['Strategy', 'Governance', 'Finance', 'HR', 'OD'],
        contact: {
          email: 'consultancy@liyanahealthcare.com',
          address: 'Ethiopia',
        },
      },
    ],
  },
  {
    id: 'drugs-supplies-import',
    title: 'Import & Distribution',
    tagline: 'Securing Ethiopia’s Access to Global-Standard Pharmaceuticals',
    attributes: [
      'Medical & Industrial Gases (Oxygen, Nitrogen) Manufacturing & Distribution',
      'Drugs, Medical Supplies, & Equipment Import & Distribution',
    ],
    divisions: [
      {
        id: 'ydmsi',
        slug: 'yanet-drugs-medical-supplies-import',
        name: 'Yanet Drugs & Medical Equipment Import & Wholesale (YDMSI)',
        location: 'Ethiopia',
        overview:
          'Import and wholesale of EFDA-approved medicines and supplies with robust licensing and distribution coverage.',
        description: [
          'Launched in June 2019, YDMSI imports EFDA-approved high-quality drugs and medical supplies, distributing to wholesalers in southern and central Ethiopia.',
          'Builds on the success of YDMSWS, leveraging experience in medical supply chain management to meet growing healthcare product demands.',
          'Operates with appropriate premises, work permissions, and licenses, ensuring efficient distribution.',
          'First of its kind in southern and central Ethiopia, enhancing access to essential medical supplies.',
        ],
        images: [`${IMAGE_URL}&ydmsi1`, `${IMAGE_URL}&ydmsi2`],
        coreServices: ['EFDA-Approved', 'Wholesale', 'Coverage'],
        contact: {
          email: 'info@ydmsi.com',
          address: 'Ethiopia',
        },
      },
      {
        id: 'digital-pharma',
        slug: 'liyana-digital-pharmaceuticals',
        name: 'Liyana Digital Pharmaceuticals & Medical Supplies Import',
        location: 'Ethiopia',
        overview:
          'Exclusive agency registrations with reputable manufacturers to solve critical drug & equipment shortages nationally.',
        description: [
          'Established to address current and future needs for drugs, medical equipment, and supplies for Liyana Healthcare and Ethiopia.',
          'Registered as the sole agent for products from reputable global manufacturers, with more registrations in progress.',
          'Aims to alleviate critical shortages of specific drugs and equipment, enhancing healthcare delivery nationwide.',
          'Designed to support financial growth and improve access to essential healthcare products.',
        ],
        images: [
          `${IMAGE_URL}&digital-pharma1`,
          `${IMAGE_URL}&digital-pharma2`,
        ],
        coreServices: [
          'Registrations',
          'Global Manufacturers',
          'Shortage Solutions',
        ],
        contact: {
          email: 'digitalpharma@liyanahealthcare.com',
          address: 'Ethiopia',
        },
      },
    ],
  },
  {
    id: 'product-manufacturing',
    title: 'Manufacturing',
    tagline: 'Innovating Everyday Essentials for Healthcare & Households',
    attributes: [
      'Detergents, Chemicals, & Cosmetics Manufacturing & Distribution',
    ],
    divisions: [
      {
        id: 'yali-detergent',
        slug: 'yali-detergent-cosmetic-manufacturing',
        name: 'Yali Detergent & Cosmetic Manufacturing (YDMSWS)',
        location: 'Ethiopia',
        overview:
          'High-quality detergents, industrial chemicals, and cosmetics serving healthcare facilities and consumer markets.',
        description: [
          'A branch of Liyana Healthcare, YDMSWS specializes in wholesale distribution of drugs and medical supplies, established in November 2013.',
          'Major distributor in central and southern Ethiopia, ensuring access to essential drugs and supplies through efficient supply chain management.',
          'Supported by dependable suppliers and loyal customers, including pharmacies and drug stores across the region.',
          'Produces high-quality detergents, industrial chemicals, and cosmetics for healthcare and consumer markets.',
        ],
        images: [
          `${IMAGE_URL}&yali-detergent1`,
          `${IMAGE_URL}&yali-detergent2`,
        ],
        coreServices: ['Detergents', 'Chemicals', 'Cosmetics', 'Wholesale'],
        contact: {
          email: 'info@ydmsws.com',
          address: 'Ethiopia',
        },
      },
    ],
  },
];
