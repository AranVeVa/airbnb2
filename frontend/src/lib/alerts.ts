import Swal from "sweetalert2";

export const showAlert = (title: string, text: string, icon: "success" | "error" | "warning" | "info") => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: "#3085d6",
    });
};