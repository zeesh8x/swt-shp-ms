import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://127.0.0.1:8000/users/count", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCount(res.data.count))
    .catch(err => console.error("Error fetching user count"));
  }, []);

  return (
    <div style={{ color: "white", marginTop: "2rem" }}>
      {count !== null ? `Total registered users: ${count}` : "Loading..."}
    </div>
  );
}
