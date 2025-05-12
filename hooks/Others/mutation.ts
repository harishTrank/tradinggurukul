import { useMutation } from "@tanstack/react-query";
import { editProfileCall } from "../../store/Services/Others";

export const useEditProfileCall = () => {
    return useMutation((payload) => editProfileCall(payload));
};