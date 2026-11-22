import { FittedText } from '@dsplay/react-template-utils';

function UserProfile({
    name,
    username,
    pic,
}) {
    return (
        <div className="user-profile">
            <div className="user-picture" style={{ backgroundImage: `url("${pic}")` }}></div>
            <div className="user-info">
                <FittedText className="user-name" text={name} max={3} min={1.4} />
                <span className="user-screen-name">@{username}</span>
            </div>
        </div>
    )
}

export default UserProfile;