import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },{
        callbacks: {
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl
                return true
            }
        }
    }
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};