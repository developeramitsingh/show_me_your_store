declare interface ImageKitUploadImageParams {
    imageKitInstance: any;
    file: fs.ReadStream | Buffer | Url;
    fileName: string;
    folder?: string;
}
