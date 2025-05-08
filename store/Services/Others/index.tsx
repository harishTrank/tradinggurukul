import { callApi } from "../../../utils/api/apiUtils";
import { othersEndpoints } from "../../Endpoints/Others";

export const bannersCall = () =>
  callApi({
    uriEndPoint: othersEndpoints.banners.v1,
  });
