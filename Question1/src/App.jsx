import { useEffect, useState } from "react";
import "./App.css";
import { Log } from "../../logging_middleware";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    Log(
      "frontend",
      "info",
      "component",
      "Fetching notifications"
    );

    fetch("http://4.224.186.213/evaluation-service/notifications", {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoaXlhc21pbjIzMjNAZ21haWwuY29tIiwiZXhwIjoxNzgwNjM5NjU3LCJpYXQiOjE3ODA2Mzg3NTcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhOGE5NjU2YS0wZjRiLTQxMzctYTU0MC0zYzA1ZjFlYmE1ZDUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaXNoaSB5YXNtaW4iLCJzdWIiOiI2MDM3ZjI5Mi1hNjM0LTQ3ODEtYjExYy00MGM2ZDRiNWJiMjcifSwiZW1haWwiOiJyaXNoaXlhc21pbjIzMjNAZ21haWwuY29tIiwibmFtZSI6InJpc2hpIHlhc21pbiIsInJvbGxObyI6IjIzYnExYTQ3ODQiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiI2MDM3ZjI5Mi1hNjM0LTQ3ODEtYjExYy00MGM2ZDRiNWJiMjciLCJjbGllbnRTZWNyZXQiOiJVQ0RjaHdzd1NITVBOR2NkIn0.38R9L3_DRmVIBtWPhDD5vZYj0ivI1s2qP6JBnqZ8iL0",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API DATA:", data);

        const items = data.notifications || [];

        console.log("COUNT:", items.length);

        setNotifications(items);

        Log(
          "frontend",
          "info",
          "component",
          `Loaded ${items.length} notifications`
        );
      })
      .catch((err) => {
        console.error(err);

        Log(
          "frontend",
          "error",
          "api",
          err.message
        );
      });
  }, []);

  const priorityOrder = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  const topPriority = [...notifications]
    .sort(
      (a, b) =>
        (priorityOrder[b.Type] || 0) -
        (priorityOrder[a.Type] || 0)
    )
    .slice(0, 10);

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          (n) => n.Type === filter
        );

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "20px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Campus Notifications
      </h1>

      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <label>Filter by Type: </label>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Placement">Placement</option>
          <option value="Result">Result</option>
          <option value="Event">Event</option>
        </select>
      </div>

      <h2>Top 10 Priority Notifications</h2>

      {topPriority.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        topPriority.map((n) => (
          <div
            key={n.ID}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <h3>{n.Type}</h3>
            <p>{n.Message}</p>
            <small>{n.Timestamp}</small>
          </div>
        ))
      )}

      <h2>All Notifications</h2>

      {filteredNotifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        filteredNotifications.map((n) => (
          <div
            key={n.ID}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <h3>{n.Type}</h3>
            <p>{n.Message}</p>
            <small>{n.Timestamp}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;