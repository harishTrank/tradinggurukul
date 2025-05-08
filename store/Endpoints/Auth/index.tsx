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
};
