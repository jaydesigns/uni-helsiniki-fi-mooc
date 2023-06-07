const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    if(blogs.length === 0){
        return 0;
    } else if(blogs.length === 1){
        return blogs[0].likes;
    } else if(blogs.length > 1){
        const allLikes = blogs.map(blog => blog.likes);
        // console.log(allLikes);
        return allLikes.reduce((acc,next)=>acc+next,0);
    }
}

const favoriteBlog = (blogs) => {
    const allLikes = blogs.map(blog => blog.likes);
    const mostLiked = Math.max(...allLikes);
    const popularPost = blogs.find(blog => blog.likes === mostLiked);
    const newObj = {'author':popularPost.author,'title':popularPost.title,'likes':popularPost.likes}
    // console.log(newObj);
    return newObj;
}

const mostBlog = (blogs) => {
    const authors = _.countBy(blogs, 'author');
    const authorWithMostBlogs = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b);
    const newObj = {'author': authorWithMostBlogs, 'blogs': authors[authorWithMostBlogs]}
    return newObj;
}

const mostLikes = (blogs) => {
    const list = _.groupBy(blogs, 'author');
    const authObj = {};
    for (let key in list){
        authObj[key] = list[key].reduce((acc,next) => { 
            return acc+next.likes
        },0)
    }
    const authorWithMostLikes = Object.keys(authObj).reduce((a, b) => authObj[a] > authObj[b] ? a : b);
    // console.log(authObj);
    const newObj = {'author': authorWithMostLikes, 'likes': authObj[authorWithMostLikes]};
    return newObj;
}

module.exports = {
dummy, totalLikes, favoriteBlog, mostBlog, mostLikes
}