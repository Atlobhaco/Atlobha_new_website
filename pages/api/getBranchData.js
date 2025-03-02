export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { matchId } = req.query;

  if (!matchId) {
    return res.status(400).json({ error: "Missing matchId" });
  }

  try {
    const response = await fetch(
      `https://api2.branch.io/v1/url?branch_match_id=${matchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "branch-key": "key_test_cxmWbdwHvdK1l9XnJldEqpdftuk65asG", // Use server-side env variable
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Branch API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Branch.io API error:", error);
    res.status(500).json({ error: "Failed to fetch Branch.io data" });
  }
}
