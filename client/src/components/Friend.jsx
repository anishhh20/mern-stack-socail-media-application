import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import "../index.css";
import { useEffect, useState } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const [mainUserFriends, setMainUserFriends] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  let isMainUserFriends = "";

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);
  const match = Boolean(_id === friendId);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${_id}/friends`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setMainUserFriends(data);

        if (response.ok) {
        } else {
          console.error("Error fetching friends:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    getFriends();
  }, [mainUserFriends, _id, token]);

  if (mainUserFriends) {
    isMainUserFriends = mainUserFriends.some((item) => item._id === friendId);
  }
  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>

      {match ? undefined : (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend && isMainUserFriends ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}

          {/* {friendId || _id ? (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          )} */}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
