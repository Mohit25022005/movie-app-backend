const Movie = require('./../models/tourModel')
exports.getAllMovies=async (req,res)=>{
    try{
        const movies =await Movie.find()
        res.status(200).json({
            status:"ok",
            data:{
                movies
            }
        })
    }catch(err){
        res.status(404).json({
            status:"fail",
            message:"ERROR=> "+err
        })
    }
}

exports.createMovie = async(req,res)=>{
    try{
        const newMovie = await Movie.create({
            movieName:req.body.movieName,
            movieRating:req.body.movieRating,
            releaseDate:req.body.releaseDate,
            directorName:req.body.directorName
        })
        res.status(201).json({
            status:"ok",
            data:{
                movies:newMovie
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:"ERROR=> "+err
        })
    }
}
exports.deleteMovie = async (req,res)=>{
    try{
        await Movie.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status:"ok",
            data:null,

        })
    }
    catch(err){
         res.status(404).json({
            status:"fail",
            message:"ERROR=> "+err
        })
    }
}

exports.filterByName =async (req,res)=>{
    try{
        const stats = await Movie.aggregate([
            {
                $match:{"directorName":req.body.directorName}
            }
        ])
        res.status(200).json({
            status:"ok",
            data:{
                stats
            }
        })
        
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:"ERROR=> "+err
        }) 
    }
}

exports.rating = async(req,res)=>{
    try{
        const stats = await Movie.aggregate([
            {
                $match:{"movieRating":{$gt:7}}
            }
        ])
        res.status(200).json({
            status:"ok",
            data:{
                stats
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:"ERROR=> "+err
        }) 
    }
}