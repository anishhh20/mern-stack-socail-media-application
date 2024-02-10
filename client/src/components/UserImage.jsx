import Backdrop from "@mui/material/Backdrop";
import { Box, Fade, Modal } from "@mui/material";
import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  boxShadow: "0 0 20px 20px rgba(0,0,0,.20)",
};

const UserImage = ({ image, size = "60px", isProfile, loading}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const handleOpen = () => setIsImageModalOpen(true);
  const handleClose = () => setIsImageModalOpen(false);

  return (
    <>
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
          <Box sx={style}>
            <img
              src={`http://localhost:3001/assets/${image}`}
              alt="Profile"
              style={{
                width: "100%",
                height: "auto",
                margin: "auto",
                zIndex: "100",
              }}
            />
          </Box>
        </Fade>
      </Modal>
      <Box width={size} height={size}>
      {loading ? (
        <Skeleton
            animation="wave"
            variant="circular"
            width={size}
            height={size}
          />
      ) :(
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="user"
          src={`http://localhost:3001/assets/${image}`}
          onClick={ isProfile ? handleOpen : undefined}
        />

      )}
      </Box>
    </>
  );
};

export default UserImage;
