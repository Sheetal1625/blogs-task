import { toast } from "react-toastify";

export const showSuccessToast = (message:string)=>{
    toast.success(message, {
      position: "top-center",
    });
  }
  export const showFailureToast = (message:String)=>{
    toast.error(message, {
      position: "top-center",
    });
  }