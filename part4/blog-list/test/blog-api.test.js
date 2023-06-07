const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blog list counter', async () => {
  const response = await api.get('/api/blogs/')
  expect(response.body).toHaveLength(2)
},100000)

test('unique identifier', async () => {
  const response = await api.get('/api/blogs/')
  response.body.map(blog => {
    expect(blog.id).toBeDefined()
    expect(blog.id).toEqual(blog.id)
  })
},100000)

test('posting a blog', async () => {
  const blogEntry = {
    "title": "Test",
    "author": "Jay Indino",
    "url": "https://jayindino.com/pwa",
    "likes": 128
  }
  
  const blogs = await api.get('/api/blogs')
  const response = await api
  .post('/api/blogs')
  .send(blogEntry)
  const updatedBlogList = await api.get('/api/blogs')
  expect(updatedBlogList.body).toHaveLength(blogs.body.length+1)
  expect(response.body.title).toEqual('Test')
  expect(response.body.author).toEqual('Jay Indino')
  expect(response.body.url).toEqual('https://jayindino.com/pwa')
  expect(response.body.likes).toEqual(128)
})

test('undefined likes',async () =>{
  const blogEntry = {
    "title": "Test zero likes"
  }

  const blogs = await api.get('/api/blogs')
  const response = await api
  .post('/api/blogs')
  .send(blogEntry)
  const updatedBlogList = await api.get('/api/blogs')
  expect(response.body.likes).toEqual(0)
})

afterAll(() => {
  mongoose.connection.close()
})