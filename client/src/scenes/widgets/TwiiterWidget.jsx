import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box, InputBase, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { EditOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

const TwiiterWidget = ({ userId, twitterLink }) => {
  const [editTwitter, setEditTwitter] = useState(false);
  const [link, setLink] = useState("");
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  useEffect(() => {
    setLink(twitterLink);
  }, [twitterLink]);

  const handleChange = (e) => {
    setLink(e);
  };

  const isTwitterLinkValid = (link) => {
    // Regular expression to match Twitter profile URLs
    const twitterRegex =
      /^(https?:\/\/)?(www\.)?twitter\.com\/([a-zA-Z0-9_]+)$/;

    return twitterRegex.test(link);
  };
  const isValid = isTwitterLinkValid(link);


  const submitLink = async () => {
    if (isValid || link === "") {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/saveTwiiterLink`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId, twitterLink: link }),
          }
        );

        if (response.ok) {
          console.log(link);
          setEditTwitter(false);
        } else {
          console.error("Error updating Twitter link:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating Twitter link:", error);
      }
    }
  };

  return (
    <>
      {editTwitter && (
        <Box m="1rem 0" p=".5rem">
          <FlexBetween gap="1rem">
            <InputBase
              placeholder="Paste your Twitter link.."
              onChange={(e) => handleChange(e.target.value)}
              value={link}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "1rem 2rem",
              }}
            />
            <CheckCircleOutlineIcon onClick={submitLink} cursor="pointer" />
          </FlexBetween>
        </Box>
      )}

      <FlexBetween gap="1rem" mb="1rem">
        <FlexBetween gap="1rem">
          <img src="../assets/twitter.png" alt="twitter" />
          <Box>
            <Typography
              color={main}
              fontWeight="500"
              component="a"
              href={link}
              target="_blank"
              cursor="pointer"
              style={{
                pointerEvents: isValid ? "auto" : "none", // Enable/disable based on the value of x
                color: isValid ? undefined : "gray", // Adjust color based on the disabled/enabled state
                textDecoration: isValid ? undefined : "none",
              }}
            >
              Twitter
            </Typography>
            <Typography color={medium}>Social Network</Typography>
          </Box>
        </FlexBetween>
        <EditOutlined
          cursor="pointer"
          sx={{ color: main }}
          onClick={() => setEditTwitter(!editTwitter)}
        />
      </FlexBetween>
    </>
  );
};

export default TwiiterWidget;
