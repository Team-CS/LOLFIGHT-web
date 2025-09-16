import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Page() {
  return (
    <div className="w-full h-full my-[64px]">
      <div className="max-w-[1200px] mx-auto p-[12px] rounded-[12px] bg-brandbgcolor dark:bg-dark">
        <div className="privacy-header py-[12px] border-b-[2px] border-black dark:border-white">
          <p className="text-[24px] font-extrabold">
            롤파이트 개인정보 처리방침
          </p>
        </div>

        <div className="flex flex-col mt-[12px]">
          <p className="text-[20px] font-bold">개인정보처리방침</p>
          <p className="font-light">
            lolfight.kr (이하 LOLFIGHT)는 정보통신망 이용촉진 및 정보보호 등에
            관한 법률을 준수하며, 회원 가입 시 제공받은 이메일과 소셜 계정
            정보만 수집합니다. 수집된 정보는 서비스 운영, 회원 식별, 법령 준수
            및 마케팅 안내에 한정하여 이용됩니다.
          </p>
        </div>

        <div className="flex flex-col mt-[12px]">
          <p className="text-[20px] font-bold">개인정보 처리목적 및 수집항목</p>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="dark:text-white">항목</TableCell>
                <TableCell className="dark:text-white">내용</TableCell>
                <TableCell className="dark:text-white">수집항목</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="1">
                <TableCell className="dark:text-white">
                  회원가입 및 관리
                </TableCell>
                <TableCell className="dark:text-white">
                  ① 본인확인 및 회원 식별
                  <br />
                  ② 서비스 이용 및 운영
                  <br />③ 공지사항 및 안내
                </TableCell>
                <TableCell className="dark:text-white">
                  이메일 주소, 소셜 계정
                </TableCell>
              </TableRow>
              <TableRow key="2">
                <TableCell className="dark:text-white">마케팅 안내</TableCell>
                <TableCell className="dark:text-white">
                  ① 신규 서비스 안내
                  <br />② 이벤트 및 프로모션 안내
                </TableCell>
                <TableCell className="dark:text-white">이메일 주소</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col mt-[12px]">
          <p className="text-[20px] font-bold">개인정보 보유 및 이용기간</p>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="dark:text-white">수집항목</TableCell>
                <TableCell className="dark:text-white">
                  처리 및 보유기간
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="1">
                <TableCell className="dark:text-white">
                  회원 이메일 및 소셜 계정 정보
                </TableCell>
                <TableCell className="dark:text-white">
                  회원 탈퇴 후 30일간 임시 보관, 단 법적 분쟁이나 회계/세무/법령
                  준수 필요 시 최대 기간까지 보관 가능.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col mt-[12px]">
          <p className="text-[20px] font-bold">개인정보 파기절차 및 방법</p>
          <ol className="font-light py-[4px]">
            <li>
              ① 파기절차: 개인정보 처리 목적 달성, 보유기간 경과 시 별도 DB로
              이동 후 즉시 파기, 단 법령에 따른 예외는 제외.
            </li>
            <li>
              ② 파기방법: 전자적 파일은 복구 불가능하게 삭제, 종이 문서 등은
              파쇄 또는 소각.
            </li>
          </ol>
        </div>

        <div className="flex flex-col mt-[12px]">
          <p className="text-[20px] font-bold">개인정보 제공 및 위탁</p>
          <p className="font-light py-[4px]">
            LOLFIGHT는 수집된 개인정보를 외부에 제공하지 않습니다. 다만, 회원
            동의, 법령 준수, 수사기관 요청, 제휴사 계약 범위 내에서만 제공
            가능하며, 회원에게 사전 고지할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col mt-[12px]">
          <p className="text-[20px] font-bold">
            이용자 및 법정대리인의 권리와 행사방법
          </p>
          <div className="py-[4px]">
            <p>
              ① 회원은 개인정보 열람, 정정, 삭제, 처리 중단 요구 등 권리를
              행사할 수 있습니다.
            </p>
            <p>
              ② 단, 법령에서 명시된 수사·조사 목적 등 예외적 경우에는 권리 제한
              가능.
            </p>
            <p>
              ③ 회사는 회원이 제공한 정보의 정확성, 허위 정보 입력, 계정 공유
              등으로 인한 피해에 대해 책임을 지지 않습니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col mt-[12px]">
          <p className="text-[20px] font-bold">민원 처리 안내</p>
          <div className="py-[4px]">
            <p>이메일: lolfight.help@gmail.com</p>
            <p>
              회원은 서비스 이용 중 발생한 개인정보 관련 민원을 신고할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
