import { ADD_BLOG_ERROR, ADD_BLOG_SUCCESS, DELETE_BLOG_ERROR, DELETE_BLOG_SUCCESS, GET_BLOGS_ERROR, GET_BLOGS_SUCCESS, IBlogActions, UPDATE_BLOG_ERROR, UPDATE_BLOG_SUCCESS } from "../actions/Blogs";
import { IBlog } from "../models/Blog";

export interface IBlogState {
    blog: IBlog;
    blogs: IBlog[];
    error:string;
}

export const initialBlogState: IBlogState = {
    blog: {
        id: "",
        authorId: "",
        title: "",
        content: "",
        publishedAt: ""
    },
    blogs: [],
    error:""
}

export const BlogReducer = (
    state:IBlogState = initialBlogState,
    action:IBlogActions
) :IBlogState => {
    switch(action.type){
        case GET_BLOGS_SUCCESS: {
          return { ...state, blogs: action.payload };
        }
        case GET_BLOGS_ERROR: {
          return state;
        }
        case ADD_BLOG_SUCCESS:{
          return {
            ...state
          }
        }
        case ADD_BLOG_ERROR:{
          return {
            ...state,error:action.payload
          }
        }
        case DELETE_BLOG_SUCCESS : {
            return state
        }
        case DELETE_BLOG_ERROR:{
            return {
                ...state,
                error:action.payload
            }
        }
        case UPDATE_BLOG_SUCCESS :{
           return state
        }
        case UPDATE_BLOG_ERROR:{
          return {
             ...state,error:action.payload
          }
        }
        default:
          return state; 
    }
}