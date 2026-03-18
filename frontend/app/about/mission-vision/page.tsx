import MissionVisionValuesSection from '@/components/client/about/MissionVisionValuesSection';

const page = () => {
  return (
    <MissionVisionValuesSection
      missionTitle="Our Mission"
      missionDescription="To empower businesses and individuals through innovative solutions, exceptional service, and unwavering commitment to excellence, while creating sustainable value for all our stakeholders."
      missionIcon="Target"
      visionTitle="Our Vision"
      visionDescription="To be the leading force in our industry, recognized for innovation, integrity, and impact, while building a future where technology serves humanity and creates lasting positive change."
      visionIcon="Eye"
      coreValues={[
        {
          title: 'Excellence',
          description:
            'We strive for the highest standards in everything we do, delivering exceptional quality and results.',
          icon: 'Star',
        },
        {
          title: 'Innovation',
          description:
            'We embrace new ideas and technologies to create cutting-edge solutions for our clients.',
          icon: 'Rocket',
        },
        {
          title: 'Integrity',
          description:
            'We maintain the highest ethical standards and build trust through honest, transparent relationships.',
          icon: 'ShieldCheck',
        },
        {
          title: 'Collaboration',
          description:
            'We believe in the power of teamwork and partnerships to achieve extraordinary outcomes.',
          icon: 'Users',
        },
        {
          title: 'Sustainability',
          description:
            'We are committed to environmental responsibility and long-term value creation.',
          icon: 'Leaf',
        },
        {
          title: 'Customer Focus',
          description:
            'We put our clients first, understanding their needs and exceeding their expectations.',
          icon: 'UserCheck',
        },
      ]}
    />
  );
};

export default page;
