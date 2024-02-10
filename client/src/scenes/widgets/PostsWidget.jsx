import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import ClipLoader from "react-spinners/ClipLoader";
import { useTheme } from "@emotion/react";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import Skeleton from "@mui/material/Skeleton";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const [loading, setLoading] = useState(true);
  const { palette } = useTheme();

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        dispatch(setPosts({ posts: data }));
      } else {
        console.error("Invalid data format received from the server");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        dispatch(setPosts({ posts: data }));
      } else {
        console.error("Invalid data format received from the server");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile, userId, token, dispatch]);

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            loading={loading}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
