import React from 'react';
import { ReactNode, createContext, useReducer } from "react";
import { BlogReducer, IBlogState, initialBlogState } from "../reducers/BlogsReducer";
import { IBlogActions } from "../actions/Blogs";

export const BlogContext = createContext<{state:IBlogState, dispatch : React.Dispatch<IBlogActions>}>({
    state:initialBlogState,
    dispatch:()=>null
})

export const BlogContextProvider : React.FC<{children:ReactNode}> = ({ children})=> {
    const [state, dispatch] = useReducer(BlogReducer, initialBlogState)
    return <BlogContext.Provider value={{state, dispatch}}>
            {children}
        </BlogContext.Provider>
    
}