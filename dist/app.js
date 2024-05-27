"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.use((0, cors_1.default)()); // разрешить любым фронтам делать запросы на наш бэк
const errors = [{}];
const db = {
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
};
//delete all
exports.app.delete('/testing/all-data', (req, res) => {
    // let arr = db.videos;
    // const arr2 = arr;
    // arr = [];
    //
    db.videos.slice(0, db.videos.length);
    res.status(204).json('All data is deleted');
});
//post
exports.app.post('/videos', (req, res) => {
    const videos = db.videos;
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
        });
        res.status(400).json({ errors });
        return;
    }
    const newVideo = Object.assign(Object.assign({}, req.body), { id: Math.floor(Math.random() * 20), title: body.title, author: body.author });
    db.videos = [...db.videos, newVideo];
    res.status(201).json(newVideo);
});
//get
exports.app.get('/videos', (req, res) => {
    res.status(200).json(db.videos);
});
//get by id
exports.app.get('/videos/:id', (req, res) => {
    const body = req.params.id;
    const foundVideo = db.videos.find(fv => fv.id === +body);
    if (foundVideo) {
        res.status(200).json(foundVideo);
        return;
    }
    else {
        res.status(404).json({ errors });
    }
});
// const videos = db.videos
// let video = videos.find(v => v.id === +req.params.id)
// if (video) {
//     res.status(200).json(video)
// } else {
//     res.sendStatus(404)
// }
//put id
exports.app.put('/videos/:id', (req, res) => {
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
        });
    }
    const bodyparam = req.params.id;
    const foundVideo = db.videos.find(fv => fv.id === +bodyparam);
    if (foundVideo) {
        foundVideo.title = body.title;
        foundVideo.author = body.author;
        res.status(204).json(foundVideo);
    }
    else {
        res.status(404).json({ errors });
    }
});
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
exports.app.delete('/videos/:id', (req, res) => {
    const body = req.params.id;
    const foundVideo = db.videos.find(fv => fv.id === +body);
    if (foundVideo) {
        for (let i = 0; i < db.videos.length; i++) {
            if (db.videos[i].id == +req.params.id) {
                db.videos.slice(i, 1);
                res.sendStatus(204);
            }
            return;
        }
    }
    else {
        res.status(404).json({ errors });
    }
});
