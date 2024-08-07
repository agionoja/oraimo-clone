import * as crypto from "crypto";

// Function to hash a password
export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate a random salt
    crypto.randomBytes(16, (err, salt) => {
      if (err) reject(err);

      // Use the salt to hash the password
      crypto.scrypt(password, salt.toString("hex"), 64, (err, derivedKey) => {
        if (err) reject(err);

        // Combine the salt and hashed password for storage
        const hashedPassword = `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
        resolve(hashedPassword);
      });
    });
  });
};

// Function to compare a plain text password with a hashed password
export const compareHash = (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Extract the salt from the stored hashed password
    const [salt, key] = hashedPassword.split(":");

    // Hash the input password with the extracted salt
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);

      // Compare the derived key with the stored key
      resolve(derivedKey.toString("hex") === key);
    });
  });
};
