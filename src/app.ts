import express from 'express'
import cors from 'cors'
import {Request, Response} from 'express'
import {SETTINGS} from "./settings";

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

const errors = [{}]


const db = { // создаём базу данных (пока это просто переменная)
    videos: [
        {
            id: 1,
            title: "title",
            author: "author",

        },
        {
            id: 2,
            title: "title2",
            author: "author2",

        },

    ],
}

//delete all
app.delete('/testing/all-data', (req: Request, res: Response) => {
    // let arr = db.videos;
    // const arr2 = arr;
    // arr = [];
    //
    db.videos.slice(0, db.videos.length)

    res.status(204).json('All data is deleted');

})

//post
app.post('/videos', (req: Request, res: Response | any) => {
    const videos = db.videos
    const body = req.body;
    //checking
    if (body.title.length > 40 || body.author > 20 || typeof body.title !== "string") {
        errors.push({
            errorsMessages: [
                {
                    message: "incorrect",
                    field: "title"
                }
            ]
        })
        res.status(400).json({errors})
        return;
    }
    const newVideo = {
        ...req.body,
        id: Math.floor(Math.random() * 20),
        title: body.title,
        author: body.author,
    }
    db.videos = [...db.videos, newVideo]

    res.status(201).json(newVideo)
})

//get

app.get('/videos', (req: Request, res: Response) => {

    res.status(200).json(db.videos);

})

//get by id
app.get('/videos/:id', (req: Request, res: Response) => {
    const body = req.params.id;
    const foundVideo = db.videos.find(fv => fv.id === +body)
    if (foundVideo) {
        res.status(200).json(foundVideo);
        return
    } else {
        res.status(404).json({errors})
    }
})
// const videos = db.videos
// let video = videos.find(v => v.id === +req.params.id)
// if (video) {
//     res.status(200).json(video)
// } else {
//     res.sendStatus(404)
// }

//put id
app.put('/videos/:id', (req: Request, res: Response | any) => {
    const body = req.body;
    //checking
    if (body.title.length > 40 || body.author > 20 || typeof body.title !== "string") {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "incorrect",
                    field: "title"
                }
            ]
        })

    }
    const bodyparam = req.params.id;
    const foundVideo = db.videos.find(fv => fv.id === +bodyparam)
    if (foundVideo) {
         foundVideo.title=body.title;
         foundVideo.author=body.author;

        res.status(204).json(foundVideo)
    } else {
        res.status(404).json({errors})
    }
})


// const videos = db.videos // получаем видео из базы данных
// let title = req.body.title;
// let author = req.body.author;
// for (let i = 0; i < videos.length; i++) {
//
//     if (videos[i].id == +req.params.id) {
// const newVideo: VideoDBType = {
//     ...req.body,
//     title: title,
//     author: author,
//         //availableResolutions: [Resolutions.P240],
//     }
//     db.videos = [...videos, newVideo]
//
//     res
//         .status(204)
//         .json(newVideo)
//     return;
// } else {
//
//     // res
//     //     .status(400)
//     //     .json(errors)
//     // return;
// }
//delete id
app.delete('/videos/:id', (req: Request, res: Response) => {
    const body = req.params.id;
    const foundVideo = db.videos.find(fv => fv.id === +body)
    if (foundVideo) {
        for (let i = 0; i < db.videos.length; i++) {
            if (db.videos[i].id == +req.params.id) {
                db.videos.slice(i, 1);
                res.sendStatus(204)
            }
            return
        }
    } else {
        res.status(404).json({errors})
    }
})


