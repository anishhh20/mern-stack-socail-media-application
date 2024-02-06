import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import FlexBetween from "components/FlexBetween";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedFriends, setSortedFriends] = useState([]);

  useEffect(() => {
    const sorted = [...friends].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.firstName > b.firstName ? 1 : -1;
      } else {
        return b.firstName > a.firstName ? 1 : -1;
      }
    });

    setSortedFriends(sorted);
  }, [friends, sortOrder]);

  const handleOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/friends`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (response.ok) {
          dispatch(setFriends({ friends: data }));
        } else {
          console.error("Error fetching friends:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    getFriends();
  }, [userId, token, dispatch, friends]);

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={palette.neutral.dark} variant="h5" fontWeight="500">
          Friend List
        </Typography>
        <SortByAlphaIcon onClick={handleOrder} cursor="pointer" />
      </FlexBetween>

      <Box display="flex" flexDirection="column" gap="1.5rem" mt="1.5rem">
        {sortedFriends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
