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
};
