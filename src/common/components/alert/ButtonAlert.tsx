import Swal from "sweetalert2";

interface Props {
  title: string;
  text: string;
  confirmButtonText: string;
  onConfirm: () => void;
}

const ButtonAlert = ({ title, text, confirmButtonText, onConfirm }: Props) => {
  Swal.fire({
    title,
    html: text.replace(/\n/g, "<br/>"),
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire(title, `${confirmButtonText}성공`);
    }
  });
};

const showAlert = (
  title: string,
  text: string,
  confirmButtonText: string,
  onConfirm: () => void
) => {
  ButtonAlert({ title, text, confirmButtonText, onConfirm });
};

export default showAlert;
