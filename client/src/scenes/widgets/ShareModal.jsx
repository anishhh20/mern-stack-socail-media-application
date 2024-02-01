import React, { useState } from "react";
import { ShareOutlined } from "@mui/icons-material";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import FlexBetween from "components/FlexBetween";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTheme } from "@emotion/react";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: "0 0 20px 20px rgba(0,0,0,.05)",
  // boxShadow: 24,
  p: 4,
};

const ShareModal = ({ description, picturePath }) => {
  const currentURL = window.location.href;
  const [open, setOpen] = React.useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { palette } = useTheme();
  const medium = palette.neutral.medium;

  return (
    <IconButton>
    
      <ShareOutlined onClick={handleOpen} />

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        aria-labelledby="modal-modal-title"
      >
        <Fade in={open}>
          <Box sx={style}>
            <FlexBetween justifyContent="center">
              {picturePath && (
                <img
                  width="70%"
                  height="70%"
                  alt="post"
                  style={{
                    borderRadius: "0.75rem",
                    margin: "auto",
                    top: "-10%",
                  }}
                  src={`http://localhost:3001/assets/${picturePath}`}
                />
              )}
            </FlexBetween>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              marginTop=".7rem"
              textAlign="center"
            >
              {description}
            </Typography>

            <FlexBetween justifyContent="space-between" p="1.5rem" mt="3rem">
              <IconButton>
                <FacebookShareButton
                  url="https://github.com/nygardk/react-share"
                  quote={description}
                  hashtag="#React"
                >
                  <FacebookIcon sx={{ fontSize: "25px" }} />
                </FacebookShareButton>
              </IconButton>
              <IconButton>
                <LinkedinShareButton
                  summary={description}
                  url="https://github.com/nygardk/react-share"
                >
                  <LinkedInIcon sx={{ fontSize: "25px" }} />
                </LinkedinShareButton>
              </IconButton>
              <IconButton>
                <TwitterShareButton
                  url="https://github.com/nygardk/react-share"
                  title={description}
                  hashtag="#React"
                >
                  <XIcon sx={{ fontSize: "22px" }} />
                </TwitterShareButton>
              </IconButton>
            </FlexBetween>

            <Typography color={medium}>or copy link</Typography>

            <FlexBetween gap="1rem" m="1rem">
              <InputBase
                value={currentURL}
                endAdornment
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />
              <CopyToClipboard
                text={currentURL}
                onCopy={() => setIsCopied({ isCopied: true })}
              >
                <Typography
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  {!isCopied ? "copy" : "copied"}
                </Typography>
              </CopyToClipboard>
            </FlexBetween>
          </Box>
        </Fade>
      </Modal>
    </IconButton>
  );
};

export default ShareModal;
