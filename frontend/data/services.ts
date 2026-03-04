// data/services.ts

// ======================================================
// TYPES
// ======================================================

export type DivisionType =
  | 'healthcare'
  | 'education'
  | 'business'
  | 'manufacturing';

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  image: string;
  availability: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  tagline: string;
  heroImage: string;
  attributes: string[];
  divisions: Division[];
};

export type Division = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: DivisionType;
  location?: string;
  overview: string;
  description: string[];
  images: string[];
  coreServices: string[];
  stats?: { label: string; value: string }[];
  doctors?: Doctor[];
  contact: {
    phone?: string;
    email?: string;
    address?: string;
    googleMap?: string;
  };
  groupPhoto?: string;
};

// ======================================================
// PLACEHOLDER IMAGES (All Different for Sliders)
// ======================================================

// HERO IMAGES
const HERO_HEALTHCARE =
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=2000';
const HERO_EDUCATION =
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=2000';
const HERO_IMPORT =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=2000';
const HERO_MANUFACTURING =
  'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=2000';

// HEALTHCARE SLIDER IMAGES
const HOSPITAL_1 =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900';
const HOSPITAL_2 =
  'https://images.unsplash.com/photo-1516549655169-df83a092fc14?w=900';
const HOSPITAL_3 =
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900';
const HOSPITAL_4 =
  'https://images.unsplash.com/photo-1580281657521-47c8a5b7b1a6?w=900';

// EDUCATION SLIDER IMAGES
const COLLEGE_1 =
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900';
const COLLEGE_2 =
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=900';
const COLLEGE_3 =
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900';

// BUSINESS / IMPORT SLIDER IMAGES
const WAREHOUSE_1 =
  'https://images.unsplash.com/photo-1566576912906-25327041796c?w=900';
const WAREHOUSE_2 =
  'https://images.unsplash.com/photo-1581091012184-5c16f3b3c5a3?w=900';
const WAREHOUSE_3 =
  'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=900';

// MANUFACTURING SLIDER IMAGES
const FACTORY_1 =
  'https://images.unsplash.com/photo-1628522307525-423c4a250324?w=900';
const FACTORY_2 =
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900';
const FACTORY_3 =
  'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=900';

// DOCTOR IMAGE
const DOCTOR_PLACEHOLDER =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600';

// ======================================================
// DATA
// ======================================================

