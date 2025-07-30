import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({
  username,
  verifyCode,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "sans-serif",
          padding: "20px",
          backgroundColor: "#f6f6f6",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <Heading style={{ color: "#333", fontSize: "24px" }}>
            Email Verification for ToughtSphere
          </Heading>
          <Text style={{ color: "#555", lineHeight: "1.5" }}>
            Hello {username},
          </Text>
          <Text style={{ color: "#555", lineHeight: "1.5" }}>
            Thank you for registering with ThoughtSpere. To complete your
            registration, please use the following verification code:
          </Text>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#007bff",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            {verifyCode}
          </Text>
          <Text style={{ color: "#555", lineHeight: "1.5" }}>
            This code is valid for 1 hour. Please do not share this code with
            anyone.
          </Text>
          <Text style={{ color: "#555", lineHeight: "1.5" }}>
            If you did not request this, please ignore this email.
          </Text>
          <Text style={{ color: "#555", lineHeight: "1.5", marginTop: "20px" }}>
            Best regards,
            <br />
            The ThoughtSphere Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
