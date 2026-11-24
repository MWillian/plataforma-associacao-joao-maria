export class MediaController {
  constructor(mediaService) {
    this.mediaService = mediaService;
    this.uploadImage = this.uploadImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  async uploadImage(req, res, next) {
    try {
      const image = await this.mediaService.uploadImage({
        buffer: req.body,
        contentType: req.get('content-type')?.split(';')[0].trim(),
        folder: req.params.folder,
      });

      return res.status(201).json(image);
    } catch (error) {
      return next(error);
    }
  }

  async deleteImage(req, res, next) {
    try {
      await this.mediaService.deleteImage(req.body?.publicId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
