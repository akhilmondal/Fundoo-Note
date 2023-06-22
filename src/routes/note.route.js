import express from 'express';
import * as noteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

//route to get all notes
router.get('/getallnotes',userAuth, noteController.getAllNotes);

//route to create a new note
router.post('',userAuth, noteController.newNote);

export default router;
