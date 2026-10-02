import createMiddleware from "next-intl/middleware";
import { routing } from "~/utils/navigation";

const proxy = createMiddleware(routing);

export default proxy;

export const config = { matcher: ["/", "/(fa|en)/:path*"] };
