import { useQuery } from "@tanstack/react-query";
import { bannersCall, customProductsCall, getCategoryCall } from "../../store/Services/Others";

export const useCustomProductsCall = (payload: any) =>
  useQuery(["customProductsCall", payload], () => customProductsCall(payload));

export const useBannersCall = () =>
  useQuery(["useBannersCall"], () => bannersCall());

  export const useGetCategoryCall = () =>
  useQuery(["getCategoryCall"], () => getCategoryCall());

  