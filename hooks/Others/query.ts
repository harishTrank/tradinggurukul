import { useQuery } from "@tanstack/react-query";
import { bannersCall } from "../../store/Services/Others";

// export const useViewCollectionPost = (payload: any) =>
//   useQuery(["viewCollectionPost", payload], () => viewCollectionPost(payload));

export const useBannersCall = () =>
  useQuery(["useBannersCall"], () => bannersCall());
