import { useMutation } from "@tanstack/react-query";
import { registerUser, loginApiCall } from "../../store/Services/Auth";


export const useloginApiCall = () => {
    return useMutation((payload) => loginApiCall(payload));
};

export const useRegisterUser = () => {
    return useMutation((payload) => registerUser(payload));
};

