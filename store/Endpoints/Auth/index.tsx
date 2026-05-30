import { defaults } from "../default";

export const authEndpoints = {
  mobileLogin: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/login/",
    },
  },
  registerUser: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/register",
    },
  },
  sendOTP: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/send-otp",
    },
  },
  verifyOTP: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/verify-otp",
    },
  },
  resetPassword: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/reset-password",
    },
  },
};
