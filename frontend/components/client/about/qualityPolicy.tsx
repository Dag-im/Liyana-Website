'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { CheckCircle2, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function QualityPolicyShowcase() {
  const [activeLang, setActiveLang] = useState<'English' | 'Amharic'>(
    'English'
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const policyData = [
    {
      lang: 'English',
      goals: [
        'Ensure customer centricity and excelling experience by understanding, fulfilling, and exceeding customer requirements.',
        'Ensure service excellence by implementing national and international standards, innovations, and technology advancements focusing on clinical effectiveness, safety, and patient experience.',
        'Maintain and retain competent employees through development, engagement and empowerment to meet customer and stakeholder needs and to achieve organizational goals.',
        'Ensure financial growth and sustainability through cost efficiency, exploration and engagement of evolving business needs, strategic partnership, and carrying out of societal and environmental responsibilities.',
        'Our day-to-day operation reflects our core value of compassionate service. Clinical risk management is integral part of our operation; and involves identifying, assessing, and managing risks to ensure continual improvement of our processes and prevention of undesirable outcomes.',
        'The top management of LHC is committed to satisfy the needs and expectations of customers and stakeholders while fulfilling statutory and regulatory requirements, and continually improving the quality management system in alignment with current standards and best practices for the sustainable achievement of company mission and realization of the vision of becoming "the most preferred healthcare solutions provider in the Horn of Africa by 2027".',
      ],
    },
    {
      lang: 'Amharic',
      goals: [
        'የደንበኛ ፍላጎት ማሟላትና ከፍ ባለ ተሞክሮ በማሳየት የደንበኛ ፍላጎትን እንዲሁም ከሚጠበቀው በላይ ማድረግ።',
        'በአለም አቀፍና በአገር ደረጃ መደበኛ መርሀግብሮች ማስፈጸም፣ አዳዲስ ቴክኖሎጂዎች ማስገባት፣ እንዲሁም በታካሚ ተሞክሮ ፣ ደህንነትና ትክክለኛ ተግባር ላይ መሰረት ያለው አገልግሎት።',
        'በስራ ቦታ ውስጥ በሚገኙት ሰራተኞች እድገት፣ እንቅስቃሴና ብቃት ማድረግ በኩል የደንበኛና ባለሃብት ፍላጎት ማሟላትን እንዲሁም የድርጅቱን ግቦች ማሳካት።',
        'በተመጣጣኝ ወጪ፣ በተለዋዋጭ የንግድ ፍላጎቶች ማስተካከል፣ በስትራቴጂ አጋርነት እንዲሁም በማህበራዊና በአካባቢ ተግባር በመሳተፍ የገንዘብ እድገትና ቋሚነት ማረጋገጥ።',
        'ዕለታዊ ስራችን የእኛን ዋነኛ የአገልግሎት እሴት ይወክላል። የክሊኒካል አደጋ አስተዳደር የስራችን አካል ሲሆን ሂደታችንን በቀጥታ ለማሻሻልና የማይፈለጉ ውጤቶችን ለመከላከል አደጋዎችን ማወቅ፣ መገምገም እና ማስተዳደር ይያዙታል።',
        'የዋና አስተዳዳሪዎች የደንበኞችንና የባለሀብቶችን ፍላጎት ማሟላት፣ ሕጋዊና የመንግስት መስፈርቶችን ማሟላት፣ እንዲሁም በሁሉም እርምጃዎች ላይ የጥራት ስርዓትን በቀጥታ ማሻሻል እና በአሁኑ የስራ ደንቦች እና ምርጥ ተግባራት ጋር በማስተካከል የድርጅቱን ተልዕኮ ማሳካትና በ2027 በሀብረት አፍሪካ ውስጥ በጣም ተመርጠው የጤና አገልግሎት አቅራቢ መሆን።',
      ],
    },
  ];

  const currentPolicy = policyData.find((p) => p.lang === activeLang)!;

  useEffect(() => {
    if (containerRef.current) {
      const goalItems = containerRef.current.querySelectorAll('.goal-item');
      goalItems.forEach((item, index) => {
        const element = item as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
          element.style.transition = 'all 0.6s ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  }, [activeLang]);

  return (
    <div className="relative max-w-6xl mx-auto py-24 px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
        >
          Quality Policy
        </SectionHeading>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Liyana Healthcare is committed to excellence, compassion, and
          sustainability through strategic goals that shape a healthier
          tomorrow.
        </p>

        {/* Language Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="bg-gray-100 p-2 rounded-2xl inline-flex">
            {policyData.map((p) => (
              <button
                key={p.lang}
                onClick={() => setActiveLang(p.lang as 'English' | 'Amharic')}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  activeLang === p.lang
                    ? 'bg-white text-cyan-500 shadow-lg shadow-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Globe className="w-4 h-4" />
                {p.lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative" ref={containerRef}>
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl border border-gray-100 rounded-3xl p-12 max-w-4xl mx-auto">
          {/* Goals Grid */}
          <div className="grid gap-6">
            {currentPolicy.goals.map((goal, i) => (
              <div
                key={i}
                className="goal-item flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-cyan-500 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    {goal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>
    </div>
  );
}
