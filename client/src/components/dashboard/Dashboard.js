import React , {useEffect , Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getProfile , deleteAccount} from '../../actions/profile';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';


const Dashboard = ({auth:{user} ,getProfile ,deleteAccount, profile:{profile , loading}}) => {
    useEffect(() => {
        getProfile();
    } , [getProfile]);
    
    return (
        // if loading is true then load the spinner
        loading && profile === null ? 
        (<Spinner/>) : 
        (
        <Fragment>
            <h1 className = "large text-primary">Dashboard</h1>
            <p className = "lead">
                <i className = "fa fa-user" /> Welcome {user !==null ? user.name : 'No User'}
            </p>
            {profile !== null ? 
            // if there is a profile
            (<Fragment>
                <DashboardActions />
                <Experience experience={profile.experience}/>
                <Education education={profile.education}/>
                <div className = 'my-2'>
                    <button onClick = {() => deleteAccount()} className = 'btn btn-danger'>
                        <i className="fa fa-user-minus"></i> Delete My Account
                    </button>
                </div>
            </Fragment>) : 
            // if there is no profile
            (<Fragment>
                <p>You have no profile , please add some info</p>
                <Link to="/create-profile" className = "btn btn-primary my-1">
                    Create Profile
                </Link>
            </Fragment>)
            }
        </Fragment> 
        )
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = state => (
    {
        auth: state.auth,
        profile: state.profile
    }
)

export default connect(mapStateToProps , {getProfile , deleteAccount})(Dashboard)

