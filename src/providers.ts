import {IDB} from '../db/interfaces'
import FirebaseDB from  '../db/firebase'

export const DataProvider: IDB = new FirebaseDB()