import { useTheme } from "@emotion/react";
import { IconButton, InputBase } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { List, ListItem, ListItemText, Paper, Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserImage from "components/UserImage";


const SearchModal = ({ userId }) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const [users, setUsers] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/getAllUsers`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    getAllUsers();
  }, [userId, token, users]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter users based on the search query
    const filteredResults = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
    setPopoverAnchor(event.currentTarget);
  };

  const closePopover = () => {
    setPopoverAnchor(null);
  };

  return (
    <FlexBetween
      backgroundColor={neutralLight}
      borderRadius="9px"
      gap="3rem"
      padding="0.1rem 1.5rem"
    >
      <InputBase
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <IconButton>
        <Search />
      </IconButton>

      <Popover
        open={Boolean(searchResults.length && popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={closePopover}
        disableAutoFocus={true}
        disableEnforceFocus={true}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Paper>
          <List>
            {searchResults.map((user) => (
              <ListItem
                key={user._id}
                onClick={() => {
                  navigate(`/profile/${user._id}`);
                }}
                sx={{margin: ".5rem", gap: ".75rem", cursor: "pointer"}}
              >
                <UserImage image={user.picturePath} size="30px" />
                <ListItemText primary={`${user.firstName} ${user.lastName}`}  />

              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>
    </FlexBetween>
  );
};

export default SearchModal;
