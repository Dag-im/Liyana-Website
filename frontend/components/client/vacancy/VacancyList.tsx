'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { motion } from 'framer-motion';
import { Briefcase, ChevronDown, Filter, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  whatYouWillDo: string[];
  qualifications: string[];
}

interface VacancyListProps {
  vacancies: Vacancy[];
  onSelect: (id: string) => void;
}

export default function VacancyList({ vacancies, onSelect }: VacancyListProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<
    'title' | 'department' | 'location' | 'type'
  >('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort logic
  const filteredVacancies = vacancies.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.department.toLowerCase().includes(search.toLowerCase())
  );

  const sortedVacancies = [...filteredVacancies].sort((a, b) => {
    const aValue = String(a[sortBy] ?? '').trim();
    const bValue = String(b[sortBy] ?? '').trim();

    return sortOrder === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(sortedVacancies.length / itemsPerPage);
  const paginatedVacancies = sortedVacancies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'title' | 'department' | 'location' | 'type') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <div className="text-center mb-8">
        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
        >
          Open Positions
        </SectionHeading>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          Join our team and shape the future with us.
        </p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by title or department..."
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
            aria-expanded={showFilters}
            aria-controls="filters"
          >
            <Filter size={16} />
            Filters
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </button>
          <span className="text-sm text-gray-600 hidden sm:inline">
            Showing {paginatedVacancies.length} of {sortedVacancies.length}{' '}
            positions
          </span>
        </div>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
          id="filters"
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          <select
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none w-full sm:w-auto min-w-[140px]"
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
          </select>
          <select
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none w-full sm:w-auto min-w-[140px]"
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </motion.div>
      )}

      {/* Vacancy Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 hidden sm:table-header-group">
              <tr>
                {[
                  { field: 'title', label: 'Position' },
                  { field: 'department', label: 'Department' },
                  { field: 'location', label: 'Location' },
                  { field: 'type', label: 'Type' },
                ].map(({ field, label }) => (
                  <th
                    key={field}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      handleSort(
                        field as 'title' | 'department' | 'location' | 'type'
                      )
                    }
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {sortBy === field && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${
                            sortOrder === 'asc' ? '' : 'rotate-180'
                          }`}
                        />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 sm:divide-none">
              {paginatedVacancies.map((vacancy) => (
                <motion.tr
                  key={vacancy.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  transition={{ duration: 0.1 }}
                  className="flex flex-col sm:table-row border-b sm:border-none p-4 sm:p-0 gap-2 sm:gap-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSelect(vacancy.id)}
                >
                  <td className="px-4 py-3 sm:whitespace-nowrap flex justify-between sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Briefcase
                        size={16}
                        className="text-cyan-700 sm:flex hidden"
                      />
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        {vacancy.title}
                      </span>
                    </div>
                    <span className="sm:hidden text-cyan-700 text-sm font-medium">
                      View Details
                    </span>
                  </td>
                  <td className="px-4 py-1 sm:py-3 text-sm text-gray-600 flex justify-between sm:table-cell">
                    <span className="sm:hidden font-medium">Department:</span>
                    {vacancy.department}
                  </td>
                  <td className="px-4 py-1 sm:py-3 text-sm text-gray-600 flex justify-between sm:table-cell">
                    <span className="sm:hidden font-medium">Location:</span>
                    <div className="flex items-center gap-1">
                      <MapPin
                        size={16}
                        className="text-cyan-400 sm:flex hidden"
                      />
                      {vacancy.location}
                    </div>
                  </td>
                  <td className="px-4 py-1 sm:py-3 sm:whitespace-nowrap flex justify-between sm:table-cell">
                    <span className="sm:hidden font-medium">Type:</span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-cyan-500/70 text-primary">
                      {vacancy.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:whitespace-nowrap text-center text-sm font-medium hidden sm:table-cell">
                    <button className="text-cyan-700 hover:text-cyan-400/80 transition cursor-pointer">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginatedVacancies.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-500 text-sm sm:text-base">
            No positions found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm"
              aria-label="Previous page"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 3;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50'
                  } transition`}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
