const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Atomic habbits",
    author: "Subash",
    url: "sommeurl.com",
    likes: 9,
  },
  {
    title: " habbits",
    author: "Raju dai",
    url: "somemoreurl.com",
    likes: 100,
  },
];

describe("api requests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogsObjects = initialBlogs.map((blogs) => new Blog(blogs));
    const promiseArray = blogsObjects.map((blogs) => blogs.save());
    await Promise.all(promiseArray);
  });

  test("get", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("correct no of blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(initialBlogs.length);
  });

  test("id to be defined", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });

  test("creates a blog post successfully", async () => {
    const blog = {
      title: "whatever",
      author: "Suraj dai",
      url: "somemor.com",
      likes: 100,
    };
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const title = response.body.map((blog) => blog.title);

    expect(title).toContain("whatever");
  });

  test("creates a blog post successfully even if like is missing", async () => {
    const blog = {
      title: "Hosting react app to github",
      author: "sudesh",
      url: "sushcodes.me",
    };
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const likes = response.body.map((blog) => blog.likes);

    expect(likes).toContain(0);
  });

  test("400 Bad request if title and url is missing", async () => {
    const blog = {
      author: "sudesh",

      likes: 15,
    };
    await api.post("/api/blogs").send(blog).expect(400);
  });

  test(" delete specific blog acc to id", async () => {
    const blog = await Blog.find({ title: "Atomic habbits" });

    await api.delete(`/api/blogs/${blog[0].id}`).expect(204);

    const remainingBlogs = await Blog.find();
    const remainingTitle = remainingBlogs.map((blog) => {
      return blog.title;
    });

    expect(remainingTitle).not.toContain("Atomic habbits");
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
