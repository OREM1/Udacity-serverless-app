import * as AWS from "aws-sdk";
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from "aws-sdk/clients/dynamodb";
//import { Types } from 'aws-sdk/clients/s3';
//import { Logger, loggers } from "winston";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
var AWSXRay=require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
//const logger=createLogger(TodosAcess)



export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
       // private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todosIndex =process.env.INDEX_NAME,
        //private readonly s3BucketName = process.env.S3_BUCKET_NAME
        ){}

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        //logger.info('Getting all todo')
       const results =await this.docClient
        .query ({
            TableName: this.todoTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId=:userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        .promise()
        const item=results.Items
        return item as TodoItem[]

        
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        console.log("Creating new todo");
        
        const result = await this.docClient
        .put({
            TableName:this.todoTable,
            Item:todoItem
        })
        .promise()
        console.log(result)
        return todoItem as TodoItem
       
        };
    async  updateTodoAttachmentUrl(
        todoId:string,
        userId:string,
        attachmentUrl:string 
    ):Promise<void> {
             await this.docClient
          .update({
            TableName: this.todoTable,
            Key:{
                todoId,
                userId
              },
              UpdateExpression:'set attachmentUrl=:attachmentUrl',
              ExpressionAttributeValues:{
                ':attachmentUrl':attachmentUrl
              }
          })
        
          .promise()
        
    }
    async updateTodoItem(
        todoId:string,
        userId:string,
        todoUpdate:TodoUpdate
    ):Promise<TodoUpdate>{
       const result= await this.docClient
        .update({
            TableName: this.todoTable,
            Key:{
                todoId,
                userId
            },
            UpdateExpression:'set #name=:name,dueDate =:dueDate,done =:done',
            ExpressionAttributeValues: {
                ':name':todoUpdate.name,
                ':dueDate':todoUpdate.dueDate,
                ':done':todoUpdate.done
            },
            ExpressionAttributeNames:{
                '#name':'name'
            },
            ReturnValues:'ALL_NEW'
        })
        .promise()
        const todoItemUpdate = result.Attributes
        //logger.info('To do item updated',todoItemUpdate)
        return todoItemUpdate as TodoUpdate
        
        
    }
       async deleteTodoItem(todoId:string,userId:string):Promise<string>{
        const result=await this.docClient
        .delete({
            TableName:this.todoTable,
            Key:{
                todoId,
                userId
              },
        })
        .promise()
        console.log('Delete todo item called',result)
        return todoId as string
       }


       async  saveImgUrl(todoId:string,userId:string,bucketName:string):Promise<void> {
        await this.docClient
        .update({
            TableName:this.todoTable,
            Key:{
                todoId,
                userId
            },
            //ConditionExpression:'attribute_exits(todoId)',
            UpdateExpression:'set attachmentUrl=:attachmentUrl',
            ExpressionAttributeValues:{
                ':attachmentUrl':`https:${bucketName}.s3.amazonaws.com/${todoId}`
            }
    
        })
        .promise(); 
    
    }   
    
    }


