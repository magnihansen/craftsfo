export interface FileContentResult {
    contentType: string;
    enableRangeProcessing: boolean;
    entityTag: string | null;
    fileContents: string;
    fileDownloadName: string;
    lastModified: Date | null;
}