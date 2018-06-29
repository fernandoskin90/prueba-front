import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

import Artist from './artist';

import './style.scss';

class Following extends Component {
    state = {
        loading: true
    };

    componentDidMount() {
        this.props.getMyFollowing(
            () => this.setState({ loading: false })
        );
    }

    render() {
        const { user: { following } } = this.props;
        if (!localStorage.getItem('accessToken') || this.props.accessTokenExpired) {
            return <Redirect  to="/" />
        }
        if (this.state.loading) {
            return (
                <div className="following__loader">
                    <CircularProgress size={50} />
                </div>
            );
        }
        return (
            <div className="following">
                {
                    following.map(({ followers, genres, images, name }, index) => (
                        <Artist
                            followers={followers.total}
                            genders={genres}
                            image={images.length ? images[0].url : null}
                            key={index}
                            name={name}
                        />
                    ))
                }
            </div>
        );
    }
};

export default Following;
