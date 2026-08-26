import { Email } from "@convex-dev/auth/providers/Email";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    return generateRandomString(random, alphabet, 6);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    // 1. Always log the code to your local terminal for easy dev testing
    console.log(`\n🔑 [VERIFICATION CODE] for ${email}: ${token}\n`);

    // 2. Attempt Resend delivery (works for samyakdongare93@gmail.com or verified domains)
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Product Demand Forecast <noreply@yourdomain.com>",
          to: email,
          subject: "Your Verification Code",
          html: `<p>Your verification code is: <strong>${token}</strong></p>`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.warn(`Resend non-fatal error: ${errorData}`);
      }
    } catch (err) {
      console.error("Resend delivery failed:", err);
    }
  },
});