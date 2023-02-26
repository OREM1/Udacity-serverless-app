import { ToDoAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import { TodoUpdate } from '../../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';
//import { Logger } from 'winston';
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger=createLogger('TodosAcess')
const attachmentUtils=new AttachmentUtils()
const todosAcess=new ToDoAccess()

// write get todos function
export async function getTodosForUser(userId:string):Promise<TodoItem[]>{
  logger.info('Get todos function called')
  return todosAcess.getAllTodos(userId)
}

//write create to do function
export async function createToDo(
    newTodo:CreateTodoRequest,
    userId:string
):Promise<TodoItem>{
    logger.info('create to do function called')
    const todoId=uuid.v4()
    const createdAt=new Date().toISOString()
    const s3AttachmentUrl=attachmentUtils.getAttachmentUrl(todoId)
    const newItem={
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl:s3AttachmentUrl,
        ...newTodo
    }
    return await todosAcess.createTodoItem(newItem)
}
// write update function
export async function updateTodo(
    todoId,
    todoUpdate:UpdateTodoRequest,
    userId
):Promise<TodoUpdate>{
    logger.info('Update todo function called')
    return await todosAcess.updateTodoItem(todoId,userId,todoUpdate)
}

//write delete todo function
export async function deleteTodo(
    userId,
    todoId,
):Promise<string>{
    logger.info('Delete todo function called')
    return todosAcess.deleteTodoItem(todoId,userId)
}
//Write generate upload url function
export async function createAttachmentPresignedUrl(
       todoId:string,
       userId:string
):Promise<string>{
    logger.info('Create attachment function called by user',userId,todoId)
    return attachmentUtils.getUploadUrl(todoId)
}
    


    
