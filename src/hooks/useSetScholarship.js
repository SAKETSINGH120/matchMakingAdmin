import { useEffect } from "react";
import { getScholarship } from "../Services/ScholarshipApi";

const useSetScholarship = (id, set) => {
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await getScholarship(id);
          if (res.status) set(res.data);
        } catch (error) {
          console.log("Error while fetching scholarship details : ", error);
        }
      })();
    }
  }, []);
};

export default useSetScholarship;
