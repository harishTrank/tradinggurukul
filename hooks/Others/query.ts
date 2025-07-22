import { useQuery } from "@tanstack/react-query";
import {
  bannersCall,
  customProductsCall,
  getallContent,
  getCategoryCall,
  getCourseDetailsCall,
  getMyCoursesCall,
  postsBlogAndCommunityCall,
} from "../../store/Services/Others";

export const useCustomProductsCall = (payload: any) =>
  useQuery(["customProductsCall", payload], () => customProductsCall(payload));

export const useBannersCall = () =>
  useQuery(["useBannersCall"], () => bannersCall());

export const useGetCategoryCall = () =>
  useQuery(["getCategoryCall"], () => getCategoryCall());

export const usePostsBlogAndCommunityCall = (payload: any) =>
  useQuery(["postsBlogAndCommunityCall", payload], () =>
    postsBlogAndCommunityCall(payload)
  );

export const useGetCourseDetailsCall = (payload: any) =>
  useQuery(["getCourseDetailsCall", payload], () =>
    getCourseDetailsCall(payload)
  );

export const useGetallContent = () =>
  useQuery(["getallContent"], () => getallContent());
