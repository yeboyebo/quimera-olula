import { Link } from "react-router";
export { navigate, usePath, useRoutes } from "hookrouter";

export const A = ({ href, children, ...props }) => <Link to={href} {...props}>{children}</Link>;