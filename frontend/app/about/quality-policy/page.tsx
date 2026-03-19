import QualityPolicyShowcase from '@/components/client/about/qualityPolicy';

export const revalidate = 86400;

const page = () => {
  return (
    <QualityPolicyShowcase
      policies={[
        {
          lang: 'English',
          goals: [
            'Ensure customer centricity and excelling experience by understanding, fulfilling, and exceeding customer requirements.',
            'Ensure service excellence by implementing national and international standards, innovations, and technology advancements focusing on clinical effectiveness, safety, and patient experience.',
            'Maintain and retain competent employees through development, engagement and empowerment to meet customer and stakeholder needs and to achieve organizational goals.',
            'Ensure financial growth and sustainability through cost efficiency, exploration and engagement of evolving business needs, strategic partnership, and carrying out of societal and environmental responsibilities.',
            'Our day-to-day operation reflects our core value of compassionate service. Clinical risk management is integral part of our operation; and involves identifying, assessing, and managing risks to ensure continual improvement of our processes and prevention of undesirable outcomes.',
            'The top management of LHC is committed to satisfy the needs and expectations of customers and stakeholders while fulfilling statutory and regulatory requirements, and continually improving the quality management system.',
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
            'የዋና አስተዳዳሪዎች የደንበኞችንና የባለሀብቶችን ፍላጎት ማሟላት፣ ሕጋዊና የመንግስት መስፈርቶችን ማሟላት፣ እንዲሁም በሁሉም እርምጃዎች ላይ የጥራት ስርዓትን በቀጥታ ማሻሻል እና የድርጅቱን ተልዕኮ ማሳካት።',
          ],
        },
      ]}
    />
  );
};

export default page;
