import {
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  InputBase,
  Modal,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import React, { useEffect, useState } from "react";
import Friend from "components/Friend";
import ShareModal from "./ShareModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "@emotion/react";
import UserImage from "components/UserImage";
import { setPost } from "state";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ChatBubbleOutlineOutlined,
} from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  boxShadow: "0 0 20px 20px rgba(0,0,0,.20)",
  bgcolor: "background.paper",
};

const CommentModal = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments: initialComments,
}) => {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [isImageModalOpen, setIsImageModalOpen] = useState();
  const dispatch = useDispatch();

  const handleOpen = () => setIsImageModalOpen(true);
  const handleClose = () => setIsImageModalOpen(false);
  const [cmt, setCmt] = useState("");
  const token = useSelector((state) => state.token);
  const likeCount = Object.keys(likes).length;

  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserPicturePath = useSelector(
    (state) => state.user.picturePath
  );
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const isLiked = Boolean(likes[loggedInUserId]);

  const [comments, setComments] = useState(initialComments);

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

  const handleCmt = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postUserId}/addComment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            comment: cmt,
            currentUser: loggedInUserId,
            currentPicturePath: loggedInUserPicturePath,
          }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setCmt("");
      } else {
        console.error("Error posting Comment :(", response.statusText);
      }
    } catch (err) {
      console.error("Error posting Comment :(", err);
    }
  };

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <ChatBubbleOutlineOutlined />
      </IconButton>

      <Modal
        open={isImageModalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        aria-labelledby="modal-modal-title"
        disableAutoFocus={true}
      >
        <Fade in={isImageModalOpen}>
          <Box
            width="100%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="1rem"
            justifyContent="space-between"
            sx={style}
          >
            <FlexBetween
              sx={{ justifyContent: "center" }}
              margin="1rem"
              flexBasis={isNonMobileScreens ? "50%" : undefined}
            >
              {picturePath ? (
                <img
                  width="100%"
                  height="100%"
                  alt="post"
                  src={`http://localhost:3001/assets/${picturePath}`}
                />
              ) : (
                <Typography color={main} textAlign="center">
                  {description}
                </Typography>
              )}
            </FlexBetween>
            <Box
              flexBasis={isNonMobileScreens ? "50%" : undefined}
              mt={isNonMobileScreens ? undefined : "2rem"}
            >
              <Box p="1rem">
                <Friend
                  friendId={postUserId}
                  name={name}
                  userPicturePath={userPicturePath}
                />
                {picturePath && (
                  <Typography color={main} sx={{ m: "1rem" }}>
                    {description}
                  </Typography>
                )}

                <Divider sx={{ mt: ".75rem" }} />

                <Box
                  mt="0.7rem"
                  style={{
                    height: "55vh",
                    overflow: "auto",
                  }}
                >
                  {comments.map((comment, i) => (
                    <Box key={i}>
                      <FlexBetween sx={{ justifyContent: "flex-start" }}>
                        <Box
                          sx={{
                            "&:hover": {
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => {
                            navigate(
                              `/profile/${comment[0] || comment.userId}`
                            );
                            navigate(0);
                          }}
                        >
                          <UserImage
                            image={comment[2] || comment.userPicturePath}
                            size="35px"
                          />
                        </Box>
                        <Typography
                          sx={{ color: main, m: "1rem 0", pl: "1rem" }}
                        >
                          {comment[1] || comment.comment}
                        </Typography>
                      </FlexBetween>
                    </Box>
                  ))}
                </Box>

                <FlexBetween>
                  <InputBase
                    placeholder="Add comment"
                    onChange={(e) => setCmt(e.target.value)}
                    value={cmt}
                    required
                    sx={{
                      width: "80%",
                      backgroundColor: palette.neutral.light,
                      borderRadius: "2rem",
                      padding: "1rem 2rem",
                    }}
                  />
                  <Button
                    disabled={!cmt}
                    onClick={(e) => handleCmt(e)}
                    sx={{
                      color: palette.background.alt,
                      backgroundColor: palette.primary.main,
                      borderRadius: "3rem",
                    }}
                  >
                    Post
                  </Button>
                </FlexBetween>

                <FlexBetween>
                  <FlexBetween gap="0.3rem">
                    <IconButton onClick={patchLike}>
                      {isLiked ? (
                        <FavoriteOutlined sx={{ color: primary }} />
                      ) : (
                        <FavoriteBorderOutlined />
                      )}
                    </IconButton>
                    <Typography>{likeCount}</Typography>
                  </FlexBetween>

                  <IconButton>
                    <ShareModal
                      description={description}
                      picturePath={picturePath}
                    />
                  </IconButton>
                </FlexBetween>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CommentModal;
