const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

mongoose.set("bufferTimeoutMS", 30000)
let TOKEN = ''

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  // const testUser = await api
  // .post('/api/users')
  // .send({ 'username':'tester','name':'Tester','password':'ambotlang'})
  // console.log(testUser.body)
  
  const login = await api
  .post('/api/login')
  .send({ username:'tester',password:'ambotlang'})
  TOKEN = login.body.token
})

test('blog list counter', async () => {
  const response = await api
  .get('/api/blogs/')
  .set('Authorization',`Bearer ${TOKEN}`)

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
  .set('Authorization',`Bearer ${TOKEN}`)
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

test('posting denied without authentication', async () => {
  const blogEntry = {
    "title": "Not again",
    "author": "Dubvision",
    "url": "https://dubvision.com/",
    "likes": 1022
  }

  const response = await api
  .post('/api/blogs')
  .send(blogEntry)
  .expect(401)

  const updatedBlogList = await helper.blogsInDb()
  expect(updatedBlogList).toHaveLength(helper.initBlogs.length)
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

test('an entry is deleted', async () => {
  const initialBlogList = await helper.blogsInDb()
  const blogToDelete = initialBlogList[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`)
  .expect(204)

  const updatedBlogList = await helper.blogsInDb()
  expect(updatedBlogList).toHaveLength(helper.initBlogs.length-1)

  const titles = updatedBlogList.map(blog => blog.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('an entry can be updated', async () => {
  let newLikes = 43261
  const incomingUpdate = {
    "title": "Dummy",
    "author": "Stephen Hawking",
    "url": "https://jayindino.com/pwa",
    "likes": newLikes
  }
  const initialBlogList = await helper.blogsInDb()
  const blogToUpdate = initialBlogList.find(el => el.title===incomingUpdate.title && el.author===incomingUpdate.author)

  const res = await api.put(`/api/blogs/${blogToUpdate.id}`)
  .send(incomingUpdate)
  .expect(200)

  expect(res.body.likes).toBe(newLikes)
})

//
// TESTING FOR USERS CONTROLLER
//

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:"Superuser", passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jayindino',
      name: 'Jay Indino',
      password: 'ambotlang',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  //TEST Password length
  test('adding user fails when password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: "jay",
      name: "Jay Indino",
      password: "we",
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('password is too short')
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})