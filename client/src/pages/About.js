import AuthContext from "../context/AuthContext";
import React from 'react'

import {Button, Text } from "@mantine/core";
import { Grid } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import Address from "../components/About/Address";
import Bitsid from "../components/About/Bitsid";
import Branch from "../components/About/Branch";
import Dual from "../components/About/Dual";
import ImgUpload from "../components/About/ImgUpload";
import Nick from "../components/About/Nick";
import Phno from "../components/About/Phno";

export default function About() {
  // Get name and email from Authcontext
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
  );
  const [bitsid, setBitsid] = useState("");
  const [address, setAddress] = useState("");
  const [branch, setBranch] = useState("");
  const [dual, setDual] = useState("");
  const [phno, setPhno] = useState("");
  const [nick, setNick] = useState("");
  const [active, setActive] = useState("profile");
  useEffect(() => {
    // emulating the componentDidMount() function

    if (active === "profile") {
      // Updating the state variables
      setName(user.Name);
      setEmail(user.Email);
      setImagePreviewUrl(user.ProfilePic);
      setBitsid(user.ID);
      setAddress(user.Address);
      setBranch(user.Branch.substring(0, 2));
      setDual(user.Branch.substring(2));
      setPhno(user.MobileNumber);
      setNick(user.NickName);
    }
  });
  const handleSubmit = (e) => {
    // Clicking submit will just toggle between edit and profile mode
    e.preventDefault();
    if (active === "edit") {
      // Update the database
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID: bitsid,
          ProfilePic: imagePreviewUrl,
          Address: address,
          Branch: branch + dual,
          MobileNumber: phno,
          NickName: nick,
        }),
      };
      fetch("http://localhost:5000/users/update/" + user._id, requestOptions)
        .then((response) => {
          // console.log(response);
          return response.json();
        })
        .then((updatedUserDetails) => {
          // console.log(updatedUserDetails);
          setUser(updatedUserDetails);
        })
        .catch((err) => console.log(err));
    }
    let activeP = active === "edit" ? "profile" : "edit";
    setActive(activeP);
  };

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result); // this is for the actual image
      setFile(e.target.files[0]);
      // console.log(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={0} sm={3} />
      <Grid item xs={12} md={9}>
        <div className="userDetails" style={{ margin: "4vh 4vh", display:"flex", flexDirection: "column", alignItems:"center" }}>
              <ImgUpload onChange={photoUpload} src={imagePreviewUrl} />
              <Text size="lg" weight={500} color="white" > Name: {name}</Text>
              <Text size="lg" weight={500} color="white">Email: {email}</Text>
              <div style={{display: "flex", flexDirection: "row"}}>
                <Bitsid
                  onChange={(e) => {
                    setBitsid(e.target.value);
                  }}
                  value={bitsid}
                  active={active}
                />
                <Phno
                  onChange={(e) => {
                    setPhno(e.target.value);
                  }}
                  value={phno}
                  active={active}
                />
              </div>
              <div style={{display: "flex", flexDirection: "row"}}>
                <Branch
                  onChange={(e) => {
                    setBranch(e);
                  }}
                  value={branch}
                  active={active}
                />
                {branch.includes("B") ? (
                  <Dual
                    onChange={(e) => {
                      setDual(e);
                    }}
                    value={dual}
                    active={active}
                  />
                ) : (
                  <></>
                )}
              </div>
              <Address
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                value={address}
                active={active}
              />
              <Nick
                onChange={(e) => {
                  setNick(e.target.value);
                }}
                value={nick}
                active={active}
              />
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{
              display: "block",
              margin: "auto",
              marginTop: "30px",
            }}
            onClick={handleSubmit}
            >
            {(active==="profile")?"Edit Profile": "Save"}
          </Button>
          
        </div>
      </Grid>
    </Grid>
  );
}