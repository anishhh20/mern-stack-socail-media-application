import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setSuggestedUsers } from "state";

const SuggestionWidget = ({ userId }) => {
  const [noFriendsMessage, setNoFriendsMessage] = useState('');
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const suggestedUsers = useSelector((state) => state.user.suggestedUsers);

  const getAllFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/suggestedUsers`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.length === 0) {
      setNoFriendsMessage('No suggested friends to show.');
    } else {
      dispatch(setSuggestedUsers({ suggestedUsers: data }));
      setNoFriendsMessage('');
    }
  };

  useEffect(() => {
    getAllFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Suggestions
      </Typography>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        { noFriendsMessage || suggestedUsers.map((friend) => (
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

export default SuggestionWidget;
