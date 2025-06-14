"use client";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
// import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import boardNavLinks from "@/src/data/boardNavLinks";
import { useEffect, useRef } from "react";
import { writePost } from "@/src/api/post.api";
import constant from "@/src/common/constant/constant";
import { useState } from "react";
import { PostDTO } from "@/src/common/DTOs/board/post.dto";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import CustomAlert from "./alert/CustomAlert";
import { jwtDecode } from "jwt-decode";

const WysiwygEditor = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>();
  const [category, setCategory] = useState("자유");
  const [image, setImage] = useState<string>();
  const editorRef = useRef<Editor>(null);
  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr"],
    ["ul", "ol", "task"],
    ["table", "link"],
    ["image"],
    ["code"],
    ["scrollSync"],
  ];
  const { theme } = useTheme();
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      editorRef.current
        .getInstance()
        .addHook("addImageBlobHook", (blob: any, callback: any) => {
          onUploadImage(blob, callback);
        });
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded: any = jwtDecode(token);
        setIsAdminUser(decoded.admin || false);
      }
    }
  }, [editorRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSaveClick = async () => {
    const link = "";
    const editorIns = editorRef.current?.getInstance().getHTML() || "";
    const strippedHTML = editorIns.push(/<[^>]*>/g, ""); // HTML 태그 제거
    const storedMemberName = sessionStorage.getItem("memberName")?.toString();
    if (title && strippedHTML) {
      writePost(title, editorIns, storedMemberName!, category).then(
        (response) => {
          boardNavLinks
            .filter((link) => link.href !== "/")
            .map((link) => {
              if (link.title === category) {
                router.push(link.href + "/" + response.data.data.id);
              }
            });
          return;
        }
      );
    } else {
      CustomAlert("warning", "글쓰기", "제목과 내용을 작성해주세요.");
    }
  };

  const onUploadImage = async (blob: any, callback: any) => {
    const formData = new FormData();
    formData.append("file", blob);
    try {
      const imageRes = await axios.post(
        `${constant.SERVER_URL}/post/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const imageUrl = `${constant.SERVER_URL}/` + imageRes.data.data;
      setImage(imageUrl);
      callback(imageUrl, "image");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <select
        className="w-32 h-10 border rounded-md mb-4 dark:border-gray-700"
        onChange={handleCategoryChange}
      >
        {/* {boardNavLinks
          .filter((link) => link.href !== "/" && link.title !== "전체")
          .map((link) => (
            <option key={link.title} value={link.title}>
              {link.title}
            </option>
          ))} */}
        {boardNavLinks
          .filter((link) => {
            if (!isAdminUser) {
              return link.title !== "공지사항" && link.title !== "이벤트";
            }
            return link.href !== "/" && link.title !== "전체";
          })
          .map((link) => (
            <option key={link.title} value={link.title}>
              {link.title}
            </option>
          ))}
      </select>
      <input
        className="w-full h-10 mb-4 border rounded-md px-2 bg-gray-100 dark:bg-black dark:border-gray-700"
        type="text"
        placeholder="제목을 입력하세요"
        onChange={handleChange}
      ></input>
      <div className="w-full overflow-hidden overflow-y-scroll">
        <Editor
          ref={editorRef}
          initialValue=" "
          placeholder="글을 작성해주세요"
          initialEditType="wysiwyg"
          previewStyle="tab"
          height="60rem"
          plugins={[colorSyntax]}
          toolbarItems={toolbarItems}
          hooks={{ addImageBlobHook: onUploadImage }}
          className="bg-red-500"
          // 현재 글 작성 도중 테마를 변경하면 렌더링이 되지 않는 상황이 발생함
          theme={theme === "dark" ? "dark" : "light"}
        />
      </div>
      <div className="w-full flex justify-between">
        <button className="w-16 h-10 flex font-medium border items-center justify-center rounded-md cursor-pointer my-4 dark:border-gray-700 dark:text-gray-100">
          취소
        </button>
        <button
          className="w-32 h-10 flex font-medium bg-brandcolor text-white items-center justify-center rounded-md cursor-pointer my-4"
          onClick={handleSaveClick}
        >
          작성하기
        </button>
      </div>
    </div>
  );
};

export default WysiwygEditor;
