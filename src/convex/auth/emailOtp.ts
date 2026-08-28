import { Email } from "@convex-dev/auth/providers/Email";

declare const process: { env: Record<string, string | undefined> };

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const array = new Uint8Array(6);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => (byte % 10).toString()).join("");
  },
  async sendVerificationRequest({ identifier: email, token }) {
    // 1. Log code to Convex dashboard logs
    console.log(`\n🔑 [VERIFICATION CODE] for ${email}: ${token}\n`);

    // 2. Resend API delivery
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.AUTH_EMAIL_FROM ??
            "Product Demand Forecast <onboarding@resend.dev>",
          to: email,
          subject: "Your Verification Code",
          html: `<p>Your verification code is: <strong>${token}</strong></p>`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Resend API delivery error: ${errorData}`);
      }
    } catch (err) {
      console.error("Resend delivery failed:", err);
    }
  },
});