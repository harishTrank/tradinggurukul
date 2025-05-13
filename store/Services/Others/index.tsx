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
