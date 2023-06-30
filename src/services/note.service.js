import Note from '../models/note.model';

// creat new note.
export const newNote = async (body) => {
  const data = await Note.create(body);
  return data;
};

// Get all Notes
export const getAllNotes = async (body) => {
  const data = await Note.find({ createdBy: body.createdBy });
  return data;
};

// Get note by id
export const getNote = async (_id, body) => {
  const data = await Note.findById({ _id: _id, createdBy: body.createdBy });
  return data;
};

//Update Note by id
export const updateNote = async (_id, body) => {
  const data = await Note.findByIdAndUpdate(
    {
      _id: _id,
      createdBy: body.createdBy
    },
    body,
    {
      new: true
    }
  );
  return data;
};

//Delete Note by id
export const deleteNote = async (_id, body) => {
  await Note.findByIdAndDelete({ _id: _id, createdBy: body.createdBy });
  return '';
};

//Archive note by id
export const archiveNote = async (_id, body) => {
  const data = await Note.findById({ _id: _id, createdBy: body.createdBy });
  let archiveStatus;
  if (data) {
    archiveStatus = data.archive == false ? true : false;
    const updatedData = await Note.findByIdAndUpdate(
      {
        _id: _id
      },
      { archive: archiveStatus },
      { new: true }
    );
    return updatedData;
  } else {
    throw new Error('Invalid Note Id');
  }
};

//trash note by id
export const trashNote = async (_id, body) => {
  const data = await Note.findById({ _id: _id, createdBy: body.createdBy });
  let trashStatus;
  if (data) {
    trashStatus = data.trash == false ? true : false;
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
