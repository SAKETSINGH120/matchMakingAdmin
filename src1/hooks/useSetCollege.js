import { useEffect } from "react";
import { getcollageApi } from "../Services/CollageApi,";

const useSetCollege = (id, set) => {
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await getcollageApi(id);
          if (res.status) set(res.data);
        } catch (error) {
          console.log("Error while fetching college details : ", error);
        }
      })();
    }
  }, []);
};

export default useSetCollege;
