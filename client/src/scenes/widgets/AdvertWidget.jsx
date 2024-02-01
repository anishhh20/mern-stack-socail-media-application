import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { setAds } from "state";

import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: "0 0 20px 20px rgba(0,0,0,.05)",
  p: 4,
};

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const mediumMain = palette.neutral.mediumMain;
  const ads = useSelector((state) => state.ads);

  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const handleAd = async (e) => {
    try {
      e.preventDefault();
      setErrMsg("");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("websiteLink", link);
      formData.append("description", desc);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      const response = await fetch(`http://localhost:3001/ads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      // const ads = await response.json();
      // ads.sort().reverse();

      if (response.ok) {
        setImage(null);
        setTitle("");
        setDesc("");
        setLink("");
        setErrMsg("");
        handleClose();
      } else {
        setErrMsg("Error creating Ad's :(");
        console.error("Error creating Ad's :(", response.statusText);
      }
    } catch (err) {
      console.error("Error creating Ad's :(", err);
    }
  };

  const getAds = async () => {
    try {
      const response = await fetch("http://localhost:3001/ads/getads", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // console.log(data)
      data.sort().reverse();
      dispatch(setAds({ ads: data }));
    } catch (error) {}
  };
  useEffect(() => {
    getAds();
  }, []);

  return (
    <>
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
          <Box sx={style} gap="1rem">
            <p>{errMsg}</p>
            {isImage && (
              <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                m="1rem"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                  required
                >
                  {({ getRootProps, getInputProps }) => (
                    <FlexBetween>
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        width="100%"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!image ? (
                          <p>Add Image Here</p>
                        ) : (
                          <FlexBetween>
                            <img
                              alt="advert"
                              src={URL.createObjectURL(image)}
                              style={{
                                margin: "0.75rem 0",
                                objectFit: "cover",
                                width: "40%",
                                height: "30%",
                              }}
                            />
                            <Typography>{image.name}</Typography>
                            <EditOutlined />
                          </FlexBetween>
                        )}
                      </Box>

                      {image && (
                        <IconButton
                          onClick={() => setImage(null)}
                          sx={{ width: "15%" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </FlexBetween>
                  )}
                </Dropzone>
              </Box>
            )}

            <FlexBetween gap="1rem" flexDirection="column">
              <FlexBetween
                gap="0.25rem"
                onClick={() => setIsImage(!isImage)}
                justifyContent="center"
              >
                <ImageOutlined sx={{ color: mediumMain }} />
                <Typography
                  color={mediumMain}
                  sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                >
                  Image *
                </Typography>
              </FlexBetween>

              <InputBase
                placeholder="What's the Title ? *"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />

              <InputBase
                placeholder="Website Link *"
                onChange={(e) => setLink(e.target.value)}
                value={link}
                required
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />

              <InputBase
                placeholder="Description *"
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                required
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />

              <Button
                disabled={!title}
                onClick={(e) => handleAd(e)}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                }}
              >
                Create Ad
              </Button>
            </FlexBetween>
          </Box>
        </Fade>
      </Modal>

      <WidgetWrapper>
        <FlexBetween>
          <Typography color={dark} variant="h5" fontWeight="500">
            Sponsored
          </Typography>
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            onClick={handleOpen}
          >
            Create Ad
          </Typography>
        </FlexBetween>

        {ads.map(({ _id, title, websiteLink, description, picturePath }) => (
          <Box key={_id}>
            <img
              width="100%"
              height="auto"
              alt="advert"
              src={`http://localhost:3001/assets/${picturePath}`}
              style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <FlexBetween flexWrap="wrap">
              <Typography color={main}>{title}</Typography>
              <Typography
                color={medium}
                component="a"
                href={websiteLink}
                target="_blank"
                cursor="pointer"
                style={{
                  pointerEvents: "auto", // Enable/disable based on the value of x
                  textDecoration: "none",
                }}
              >
                {websiteLink}
              </Typography>
            </FlexBetween>

            <Typography color={medium} m="0.5rem 0">
              {description}
            </Typography>
          </Box>
        ))}
      </WidgetWrapper>
    </>
  );
};

export default AdvertWidget;
