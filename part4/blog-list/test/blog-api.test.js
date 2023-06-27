const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

mongoose.set("bufferTimeoutMS", 30000)
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blog list counter', async () => {
  const response = await api.get('/api/blogs/')
  expect(response.body).toHaveLength(helper.initBlogs.length)
},10000)

test('unique identifier', async () => {
  const response = await api.get('/api/blogs/')
  response.body.map(blog => {
    expect(blog.id).toBeDefined()
    expect(blog.id).toEqual(blog.id)
  })
},10000)

test('posting a blog', async () => {
  const blogEntry = {
    "title": "Not again",
    "author": "Dubvision",
    "url": "https://dubvision.com/",
    "likes": 1022
  }

  
  const response = await api
  .post('/api/blogs')
  .send(blogEntry)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const updatedBlogList = await helper.blogsInDb()
  expect(updatedBlogList).toHaveLength(helper.initBlogs.length+1)
  expect(response.body.title).toEqual('Not again')
  expect(response.body.author).toEqual('Dubvision')
  expect(response.body.url).toEqual('https://dubvision.com/')
  expect(response.body.likes).toEqual(1022)
})

test('undefined likes',async () =>{
  const blogEntry = {
    "title": "Test zero likes",
    "url": "http://localhost",
    "author": "Midas"
  }

  const response = await api
  .post('/api/blogs')
  .send(blogEntry)
  .expect(201)

  const updatedBlogList = await helper.blogsInDb()
  expect(updatedBlogList).toHaveLength(helper.initBlogs.length + 1)
  expect(response.body.likes).toEqual(0)
})

test('missing some properties', async() => {
  const missingUrl = {
    "title": "Missing",
    "author": "Jack Reacher",
    // "url": "https://jayindino.com/pwa",
    "likes": 582
  }

  await api
  .post('/api/blogs')
  .send(missingUrl)
  .expect(400)
  
  const updatedBlogList = await helper.blogsInDb()

  expect(updatedBlogList).toHaveLength(helper.initBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})