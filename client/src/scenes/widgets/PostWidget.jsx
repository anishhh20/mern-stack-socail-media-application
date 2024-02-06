import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Modal,
  Typography,
  useTheme,
  Fade,
  useMediaQuery,
  InputBase,
  Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import ShareModal from "./ShareModal";
import Backdrop from "@mui/material/Backdrop";
import Picker from "emoji-picker-react";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  boxShadow: "0 0 20px 20px rgba(0,0,0,.20)",
  bgcolor: "background.paper",
};

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
}) => {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const handleOpen = () => setIsImageModalOpen(true);
  const handleClose = () => setIsImageModalOpen(false);
  const [isComments, setIsComments] = useState(false);
  const [cmt, setCmt] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserPicturePath = useSelector(
    (state) => state.user.picturePath
  );
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

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

  const handleCmt = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
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
          // body: JSON.stringify({ postId: postId, comment: { userId: loggedInUserId, text: cmt } }),
        }
      );
      console.log(cmt);

      if (response.ok) {
        setCmt("");
      } else {
        console.error("Error posting Comment :(", response.statusText);
      }
    } catch (err) {
      console.error("Error posting Comment :(", err);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
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
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleOpen}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareModal description={description} picturePath={picturePath} />
        </IconButton>
      </FlexBetween>

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
            <Box flexBasis={isNonMobileScreens ? "50%" : undefined}>
              {picturePath ? (
                <img
                  width="100%"
                  height="100%"
                  alt="post"
                  src={`http://localhost:3001/assets/${picturePath}`}
                />
              ) : (
                <FlexBetween 
                sx={{margin: "50% auto"}}>
                  <Typography color={main} >{description}</Typography>
                </FlexBetween>
              )}
            </Box>
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
                    <Box>
                      <FlexBetween sx={{ justifyContent: "flex-start" }}>
                        <Box
                          sx={{
                            "&:hover": {
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => {
                            navigate(`/profile/${comment[0]}`);
                            navigate(0);
                          }}
                        >
                          <UserImage image={comment[2]} size="35px" />
                        </Box>
                        <Typography
                          sx={{ color: main, m: "1rem 0", pl: "1rem" }}
                        >
                          {comment[1]}
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
    </WidgetWrapper>
  );
};

export default PostWidget;
