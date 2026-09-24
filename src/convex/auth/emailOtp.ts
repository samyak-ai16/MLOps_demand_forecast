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
  async sendVerificationRequest({
    identifier: email,
    token,
  }: {
    identifier: string;
    token: string;
  }) {
    // 1. Log code prominently in Convex logs and console
    console.log(
      `\n========================================\n` +
      `🔑 [VERIFICATION CODE] for ${email}: ${token}\n` +
      `========================================\n`
    );

    // 2. Resend API delivery
    try {
      if (!process.env.AUTH_RESEND_KEY) {
        console.warn("AUTH_RESEND_KEY is not set. Verification code logged above.");
        return;
      }

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
        console.warn(`Resend API notice: ${errorData}`);
        console.warn(`(If testing on Resend sandbox free tier, emails only deliver to account owner. Use the code above: ${token})`);
      }
    } catch (err) {
      console.warn("Resend delivery failed (development mode - use code from logs):", err);
    }
  },
});