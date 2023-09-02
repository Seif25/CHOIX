import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { poll } = await req.json();

  let response = NextResponse.json({
    status: 200,
    message: "Auth success",
  });

  console.log(poll);

  //  if (username === process.env.USER && password === process.env.PASSWORD) {

  //      let response = NextResponse.json({
  //          status: 200,
  //          message: "Auth success",

  //         })

  //     response.cookies.set({
  //         name: "auth",
  //         value: "true",
  //         httpOnly: true,
  //         maxAge: 60 * 60 * 24 * 7,
  //     });

  return response;
  // } else {

  //     return NextResponse.json({
  //         status: 401,
  //         message: "Auth failed",
  //     })

  // }
}
