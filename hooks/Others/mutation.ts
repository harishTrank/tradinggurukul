import { useMutation } from "@tanstack/react-query";
import { addCommentApi, addCommentReplyApi, addDoubtApi, addToCartCall, cartItemListCall, customSearchCourseCall, editProfileCall } from "../../store/Services/Others";

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

export const useAddCommentApi = () => {
    return useMutation((payload) => addCommentApi(payload));
};

export const useAddCommentReplyApi = () => {
    return useMutation((payload) => addCommentReplyApi(payload));
};

export const useAddDoubtApi = () => {
    return useMutation((payload) => addDoubtApi(payload));
};


