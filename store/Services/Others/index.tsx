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

export const freeProductsCall = () =>
  callApi({
    uriEndPoint: othersEndpoints.freeProducts.v1,
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

export const removeCartItemCall = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.removeCartItem.v1,
    body,
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
export const createSingleOrderApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.createSingleOrderApi.v1,
    query,
  });

export const updateStatusOrderApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.updateStatusOrderApi.v1,
    body,
  });
export const updateBuyOrderApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.updateBuyOrderApi.v1,
    body,
  });

export const addCommentApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.addCommentApi.v1,
    body,
  });

export const addCommentReplyApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.addCommentReplyApi.v1,
    body,
  });

export const getAllCommentsApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getAllCommentsApi.v1,
    query,
  });

export const checkLoginTokenApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.checkLoginToken.v1,
    body,
  });

export const addDoubtApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.addDoubtApi.v1,
    body,
    multipart: true,
  });
export const getAllDoubtsApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getAllDoubtsApi.v1,
    query,
  });

export const getNotificationListApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getNotificationListApi.v1,
    query,
  });

export const readAllNotificationApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.readAllNotificationApi.v1,
    query,
  });

export const unReadNotificationCountApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.unReadNotificationCount.v1,
    query,
  });

export const supportDetailsApi = () =>
  callApi({
    uriEndPoint: othersEndpoints.supportDetailsApi.v1,
  });

export const getRefralCodeApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getRefralCodeApi.v1,
    body,
  });

export const walletApplyApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.walletApplyApi.v1,
    body,
  });

export const eventsApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.eventsApi.v1,
    query,
  });
export const dashboardEventApi = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.dashboardEventApi.v1,
    query,
  });

export const sendFCMTokenFirebase = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.sendFCMTokenFirebase.v1,
    body,
  });
export const deleteAccountApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.deleteAccountApi.v1,
    body,
  });
export const getIPODetails = () =>
  callApi({
    uriEndPoint: othersEndpoints.getIPODetails.v1,
  });
export const getNewsDetails = ({ query }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.getNewsDetails.v1,
    query,
  });
export const feedbackFormAPI = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.feedbackFormAPI.v1,
    body,
  });
export const withdrawRequestApi = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.withdrawRequestApi.v1,
    body,
  });
export const importantLinksAPI = () =>
  callApi({
    uriEndPoint: othersEndpoints.importantLinksAPI.v1,
  });
export const donwloadCertificate = ({ body }: any) =>
  callApi({
    uriEndPoint: othersEndpoints.donwloadCertificate.v1,
    body,
  });
