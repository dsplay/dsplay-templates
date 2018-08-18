import React from 'react';
import { tval } from '../util/template';
import logo from '../images/ig-logo.png';

const primaryColor = tval('primary_color', 'white');
const fullNameColor = tval('user_full_name_color', primaryColor);

const secondaryColor = tval('secondary_color', '#FFFF99');
const screenNameColor = tval('user_screen_name_color', secondaryColor);

function UserProfile({
    name,
    username,
    pic,
    className,
}) {
    return (
        <div className={`user-profile ${className}`}>
            <div className="user-picture" style={{ backgroundImage: `url("${pic}")` }}></div>
            <span className="user-name" style={{ color: fullNameColor }}>{name}</span>
            <span className="user-screen-name" style={{ color: screenNameColor }}>@{username}</span>
            <img id="logo" src={logo}/>
        </div>
    )
}

export default UserProfile;