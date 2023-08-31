const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
})

//
// Get token for header
// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//       return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    //console.log(request.token)

    const user = request.user

    if(body.title===undefined){
        response.status(400).end()
    }
    if(body.url===undefined){
        response.status(400).end()
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request,response) => {
    const userId = request.user.id

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() === userId.toString()){
        await Blog.findByIdAndRemove(blog.id)
        response.status(204).end()
    } else {
        response.status(400).send(`uhm you didn't write that blog`)
    }
})

blogsRouter.put('/:id', async (request,response) => {
    const body = request.body
    const changedBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, changedBlog, {new: true})
    response.json(updatedBlog)
})


module.exports = blogsRouter