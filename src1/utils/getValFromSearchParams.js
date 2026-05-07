const getValFromSearchParams = ({ searchParams }) => {
  const searchQueryFromUrl = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const rowsPerPage = Number(searchParams.get("limit") || 7);
  const applicationStatus = searchParams.get("applicationStatus") || "";
  const status = searchParams.get("status") || "";
  const studentId = searchParams.get("student") || "";
  const collegeId = searchParams.get("college") || "";
  const location = searchParams.get("location") || "";
  const courses = searchParams.getAll("courses") || [];
  const scholarshipId = searchParams.get("scholarship") || "";
  const callStatus = searchParams.get("callStatus") || "";
  const start = searchParams.get("start") || "";
  const end = searchParams.get("end") || "";

  return {
    searchQueryFromUrl,
    page,
    rowsPerPage,
    applicationStatus,
    status,
    studentId,
    collegeId,
    location,
    courses,
    scholarshipId,
    callStatus,
    start,
    end,
  };
};

export default getValFromSearchParams;
