import { useTemplateVal } from '@dsplay/react-template-utils';
import logo from '../../images/ig-logo.png';

function UserProfile({
  name,
  username,
  pic,
  className,
}) {
  const primaryColor = useTemplateVal('primary_color', 'white');
  const fullNameColor = useTemplateVal('user_full_name_color', primaryColor);
  const secondaryColor = useTemplateVal('secondary_color', '#FFFF99');
  const screenNameColor = useTemplateVal('user_screen_name_color', secondaryColor);

  // Template values override the account's own Instagram name/picture; empty means "use Instagram".
  const finalPic = useTemplateVal('profile_picture') || pic;
  const finalName = useTemplateVal('user_screen_name') || name;

  return (
    <div className={`user-profile ${className}`}>
      <div className="user-picture" style={{ backgroundImage: `url("${finalPic}")` }} />
      <span className="user-name" style={{ color: fullNameColor }}>{finalName}</span>
      <span className="user-screen-name" style={{ color: screenNameColor }}>
        @
        {username}
      </span>
      <img id="logo" alt="Instagram Logo" src={logo} />
    </div>
  );
}

export default UserProfile;
