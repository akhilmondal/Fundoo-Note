import Note from '../models/note.model';
import { client } from '../config/redis';

// create new note.
export const newNote = async (body) => {
  const data = await Note.create(body);
  return data;
};

// Get all Notes
export const getAllNotes = async (body) => {
  const data = await Note.find({ createdBy: body.createdBy });
  if (data) {
    await client.set(body.createdBy, JSON.stringify(data));
    return data;
  }
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

//update note using promises
export const updateNoteUsingPromise = (_id, body) => {
  return new Promise((resolve, reject) => {
    const data = Note.findByIdAndUpdate(
      {
        _id: _id,
        createdBy: body.createdBy
      },
      body,
      {
        new: true
      }
    );
    if (data) {
      resolve(data);
    } else {
      reject(new Error('Failed to update note.'));
    }
  });
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
    archiveStatus = data.archive === false ? true : false;
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
    trashStatus = data.trash === false ? true : false;
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

export const noteColor = async (_id, body) => {
  const data = await Note.findById({ _id: _id, createdBy: body.createdBy });
  console.log('Hello everyone', body);
  if (data) {
    const updatedData = await Note.findByIdAndUpdate(
      { _id },
      { color: body.color },
      { new: true }
    );
    return updatedData;
  } else {
    throw new Error('Invalid Note Id');
  }
};

export const countNote = async (body) => {
  const data = await Note.find({ createdBy: body.createdBy });
  let countAll = 0;
  let countArchive = 0;
  let countTrash = 0;
  const countNote = {};
  if (data) {
    data.forEach(() => {
      countAll++;
    });
    countNote['AllNote'] = countAll;
    const countArchiveData = await Note.find({
      archive: true,
      createdBy: body.createdBy
    });
    countArchiveData.forEach(() => {
      countArchive++;
    });
    countNote['ArchivedNote'] = countArchive;
    const countTrashData = await Note.find({
      trash: true,
      createdBy: body.createdBy
    });
    countTrashData.forEach(() => {
      countTrash++;
    });
    countNote['TrashedNote'] = countTrash;
    return countNote;
  }
};
