import express from 'express'
import cors from 'cors'
import {Request, Response} from 'express'
import {SETTINGS} from "./settings";
import {db} from "./db";
import {InputVideoType, OutputVideoType, Resolutions} from "./video-types";
import {OutputErrorsType} from "./output-error-types";


export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк


const errors: OutputErrorsType = { // объект для сбора ошибок
    errorsMessages: []
}
const inputValidation = (video: InputVideoType) => {

    ///title author
    if (video.title.length > 40 || video.author.length > 20 ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolution'
        })

    }
    if (video.availableResolution) {
        const validResolutionsKeys = Object.keys(Resolutions);

        const invalidResolutions = video.availableResolution.filter(
            (res: string) => !validResolutionsKeys.includes(res),
        );

   }
    // if (!Array.isArray(video.availableResolution)
    //     || video.availableResolution.find(p => !Resolutions[p])
    // ) {
    //     errors.errorsMessages.push({
    //         message: 'error!!!!', field: 'availableResolution'
    //     })
    // }
    return errors
}
const PutValidation = (video: OutputVideoType) => {

    if (video.title.length > 40 || video.author.length > 20 ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'title put'
        })

    }
    if (!video.canBeDownloaded) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'download'
        })
    }
    if (!video.minAgeRestriction) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'age'
        })
    }
   //  if (!video.createdAt) {
   //      errors.errorsMessages.push({
   //          message: 'error!!!!', field: 'created at'
   //      })
   // }
    if (!video.publicationDate) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'publication date'
        })
    }
    if (video.availableResolution) {
        const validResolutionsKeys = Object.keys(Resolutions);

        const invalidResolutions = video.availableResolution.filter(
            (res: string) => !validResolutionsKeys.includes(res),
        );

    }
    // if (!Array.isArray(video.availableResolution)
    //     || video.availableResolution.find(p => !Resolutions[p])
    // ) {
    //     errors.errorsMessages.push({
    //         message: 'error!!!!', field: 'availableResolution Put'
    //     })
    // }
    return errors
}


//delete all
app.delete('/testing/all-data', (req: Request, res: Response) => {

    db.videos.length === 0

    res.status(204).json('All data is deleted');

})

//post
app.post('/videos', (req: Request, res: Response,any ) => {
    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors)
        return
    }

    const body = req.body;
    //checking
    const newVideo = {
         id: body.id ||Number(new Date()) ,
        title: body.title || null,
        author: body.author,
        canBeDownloaded: false,
        minAgeRestriction: null ,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolution: body.availableResolution || null,
    }
    db.videos.push(newVideo)

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

    } else {
        res.status(404).json({errors})
    }
})

//put id
app.put('/videos/:id', (req: Request, res: Response | any) => {
    const body = req.body;
    const errors = PutValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors)

    }

    const bodyparam = req.params.id;
    const foundVideo = db.videos.find(fv => fv.id === +bodyparam)
    if (foundVideo) {
        foundVideo.title = body.title;
        foundVideo.author = body.author;
        foundVideo.canBeDownloaded = body.canBeDownloaded
        foundVideo.minAgeRestriction = body.minAgeRestriction
        foundVideo.createdAt = body.createdAt
        foundVideo.publicationDate = body.publicationDate
        foundVideo.availableResolution = body.availableResolution

        res.status(204).json(foundVideo)
    } else {
        res.status(404).json({errors})
    }
})


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

        }
    } else {
        res.status(404).json({errors})
    }
})


