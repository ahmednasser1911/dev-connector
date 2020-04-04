import React  , {Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {deleteComment} from '../../actions/post'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'

const CommentItem = ({
    postID,
    comment: {_id , text , name , user , avatar , date},
    auth,
    deleteComment
}) => {
    return (
        <div class="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${user}`}>
              <img
                class="round-img"
                src={avatar}
                alt=""
              />
              <h4>{name}</h4>
            </Link>
          </div>
          <div>
            <p class="my-1">
              {text}
            </p>
             <p class="post-date">
                Posted on <Moment formate='YYYY/MM/DD'>{date}</Moment>
            </p>
            {!auth.loading && user === auth.user._id && (
                <button onClick = {e => deleteComment(postID , _id)} type='button' 
                className='btn btn-danger'>
                    <i className='fa fa-times'></i>
                </button>
            )}
          </div>
        </div>
    )
}

CommentItem.propTypes = {
    postID: PropTypes.number.isRequired,
    deleteComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps , {deleteComment})(CommentItem)
