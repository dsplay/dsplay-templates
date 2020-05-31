import React from 'react';
import { tval } from '@dsplay/template-utils';
import './user-profile.sass';
import FitText from '../fit-text/fit-text';

const primaryColor = tval('primary_color', 'white');
const fullNameColor = tval('user_full_name_color', primaryColor);

function UserProfile({
  name,
  pic,
  className = '',
}) {
  return (
    <div className={`user-profile ${className}`}>
      <div className="user-info">
        <span className="user-name" style={{ color: fullNameColor }}>
          <FitText>
            <div className="user-picture" style={{ backgroundImage: `url("${pic}")` }} />
            <span className="name">{name}</span>
          </FitText>
        </span>
      </div>
    </div>
  )
}

export default UserProfile;