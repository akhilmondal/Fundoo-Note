import express from 'express';
import * as noteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';
import { newNoteValidator } from '../validators/note.validator';
import { redisForGetallNote } from '../middlewares/redis.middleware';

const router = express.Router();

//route to create a new note
router.post('', newNoteValidator, userAuth, noteController.newNote);

//route to get all notes
router.get('', userAuth, redisForGetallNote, noteController.getAllNotes);

//route to get a single note by id
router.get('/:_id', userAuth, noteController.getNote);

//route to update Note
router.put('/:_id', userAuth, noteController.updateNote);

//route to delete Note
router.delete('/:_id', userAuth, noteController.deleteNote);

//route to archive Note
router.put('/archive/:_id', userAuth, noteController.archiveNote);

//route to trash Note
router.put('/trash/:_id', userAuth, noteController.trashNote);

//router.get('/countnote', userAuth, noteController.getCountofNotes);

export default router;
