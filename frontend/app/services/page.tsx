import LiyanaShowcase from '@/components/client/services/ServiceGrid';
import {
  SERVICES_DATA,
  type Division as LocalDivision,
  type Doctor as LocalDoctor,
  type ServiceCategory as LocalServiceCategory,
} from '@/data/services';
import type { Division, ServiceCategory } from '@/types/services.types';

function mapDoctor(doctor: LocalDoctor, divisionId: string) {
  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    image: doctor.image,
    availability: doctor.availability,
    divisionId,
  };
}

function mapDivision(division: LocalDivision, serviceCategoryId: string): Division {
  return {
    id: division.id,
    slug: division.slug,
    name: division.name,
    shortName: division.shortName,
    location: division.location ?? null,
    overview: division.overview,
    logo: division.logo ?? null,
    description: division.description,
    groupPhoto: division.groupPhoto ?? null,
    isActive: true,
    serviceCategoryId,
    divisionCategoryId: division.type,
    divisionCategory: {
      id: division.type,
      name: division.type,
      label: division.type,
      description: null,
    },
    images: division.images.map((path, index) => ({
      id: `${division.id}-image-${index}`,
      path,
      sortOrder: index,
    })),
    coreServices: division.coreServices.map((name, index) => ({
      id: `${division.id}-service-${index}`,
      name,
      sortOrder: index,
    })),
    stats: (division.stats ?? []).map((stat, index) => ({
      id: `${division.id}-stat-${index}`,
      label: stat.label,
      value: stat.value,
      sortOrder: index,
    })),
    doctors: (division.doctors ?? []).map((doctor) =>
      mapDoctor(doctor, division.id)
    ),
    contact: {
      id: `${division.id}-contact`,
      phone: division.contact.phone ?? null,
      email: division.contact.email ?? null,
      address: division.contact.address ?? null,
      googleMap: division.contact.googleMap ?? null,
    },
    createdAt: '',
    updatedAt: '',
  };
}

function mapCategory(category: LocalServiceCategory): ServiceCategory {
  return {
    id: category.id,
    title: category.title,
    tagline: category.tagline,
    heroImage: category.heroImage,
    attributes: category.attributes,
    divisions: category.divisions.map((division) =>
      mapDivision(division, category.id)
    ),
    createdAt: '',
    updatedAt: '',
  };
}

const page = () => {
  return (
    <div>
      <LiyanaShowcase services={SERVICES_DATA.map(mapCategory)} />
    </div>
  );
};

export default page;
