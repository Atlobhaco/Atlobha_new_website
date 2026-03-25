import React from "react";
import { Box, TextField, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useLocalization from "@/config/hooks/useLocalization";

function AddCommentMarketplace({ notes, setNotes }) {
  const { t } = useLocalization();

  return (
    <Box sx={{ padding: "0 13px", mb: 3 }}>
      {/* Header Section */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 1, borderBottom: "none" }}
      >
        <InfoOutlinedIcon
          sx={{
            width: { xs: 20, md: 25 },
            height: { xs: 20, md: 25 },
            color: "#FFD400",
            marginInlineEnd: 1, // Automatically handles LTR/RTL
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "14px", md: "20px" },
            fontWeight: 700,
          }}
        >
          {t.addNotes}
        </Typography>
      </Stack>

      {/* Input Section */}
      <Box
        sx={{
          padding: { xs: "10px", md: "15px" },
          borderRadius: 2,
          bgcolor: "background.paper", // Optional: adds subtle background
        }}
      >
        <TextField
          multiline
          fullWidth
          minRows={3}
          maxRows={5}
          value={notes || ""} // Controlled input
          placeholder={t.writeHere}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default AddCommentMarketplace;
