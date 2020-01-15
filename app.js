var express = require('express');
var app=express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
mongoose.connect("mongodb://localhost/restful_blog_app");

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));


var blogSchema = mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type: Date, default:Date.now}
});

var Blog = mongoose.model('Blog',blogSchema);

// Blog.create({
//     title:'Test blog',
//     image:"https://images.unsplash.com/photo-1578167597239-14f8fc680b6b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body : 'Hello this is a blog'
// })

app.get("/",function(req,res){
    res.redirect('/blogs');
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{blogs:blogs});
        }
    });
});

app.get("/blogs/new",function(req,res){
    res.render('new');
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    });
});

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("/blogs/new");
        }
        else{
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,edbg){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:edbg});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

app.delete("/blogs/:id",function(req,res){
    // res.send("You have reached delete route");
    Blog.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
});

app.listen(8000,process.env.IP);