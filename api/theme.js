let theme = {
  primary: "#009344",
  secondary: "#f6a623"
};

export default function handler(req, res) {
  if (req.method === "POST") {
    theme = req.body;
    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    return res.status(200).json(theme);
  }

  res.status(405).end();
}
