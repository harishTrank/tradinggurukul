import { callApi } from "../../../utils/api/apiUtils";
import { othersEndpoints } from "../../Endpoints/Others";

export const bannersCall = () =>
  callApi({
    uriEndPoint: othersEndpoints.banners.v1,
  });

export const getCategoryCall = () =>
  callApi({
    uriEndPoint: othersEndpoints.getCategory.v1,
  });

export const customProductsCall = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.customProducts.v1,
    query,
  });

export const postsBlogAndCommunityCall = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.postsBlogAndCommunity.v1,
    query,
  });

export const editProfileCall = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.editProfile.v1,
    body,
    multipart: true,
  });

export const getUserProfileCall = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getUserProfile.v1,
    body,
    multipart: true,
  });

export const getCourseDetailsCall = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getCourseDetails.v1,
    query,
  });

export const getCourseMyDetailsCall = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getCourseMyDetails.v1,
    query,
  });

export const getCourseTopicsCall = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getCourseTopics.v1,
    query,
  });

export const getMyCoursesCall = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getMyCourses.v1,
    query,
  });

export const customSearchCourseCall = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.customSearchCourse.v1,
    body,
  });

export const addToCartCall = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.addToCart.v1,
    body,
  });

export const cartItemListCall = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.cartItemList.v1,
    body,
  });

export const removeCartItemCall = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.removeCartItem.v1,
    query,
  });

export const getallContent = () =>
  callApi({
    uriEndPoint: othersEndpoints.getallContent.v1,
  });

export const phonePeApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.phonePeApi.v1,
    body,
  });

export const createOrderApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.createOrderApi.v1,
    query,
  });

export const updateStatusOrderApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.updateStatusOrderApi.v1,
    body,
  });
