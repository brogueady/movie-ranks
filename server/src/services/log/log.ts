/* eslint-disable no-console */
import * as fs from 'fs'

var stream = fs.createWriteStream("log.out", {flags:'a'});

export const logError = (msg: string) => {
    stream.write("Error:" + msg + '\n')
}

export const logInfo = (msg: string) => {
    stream.write(msg + '\n')
}