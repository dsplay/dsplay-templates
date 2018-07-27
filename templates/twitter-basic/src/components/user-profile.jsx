import React from 'react';

function UserProfile({
    name,
    username,
    pic,
}) {
    return (
        <div className="user-profile">
            <div className="user-picture" style={{ backgroundImage: `url("${pic}")` }}></div>
            <div className="user-info">
                <span className="user-name">{name}</span>
                <span className="user-screen-name">@{username}</span>
            </div>
        </div>
    )
}

export default UserProfile;