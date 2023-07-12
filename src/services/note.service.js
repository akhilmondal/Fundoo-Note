import Note from '../models/note.model';
import { client } from '../config/redis';

// create new note.
export const newNote = async (body) => {
  const data = await Note.create(body);
  console.log(data);
  return data;
};

// Get all Notes
export const getAllNotes = async (body) => {
  const data = await Note.find({ createdBy: body.createdBy });
  console.log(data);
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

export const countNote = async (body) => {
  const data = await Note.find({ createdBy: body.createdBy });
  let countAll = 0;
  let countArchive = 0;
  let countTrash = 0;
  const countNote = {};
  if (data) {
    data.forEach((element) => {
      countAll++;
    });
    countNote['AllNote'] = countAll;
    const countArchiveData = await Note.find({
      archive: true,
      createdBy: body.createdBy
    });
    countArchiveData.forEach((element) => {
      countArchive++;
    });
    countNote['ArchivedNote'] = countArchive;
    const countTrashData = await Note.find({
      trash: true,
      createdBy: body.createdBy
    });
    countTrashData.forEach((element) => {
      countTrash++;
    });
    countNote['TrashedNote'] = countTrash;
    return countNote;
  }
};
