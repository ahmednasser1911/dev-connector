import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = ({alerts}) =>{ 
  return alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
)
);
}
 
Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

// {alerts} = props 
const mapStateToProp = state => ({
  alerts: state.alert
});

export default connect(mapStateToProp)(Alert); // getting the state from roote reducer
