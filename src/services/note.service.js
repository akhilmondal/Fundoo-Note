import Note from '../models/note.model';

// creat new note.
export const newNote = async (body) => {
  const data = await Note.create(body);
  return data;
};

// Get all Notes
export const getAllNotes = async () => {
  const data = await Note.find();
  return data;
};

// Get note by id
export const getNote = async (id) => {
  const data = await Note.findById(id);
  return data;
};

//Update Note by id
export const updateNote = async (_id, body) => {
  const data = await Note.findByIdAndUpdate(
    {
      _id
    },
    body,
    {
      new: true
    }
  );
  return data;
};

//Delete Note by id
export const deleteNote = async (id) => {
  await Note.findByIdAndDelete(id);
  return '';
};

//Archive note by id
export const archiveNote = async (_id) => {
  const data = await Note.findById(_id);
  let archiveStatus;
  if (data) {
    archiveStatus = (data.archive == false)? true: false;
    const updatedData = await Note.findByIdAndUpdate(
      { _id },
      { archive: archiveStatus },
      { new: true }
    );
    return updatedData;
  } else {
    throw new Error('Invalid Note Id');
  }
};

//trash note by id
export const trashNote = async (_id) => {
  const data = await Note.findById(_id);
  let trashStatus;
  if (data) {
    trashStatus = (data.trash == false)? true: false;
    const updatedData = await Note.findByIdAndUpdate(
      { _id },
      { trash: trashStatus },
      { new: true }
    );
    return updatedData;
  } else {
    throw new Error('Invalid Note Id');
  }
};