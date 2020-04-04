import React  , {Fragment , useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import PostItem from '../posts/PostItem'
import CommentForm from '../post/CommentForm'
import CommentItem from '../post/CommentItem'
import { getPost } from '../../actions/post'
import { Link } from 'react-router-dom'

const Post = ({ getPost , post: {post , loading} , match }) => {
    useEffect(() => {
        getPost(match.params.id)
    } , [getPost])
    return ( loading || post === null ? <Spinner /> :
        <Fragment>
            <Link to='/posts' className='btn'>
                Back To Posts
            </Link>
            {/* just reusing the component*/}
            <PostItem post={post} showActions={false} />
            <CommentForm postID={post._id}/>
            {
            <div className='comments'>
                {post.comments.map(comm => (
                    <CommentItem key = {comm._id} comment = {comm} postID = {post._id}/>
                ))}
            </div>
            }
        </Fragment>
    )
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    getPost: PropTypes.func.isRequired
}

const mapStateToPorops = state => ({
    post: state.post
})

export default connect(mapStateToPorops , {getPost})(Post)
