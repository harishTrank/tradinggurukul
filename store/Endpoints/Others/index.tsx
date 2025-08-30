import { defaults } from "../default";

export const othersEndpoints = {
  banners: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/layout",
    },
  },
  getCategory: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/products/all-categories",
    },
  },
  customProducts: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/custom-products",
    },
  },
  postsBlogAndCommunity: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/getposts",
    },
  },
  editProfile: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/profile",
    },
  },
  getUserProfile: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/myprofile",
    },
  },
  getCourseDetails: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/get-products-by-id",
    },
  },
  getCourseMyDetails: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/courseDetail",
    },
  },
  getCourseTopics: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/sectionTopic",
    },
  },
  getMyCourses: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/myCourse",
    },
  },
  customSearchCourse: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/custom-search",
    },
  },
  addToCart: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/cart/add",
    },
  },
  cartItemList: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/cart",
    },
  },
  removeCartItem: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/cart/remove",
    },
  },
  getallContent: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/getallContent",
    },
  },
  phonePeApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/phonepe-initiate",
    },
  },
  createOrderApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/checkout/new-order",
    },
  },
  updateStatusOrderApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/checkout/update-order",
    },
  },
  addCommentApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/add_comment",
    },
  },
  addCommentReplyApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/reply-comment",
    },
  },
  getAllCommentsApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/get-comment",
    },
  },
  checkLoginToken: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/check-token",
    },
  },
  addDoubtApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/course/add-doubt",
    },
  },
  getAllDoubtsApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/course/get-doubts",
    },
  },
  getNotificationListApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/notifications",
    },
  },
  readAllNotificationApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/notification/read-all",
    },
  },
  unReadNotificationCount: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/unread-notifications",
    },
  },
  supportDetailsApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/contact-info",
    },
  },
  getRefralCodeApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/refer",
    },
  },
  walletApplyApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/walletapply",
    },
  },
};
