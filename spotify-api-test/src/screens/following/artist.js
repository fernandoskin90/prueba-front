import React from 'react';

const Artist = ({
    followers,
    image,
    genders,
    name
}) => (
    <div className="following__artist">
        <div className="following__artist__name">
            {name}
        </div>

        <div className="following__artist__image">
            <img alt="Artist" src={image} />
        </div>

        <div className="following__artist__followers">
            <div className="following__artist__followers--number">
                {followers}
            </div>

            <div className="following__artist__followers--label">
                followers
            </div>
        </div>

        <div className="following__artist__genders">
            <div className="following__artist__genders--number">
                {genders.length}
            </div>

            <div className="following__artist__genders--label">
                genders
            </div>
        </div>
    </div>
);

export default Artist;