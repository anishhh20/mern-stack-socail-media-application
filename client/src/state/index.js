import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  ads: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setSuggestedUsers: (state, action) => {
      if (state.user) {
        state.user.suggestedUsers = action.payload.suggestedUsers;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setTwitterLink: (state, action) => {
      state.user.twitterLink = action.payload.twitterLink;
    },
    setAds: (state, action) => {
      state.ads = action.payload.ads;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setSuggestedUsers,
  setTwitterLink,
  setAds,
} = authSlice.actions;
export default authSlice.reducer;
