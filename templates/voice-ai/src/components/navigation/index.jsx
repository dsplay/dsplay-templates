/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home setup</Link>
        </li>
        <li>
          <Link to="/vapi">Go to A.I Assistant</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
