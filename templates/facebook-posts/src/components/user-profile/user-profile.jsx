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
      <div className="user-picture" style={{ backgroundImage: `url("${pic}")` }} />
      <div className="user-info">
        <span className="user-name" style={{ color: fullNameColor }}>
          <FitText style={{ justifyContent: 'flex-start' }}>{name}</FitText>
        </span>
      </div>
    </div>
  )
}

export default UserProfile;