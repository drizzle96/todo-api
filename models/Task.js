import mongoose from "mongoose";

// TaskSchema: Task의 스키마를 정의
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      validate: {
        validator: (title) => {
          return title.split(' ').length > 1
        },
        message: 'Title should have more than 1 word'
      }
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  {
    timestamps: true
  }
);

// Task: TaskSchema를 이용해 Task 모델을 생성
const Task = mongoose.model('Task', TaskSchema);

export default Task;