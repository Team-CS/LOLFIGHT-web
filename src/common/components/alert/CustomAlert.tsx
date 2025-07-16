import React from "react";
import Swal from "sweetalert2";

interface Props {
  icon: "success" | "error" | "warning" | "info" | "question";
  title: string;
  text: string;
}

const CustomAlert = ({ icon, title, text }: Props) => {
  Swal.fire({
    icon,
    title,
    html: text.replace(/\n/g, "<br/>"),
    customClass: {
      container: "swal-container",
    },
  });
};

const showAlert = (
  icon: "success" | "error" | "warning" | "info" | "question",
  title: string,
  text: string
) => {
  CustomAlert({ icon, title, text });
};

export default showAlert;
