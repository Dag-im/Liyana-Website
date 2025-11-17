import { FolderList } from '@/components/client/media/FolderList';
import { SectionHeading } from '@/components/shared/sectionHeading';
import { mediaFolders } from './data';

export default function MediaPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <header className="text-center mb-16">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 leading-tight"
          >
            Media Gallery
          </SectionHeading>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our curated collection of high-quality images and videos
            from corporate events, team moments, and facility tours.
          </p>
        </header>

        {/* Perfectly Centered Folder Grid */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="border-t border-gray-200 pt-12">
              {/* The grid itself handles centering via auto-margins on cards */}
              <FolderList folders={mediaFolders} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
