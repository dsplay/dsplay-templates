import React, { Component } from 'react';
import './App.css';
import UserProfile from './components/user-profile';
import Posts from './components/posts';

class App extends Component {

    render() {

        const {
            result: {
                data: {
                    user,
                    posts,
                }
            },
            duration,
            postCount = Math.max(1, Math.floor(duration / 10000)),
        } = window.media;

        const {
            orientation,
            width,
            height,
        } = window.config;

        // console.log(postCount);

        const selectedPosts = posts.slice(0, postCount);
        // const selectedPosts = posts.slice(4, 5);

        // console.log(selectedPosts);
        const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));
        // console.log(pageDuration);

        return (
            <div className="App">
                <div className="debug">{orientation}({width}x{height})</div>
                <UserProfile {...user} />
                <Posts posts={selectedPosts} pageDuration={pageDuration}/>
            </div>
        );
    }
}

export default App;
