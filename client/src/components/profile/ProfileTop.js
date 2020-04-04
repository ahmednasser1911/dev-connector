import React from "react";
import PropTypes from "prop-types";

const ProfileTop = ({
  profile: {
    user: { name, avatar },
    social,
    company,
    status,
    website,
    location
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="profile image" />
      <h1 className="large">{name}</h1>
      <p className="lead">
        {status} {company && <span>at {company}</span>}
      </p>
      <p>{location && <span>{location}</span>}</p>
      <div className="icons my-1">
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer">
            <i className="fa fa-globe fa-2x"></i>
          </a>
        )}
        {social && social.facebook ? (
          <a href={social.facebook} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook fa-2x"></i>
          </a>
        ) : (
          ""
        )}
        {social && social.twitter ? (
          <a href={social.twitter} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter fa-2x"></i>
          </a>
        ) : (
          ""
        )}

        {social && social.linkedin ? (
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-linkedin fa-2x"></i>
          </a>
        ) : (
          ""
        )}

        {social && social.youtube ? (
          <a href={social.youtube} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-youtube fa-2x"></i>
          </a>
        ) : (
          ""
        )}

        {social && social.instegram ? (
          <a href={social.instegram} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-instegram fa-2x"></i>
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
