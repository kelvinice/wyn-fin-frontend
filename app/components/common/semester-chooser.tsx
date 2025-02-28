import { useSemester } from '../core/semester-context';
import { useSemesters } from '../hooks/useSemesters';

export function SemesterChooser() {
  const { data: semesters, isLoading } = useSemesters();
  const { currentSemester, setCurrentSemester } = useSemester();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-40">
        <div className="loading loading-spinner loading-sm text-primary"></div>
      </div>
    );
  }

  return (
    <select 
      className="select select-bordered select-sm h-10 min-h-10 w-48 md:w-56 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
      value={currentSemester?.id || ""}
      onChange={(e) => {
        const semester = semesters?.find(s => s.id === parseInt(e.target.value));
        if (semester) setCurrentSemester(semester);
      }}
    >
      <option value="" disabled>Choose semester</option>
      {semesters?.map((semester) => (
        <option key={semester.id} value={semester.id}>
          {semester.description}
        </option>
      ))}
    </select>
  );
}