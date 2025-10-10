import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import AgoraRTC from "agora-rtc-sdk-ng";
import axiosInstance from "./services/api";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function AgoraCall() {
  const [channelName, setChannelName] = useState("");
  const [joined, setJoined] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const joinChannel = async () => {
    try {
      const { data } = await axiosInstance.get("/api/agora/token", {
        params: { channelName: channelName || "test" },
      });

      await client.join(
        data.appId || process.env.REACT_APP_AGORA_APP_ID,
        data.channelName,
        data.token,
        data.uid
      );

      // Create audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);

      // Try creating video track, fallback to audio-only if fails
      let videoTrack = null;
      try {
        videoTrack = await AgoraRTC.createCameraVideoTrack();
        videoTrack.play("local-player");
        setLocalVideoTrack(videoTrack);
      } catch (err) {
        console.warn("⚠️ Video track failed, audio-only mode:", err);
      }

      // Publish available tracks
      const tracksToPublish = [audioTrack];
      if (videoTrack) tracksToPublish.push(videoTrack);
      await client.publish(tracksToPublish);

      setJoined(true);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") user.videoTrack.play("remote-player");
        if (mediaType === "audio") user.audioTrack.play();
        setRemoteUsers((prev) => [...prev, user]);
      });

      client.on("user-unpublished", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      console.log("✅ Joined channel successfully!");
    } catch (error) {
      console.error("❌ Error joining channel:", error);
    }
  };

  const leaveCall = async () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    await client.leave();
    setJoined(false);
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
    setRemoteUsers([]);
    console.log("👋 Left the call");
  };

  return (
    <Box textAlign="center" sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>🎥🎧 Fixora Video & Audio Call</Typography>

      {!joined ? (
        <>
          <TextField
            label="Channel Name"
            variant="outlined"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <br />
          <Button variant="contained" color="primary" onClick={joinChannel}>
            Join Call
          </Button>
        </>
      ) : (
        <Button variant="outlined" color="error" onClick={leaveCall}>
          Leave Call
        </Button>
      )}

      <Box id="local-player" sx={{ mt: 4, width: "300px", height: "200px", backgroundColor: "#f5f5f5", borderRadius: "10px", display: "inline-block", margin: "10px" }} />
      <Box id="remote-player" sx={{ mt: 4, width: "300px", height: "200px", backgroundColor: "#f0f0f0", borderRadius: "10px", display: "inline-block", margin: "10px" }} />
    </Box>
  );
}
