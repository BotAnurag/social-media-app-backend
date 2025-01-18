import otp from "otp-generator";

const otpGenerate = otp.generate(4, {
  upperCaseAlphabets: true,
  specialChars: true,
});

export default otpGenerate;