export const SERVICES_DATA: ServiceCategory[] = [
  // ======================================================
  // HEALTHCARE
  // ======================================================
  {
    id: 'advanced-services',
    title: 'Healthcare Services',
    tagline: 'Delivering Specialized & Comprehensive Medical Excellence',
    heroImage: HERO_HEALTHCARE,
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
        shortName: 'Yanet Addis',
        type: 'healthcare',
        location: 'Addis Ababa, Ethiopia',
        overview:
          'High-quality internal medicine, surgical care, and chronic disease management with strong affordability and community partnerships.',
        description: [
          'Integral to the community since receiving a COVID-19 treatment license.',
          'Transitioned into an internal medicine and surgical service provider.',
          'Excels in chronic disease management and kidney care.',
          'Collaborates with government institutions and aims to upgrade to a general hospital.',
        ],
        stats: [
          { label: 'Annual Patients', value: '15,000+' },
          { label: 'Specialists', value: '45' },
          { label: 'Bed Capacity', value: '120' },
        ],
        images: [HOSPITAL_1, HOSPITAL_2, HOSPITAL_3],
        coreServices: [
          'Internal Medicine',
          'Surgery',
          'Kidney Treatments',
          'Chronic Care',
        ],
        doctors: [
          {
            id: 'd1',
            name: 'Dr. Abebe Kebede',
            specialty: 'General Surgeon',
            availability: 'Mon - Fri',
            image: DOCTOR_PLACEHOLDER,
          },
          {
            id: 'd2',
            name: 'Dr. Sara Tesfaye',
            specialty: 'Internal Medicine',
            availability: 'Tue - Sat',
            image: DOCTOR_PLACEHOLDER,
          },
        ],
        contact: {
          phone: '+251-9-12-334455',
          email: 'contact@yimsc.com',
          address: 'Addis Ababa, Ethiopia',
          googleMap: 'https://goo.gl/maps/example1',
        },
      },

      {
        id: 'yph',
        slug: 'yanet-primary-hospital',
        name: 'Yanet Primary Hospital (YPH)',
        shortName: 'Yanet Primary',
        type: 'healthcare',
        location: 'Hawassa, Ethiopia',
        overview:
          'Comprehensive hospital services with Dialysis, Chemotherapy, MCH & NICU, Radiology, OR, Emergency, and In/Outpatient care.',
        description: [
          'Provides dialysis, chemotherapy, MCH, and NICU services.',
          'Includes outpatient, inpatient, emergency, radiology, and OR units.',
          'Modern facilities prioritizing patient safety and comfort.',
        ],
        stats: [
          { label: 'NICU Incubators', value: '12' },
          { label: 'Dialysis Machines', value: '8' },
          { label: 'Emergency Beds', value: '20' },
        ],
        images: [HOSPITAL_2, HOSPITAL_3, HOSPITAL_4],
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
        groupPhoto: HOSPITAL_4,
      },
    ],
  },

  // ======================================================
  // EDUCATION
  // ======================================================
  {
    id: 'education-research',
    title: 'Educational Services',
    tagline: 'Building the Future of Healthcare Knowledge & Leadership',
    heroImage: HERO_EDUCATION,
    attributes: [
      'Graduate Courses (MPH)',
      'Undergraduate Courses (BSc)',
      'Continuing Professional Development',
      'Healthcare Management & Research',
    ],
    divisions: [
      {
        id: 'ylchc',
        slug: 'yanet-liyana-college',
        name: 'Yanet-Liyana College of Health Sciences (YLCHC)',
        shortName: 'Yanet College',
        type: 'education',
        location: 'Hawassa, Ethiopia',
        overview:
          'Accredited competency-based UG & PG programs with strong job placement and internships.',
        description: [
          'Established in 2021 under Liyana Healthcare PLC.',
          'Offers MPH and BSc programs in health sciences.',
          'Provides scholarships, internships, and CPD programs.',
          'Accredited by Hawassa University as a CPD provider.',
        ],
        stats: [
          { label: 'Graduates', value: '500+' },
          { label: 'Programs', value: '8' },
          { label: 'Employment Rate', value: '95%' },
        ],
        images: [COLLEGE_1, COLLEGE_2, COLLEGE_3],
        coreServices: ['MPH Tracks', 'BSc Programs', 'CPD', 'Research'],
        contact: {
          phone: '+251-9-33-445566',
          email: 'info@ylchc.edu.et',
          address: 'Hawassa, Ethiopia',
          googleMap: 'https://www.google.com/maps',
        },
      },
    ],
  },

  // ======================================================
  // IMPORT & DISTRIBUTION
  // ======================================================
  {
    id: 'drugs-supplies-import',
    title: 'Import & Distribution',
    tagline: 'Securing Ethiopia’s Access to Global-Standard Pharmaceuticals',
    heroImage: HERO_IMPORT,
    attributes: [
      'Medical & Industrial Gases Manufacturing & Distribution',
      'Drugs, Medical Supplies & Equipment Import & Distribution',
    ],
    divisions: [
      {
        id: 'ydmsi',
        slug: 'yanet-drugs-medical-supplies-import',
        name: 'Yanet Drugs & Medical Equipment Import & Wholesale (YDMSI)',
        shortName: 'Yanet Import',
        type: 'business',
        location: 'Ethiopia',
        overview:
          'Import and wholesale of EFDA-approved medicines and supplies with strong licensing and distribution coverage.',
        description: [
          'Launched in June 2019.',
          'Distributes to southern and central Ethiopia.',
          'Operates with proper premises and licenses.',
          'Enhances access to essential medical supplies.',
        ],
        stats: [
          { label: 'Partners', value: '200+' },
          { label: 'Regions Served', value: '5' },
        ],
        images: [WAREHOUSE_1, WAREHOUSE_2, WAREHOUSE_3],
        coreServices: ['EFDA-Approved', 'Wholesale', 'Coverage'],
        contact: {
          phone: '+251-9-55-667788',
          email: 'info@ydmsi.com',
          address: 'Ethiopia',
          googleMap: 'http://googleusercontent.com/maps.google.com/5',
        },
      },
    ],
  },

  // ======================================================
  // MANUFACTURING
  // ======================================================
  {
    id: 'product-manufacturing',
    title: 'Manufacturing',
    tagline: 'Innovating Everyday Essentials for Healthcare & Households',
    heroImage: HERO_MANUFACTURING,
    attributes: [
      'Detergents, Chemicals & Cosmetics Manufacturing & Distribution',
    ],
    divisions: [
      {
        id: 'yali-detergent',
        slug: 'yali-detergent-cosmetic-manufacturing',
        name: 'Yali Detergent & Cosmetic Manufacturing (YDMSWS)',
        shortName: 'Yali Detergent',
        type: 'manufacturing',
        location: 'Ethiopia',
        overview:
          'High-quality detergents, industrial chemicals, and cosmetics serving healthcare and consumer markets.',
        description: [
          'Established November 2013.',
          'Major distributor in central and southern Ethiopia.',
          'Efficient supply chain and loyal regional customers.',
          'Produces detergents, industrial chemicals, and cosmetics.',
        ],
        stats: [
          { label: 'Daily Output', value: '5k Liters' },
          { label: 'Product Lines', value: '10' },
        ],
        images: [FACTORY_1, FACTORY_2, FACTORY_3],
        coreServices: ['Detergents', 'Chemicals', 'Cosmetics', 'Wholesale'],
        contact: {
          phone: '+251-9-77-889900',
          email: 'info@ydmsws.com',
          address: 'Ethiopia',
          googleMap: 'http://googleusercontent.com/maps.google.com/7',
        },
      },
    ],
  },
];
