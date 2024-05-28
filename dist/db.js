"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.errors = void 0;
const video_types_1 = require("./video-types");
exports.errors = [{}];
//
exports.db = {
    videos: [
        {
            id: Number(new Date()),
            title: 't' + Math.random(),
            author: 'a' + Math.random(),
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolution: [video_types_1.Resolutions.P240],
        }
    ],
};
