import { useEffect } from "react";
import { getStudent } from "../Services/StudentApi";

const useSetStudent = (id, set) => {
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await getStudent(id);
          if (res.status) set(res.data);
        } catch (error) {
          console.log("Error while fetching student details : ", error);
        }
      })();
    }
  }, []);
};

export default useSetStudent;
