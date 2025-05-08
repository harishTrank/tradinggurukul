import { callApi } from "../../../utils/api/apiUtils";
import { authEndpoints } from "../../Endpoints/Auth";

export const loginApiCall = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.mobileLogin.v1,
    body,
  });

export const registerUser = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.registerUser.v1,
    body,
    multipart: true,
  });
