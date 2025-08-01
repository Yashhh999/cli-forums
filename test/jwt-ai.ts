import axios from "axios";

async function main() {
  const username = "";
  const password = ""; 
  const prompt = ""; 

  const loginRes = await axios.post("http://localhost:3000/login", {
    username,
    password,
  });
  const accessToken = loginRes.data.access_token;
  if (!accessToken) {
    throw new Error("No access token received!");
  }

  const aiRes = await axios.get("http://localhost:3000/ai/string", {
    params: { prompt },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  console.log("AI Response:", aiRes.data);
}

main().catch((err) => {
  console.error("Error:", err.response?.data || err.message);
});