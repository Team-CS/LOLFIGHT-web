export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-gray-800">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl">페이지를 찾을 수 없습니다</p>
      <p className="text-gray-500 mt-2">
        주소가 잘못되었거나, 존재하지 않는 페이지입니다.
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
