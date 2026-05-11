export class UploadErrorExceptionMessage {
    static readonly FORM_SIZE_MESSAGE = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
    static readonly INI_SIZE_MESSAGE  = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
    static readonly PARTIAL_MESSAGE   = 'The uploaded file was only partially uploaded';
    static readonly NO_FILE_MESSAGE   = 'No file was uploaded';
    static readonly NO_TMP_DIR_MESSAGE = 'Missing a temporary folder';
    static readonly CANT_WRITE_MESSAGE = 'Failed to write file to disk';
    static readonly EXTENSION_MESSAGE  = 'A PHP extension stopped the file upload';
    static readonly OK_MESSAGE         = 'OK is not a valid upload error';
}
