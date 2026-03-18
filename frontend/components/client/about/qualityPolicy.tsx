'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import gsap from 'gsap';
import { CheckCircle2, Globe } from 'lucide-react';
import type { QualityPolicy } from '@/types/cms.types';
import { useLayoutEffect, useRef, useState } from 'react';

interface PolicyLanguage {
  lang: string;
  goals: string[];
}

interface QualityPolicyProps {
  policies?: PolicyLanguage[];
}

const DEFAULT_POLICIES: QualityPolicy[] = [
  {
    id: 'quality-en',
    lang: 'English',
    goals: [
      'Ensure customer centricity and excelling experience by understanding, fulfilling, and exceeding customer requirements.',
      'Ensure service excellence by implementing national and international standards, innovations, and technology advancements focusing on clinical effectiveness, safety, and patient experience.',
      'Maintain and retain competent employees through development, engagement and empowerment to meet customer and stakeholder needs and to achieve organizational goals.',
      'Ensure financial growth and sustainability through cost efficiency, exploration and engagement of evolving business needs, strategic partnership, and carrying out of societal and environmental responsibilities.',
      'Our day-to-day operation reflects our core value of compassionate service. Clinical risk management is integral part of our operation; and involves identifying, assessing, and managing risks to ensure continual improvement of our processes and prevention of undesirable outcomes.',
      'The top management of LHC is committed to satisfy the needs and expectations of customers and stakeholders while fulfilling statutory and regulatory requirements, and continually improving the quality management system.',
    ],
    sortOrder: 1,
  },
  {
    id: 'quality-am',
    lang: 'Amharic',
    goals: [
      'የደንበኛ ፍላጎት ማሟላትና ከፍ ባለ ተሞክሮ በማሳየት የደንበኛ ፍላጎትን እንዲሁም ከሚጠበቀው በላይ ማድረግ።',
      'በአለም አቀፍና በአገር ደረጃ መደበኛ መርሀግብሮች ማስፈጸም፣ አዳዲስ ቴክኖሎጂዎች ማስገባት፣ እንዲሁም በታካሚ ተሞክሮ ፣ ደህንነትና ትክክለኛ ተግባር ላይ መሰረት ያለው አገልግሎት።',
      'በስራ ቦታ ውስጥ በሚገኙት ሰራተኞች እድገት፣ እንቅስቃሴና ብቃት ማድረግ በኩል የደንበኛና ባለሃብት ፍላጎት ማሟላትን እንዲሁም የድርጅቱን ግቦች ማሳካት።',
      'በተመጣጣኝ ወጪ፣ በተለዋዋጭ የንግድ ፍላጎቶች ማስተካከል፣ በስትራቴጂ አጋርነት እንዲሁም በማህበራዊና በአካባቢ ተግባር በመሳተፍ የገንዘብ እድገትና ቋሚነት ማረጋገጥ።',
      'ዕለታዊ ስራችን የእኛን ዋነኛ የአገልግሎት እሴት ይወክላል። የክሊኒካል አደጋ አስተዳደር የስራችን አካል ሲሆን ሂደታችንን በቀጥታ ለማሻሻልና የማይፈለጉ ውጤቶችን ለመከላከል አደጋዎችን ማወቅ፣ መገምገም እና ማስተዳደር ይያዙታል።',
      'የዋና አስተዳዳሪዎች የደንበኞችንና የባለሀብቶችን ፍላጎት ማሟላት፣ ሕጋዊና የመንግስት መስፈርቶችን ማሟላት፣ እንዲሁም በሁሉም እርምጃዎች ላይ የጥራት ስርዓትን በቀጥታ ማሻሻል እና የድርጅቱን ተልዕኮ ማሳካት።',
    ],
    sortOrder: 2,
  },
];

export default function QualityPolicyShowcase({
  policies = DEFAULT_POLICIES,
}: QualityPolicyProps) {
  const [activeLang, setActiveLang] = useState<string>(policies[0]?.lang ?? '');
  const listRef = useRef<HTMLDivElement>(null);
  const currentPolicy = policies.find((p) => p.lang === activeLang) ?? policies[0];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.policy-item',
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, listRef);
    return () => ctx.revert();
  }, [activeLang]);

  return (
    <section className="bg-slate-50 pt-10 pb-24 px-6 border-b border-slate-200 selection:bg-cyan-100 selection:text-cyan-900">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Quality Policy
          </SectionHeading>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Liyana Healthcare is committed to excellence, compassion, and
            sustainability through strategic goals that shape a healthier
            tomorrow.
          </p>

          {/* Language Toggle */}
          <div className="mt-10 flex justify-center gap-4">
            {policies.map((p) => (
              <button
                key={p.lang}
                onClick={() => setActiveLang(p.lang)}
                className={`flex items-center gap-2 px-6 py-3 border border-slate-200 text-sm font-bold tracking-wide uppercase transition-all duration-300 rounded-sm ${
                  activeLang === p.lang
                    ? 'bg-cyan-700 text-white border-cyan-700 shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                {p.lang}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div
          ref={listRef}
          className="bg-white border border-slate-200 p-8 md:p-12 shadow-sm rounded-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {currentPolicy?.goals.map((goal, i) => (
              <div
                key={i}
                className="policy-item flex items-start gap-4 p-6 bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-colors duration-300 rounded-sm"
              >
                <div className="shrink-0 mt-1">
                  <CheckCircle2 className="text-cyan-600 w-5 h-5" />
                </div>
                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
