
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/components/EntryScreen.js";
let content = fs.readFileSync(path, "utf8");

// Remove signInWithRedirect from imports
content = content.replace(
  /import \{ signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword/,
  "import { signInWithPopup, signInWithEmailAndPassword"
);

// Remove the useEffect handleRedirectResult entirely
const redirectEffectRegex = /useEffect\(\(\) => \{\s*const handleRedirectResult = async \(\) => \{[\s\S]*?handleRedirectResult\(\);\s*\}, \[onEnter\]\);/;
content = content.replace(redirectEffectRegex, "");

// Revert handleGoogleLogin to use signInWithPopup only
const newGoogleLogin = `
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      const response = await fetch(\`\${API_URL}/api/users/google-login\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          googleId: result.user.uid,
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email);
      toast.success(\`Welcome back, \${data.user.name}!\`);
      onEnter(data.user.name || "User");
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user" && error.code !== "auth/cancelled-popup-request") {
        toast.error(error.message || "Google login failed.");
      }
    } finally {
      setLoading(false);
    }
  };
`;

const oldLoginStart = content.indexOf("const handleGoogleLogin = async () => {");
const oldLoginEnd = content.indexOf("const submitForm = async (event) => {");

if (oldLoginStart !== -1 && oldLoginEnd !== -1) {
  content = content.substring(0, oldLoginStart) + newGoogleLogin + content.substring(oldLoginEnd);
}

fs.writeFileSync(path, content);

