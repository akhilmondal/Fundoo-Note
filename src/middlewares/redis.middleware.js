import HttpStatus from 'http-status-codes';
import { client } from '../config/redis';

export const redisForGetallNote = async (req, res, next) => {
  const data = await client.get(req.body.createdBy);
  const notes = JSON.parse(data);
  if (notes != null) {
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: notes,
      message: 'All the notes fetched from redis successfully...!!!'
    });
  } else {
    next();
  }
};
