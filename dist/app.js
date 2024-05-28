"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const video_types_1 = require("./video-types");
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.use((0, cors_1.default)()); // разрешить любым фронтам делать запросы на наш бэк
const errors = {
    errorsMessages: []
};
const inputValidation = (video) => {
    ///title author
    if (video.title.length > 40 || video.author.length > 20) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolution'
        });
    }
    if (video.availableResolution) {
        const validResolutionsKeys = Object.keys(video_types_1.Resolutions);
        const invalidResolutions = video.availableResolution.filter((res) => !validResolutionsKeys.includes(res));
    }
    // if (!Array.isArray(video.availableResolution)
    //     || video.availableResolution.find(p => !Resolutions[p])
    // ) {
    //     errors.errorsMessages.push({
    //         message: 'error!!!!', field: 'availableResolution'
    //     })
    // }
    return errors;
};
const PutValidation = (video) => {
    if (video.title.length > 40 || video.author.length > 20) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'title put'
        });
    }
    if (!video.canBeDownloaded) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'download'
        });
    }
    if (!video.minAgeRestriction) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'age'
        });
    }
    if (!video.createdAt) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'created at'
        });
    }
    if (!video.publicationDate) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'publication date'
        });
    }
    if (video.availableResolution) {
        const validResolutionsKeys = Object.keys(video_types_1.Resolutions);
        const invalidResolutions = video.availableResolution.filter((res) => !validResolutionsKeys.includes(res));
    }
    // if (!Array.isArray(video.availableResolution)
    //     || video.availableResolution.find(p => !Resolutions[p])
    // ) {
    //     errors.errorsMessages.push({
    //         message: 'error!!!!', field: 'availableResolution Put'
    //     })
    // }
    return errors;
};
//delete all
exports.app.delete('/testing/all-data', (req, res) => {
    db_1.db.videos.length === 0;
    res.status(204).json('All data is deleted');
});
//post
exports.app.post('/videos', (req, res, any) => {
    const errors = inputValidation(req.body);
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors);
        return;
    }
    const body = req.body;
    //checking
    const newVideo = {
        id: Number(new Date()),
        title: body.title,
        author: body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString() + 1,
        availableResolution: body.availableResolution //|| null,
    };
    db_1.db.videos = [...db_1.db.videos, newVideo];
    res.status(201).json(newVideo);
});
//get
exports.app.get('/videos', (req, res) => {
    res.status(200).json(db_1.db.videos);
});
//get by id
exports.app.get('/videos/:id', (req, res) => {
    const body = req.params.id;
    const foundVideo = db_1.db.videos.find(fv => fv.id === +body);
    if (foundVideo) {
        res.status(200).json(foundVideo);
    }
    else {
        res.status(404).json({ errors });
    }
});
//put id
exports.app.put('/videos/:id', (req, res) => {
    const body = req.body;
    //checking
    const errors = PutValidation(req.body);
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors);
        return;
    }
    const bodyparam = req.params.id;
    const foundVideo = db_1.db.videos.find(fv => fv.id === +bodyparam);
    if (foundVideo) {
        foundVideo.title = body.title;
        foundVideo.author = body.author;
        foundVideo.canBeDownloaded = body.canBeDownloaded;
        foundVideo.minAgeRestriction = body.minAgeRestriction;
        foundVideo.createdAt = body.createdAt;
        foundVideo.publicationDate = body.publicationDate + 1;
        foundVideo.availableResolution = body.availableResolution;
        res.status(204).json(foundVideo);
    }
    else {
        res.status(404).json({ errors });
    }
});
//delete id
exports.app.delete('/videos/:id', (req, res) => {
    const body = req.params.id;
    const foundVideo = db_1.db.videos.find(fv => fv.id === +body);
    if (foundVideo) {
        for (let i = 0; i < db_1.db.videos.length; i++) {
            if (db_1.db.videos[i].id == +req.params.id) {
                db_1.db.videos.slice(i, 1);
                res.sendStatus(204);
            }
        }
    }
    else {
        res.status(404).json({ errors });
    }
});
