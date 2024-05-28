import {Resolutions} from "./video-types";
import any = jasmine.any;

export const errors = [{}]

//
export const db = { // создаём базу данных (пока это просто переменная)
    videos: [
        {
            id: Number(new Date()),
            title: 't' + Math.random(),
            author: 'a' + Math.random(),
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolution: [Resolutions.P240],

        }


    ],
}
