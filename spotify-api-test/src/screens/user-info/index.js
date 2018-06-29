import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

import './style.scss';

class User extends Component {
    componentWillMount() {
        const {
            match: {
                params: {
                    accessToken, refreshToken
                }
            },
            setAccessToken,
            setRefreshToken,
            getMyInfo
        } = this.props;

        setAccessToken(accessToken, () => getMyInfo(accessToken));
        setRefreshToken(refreshToken);
    }

    renderLoader = () => {
        return (
            <div className="following__loader">
                <CircularProgress size={50} />
            </div>
        );
    }
    
    renderUser = () => {
        const { user: { email, image } } = this.props;
        return (
            <div className="user-info">
                <div className="user-info__image">
                    <img src={image} alt="user logged" />
                </div>

                <div className="user-info__email">
                    {email}
                </div>
            </div>
        );
    }

    render() {
        if (!localStorage.getItem('accessToken') || this.props.accessTokenExpired) {
            return <Redirect  to="/" />
        }
        if (this.props.user.loading) {
            return this.renderLoader();
        }
        return this.renderUser();
    }
}

export default User;