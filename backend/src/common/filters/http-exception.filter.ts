import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(exception.getStatus()).json({
      success: false,
      message: exception.message,
    });
  }
}
