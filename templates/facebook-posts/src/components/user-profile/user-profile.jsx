import React from 'react';
import { FitText, useTemplateVal } from '@dsplay/react-template-utils';
import './user-profile.sass';



function UserProfile({
  name,
  pic,
  className = '',
}) {

  const primaryColor = useTemplateVal('primary_color', 'white');
  const fullNameColor = useTemplateVal('user_full_name_color', primaryColor);


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