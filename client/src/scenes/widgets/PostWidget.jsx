import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import ShareModal from "./ShareModal";
import CommentModal from "./CommentModal";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Skeleton from "@mui/material/Skeleton";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  loading,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        loading={loading}
      />
      {loading ? (
        <Skeleton
          variant="rounded"
          width="100%"
          height={35}
          sx={{ m: ".75rem 0" }}
        />
      ) : (
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      )}
      {picturePath && (
        <>
          {!isImageLoaded && (
            <Skeleton
              animation="wave"
              variant="rounded"
              width="100%"
              height={400}
              sx={{ m: ".6rem 0" }}
            />
          )}
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{
              borderRadius: "0.75rem",
              marginTop: "0.75rem",
              display: isImageLoaded ? "block" : "none",
            }}
            src={`http://localhost:3001/assets/${picturePath}`}
            onLoad={handleImageLoad}
          />
        </>
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            {loading ? (
              <Skeleton variant="rounded" width={25} height={25} />
            ) : (
              <Typography>{likeCount}</Typography>
            )}
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <CommentModal
              key={postId}
              postId={postId}
              postUserId={postUserId}
              name={name}
              description={description}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
            {loading ? (
              <Skeleton variant="rounded" width={25} height={25} />
            ) : (
              <Typography>{comments.length}</Typography>
            )}
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareModal description={description} picturePath={picturePath} />
        </IconButton>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;
