import express from 'express';
import * as noteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();


//route to create a new note
router.post('',userAuth, noteController.newNote);

//route to get all notes
router.get('',userAuth, noteController.getAllNotes);

//route to get a single note by id
router.get('/:_id',userAuth, noteController.getNote);

//route to update Note
router.put('/:_id',userAuth, noteController.updateNote);

//route to delete Note
router.delete('/:_id',userAuth, noteController.deleteNote);

export default router;
