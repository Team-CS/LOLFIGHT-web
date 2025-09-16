"use client";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import boardNavLinks from "@/src/data/boardNavLinks";
import { useEffect, useRef } from "react";
import { writePost } from "@/src/api/post.api";
import constant from "@/src/common/constant/constant";
import { useState } from "react";
import { PostCreateDto } from "@/src/common/DTOs/board/post.dto";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import CustomAlert from "./alert/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useMemberStore } from "../zustand/member.zustand";
import { getCookie } from "@/src/utils/cookie/cookie";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface HeadingNode {
  level: number;
}

interface RenderContext {
  entering: boolean;
}

interface CodeBlockNode {
  info: string;
}
const WysiwygEditor = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { member } = useMemberStore();
  const { theme } = useTheme();
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const editorRef = useRef<Editor>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [title, setTitle] = useState<string>();
  const [category, setCategory] = useState("자유");
  const [image, setImage] = useState<string>();
  const [editorHtml, setEditorHtml] = useState(""); // 현재 작성 내용 저장
  const toolbarItems = isMobile
    ? [["bold", "italic"], ["image"]]
    : [
        ["heading", "bold", "italic", "strike"],
        ["hr"],
        ["ul", "ol", "task"],
        ["table", "link"],
        ["image"],
        ["code"],
        ["scrollSync"],
      ];

  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.getInstance().getHTML();
      setEditorHtml(currentHtml); // 변경 전 내용 저장
    }

    setEditorKey((prev) => prev + 1); // Editor 리렌더링
  }, [theme]);

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
      const token = getCookie("lf_atk");
      if (token) {
        const decoded: any = jwtDecode(token);
        setIsAdminUser(decoded.role === "ADMIN" || false);
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
    const editorIns = editorRef.current?.getInstance().getHTML() || "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorIns;

    const textContent = tempDiv.textContent?.trim() || "";
    const hasImage = tempDiv.querySelector("img") !== null;

    if (title && (textContent !== "" || hasImage)) {
      const postData: PostCreateDto = {
        postTitle: title,
        postContent: editorIns,
        postWriter: member!,
        postBoard: category,
      };

      writePost(postData)
        .then((response) => {
          boardNavLinks
            .filter((link) => link.href !== "/")
            .forEach((link) => {
              if (link.title === category) {
                router.replace(link.href + "/" + response.data.data.id);
              }
            });
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-018") {
            CustomAlert(
              "error",
              "글쓰기",
              "부적절한 단어가 포함되어 있습니다."
            );
          }
        });
    } else {
      CustomAlert("warning", "글쓰기", "제목과 내용을 작성해주세요.");
    }
  };

  const onUploadImage = async (blob: any, callback: any) => {
    const token = getCookie("lf_atk");
    const formData = new FormData();
    formData.append("file", blob);
    try {
      const imageRes = await axios.post(
        `${constant.SERVER_URL}/post/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
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
    <div className="flex flex-col h-full px-[20px] py-[24px] gap-[12px]">
      {/* 카테고리 선택 */}
      <select
        className={`border border-brandborder rounded-md bg-white dark:bg-branddark dark:border-branddarkborder dark:text-white ${
          isMobile
            ? "w-[100px] h-[30px] px-[8px] text-[12px]"
            : "w-[160px] h-[40px] px-[10px] text-[14px]"
        }`}
        onChange={handleCategoryChange}
      >
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

      {/* 제목 입력 */}
      <input
        className={`w-full border border-brandborder rounded-md bg-gray-100 dark:bg-branddark dark:border-branddarkborder dark:text-white ${
          isMobile
            ? "h-[30px] px-[8px] text-[12px]"
            : "h-[40px] px-[12px] text-[14px]"
        }`}
        type="text"
        placeholder="제목을 입력하세요"
        onChange={handleChange}
      />

      {/* 에디터 */}
      <div className="w-full border border-brandborder rounded-md overflow-hidden dark:border-branddarkborder">
        <Editor
          key={editorKey}
          ref={editorRef}
          initialValue={editorHtml || " "}
          placeholder="글을 작성해주세요"
          initialEditType="wysiwyg"
          previewStyle="tab"
          height={isMobile ? "400px" : "800px"}
          plugins={[colorSyntax]}
          toolbarItems={toolbarItems}
          hooks={{ addImageBlobHook: onUploadImage }}
          theme={theme === "dark" ? "dark" : "light"}
          customHTMLRenderer={{
            heading(node: HeadingNode, { entering }: RenderContext) {
              const level = node.level;
              const style = `font-size: ${
                24 - (level - 1) * 2
              }px; font-weight: bold; margin: 1em 0;`;
              return {
                type: entering ? "openTag" : "closeTag",
                tagName: `h${level}`,
                attributes: { style },
              };
            },
            codeBlock(node: CodeBlockNode, { entering }: RenderContext) {
              const info = node.info || "";
              const style =
                "background-color: #f8f9fa; padding: 1em; border-radius: 4px; font-family: monospace; white-space: pre; overflow-x: auto;";
              return {
                type: entering ? "openTag" : "closeTag",
                tagName: "pre",
                attributes: { style },
                children: [
                  {
                    type: entering ? "openTag" : "closeTag",
                    tagName: "code",
                    attributes: { class: `language-${info}` },
                  },
                ],
              };
            },
          }}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="w-full flex justify-between">
        <button
          className={`font-medium border border-brandborder rounded-md text-brandgray hover:bg-brandhover dark:border-branddarkborder dark:text-white dark:hover:bg-gray-600 transition ${
            isMobile
              ? "w-[60px] h-[30px] text-[12px]"
              : "w-[80px] h-[40px] text-[14px]"
          }`}
          onClick={() => router.back()}
        >
          취소
        </button>
        <button
          className={`font-medium bg-brandcolor text-white rounded-md hover:bg-brandhover transition ${
            isMobile
              ? "w-[100px] h-[30px] text-[12px]"
              : "w-[120px] h-[40px] text-[14px]"
          }`}
          onClick={handleSaveClick}
        >
          작성하기
        </button>
      </div>
    </div>
  );
};

export default WysiwygEditor;
