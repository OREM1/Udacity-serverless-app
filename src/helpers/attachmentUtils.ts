import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3BuketName =process.env.S3_BUCKET_NAME
const urlExpiration=3000

export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = s3BuketName
    ){}
    getAttachmentUrl(todoId: string){
        return `https://${this.bucketName}.s3amazonaws.com/${todoId}`
    }
    getUploadUrl(todoId: string):string{
        console.log('getUploadUrl called')
        const url = this.s3.getSignedUrl('putObject',{
            Bucket: this.bucketName,
            Key: todoId,
            Expires: urlExpiration
        })
        return url as string
    }
}