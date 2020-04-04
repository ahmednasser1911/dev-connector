import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import ProfileTop from '../profile/ProfileTop'
import ProfileAbout from '../profile/ProfileAbout'
import ProfileExperience from '../profile/ProfileExperience'
import ProfileEducation from '../profile/ProfileEducation'
import ProfileGithub from '../profile/ProfileGithub'
import { Link } from "react-router-dom";

const Profile = ({
  getProfileById,
  profile: { loading, profile },
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profile
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id ? ('') : (
                <Link to="/edit-profile" className="btn btn-dark">
                    Edit Profile
                </Link>
            )}
            <div className="profile-grid my-1">
              <ProfileTop profile = {profile}/>
              <ProfileAbout profile = {profile}/>
              <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
                {profile.experience.length > 0 ? (<Fragment>
                  {profile.experience.map(exp => (
                    <ProfileExperience key = {exp._id} experience = {exp}/>
                  ))}
                </Fragment>) : (<h4>No Experience Added</h4>)}
              </div>
              <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
                {profile.education.length > 0 ? (<Fragment>
                  {profile.education.map(edu => (
                    <ProfileEducation key = {edu._id} education = {edu}/>
                  ))}
                </Fragment>) : (<h4>No Education Added</h4>)}
              </div>

              {profile.githubusername ? (
                <ProfileGithub username = {profile.githubusername} />
              ) : ('')}

            </div>

            
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.profile
});

export default connect(mapStateToProps, { getProfileById })(Profile);
