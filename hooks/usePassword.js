import { useState } from "react";

export function usePassword(form) {
  const [passwordStrength, setPasswordStrength] = useState(null);

  function generateStrongPassword(length = 12) {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%&*()=[]{}";

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = "";

    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  function checkPasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    };

    const strength = Object.values(checks).filter(Boolean).length;

    return {
      score: strength,
      checks,
      isStrong: strength >= 4,
    };
  }

  function getPasswordStrengthColor(score) {
    if (!score) return "#ff4d4f";
    if (score <= 2) return "#ff4d4f";
    if (score <= 3) return "#faad14";
    return "#52c41a";
  }

  const handlePasswordGenerate = () => {
    const newPassword = generateStrongPassword();
    form.setFieldsValue({ password: newPassword });
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
  };

  return {
    passwordStrength,
    handlePasswordChange,
    handlePasswordGenerate,
    getPasswordStrengthColor,
    checkPasswordStrength,
  };
}
