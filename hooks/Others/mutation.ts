import { useMutation } from "@tanstack/react-query";
import { customSearchCourseCall, editProfileCall } from "../../store/Services/Others";

export const useEditProfileCall = () => {
    return useMutation((payload) => editProfileCall(payload));
};

export const useCustomSearchCourseCall = () => {
    return useMutation((payload) => customSearchCourseCall(payload));
};

