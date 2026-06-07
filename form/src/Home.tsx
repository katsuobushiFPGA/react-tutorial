import { Link } from "react-router";

export default function Home() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/zod-form">ZodForm</Link>
        </li>
        <li>
          <Link to="/react-hook-form">ReactHookForm</Link>
        </li>
      </ul>
    </nav>
  );
}
