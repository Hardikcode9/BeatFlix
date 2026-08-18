
const authFix = async () => {
  const fs = require("fs");
  const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/components/EntryScreen.js";
  let content = fs.readFileSync(path, "utf8");

  // 1. Add imports
  content = content.replace(
    /import { signInWithPopup, signInWithEmailAndPassword/,
    "import { signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword"
  );

  // 2. Add useEffect for redirect
  const redirectEffect = `
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setLoading(true);
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
        }
      } catch (error) {
        toast.error(error.message || "Google login failed.");
      } finally {
        setLoading(false);
      }
    };
    handleRedirectResult();
  }, [onEnter]);
  `;

  // Insert just after \`const [loading, setLoading] = useState(false);\`
  content = content.replace(
    /const \[loading, setLoading\] = useState\(false\);/,
    "const [loading, setLoading] = useState(false);\n" + redirectEffect
  );

  // 3. Update handleGoogleLogin
  const newGoogleLogin = `
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      if (isMobileDevice) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
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
      toast.error(error.message || "Google login failed.");
      setLoading(false);
    }
  };
  `;

  // Find and replace the old handleGoogleLogin
  const oldLoginStart = content.indexOf("const handleGoogleLogin = async () => {");
  const oldLoginEnd = content.indexOf("  const submitForm = async (event) => {");
  
  if (oldLoginStart !== -1 && oldLoginEnd !== -1) {
    content = content.substring(0, oldLoginStart) + newGoogleLogin + content.substring(oldLoginEnd);
  }

  fs.writeFileSync(path, content);
};
authFix();

