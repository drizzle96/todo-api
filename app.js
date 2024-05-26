import express from 'express';
import mongoose from 'mongoose';
import Task from './models/Task.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
// app 전체에서 json 형태의 데이터를 사용할 수 있도록 설정
app.use(cors())
app.use(express.json());

const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  }
}


// req: 들어온 request 객체
// res: response 객체
app.get('/tasks', asyncHandler(async (req, res) => {
  /**
   * 쿼리 파라미터
   * sort: oldest 인 경우 오래된 순, 나머지 값의 경우 최신 순
   * count: 태스크 갯수
   */
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
  const tasks = await Task.find().sort(sortOption).limit(count);

  res.send(tasks);
}))

app.get('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id)
  if (task) {
    res.send(task);

  } else {
    res.status(404).send({ message: 'Task not found' })
  }
}))

app.post('/tasks', asyncHandler(async (req, res) => {
  const newTask = await Task.create(req.body)
  res.status(201).send(newTask);
}))

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id)
  if (task) {
    Object.keys(req.body).forEach(key => {
      task[key] = req.body[key];
    })
    await task.save();
    res.send(task);

  } else {
    res.status(404).send({ message: 'Task not found' })
  }
}))

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);
  if (task) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'Task not found' })
  }
}))

app.listen(process.env.PORT || 3000, () => console.log('Server is running on http://localhost:3000'))

// MongoDB 연결
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));