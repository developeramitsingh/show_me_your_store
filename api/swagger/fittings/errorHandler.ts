module.exports = () => {
    return (context: any, next: any) => {
      let error: any;
      let message: any;
      let statusCode: any;
      const name = context.error.name;
  
      // handle jwt token errors
      if (name === 'JsonWebTokenError' || name === 'TokenExpiredError') {
        message = 'Your session has timed out. Please login again';
        statusCode = 403;
      } else if (
        // handle db errors
        context.error &&
        context.error.errors &&
        context.error.errors[0].origin === 'DB'
      ) {
        error = context.error.errors[0];
        message = error.message;
        // log db error
        console.error(`${(context.request.user && context.request.user.id) ||
          ''}->${context.request.method}->${
          context.request.swagger.operation.operationId
        }->${message}
        `);
        statusCode = 400;
        if (message.indexOf('.unique_index') >= 0) {
          message = message
            ? message.replace('.unique_index', '').replace(/_/g, ' ')
            : '';
        } else if (message.indexOf('_UNIQUE') >= 0) {
          message = message
            ? message
                .replace('_UNIQUE', '')
                .replace('.', ' ')
                .replace(/_/g, ' ')
            : '';
        } else {
          message = message.replace('.', ' ').replace(/_/g, ' ');
        }
      } else if (
        // handle swagger errors
        context.error &&
        context.error.errors &&
        context.error.errors[0].code === 'INVALID_REQUEST_PARAMETER'
      ) {
        message = getSwaggerErrorMessage(context);
  
        // log swagger errors
        console.error(`${(context.request.user && context.request.user.id) ||
          ''}->${context.request.method}->${
          context.request.swagger.operation.operationId
        }->${message}
        `);
        statusCode = 400;
      } else {
        // handle controller errors
        error = context.error;
        message = error.message;
        statusCode = error.statusCode || 400;
        // log errors
        console.error(`${(context.request.user && context.request.user.id) ||
          ''}->${context.request.method}->${
          context.request.swagger.operation.operationId
        }->${error}
        `);
      }
  
      return context.response
        .status(statusCode)
        .send({ message, statusCode, name });
    };
  };
  
  // convert to sentence case
  const toSentenceCase = (text: any) => {
    const result = text ? text.replace(/([A-Z])/g, ' $1') : '';
  
    return result.charAt(0).toUpperCase() + result.slice(1);
  };
  
  function getSwaggerErrorMessage(context: any) {
    let errorMessage: string;
    const error =
      context.error.errors[0].errors[context.error.errors[0].errors.length - 1];
    switch (error.code) {
      case 'OBJECT_MISSING_REQUIRED_PROPERTY':
        errorMessage = `${toSentenceCase(
          error.params[error.params.length - 1]
        )} is required`;
        break;
      case 'MIN_LENGTH':
        errorMessage = `${toSentenceCase(error.path[0])} should have atleast ${
          error.params[1]
        } character${error.params[1] > 1 ? 's' : ''}`;
        break;
      case 'MAX_LENGTH':
        errorMessage = `${toSentenceCase(error.path[0])} should not exceed ${
          error.params[1]
        } character${error.params[1] > 1 ? 's' : ''}`;
        break;
      case 'INVALID_TYPE':
        if (error.path.length && error.path[0]) {
          errorMessage = `${toSentenceCase(error.path[0])} should be ${
            error.params[0]
          } type but found ${error.params[1]}`;
        } else {
          errorMessage = context.error.errors[0].message;
        }
        break;
      case 'PATTERN':
      case 'ENUM_MISMATCH':
        errorMessage = `${toSentenceCase(
          error.path.length ? error.path[0] : context.error.errors[0].name
        )} is incorrect. Please verify`;
        break;
      case 'REQUIRED':
        errorMessage = `${toSentenceCase(
          context.error.errors[0].name
        )} is required but was not provided`;
        break;
  
      default:
        errorMessage = `Invalid ${toSentenceCase(error.path[0])}`;
        break;
    }
  
    return errorMessage;
  }