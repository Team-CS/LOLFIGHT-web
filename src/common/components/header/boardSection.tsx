// components/BoardSection.tsx

interface Post {
  id: number;
  postTitle: string;
  postContent: string;
  postComments: number;
}

interface BoardSectionProps {
  tabTitles: [string, string];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  postLists: {
    [key: string]: Post[];
  };
  onPostClick: (id: number) => void;
  containsImage: (content: string) => boolean;
}

export default function BoardSection({
  tabTitles,
  activeTab,
  setActiveTab,
  postLists,
  onPostClick,
  containsImage,
}: BoardSectionProps) {
  return (
    <div className="flex flex-col w-full h-full gap-[12px] bg-brandbgcolor dark:bg-branddark">
      <div className="flex w-full items-center justify-between">
        {tabTitles.map((title) => (
          <button
            key={title}
            className={`w-full p-[12px] ${
              activeTab === title
                ? "font-bold text-brandcolor dark:text-white"
                : "bg-[#e4eefb] dark:bg-brandgray text-gray-500"
            }`}
            onClick={() => setActiveTab(title)}
          >
            {title}
          </button>
        ))}
      </div>

      <div className="flex flex-col px-[12px] py-[4px] gap-[8px]">
        {postLists[activeTab] && postLists[activeTab].length > 0 ? (
          postLists[activeTab].map((post) => (
            <div key={post.id} className="flex gap-[4px] items-center">
              {containsImage(post.postContent) ? <ImageIcon /> : <TextIcon />}
              <p
                className="max-w-[300px] hover:underline hover:decoration-gray-400 hover:decoration-opacity-50 cursor-pointer truncate"
                onClick={() => onPostClick(post.id)}
              >
                {post.postTitle}
              </p>
              <span className="text-red-400 text-xs">
                [{post.postComments}]
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

function ImageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.2"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 
          1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 
          1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 
          6v12a1.5 1.5 0 0 0 1.5 1.5Z"
      />
      <circle cx="20" cy="5" r="3" fill="red" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.2"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 
          1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 
          12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 
          1.125v17.25c0 .621.504 1.125 1.125 
          1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
      <circle cx="20" cy="5" r="3" fill="red" />
    </svg>
  );
}
