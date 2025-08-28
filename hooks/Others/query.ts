import { useQuery } from "@tanstack/react-query";
import {
  bannersCall,
  customProductsCall,
  getAllCommentsApi,
  getallContent,
  getAllDoubtsApi,
  getCategoryCall,
  getCourseDetailsCall,
  getMyCoursesCall,
  getNotificationListApi,
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

export const useGetAllCommentsApi = (payload: any) =>
  useQuery(["getAllCommentsApi", payload], () => getAllCommentsApi(payload));

export const useGetallContent = () =>
  useQuery(["getallContent"], () => getallContent());

export const useGetAllDoubtsApi = (payload: any) =>
  useQuery(["getAllDoubtsApi", payload], () => getAllDoubtsApi(payload));

export const useGetNotificationListApi = (payload: any) =>
  useQuery(["getNotificationListApi", payload], () =>
    getNotificationListApi(payload)
  );
