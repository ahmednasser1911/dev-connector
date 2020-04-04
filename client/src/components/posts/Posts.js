import React , {Fragment , useEffect} from 'react'
import PropTypes from 'prop-types'
import {getPosts} from '../../actions/post'
import { connect } from "react-redux";
import PostItem from './PostItem';
import Spinner from '../layout/Spinner'
import PostForms from './PostForms'
const Posts = ({getPosts , post : {posts , loading}}) => {
    useEffect(() => {
        getPosts()
    } , [getPosts])

    return (
        loading ? <Spinner /> : (
        <Fragment>
            <h1 className = "large text-primary">Posts</h1>
            <p  className = 'lead'>
                <i className = 'fa fa-user'/> Welcome To The Commuinty
            </p>
            <PostForms /> 
            <div className = "posts">
                {posts.map(post => (
                    <PostItem key = {post.id} post = {post} />
                ))}
            </div>
            
        </Fragment>
    ))
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})
export default connect(mapStateToProps , {getPosts})(Posts)
