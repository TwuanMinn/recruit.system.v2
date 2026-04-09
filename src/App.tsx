import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useCandidateStore } from './store/useCandidateStore';
import { useDarkMode } from './hooks/useDarkMode';
import { useFilteredCandidates } from './hooks/useFilteredCandidates';
import { useExport } from './hooks/useExport';
import { Icon } from './components/ui';
import StatsPanel, { TalentDistribution, ApplicationHealth } from './components/StatsPanel';
import CandidateForm from './components/CandidateForm';
import CandidateDetail from './components/CandidateDetail';
import CandidateTable from './components/CandidateTable';
import FilterDropdown from './components/FilterDropdown';
import SkeletonLoader from './components/SkeletonLoader';
import { showUndoToast } from './components/UndoToast';
import ParticleBackground from './components/ParticleBackground';
import TrashPanel from './components/TrashPanel';

export default function App() {
  const store = useCandidateStore();
  const {
    candidates, view, selectedCandidate, showForm,
    searchTerm, filterLevel, filterResult, sortConfig, currentPage,
  } = store;

  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, toggleDarkMode] = useDarkMode();

  const { sorted, paginated, totalPages, handleSort } = useFilteredCandidates();
  const {
    fileInputRef, exportToPDF, handleExportCSV,
    handleExportExcel, handleImportCSV, onCSVFileSelected,
  } = useExport();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-candidates')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen transition-colors duration-300">
      <ParticleBackground />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? 'rgb(22 28 42)' : '#fff',
            color: darkMode ? 'rgb(200 214 233)' : '#0d3459',
            borderRadius: '12px',
            border: darkMode ? '1px solid rgba(45,60,85,0.5)' : '1px solid rgba(148,180,224,0.15)',
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      />
      {/* Hidden CSV file input */}
      <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={onCSVFileSelected} aria-label="Import candidates from CSV" />

      {/* Trash Panel */}
      <TrashPanel />

      {/* ===== Main Content ===== */}
      <main className="min-h-screen w-full max-w-7xl mx-auto" role="main">
        <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <AnimatePresence mode="wait">
            {/* ===== List View ===== */}
            {view === 'list' && !showForm && (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Hero Header */}
                <div className="relative py-8 sm:py-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4">
                  {/* Decorative gradient blobs */}
                  <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -top-10 right-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="dashboard" className="text-primary" size="text-xl" />
                      </div>
                      <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-primary/70 bg-primary/5 px-3 py-1 rounded-full">
                        Talent Acquisition
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
                      Candidates Overview
                    </h1>
                    <p className="text-sm sm:text-base text-on-surface/50 mt-1.5 max-w-md">
                      Reviewing the latest talent acquisition metrics and candidate profiles.
                    </p>
                  </div>
                  <div className="relative flex flex-row flex-wrap w-full sm:w-auto gap-3 items-center">
                    {/* Dark Mode Toggle */}
                    <button
                      onClick={toggleDarkMode}
                      className="p-2.5 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 active:scale-95"
                      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      title={darkMode ? 'Light Mode' : 'Dark Mode'}
                    >
                      <Icon name={darkMode ? 'light_mode' : 'dark_mode'} size="text-lg" />
                    </button>

                    {/* Trash Toggle */}
                    <button
                      onClick={store.toggleTrash}
                      className="p-2.5 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 active:scale-95 relative"
                      aria-label="Open trash"
                      title="Trash"
                    >
                      <Icon name="delete_sweep" size="text-lg" />
                      {store.deletedCandidates.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error text-[0.6rem] font-bold rounded-full flex items-center justify-center">
                          {store.deletedCandidates.length}
                        </span>
                      )}
                    </button>

                    {/* Filter */}
                    <FilterDropdown
                      filterOpen={filterOpen}
                      setFilterOpen={setFilterOpen}
                      filterLevel={filterLevel}
                      filterResult={filterResult}
                      dispatch={(action: { type: string; payload: string }) => {
                        if (action.type === 'SET_FILTER_LEVEL') store.setFilterLevel(action.payload);
                        if (action.type === 'SET_FILTER_RESULT') store.setFilterResult(action.payload);
                      }}
                    />

                    {/* Add Candidate */}
                    <button
                      className="flex-1 sm:flex-none justify-center px-5 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl active:scale-[0.97] transition-all duration-200 flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:bg-primary-dim cursor-pointer"
                      onClick={store.toggleForm}
                    >
                      <Icon name="add" size="text-lg" /> Add Candidate
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {loading ? <SkeletonLoader type="stats" /> : <StatsPanel candidates={candidates} />}

                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Table */}
                  <div className="lg:col-span-2">
                    {loading ? (
                      <SkeletonLoader type="table" />
                    ) : (
                      <CandidateTable
                        candidates={paginated}
                        totalFiltered={sorted.length}
                        searchTerm={searchTerm}
                        sortConfig={sortConfig}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        deleteConfirmId={deleteConfirmId}
                        onSearch={store.setSearchTerm}
                        onSort={handleSort}
                        onSelect={store.selectCandidate}
                        onDelete={(id) => {
                          store.softDeleteCandidate(id);
                          setDeleteConfirmId(null);
                          showUndoToast('Candidate removed', () => {
                            store.restoreCandidate(id);
                            toast.success('Candidate restored');
                          });
                        }}
                        onDeleteConfirm={setDeleteConfirmId}
                        onPageChange={store.setPage}
                        onExportPDF={exportToPDF}
                        onExportCSV={handleExportCSV}
                        onExportExcel={handleExportExcel}
                        onImportCSV={handleImportCSV}
                      />
                    )}
                  </div>

                  {/* Right Rail */}
                  <div className="space-y-8">
                    {loading ? (
                      <SkeletonLoader type="sidebar" />
                    ) : (
                      <>
                        <TalentDistribution candidates={candidates} />
                        <ApplicationHealth candidates={candidates} />
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== Detail View ===== */}
            {view === 'detail' && selectedCandidate && (
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="py-4 sm:py-8 max-w-4xl mx-auto"
              >
                <CandidateDetail
                  candidate={candidates.find((c) => c.id === selectedCandidate.id) || selectedCandidate}
                />
              </motion.div>
            )}

            {/* ===== Add Form ===== */}
            {showForm && (
              <motion.div
                key="add-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'backOut' }}
                className="py-4 sm:py-8 max-w-3xl mx-auto"
              >
                <CandidateForm
                  onSuccess={() => toast.success('Candidate added successfully!')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
