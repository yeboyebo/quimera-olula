import { Link, useNavigate } from "react-router";
export { usePath, useRoutes } from "hookrouter";

// Imperatively callable navigate compatible with React Router v6
let _navigate = (to) => { window.location.href = to; }; // fallback
export const navigate = (to, opts) => _navigate(to, opts);

// Render this component once near the root to wire up React Router's navigate
export function RouterBridge() {
    const nav = useNavigate();
    _navigate = nav;
    return null;
}

export const A = ({ href, children, ...props }) => <Link to={href} {...props}>{children}</Link>;
