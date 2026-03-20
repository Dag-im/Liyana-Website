'use client';

import AwardsSection from '@/components/client/about/AwardsSection';
import BrandLoader from '@/components/shared/BrandLoader';
import type { Award } from '@/types/awards.types';
import { useEffect, useRef, useState, useTransition } from 'react';
import { filterAwards } from './actions';

type AwardsClientProps = {
  initialAwards: Award[];
  initialTotal: number;
  categories: string[];
};

export default function AwardsClient({
  initialAwards,
  initialTotal,
}: AwardsClientProps) {
  const [awards, setAwards] = useState<Award[]>(initialAwards);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    startTransition(async () => {
      const result = await filterAwards({
        page: 1,
      });
      setAwards(result.data);
      setTotal(result.total);
      setPage(1);
    });
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await filterAwards({
        page: nextPage,
      });
      setAwards((prev) => [...prev, ...result.data]);
      setPage(nextPage);
    });
  };

  const hasMore = awards.length < total;

  return (
    <div>
      {isPending && (
        <div className="flex justify-center py-12">
          <BrandLoader fullScreen={false} size="sm" />
        </div>
      )}

      {!isPending && (
        <>
          <AwardsSection awards={awards} />

          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 border border-cyan-600 text-cyan-600 font-bold uppercase tracking-wider text-sm hover:bg-cyan-600 hover:text-white transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {!isPending && awards.length === 0 && (
        <div className="text-center py-20 text-slate-500">No awards found.</div>
      )}
    </div>
  );
}
