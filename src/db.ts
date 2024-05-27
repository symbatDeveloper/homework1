import {Resolutions} from "./video-types";

export const errors = [{}]

//
export const db = { // создаём базу данных (пока это просто переменная)
    videos: [
        {
            id: Math.floor(Math.random() * 20),
            title: 't' + Math.random(),
            author: 'a' + Math.random(),
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolution: [Resolutions.P240],
        }


    ],
}
