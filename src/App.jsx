import { useState, useMemo, useCallback } from "react";
import "./App.css";

const initialPosts = [
  { id: 1, title: "Instagram Post", date: "2026-09-10", platform: "Instagram" },
  { id: 2, title: "Facebook Campaign", date: "2026-09-12", platform: "Facebook" },
  { id: 3, title: "LinkedIn Update", date: "2026-09-15", platform: "LinkedIn" },
  { id: 4, title: "Twitter Announcement", date: "2026-09-18", platform: "Twitter" },
];

function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);

  const days = useMemo(() => {
    const result = [];

    for (let day = 1; day <= 30; day++) {
      const date = `2026-09-${String(day).padStart(2, "0")}`;
      result.push(date);
    }

    return result;
  }, []);

  const handleDrop = useCallback((newDate) => {
    const draggedId = window.draggedPostId;

    if (!draggedId) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === draggedId
          ? { ...post, date: newDate }
          : post
      )
    );

    window.draggedPostId = null;
  }, []);

  const handleDragStart = useCallback((postId) => {
    window.draggedPostId = postId;
  }, []);

  const getPostsForDate = (date) => {
    return posts.filter((post) => post.date === date);
  };

  return (
    <div className="app">
      <h1>Social Media Calendar</h1>

      <p className="subtitle">
        Drag and drop your scheduled posts
      </p>

      <div className="calendar-header">
        <button>‹</button>
        <h2>September 2026</h2>
        <button>›</button>
      </div>

      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="calendar-grid">
        {days.map((date) => {
          const day = Number(date.slice(-2));
          const dayPosts = getPostsForDate(date);

          return (
            <div
              className="calendar-day"
              key={date}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(date)}
            >
              <span className="day-number">{day}</span>

              {dayPosts.map((post) => (
                <div
                  key={post.id}
                  className="post-card"
                  draggable
                  onDragStart={() => handleDragStart(post.id)}
                  onClick={() => setSelectedPost(post)}
                >
                  <strong>{post.title}</strong>
                  <small>{post.platform}</small>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {selectedPost && (
        <div className="post-details">
          <h2>Post Details</h2>
          <p><strong>Title:</strong> {selectedPost.title}</p>
          <p><strong>Platform:</strong> {selectedPost.platform}</p>
          <p><strong>Date:</strong> {selectedPost.date}</p>

          <button onClick={() => setSelectedPost(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;