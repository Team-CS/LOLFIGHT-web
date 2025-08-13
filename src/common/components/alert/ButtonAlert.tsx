import Swal from "sweetalert2";

interface Props {
  title: string;
  text: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
}

const ButtonAlert = ({
  title,
  text,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
}: Props) => {
  Swal.fire({
    title,
    html: text.replace(/\n/g, "<br/>"),
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
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
  cancelButtonText: string,
  onConfirm: () => void
) => {
  ButtonAlert({ title, text, confirmButtonText, cancelButtonText, onConfirm });
};

export default showAlert;
