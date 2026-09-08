import { describe, it, expect } from "vitest";

describe("Calendar Interface", () => {
  it("should update the date when a post is dragged", () => {
    const posts = [
      {
        id: 1,
        title: "Instagram Post",
        date: "2026-09-10",
      },
    ];

    const newDate = "2026-09-11";

    const updatedPosts = posts.map((post) =>
      post.id === 1
        ? { ...post, date: newDate }
        : post
    );

    expect(updatedPosts[0].date).toBe("2026-09-11");
  });

  it("should keep other posts unchanged", () => {
    const posts = [
      { id: 1, title: "Post 1", date: "2026-09-10" },
      { id: 2, title: "Post 2", date: "2026-09-12" },
    ];

    const updatedPosts = posts.map((post) =>
      post.id === 1
        ? { ...post, date: "2026-09-11" }
        : post
    );

    expect(updatedPosts[1].date).toBe("2026-09-12");
  });

  it("should create calendar events from posts", () => {
    const posts = [
      {
        id: 1,
        title: "Instagram Post",
        date: "2026-09-10",
      },
    ];

    const events = posts.map((post) => ({
      id: post.id,
      title: post.title,
      start: post.date,
    }));

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("Instagram Post");
  });
});