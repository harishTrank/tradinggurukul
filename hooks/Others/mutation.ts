import { useMutation } from "@tanstack/react-query";
import { addToCartCall, cartItemListCall, customSearchCourseCall, editProfileCall } from "../../store/Services/Others";

export const useEditProfileCall = () => {
    return useMutation((payload) => editProfileCall(payload));
};

export const useCustomSearchCourseCall = () => {
    return useMutation((payload) => customSearchCourseCall(payload));
};

export const useAddToCartCall = () => {
    return useMutation((payload) => addToCartCall(payload));
};

export const useCartItemListCall = () => {
    return useMutation((payload) => cartItemListCall(payload));
};
