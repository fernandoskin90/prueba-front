import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Screen from './components/screen';

import Login from './screens/login';
import UserInfo from './screens/user-info';
import Following from './screens/following';

const spotifyApi = new Spotify();

class CustomRouter extends Component {
    state = {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        accessTokenExpired: false,
        user: {
            email: null,
            following: {
                total: 0,
                data: []
            },
            image: null,
            loading: true
        }
    }

    getMyInfo = (currentToken) => {
        if (this.state.accessTokenExpired) {
            this.setState({ accessTokenExpired: false });
        }
        spotifyApi.setAccessToken(currentToken);
        spotifyApi.getMe()
            .then((response) => {
                const { email, images } = response;
                this.setUser({
                    email,
                    image: images.length ? images[0].url : null,
                    loading: false
                })
            })
            .catch((err) => {
                const { error } = JSON.parse(err.response);
                if (error.message === 'The access token expired') {
                    this.setState({ accessTokenExpired: true });
                }
            });
    }

    getMyFollowing = (callback = null) => {
        if (this.state.accessTokenExpired) {
            this.setState({ accessTokenExpired: false });
        }
        const url = 'https://api.spotify.com/v1/me/following?type=artist';
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${this.state.accessToken}`
            })
        })
        .then(res => res.json())
        .then((res) => {
            const { error } = res;
            if (error && error.message === 'The access token expired') {
                this.setState({ accessTokenExpired: true });
            } else {
                this.setUser({ following: res.artists.items });
                if (callback) {
                    callback();
                }
            }
        })
        .catch(err => console.log('err', err));
    }

    setAccessToken = (accessToken, callback = null) => {
        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
            localStorage.setItem('accessToken', accessToken);
            this.setState({ accessToken });
            if (callback) {
                callback();
            }
        }
    }

    setRefreshToken = (refreshToken) => {
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
            this.setState({ refreshToken });
        }
    }

    setUser = (data) => {
        const currentUser = {
            ...this.state.user,
            ...data
        };
        
        this.setState({ user: currentUser });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route
                            render={(props) => (
                                <Login
                                    {...props}
                                    accessToken={this.state.accessToken}
                                    refreshToken={this.state.refreshToken}
                                />
                            )}
                            exact
                            path="/"
                        />
                        <Route
                            exact
                            path="/user/:accessToken/:refreshToken"
                            render={props => (
                                <Screen
                                    {...props}
                                    accessToken={this.state.accessToken}
                                    refreshToken={this.state.refreshToken}
                                >
                                    <UserInfo
                                        {...props}
                                        accessTokenExpired={this.state.accessTokenExpired}
                                        getMyInfo={this.getMyInfo}
                                        setAccessToken={this.setAccessToken}
                                        setRefreshToken={this.setRefreshToken}
                                        user={this.state.user}
                                    />
                                </Screen>
                            )}
                        />
                        <Route
                            exact
                            path="/following"
                            render={props => (
                                <Screen
                                    {...props}
                                    accessToken={this.state.accessToken}
                                    refreshToken={this.state.refreshToken}
                                >
                                    <Following
                                        {...props}
                                        accessToken={this.state.accessToken}
                                        accessTokenExpired={this.state.accessTokenExpired}
                                        refreshToken={this.state.refreshToken}
                                        getMyFollowing={this.getMyFollowing}
                                        setAccessToken={this.setAccessToken}
                                        setRefreshToken={this.setRefreshToken}
                                        user={this.state.user}
                                    />
                                </Screen>
                            )}
                        />
                        <Route exact path="/error/:errorMsg" render={(props) => (
                            <div>
                                ERROR {JSON.stringify(props)}
                            </div>
                        )} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default CustomRouter;