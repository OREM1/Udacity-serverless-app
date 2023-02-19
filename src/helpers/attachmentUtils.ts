import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3BuketName =process.env.ATTACHMENTS_s3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = s3BuketName
    ){}
    getAttachmentUrl(todoId: string){
        return `https://${this.bucketName}.s3amazonaws.com/${todoId}`
    }
    getUploadUrl(todoId: string): string{
        const url = this.s3.getSignedUrl('putObject',{
            Bucket: this.bucketName,
            key: todoId,
            Expires: urlExpiration
        })
        return url as string
    }
}