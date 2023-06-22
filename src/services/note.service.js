import Note from '../models/note.model';

//get all note
export const getAllNotes = async () => {
    const data = await Note.find();
    return data;
  };

// creat new note.
export const newNote = async (body) => {
      const data = await Note.create(body);
      return data;
  };

  