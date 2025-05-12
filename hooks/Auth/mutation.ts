import { useMutation } from "@tanstack/react-query";
import { registerUser, loginApiCall, sendOTPCall, verifyOTPCall, resetPasswordCall } from "../../store/Services/Auth";


export const useloginApiCall = () => {
    return useMutation((payload) => loginApiCall(payload));
};

export const useRegisterUser = () => {
    return useMutation((payload) => registerUser(payload));
};

export const useSendOTPCall = () => {
    return useMutation((payload) => sendOTPCall(payload));
};

export const useVerifyOTPCall = () => {
    return useMutation((payload) => verifyOTPCall(payload));
};

export const useResetPasswordCall = () => {
    return useMutation((payload) => resetPasswordCall(payload));
};
